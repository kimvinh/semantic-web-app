import React from 'react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import './input.css';

function App() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryType, setQueryType] = useState('Actor');
  const [userInput, setUserInput] = useState('');
  const [inputInstruction, setInputInstruction] = useState(
    'E.g., Leonardo DiCaprio, Angelina Jolie, Will Smith, ...'
  );
  const [filmData, setFilmData] = useState();
  const inputRef = useRef(null);

  // The input will be focused after the page is loaded
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Send the request to the server when the user press 'Enter'
  const handleKeyPressed = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  // Check and handle user's input
  // Then send the request to the server
  const handleClick = () => {
    if (userInput !== '') {
      let processedInput = userInput;
      if (queryType === 'Actor') {
        processedInput = userInput.includes(',')
          ? userInput.split(',').map((actor) => actor.trim())
          : [userInput];
      } else if (queryType === 'releasedYear') {
        processedInput = userInput.includes('-')
          ? userInput.split('-').map((year) => year.trim())
          : userInput;
      }
      setFilmData([]);
      setIsQuerying(true);
      sendQuery(processedInput);
    }
  };

  // Show the appropriate text based on the change of radio buttons
  const handleChange = (e) => {
    setUserInput('');
    setQueryType(e.target.value);
    if (e.target.value === 'Actor') {
      setInputInstruction(
        'E.g., Leonardo DiCaprio, Angelina Jolie, Will Smith, ...'
      );
    } else if (e.target.value === 'Director') {
      setInputInstruction('E.g., Martin Scorsese, Sam Mendes, ...');
    } else if (e.target.value === 'Genre') {
      setInputInstruction('E.g., Science Fiction, Comedy, Horror, ...');
    } else if (e.target.value === 'Title') {
      setInputInstruction('E.g., Inception, Life of Pi, ...');
    } else if (e.target.value === 'releasedYear') {
      setInputInstruction('E.g., 2022, 2010-2023, ...');
    } else if (e.target.value === 'Language') {
      setInputInstruction('E.g., English, French, Japanese, ...');
    }
  };

  // Rank the data based on the gross income
  const handleRank = (data, rank) => {
    if (data.gross && rank === 0) {
      return (
        <p key={rank} className="flex text-amber-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
            />
          </svg>
          . {data.name.value}{' '}
          {data.gross && `(Gross Income: $${data.gross.value})`}
        </p>
      );
    } else if (data.gross && rank === 1) {
      return (
        <p key={rank} className="flex text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
            />
          </svg>
          . {data.name.value}{' '}
          {data.gross && `(Gross Income: $${data.gross.value})`}
        </p>
      );
    } else if (data.gross && rank === 2) {
      return (
        <p key={rank} className="flex text-orange-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
            />
          </svg>
          . {data.name.value}{' '}
          {data.gross && `(Gross Income: $${data.gross.value})`}
        </p>
      );
    } else {
      return (
        <p key={rank} className="text-indigo-400">
          {rank + 1}. {data.name.value}{' '}
          {data.gross && `(Gross Income: $${data.gross.value})`}
        </p>
      );
    }
  };

  // Send the request to the server
  // Filter the data returned by the server
  const sendQuery = async (userInput) => {
    const response = await axios.post(
      `http://localhost:3001/queryBy/${queryType}`,
      {
        userInput,
      }
    );

    // Filter the data returned by the server
    let changedData = response.data;
    if (changedData.length) {
      let filteredDataWithGross = changedData.filter((film) => film.gross);
      changedData = changedData.filter((film) => !film.gross);
      let convertedData = filteredDataWithGross.map((film) => {
        return {
          ...film,
          gross: { ...film.gross, value: Number(film.gross.value) },
        };
      });
      convertedData = convertedData.filter((film) => !isNaN(film.gross.value));
      convertedData = convertedData.sort(
        (a, b) => b.gross.value - a.gross.value
      );
      changedData = [...convertedData, ...changedData];
    }
    setIsQuerying(false);
    setFilmData(changedData);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-indigo-50 justify-center items-center">
      <div className="flex gap-3 text-indigo-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-14 mt-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
          />
        </svg>
        <h1 className="font-bold text-indigo-600 text-6xl pb-10">
          Film Queries/Recommendations
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-14 mt-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
          />
        </svg>
      </div>

      <div className="flex flex-col w-1/3 justify-center items-center gap-4 pb-5">
        <p className="text-indigo-400 font-bold text-xl">
          Which type do you want to query films by?
        </p>
        <div className="flex flex-wrap w-1/2 justify-start items-center gap-3">
          <span>
            <input
              type="radio"
              id="Actor"
              value="Actor"
              checked={queryType === 'Actor'}
              onChange={handleChange}
            />
            <label className="text-indigo-400 text-lg pl-1" htmlFor="Actor">
              Actor
            </label>
          </span>
          <span>
            <input
              type="radio"
              id="Director"
              value="Director"
              checked={queryType === 'Director'}
              onChange={handleChange}
            />
            <label className="text-indigo-400 text-lg pl-1" htmlFor="Director">
              Director
            </label>
          </span>
          <span>
            <input
              type="radio"
              id="Genre"
              value="Genre"
              checked={queryType === 'Genre'}
              onChange={handleChange}
            />
            <label className="text-indigo-400 text-lg pl-1" htmlFor="Genre">
              Genre
            </label>
          </span>
          <span>
            <input
              type="radio"
              id="Title"
              value="Title"
              checked={queryType === 'Title'}
              onChange={handleChange}
            />
            <label className="text-indigo-400 text-lg pl-1" htmlFor="Title">
              Title
            </label>
          </span>
          <span>
            <input
              type="radio"
              id="releasedYear"
              value="releasedYear"
              checked={queryType === 'releasedYear'}
              onChange={handleChange}
            />
            <label
              className="text-indigo-400 text-lg pl-1"
              htmlFor="releasedYear"
            >
              Released Year
            </label>
          </span>
          <span>
            <input
              type="radio"
              id="Language"
              value="Language"
              checked={queryType === 'Language'}
              onChange={handleChange}
            />
            <label className="text-indigo-400 text-lg pl-1" htmlFor="Language">
              Language
            </label>
          </span>
        </div>
      </div>
      <div className="flex flex-row relative justify-center items-center w-full">
        <input
          type="text"
          value={userInput}
          ref={inputRef}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          onKeyDown={handleKeyPressed}
          className="rounded-full w-1/3 h-14 pl-6 pr-20 text-xl outline-none focus:shadow-md disabled:bg-slate-100 disabled:border"
          placeholder={inputInstruction}
          disabled={isQuerying}
        />
        <button
          className="absolute right-1/3 mr-2 rounded-full border-indigo-200 border-2 p-2 hover:bg-indigo-600 hover:text-white disabled:opacity-75"
          disabled={isQuerying}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            onClick={handleClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
      {isQuerying && <p className="pt-3 text-indigo-500">Querying ...</p>}
      {!isQuerying && filmData && filmData.length > 0 && (
        <>
          <div className="flex flex-row w-1/3 p-3 gap-1 bg-green-50 text-green-700 mt-3 border-2 border-green-500 rounded-md shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p>
              Based on your preferences, here is a list of film recommendations
              for you.
            </p>
          </div>
          <div className="flex flex-col w-1/3 gap-3 overflow-auto px-10 py-1 text-lg my-5 shadow-md">
            {filmData.map((film, index) => handleRank(film, index))}
          </div>
        </>
      )}
      {!isQuerying && filmData && filmData.length === 0 && (
        <div className="flex flex-row w-1/3 p-3 gap-1 bg-yellow-50 text-yellow-700 mt-3 border-2 border-yellow-500 rounded-md shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6 pt-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p>
            Sorry! We cannot provide any film recommendations based on your
            preferences. Please modify your inputs and try again.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;

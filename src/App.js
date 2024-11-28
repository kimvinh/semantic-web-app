import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import './input.css';

function App() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryType, setQueryType] = useState('Actor');
  const [userInput, setUserInput] = useState('');
  const [filmData, setFilmData] = useState([]);

  const handleClick = () => {
    if (userInput === '') {
      return;
    } else {
      setFilmData([]);
      setIsQuerying(true);
      sendQuery();
    }
  };

  const sendQuery = async () => {
    const response = await axios.post(
      `http://localhost:3001/queryBy/${queryType}`,
      {
        userInput,
      }
    );
    setIsQuerying(false);
    setFilmData(response.data);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-indigo-50 justify-center items-center">
      <h1 className="font-bold text-indigo-600 text-6xl pb-10">
        Film Queries/Recommendations
      </h1>
      <div className="flex flex-row justify-center items-center gap-4 pb-5">
        <p className="text-indigo-400 font-bold text-xl">
          Which type do you want to query films by?
        </p>
        <span>
          <input
            type="radio"
            id="Actor"
            value="Actor"
            checked={queryType === 'Actor'}
            onChange={(e) => setQueryType(e.target.value)}
          />
          <label className="text-indigo-400 text-lg pl-1" for="Actor">
            Actor
          </label>
        </span>
        <span>
          <input
            type="radio"
            id="Director"
            value="Director"
            checked={queryType === 'Director'}
            onChange={(e) => setQueryType(e.target.value)}
          />
          <label className="text-indigo-400 text-lg pl-1" for="Director">
            Director
          </label>
        </span>
        <span>
          <input
            type="radio"
            id="Genre"
            value="Genre"
            checked={queryType === 'Genre'}
            onChange={(e) => setQueryType(e.target.value)}
          />
          <label className="text-indigo-400 text-lg pl-1" for="Genre">
            Genre
          </label>
        </span>
        <span>
          <input
            type="radio"
            id="Title"
            value="Title"
            checked={queryType === 'Title'}
            onChange={(e) => setQueryType(e.target.value)}
          />
          <label className="text-indigo-400 text-lg pl-1" for="Title">
            Title
          </label>
        </span>
      </div>
      <div className="flex flex-row relative justify-center items-center w-full">
        <input
          type="text"
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          className="rounded-full w-1/3 h-14 pl-6 pr-20 text-xl outline-none focus:shadow-md"
          placeholder={`Please type your favorite ${
            queryType === 'Title'
              ? `${queryType.toLowerCase()} movie`
              : queryType.toLowerCase()
          } ...`}
        />
        <button className="absolute right-1/3 mr-2 rounded-full border-indigo-200 border-2 p-2 hover:bg-indigo-600 hover:text-white">
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
      {isQuerying && <p className="pt-3">Querying ...</p>}
      {!isQuerying && filmData.length > 0 && (
        <h1 className="text-indigo-500 text-xl py-5">Best Matches</h1>
      )}
      {filmData.length > 0 && (
        <div className="flex flex-col gap-3 overflow-auto border-2 px-3 py-1 border-indigo-200">
          {filmData.map((film, index) => (
            <p key={index} className="text-indigo-500">
              {index + 1}. {film.name.value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

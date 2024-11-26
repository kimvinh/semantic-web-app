import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import './input.css';

function App() {
  const [input, setInput] = useState('');

  const handleClick = () => {
    if (input === '') {
      return;
    } else {
      sendQuery(input);
    }
  };

  const sendQuery = async (value) => {
    await axios.post('http://localhost:3001/query', { value });
  };

  return (
    <div className="flex flex-col h-screen w-full justify-self-center bg-indigo-50 justify-center items-center">
      <h1 className="font-bold text-indigo-600 text-6xl pb-10">
        Film Queries/Recommendations
      </h1>
      <div className="flex flex-row relative justify-center items-center w-full">
        <input
          type="text"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="rounded-full w-2/5 h-14 pl-6 pr-20 text-xl outline-none focus:shadow-md"
          placeholder="Please type your favorite actors, directors, or genres ..."
        />
        <span className="absolute left-2/3 mr-2 rounded-full border-indigo-200 border-2 p-2">
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
        </span>
      </div>
      <p>{input}</p>
    </div>
  );
}

export default App;

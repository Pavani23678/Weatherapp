import React, { useState } from 'react';


const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue); // Call the search function
      setInputValue(''); // Clear the input field
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar" autoComplete="off"> {/* Added autoComplete="off" */}
      <input
        type="text"
        placeholder="Search city..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={(e) => e.stopPropagation()} // Prevent click from affecting form
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
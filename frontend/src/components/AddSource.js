import React, { useState, useContext } from 'react';
import { SourceContext } from '../contexts/SourceContext';

const AddSource = () => {
  const { setSources } = useContext(SourceContext);
  const [inputValue, setInputValue] = useState('');

  const addSource = () => {
    if (inputValue.trim()) {
      setSources(prev => [...prev, inputValue.trim()]);
      setInputValue(''); // Clear the input after adding
    }
  };

  return (
    <div className="bg-gray-100 p-4 border-b border-gray-300">
      <div className="flex items-center">
        <input 
          className="flex-grow border p-2 mr-2"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Add RSS Source URL"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addSource}>Add</button>
      </div>
    </div>
  );
};

export default AddSource;

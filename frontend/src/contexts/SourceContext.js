import React, { createContext, useState } from 'react';

export const SourceContext = createContext();

export const SourceProvider = ({ children }) => {
  const [sources, setSources] = useState([]);

  return (
    <SourceContext.Provider value={{ sources, setSources }}>
      {children}
    </SourceContext.Provider>
  );
};

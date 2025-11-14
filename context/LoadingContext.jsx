"use client";
import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
  isLoading: true,
  setIsLoading: (_v) => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
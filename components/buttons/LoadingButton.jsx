import React, { useState } from "react";

const LoadingButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simula uma operação assíncrona
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Após 3 segundos, termina o carregamento
  };

  return (
    <button
      type="button"
      className={`bg-indigo-500 text-white px-4 py-2 rounded flex items-center ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3V4a8 8 0 00-8 8h4z"
          ></path>
        </svg>
      )}
      {isLoading ? "Processing..." : "Click Me"}
    </button>
  );
};

export default LoadingButton;

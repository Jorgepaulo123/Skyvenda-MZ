"use client";
import React from "react";

export default function MobileHeader({ title, onBack, right }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-white">
      <button
        type="button"
        onClick={onBack}
        className="p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Voltar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-base font-semibold text-gray-800 truncate">{title}</h1>
      {right ? (
        <div className="flex items-center">{right}</div>
      ) : (
        <div className="w-6" />
      )}
    </div>
  );
}

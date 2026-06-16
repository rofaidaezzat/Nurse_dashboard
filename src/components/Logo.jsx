import React from 'react';

/**
 * Logo component that draws the custom healthcare cross-and-heart icon.
 * Supports customizable size and coloring.
 */
export default function Logo({ className = "w-10 h-10", dark = false }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl p-2 select-none ${dark ? 'bg-white text-sky-500' : 'bg-sky-500 text-white shadow-md'}`}>
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Cross Shape Outline */}
        <path
          d="M 40 22 
             L 60 22 
             L 60 40 
             L 78 40 
             L 78 60 
             L 60 60 
             L 60 78 
             L 40 78 
             L 40 60 
             L 22 60 
             L 22 40 
             L 40 40 
             Z"
        />

        {/* Top-Left Heart Outline */}
        <path
          d="M 40 40 
             C 40 30, 32 18, 24 25 
             C 16 32, 28 40, 40 40 
             Z"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M 40 40 
             C 38 28, 25 15, 18 24
             C 12 32, 20 42, 38 40"
        />

        {/* Bottom-Right Heart Outline */}
        <path
          d="M 60 60 
             C 60 70, 68 82, 76 75 
             C 84 68, 72 60, 60 60 
             Z"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M 60 60 
             C 62 72, 75 85, 82 76
             C 88 68, 80 58, 62 60"
        />
      </svg>
    </div>
  );
}

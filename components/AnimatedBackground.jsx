import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-purple-50 to-pink-200" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 animate-pulse-slow mix-blend-overlay opacity-70 bg-gradient-to-tr from-transparent via-purple-100/50 to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
    </div>
  );
}
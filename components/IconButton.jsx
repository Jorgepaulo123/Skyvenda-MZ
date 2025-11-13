import React from 'react';

function IconButton({ icon: Icon, count, onClick, color = "blue" }) {
  return (
    <button
      onClick={onClick}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-${color}-500/20 rounded-full blur opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300`} />
      
      {/* Icon container */}
      <div className={`relative z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:border-${color}-200`}>
        <Icon size={22} className={`text-gray-700 group-hover:text-${color}-600 transition-colors duration-300`} />
      </div>

      {/* Notification badge */}
      {count > 0 && (
        <span className={`absolute -top-2 -right-2 bg-${color}-500 text-white text-xs font-medium rounded-full w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-md transform transition-transform duration-300 group-hover:scale-110`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default IconButton;
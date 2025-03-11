import React from 'react';

const ProOverlay = ({ theme }) => {
  return (
    <div 
      className="absolute top-2 right-2 z-50"
    >
      <div
        className="px-3 py-1 rounded-full text-sm font-medium tracking-wider"
        style={{ 
          background: '#3A3A3A',
          color: '#FFFFFF',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        PRO
      </div>
    </div>
  );
};

export default ProOverlay;

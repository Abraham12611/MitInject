import React from 'react';

export const FloatingHeart = ({ x, size, delay }) => {
  const randomRotation = Math.random() * 40 - 20;
  const duration = 2000 + Math.random() * 1000;
  
  return (
    <div 
      className="absolute"
      style={{
        left: `${x}px`,
        bottom: '33vh',
        transform: 'translate(-50%, 0)',
        animation: `float ${duration}ms ease-out forwards ${delay}ms`
      }}
    >
      <svg 
        width={48 * size} 
        height={48 * size} 
        viewBox="0 0 24 24" 
        className="fill-pink-500"
        style={{
          animation: `pop ${duration}ms ease-out forwards ${delay}ms`,
          transform: `rotate(${randomRotation}deg)`
        }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

export const HeartGroup = ({ x }) => {
  const hearts = [
    { size: 1.2, delay: 0 },
    { size: 1.5, delay: 100 },
    { size: 1.8, delay: 200 },
    { size: 1.3, delay: 300 }
  ];

  return hearts.map((heart, index) => (
    <FloatingHeart 
      key={index}
      x={x + Math.random() * 60 - 30}
      size={heart.size}
      delay={heart.delay}
    />
  ));
}; 
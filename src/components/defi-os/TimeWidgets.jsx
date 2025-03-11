import React, { useState, useEffect } from 'react';
import { Timer, Clock } from 'lucide-react';

const TimeWidgets = ({ theme }) => {
  const [utcTime, setUtcTime] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19));

      // Calculate countdown to February 17th
      const target = new Date('2025-02-17T00:00:00Z');
      const diff = target - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown('Launch Day!');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-16 right-0 w-[33vw] flex gap-4 z-[90] px-4">
      <div 
        className="p-4 rounded-xl shadow-xl border flex-1 backdrop-blur-sm text-center overflow-hidden"
        style={{ 
          background: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors?.text?.primary || theme.colors.text,
          boxShadow: theme.colors.effects?.glow,
          backgroundImage: theme.colors.effects?.scanline
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Timer className="w-5 h-5" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
          <h3 className="text-base font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
            STEAMM Launch
          </h3>
        </div>
        <p className="text-2xl font-mono tracking-wider" style={{ color: theme.colors?.text?.accent || theme.colors.accent }}>
          {countdown}
        </p>
      </div>

      <div 
        className="p-4 rounded-xl shadow-xl border flex-1 backdrop-blur-sm text-center overflow-hidden"
        style={{ 
          background: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors?.text?.primary || theme.colors.text,
          boxShadow: theme.colors.effects?.glow,
          backgroundImage: theme.colors.effects?.scanline
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="w-5 h-5" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
          <h3 className="text-base font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
            UTC Time
          </h3>
        </div>
        <p className="text-2xl font-mono tracking-wider" style={{ color: theme.colors?.text?.accent || theme.colors.accent }}>
          {utcTime}
        </p>
      </div>
    </div>
  );
};

export default TimeWidgets;
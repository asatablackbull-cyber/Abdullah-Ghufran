import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] space-y-6 text-center">
      <div className="w-10 h-10 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
      <div className="space-y-2">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
          Processing Visual Input{dots}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Estimating volumetric density and mass</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
import React from 'react';
import AbonnesLogo from './AbonnesLogo';

export default function LoadingScreen() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
        <div className="relative mb-5">
          <div className="absolute -inset-3 rounded-[1.4rem] border border-emerald-400/20 animate-ping" />
          <AbonnesLogo className="w-16 h-16" size={38} />
        </div>
        <p className="text-sm font-black tracking-[0.24em] text-white">ABONNES</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Verileriniz yükleniyor</span>
        </div>
      </div>
    </main>
  );
}

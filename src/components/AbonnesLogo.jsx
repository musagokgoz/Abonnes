import React from 'react';

/**
 * Abonnes resmi uygulama logosu
 * Modern, minimalist döngüsel "A" monogramı
 */
export default function AbonnesLogo({ className = "w-9 h-9", size = 28 }) {
  return (
    <div className={`${className} relative rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0`}>
      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 32 32" width={size} height={size} fill="none">
          {/* Soyut Geometrik "A" ve Döngü Çemberi */}
          <circle cx="16" cy="16" r="12" stroke="url(#abonnes_grad)" strokeWidth="2.5" strokeDasharray="50 15" strokeLinecap="round" />
          <path
            d="M10 22L16 8L22 22M12 18H20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="14" r="1.5" fill="#34D399" />
          <defs>
            <linearGradient id="abonnes_grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="0.5" stopColor="#C084FC" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

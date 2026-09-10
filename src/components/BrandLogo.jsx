import React from 'react';

/**
 * Popüler dijital servislerin yüksek kaliteli, anında yüklenen SVG vektör logoları.
 * Dış kaynaklı bozuk favicon veya CORS sorunlarını tamamen ortadan kaldırır.
 */
export default function BrandLogo({ serviceId, name, brandColor, className = "w-10 h-10", size = 24 }) {
  const id = (serviceId || '').toLowerCase();
  const title = name || '';

  // Netflix Logosu (İkonik Kırmızı N)
  if (id.includes('netflix')) {
    return (
      <div className={`${className} rounded-xl bg-black flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          <path d="M5.5 2h3.2v20H5.5V2z" fill="#E50914" />
          <path d="M15.3 2h3.2v20h-3.2V2z" fill="#E50914" />
          <path d="M5.5 2h3.4l9.6 20h-3.4L5.5 2z" fill="#B81D24" />
        </svg>
      </div>
    );
  }

  // Spotify (Yeşil Daire + Ses Dalgaları)
  if (id.includes('spotify')) {
    return (
      <div className={`${className} rounded-xl bg-[#121212] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="#1DB954">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.625.625 0 01-.86.207c-2.355-1.439-5.32-1.764-8.813-.966a.624.624 0 11-.28-1.218c3.826-.874 7.106-.503 9.746 1.117.293.18.387.568.207.86zm1.226-2.724a.78.78 0 01-1.074.257c-2.695-1.657-6.804-2.135-9.992-1.167a.781.781 0 01-.453-1.496c3.642-1.106 8.188-.574 11.262 1.332.366.225.482.708.257 1.074zm.105-2.835C14.69 8.94 9.385 8.765 6.308 9.7a.937.937 0 11-.548-1.792c3.528-1.071 9.39-.868 13.13 1.353a.937.937 0 01-.973 1.604z" />
        </svg>
      </div>
    );
  }

  // ChatGPT / OpenAI (Yeşilimsi Teal Dönen Çark)
  if (id.includes('chatgpt') || id.includes('openai')) {
    return (
      <div className={`${className} rounded-xl bg-[#10A37F] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" fill="#0D8A6C" stroke="none" />
          <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="3" fill="white" />
        </svg>
      </div>
    );
  }

  // Claude / Anthropic
  if (id.includes('claude') || id.includes('anthropic')) {
    return (
      <div className={`${className} rounded-xl bg-[#CC785C] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
          <path d="M4 17l4.5-10h3L16 17h-2.8l-1-2.5H7.8L6.8 17H4zm4.5-5h2.2L9.6 8.8 8.5 12z" />
        </svg>
      </div>
    );
  }

  // Cursor AI
  if (id.includes('cursor')) {
    return (
      <div className={`${className} rounded-xl bg-black border border-slate-700 flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="white" strokeWidth="2">
          <polygon points="5 3 19 12 12 13 8 21 5 3" fill="white" stroke="none" />
        </svg>
      </div>
    );
  }

  // YouTube Premium (Kırmızı Dörtgen + Beyaz Play Üçgeni)
  if (id.includes('youtube')) {
    return (
      <div className={`${className} rounded-xl bg-[#FF0000] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
          <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
        </svg>
      </div>
    );
  }

  // Amazon Prime
  if (id.includes('amazon') || id.includes('prime')) {
    return (
      <div className={`${className} rounded-xl bg-[#00A8E1] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <span className="text-white font-black text-xs tracking-tighter">prime</span>
      </div>
    );
  }

  // Exxen (Sarı ve Siyah X)
  if (id.includes('exxen')) {
    return (
      <div className={`${className} rounded-xl bg-[#FFCB05] flex items-center justify-center shadow-md p-1 shrink-0`}>
        <span className="text-black font-black text-sm tracking-tighter">EXXEN</span>
      </div>
    );
  }

  // BluTV
  if (id.includes('blutv')) {
    return (
      <div className={`${className} rounded-xl bg-[#00B4D8] flex items-center justify-center shadow-md p-1 shrink-0`}>
        <span className="text-white font-black text-xs tracking-tighter">bluTV</span>
      </div>
    );
  }

  // GAIN
  if (id.includes('gain')) {
    return (
      <div className={`${className} rounded-xl bg-[#1B1B1E] border border-[#2EC4B6]/40 flex items-center justify-center shadow-md p-1 shrink-0`}>
        <span className="text-[#2EC4B6] font-black text-xs tracking-widest">GAIN</span>
      </div>
    );
  }

  // Disney+
  if (id.includes('disney')) {
    return (
      <div className={`${className} rounded-xl bg-[#113CCF] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <span className="text-white font-black text-xs tracking-tighter">Disney+</span>
      </div>
    );
  }

  // Apple (iCloud, Apple Music, Apple One)
  if (id.includes('apple') || id.includes('icloud')) {
    return (
      <div className={`${className} rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.58.67-.99 1.74-.85 2.76 1.01.08 2.03-.51 2.55-1.26z" />
        </svg>
      </div>
    );
  }

  // Google (Google One)
  if (id.includes('google')) {
    return (
      <div className={`${className} rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      </div>
    );
  }

  // Midjourney
  if (id.includes('midjourney')) {
    return (
      <div className={`${className} rounded-xl bg-[#1E293B] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18l6-6-3-4 12 8-5 4-10-2z" fill="#60A5FA" stroke="none" />
          <path d="M12 4l3 6-3 2-4-2 4-6z" fill="#93C5FD" stroke="none" />
        </svg>
      </div>
    );
  }

  // GitHub Copilot
  if (id.includes('github') || id.includes('copilot')) {
    return (
      <div className={`${className} rounded-xl bg-[#24292E] border border-slate-700 flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </div>
    );
  }

  // Xbox Game Pass
  if (id.includes('xbox')) {
    return (
      <div className={`${className} rounded-xl bg-[#107C10] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
          <circle cx="12" cy="12" r="10" />
          <path d="M7 6c2 3 5 8 5 8s3-5 5-8c-2-1-3.5-1-5-1s-3 0-5 1z" fill="#107C10" />
        </svg>
      </div>
    );
  }

  // PlayStation
  if (id.includes('playstation')) {
    return (
      <div className={`${className} rounded-xl bg-[#003791] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <span className="text-white font-black text-xs">PS+</span>
      </div>
    );
  }

  // Adobe Creative Cloud
  if (id.includes('adobe')) {
    return (
      <div className={`${className} rounded-xl bg-[#FF0000] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <span className="text-white font-black text-sm">A</span>
      </div>
    );
  }

  // Canva
  if (id.includes('canva')) {
    return (
      <div className={`${className} rounded-xl bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] flex items-center justify-center shadow-md p-1.5 shrink-0`}>
        <span className="text-white font-black text-xs">Canva</span>
      </div>
    );
  }

  // Duolingo
  if (id.includes('duolingo')) {
    return (
      <div className={`${className} rounded-xl bg-[#58CC02] flex items-center justify-center shadow-md p-1 shrink-0`}>
        <span className="text-white font-black text-xs">duo</span>
      </div>
    );
  }

  // Notion
  if (id.includes('notion')) {
    return (
      <div className={`${className} rounded-xl bg-white text-black flex items-center justify-center shadow-md p-1 shrink-0`}>
        <span className="font-serif font-black text-base">N</span>
      </div>
    );
  }

  // TOD TV / beIN
  if (id.includes('todtv') || id.includes('bein')) {
    return (
      <div className={`${className} rounded-xl bg-[#6B46C1] flex items-center justify-center shadow-md p-1 shrink-0`}>
        <span className="text-white font-black text-xs">TOD</span>
      </div>
    );
  }

  // Genel Fallback (Şık harfli rozet)
  const initial = title.charAt(0).toUpperCase() || 'A';
  return (
    <div
      className={`${className} rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-md shrink-0`}
      style={{ backgroundColor: brandColor || '#3B82F6' }}
    >
      {initial}
    </div>
  );
}

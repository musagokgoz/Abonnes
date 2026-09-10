import React from 'react';
import { Search } from 'lucide-react';

export default function SubscriptionFilter({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  counts,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      {/* Yatay Kaydırılabilir Sade Sekmeler */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
        <button
          onClick={() => onSelectTab('all')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          Tümü ({counts.all})
        </button>

        <button
          onClick={() => onSelectTab('trials')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'trials'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-amber-300 bg-slate-900/50'
          }`}
        >
          ⏳ Denemeler ({counts.trials})
        </button>

        <button
          onClick={() => onSelectTab('upcoming')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-emerald-300 bg-slate-900/50'
          }`}
        >
          💳 Yaklaşanlar ({counts.upcoming})
        </button>
      </div>

      {/* Arama Kutusu */}
      <div className="relative w-full sm:w-60">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Abonelik ara..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-8.5 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
        />
      </div>
    </div>
  );
}

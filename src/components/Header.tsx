import React from 'react';
import { Play, Square, Download, Code2, Music, BookOpen, Terminal, Mic } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'catalog' | 'api' | 'guide' | 'practice';
  setActiveTab: (tab: 'studio' | 'catalog' | 'api' | 'guide' | 'practice') => void;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onExportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPlaying,
  onPlay,
  onStop,
  onExportClick,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="text-xl font-bold tracking-tight text-stone-900 font-serif"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          PsalmiNotat
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'studio'
              ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-700'
              : 'hover:text-stone-900'
          }`}
        >
          <Music className="w-4 h-4 text-stone-500" />
          <span>Nuottistudio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'catalog'
              ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-700'
              : 'hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-stone-500" />
          <span>Psalmitonukset</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'practice'
              ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-700'
              : 'hover:text-stone-900'
          }`}
        >
          <Mic className="w-4 h-4 text-stone-500" />
          <span>Harjoitus</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('api')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'api'
              ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-700'
              : 'hover:text-stone-900'
          }`}
        >
          <Terminal className="w-4 h-4 text-stone-500" />
          <span>Mikropalvelu-API</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'guide'
              ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-700'
              : 'hover:text-stone-900'
          }`}
        >
          <Code2 className="w-4 h-4 text-stone-500" />
          <span>Pikaopas & syntaksi</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        {isPlaying ? (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Pysäytä</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Kuuntele uruilla</span>
          </button>
        )}

        <button
          type="button"
          onClick={onExportClick}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Vie</span>
        </button>
      </div>
    </header>
  );
};

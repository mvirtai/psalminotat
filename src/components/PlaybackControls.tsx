import React from 'react';
import { Play, Square, Volume2, Music2, RotateCcw } from 'lucide-react';
import { ClefType } from '../types/music';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  tempo: number;
  setTempo: (tempo: number) => void;
  transpose: number;
  setTranspose: (semi: number) => void;
  clef: ClefType;
  setClef: (clef: ClefType) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onStop,
  tempo,
  setTempo,
  transpose,
  setTranspose,
  clef,
  setClef,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-stone-200 rounded-lg shadow-xs text-xs">
      {/* Play / Stop Button Group */}
      <div className="flex items-center gap-3">
        {isPlaying ? (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md transition-colors cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Pysäytä toisto</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Soita sävelmä (urut)</span>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 text-stone-500">
          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Liturginen pilliurkusynteesi</span>
        </div>
      </div>

      {/* Sliders and Toggles */}
      <div className="flex flex-wrap items-center gap-5">
        {/* Tempo Slider */}
        <div className="flex items-center gap-2">
          <span className="text-stone-600 font-medium">Tempo:</span>
          <input
            type="range"
            min="45"
            max="110"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value, 10))}
            className="w-24 accent-amber-800 cursor-pointer"
          />
          <span className="font-mono tabular-nums text-stone-800 min-w-10">
            {tempo} <span className="text-stone-400 text-[10px]">BPM</span>
          </span>
        </div>

        {/* Transposition Slider */}
        <div className="flex items-center gap-2">
          <span className="text-stone-600 font-medium">Transponointi:</span>
          <button
            type="button"
            onClick={() => setTranspose(Math.max(-7, transpose - 1))}
            className="w-5 h-5 flex items-center justify-center border border-stone-300 rounded bg-stone-50 hover:bg-stone-100 cursor-pointer font-mono"
            title="Puolisävelaskel alas"
          >
            -
          </button>
          <span className="font-mono tabular-nums text-stone-800 min-w-8 text-center font-medium">
            {transpose > 0 ? `+${transpose}` : transpose}
          </span>
          <button
            type="button"
            onClick={() => setTranspose(Math.min(7, transpose + 1))}
            className="w-5 h-5 flex items-center justify-center border border-stone-300 rounded bg-stone-50 hover:bg-stone-100 cursor-pointer font-mono"
            title="Puolisävelaskel ylös"
          >
            +
          </button>
          {transpose !== 0 && (
            <button
              type="button"
              onClick={() => setTranspose(0)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer ml-1"
              title="Palauta alkuperäinen"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Clef Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-stone-100 border border-stone-200 rounded-md">
          <button
            type="button"
            onClick={() => setClef('treble')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              clef === 'treble'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            G-avain
          </button>
          <button
            type="button"
            onClick={() => setClef('bass')}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              clef === 'bass'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            F-avain (Basso)
          </button>
        </div>
      </div>
    </div>
  );
};

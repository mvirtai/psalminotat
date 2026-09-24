import React, { useMemo, useRef, useState } from 'react';
import { ActiveNoteColor, ActiveNoteSize, ParsedScore, StaffStyle } from '../types/music';
import { ACTIVE_COLOR_MAP, renderScoreToSvg } from '../lib/engraver';
import { synth } from '../lib/synth';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Sparkles, SlidersHorizontal } from 'lucide-react';

interface NotationCanvasProps {
  score: ParsedScore;
  style: StaffStyle;
  setStyle: (style: StaffStyle) => void;
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
  showSectionLabels: boolean;
  setShowSectionLabels: (show: boolean) => void;
  activeNoteId: string | null;
  activeNoteColor?: ActiveNoteColor;
  setActiveNoteColor?: (color: ActiveNoteColor) => void;
  activeNoteSize?: ActiveNoteSize;
  setActiveNoteSize?: (size: ActiveNoteSize) => void;
  highlightCadences?: boolean;
  setHighlightCadences?: (highlight: boolean) => void;
}

export const NotationCanvas: React.FC<NotationCanvasProps> = ({
  score,
  style,
  setStyle,
  showLyrics,
  setShowLyrics,
  showSectionLabels,
  setShowSectionLabels,
  activeNoteId,
  activeNoteColor: controlledColor,
  setActiveNoteColor: controlledSetColor,
  activeNoteSize: controlledSize,
  setActiveNoteSize: controlledSetSize,
  highlightCadences: controlledCadences,
  setHighlightCadences: controlledSetCadences,
}) => {
  // Local state with fallback to controlled props
  const [localColor, setLocalColor] = useState<ActiveNoteColor>('amber');
  const [localSize, setLocalSize] = useState<ActiveNoteSize>('large');
  const [localHighlightCadences, setLocalHighlightCadences] = useState<boolean>(true);
  const [showHighlightPanel, setShowHighlightPanel] = useState<boolean>(false);

  const activeColor = controlledColor ?? localColor;
  const setActiveColor = controlledSetColor ?? setLocalColor;

  const activeSize = controlledSize ?? localSize;
  const setActiveSize = controlledSetSize ?? setLocalSize;

  const highlightCadences = controlledCadences ?? localHighlightCadences;
  const setHighlightCadences = controlledSetCadences ?? setLocalHighlightCadences;

  const [zoom, setZoom] = useState(1.0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate SVG markup
  const svgMarkup = useMemo(() => {
    return renderScoreToSvg(score, {
      style,
      clef: score.clef,
      showLyrics,
      showSectionLabels,
      activeNoteId,
      activeNoteColor: activeColor,
      activeNoteSize: activeSize,
      highlightCadences,
    });
  }, [score, style, showLyrics, showSectionLabels, activeNoteId, activeColor, activeSize, highlightCadences]);

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgMarkup);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle note click on SVG
  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('[data-note-id]');
    if (target) {
      const noteId = target.getAttribute('data-note-id');
      const token = score.tokens.find(t => t.id === noteId);
      if (token && token.type === 'note') {
        synth.playSinglePitch(token.step, token.octave, token.accidental, 0.8);
      }
    }
  };

  const colorsList: { key: ActiveNoteColor; name: string; hex: string }[] = [
    { key: 'amber', name: 'Kulta / Meripihka', hex: '#D97706' },
    { key: 'crimson', name: 'Rubiini / Punainen', hex: '#DC2626' },
    { key: 'emerald', name: 'Smaragdi / Vihreä', hex: '#059669' },
    { key: 'sapphire', name: 'Safiiri / Sininen', hex: '#2563EB' },
    { key: 'violet', name: 'Liturginen violetti', hex: '#7C3AED' },
  ];

  return (
    <div className="flex flex-col bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
      {/* Top Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-stone-100/60 border-b border-stone-200 text-xs">
        {/* Style Segmented Switcher (Functional Tab Button) */}
        <div className="flex items-center gap-1 p-0.5 bg-stone-200/80 rounded-md">
          <button
            type="button"
            onClick={() => setStyle('modern')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              style === 'modern'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            5-viivainen moderni nuotinnus
          </button>
          <button
            type="button"
            onClick={() => setStyle('chant')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              style === 'chant'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            4-viivainen gregoriaaninen notaatio
          </button>
        </div>

        {/* View Options & Highlight Customizer Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showLyrics}
              onChange={(e) => setShowLyrics(e.target.checked)}
              className="rounded text-amber-800 focus:ring-amber-700 accent-amber-800"
            />
            <span>Sanoitus</span>
          </label>

          <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSectionLabels}
              onChange={(e) => setShowSectionLabels(e.target.checked)}
              className="rounded text-amber-800 focus:ring-amber-700 accent-amber-800"
            />
            <span>Rakenteet</span>
          </label>

          {/* Quick Highlight Options Trigger */}
          <button
            type="button"
            onClick={() => setShowHighlightPanel(!showHighlightPanel)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              showHighlightPanel
                ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
            title="Säädä soivan nuotin väriä, kokoa ja kaneettikorostusta"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Nuotin väri & koko</span>
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-black/15 shadow-2xs"
              style={{ backgroundColor: ACTIVE_COLOR_MAP[activeColor].primary }}
              title={`Aktiivinen väri: ${ACTIVE_COLOR_MAP[activeColor].label}`}
            />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center border border-stone-300 rounded bg-white divide-x divide-stone-200">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}
              className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer"
              title="Loitonna"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 text-[11px] font-mono tabular-nums text-stone-600 min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
              className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer"
              title="Lähennä"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-50 cursor-pointer"
              title="Palauta 100%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Copy SVG code */}
          <button
            type="button"
            onClick={handleCopySvg}
            className="flex items-center gap-1 px-2.5 py-1 text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors cursor-pointer"
            title="Kopioi SVG leikepöydälle"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Kopioitu!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Kopioi SVG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Bar: Active Note Color, Size & Kaneetti Highlights */}
      {showHighlightPanel && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-amber-50/70 border-b border-amber-200/80 text-xs">
          {/* Active Note Color Picker */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Aktiivisen nuotin väri:</span>
            <div className="flex items-center gap-1.5">
              {colorsList.map(c => {
                const isSelected = activeColor === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setActiveColor(c.key)}
                    className={`group relative p-1 rounded-full transition-transform cursor-pointer ${
                      isSelected ? 'ring-2 ring-stone-900 ring-offset-1 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-4 h-4 rounded-full border border-black/20 shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}
              <span className="text-[11px] text-stone-600 font-medium ml-1">
                {ACTIVE_COLOR_MAP[activeColor].label}
              </span>
            </div>
          </div>

          {/* Active Note Size Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Nuotin koko:</span>
            <div className="flex items-center gap-1 p-0.5 bg-white border border-stone-300 rounded-md">
              <button
                type="button"
                onClick={() => setActiveSize('normal')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeSize === 'normal'
                    ? 'bg-amber-800 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Normaali 1.0x koko"
              >
                Normaali
              </button>
              <button
                type="button"
                onClick={() => setActiveSize('large')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeSize === 'large'
                    ? 'bg-amber-800 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Korostettu 1.35x suurennus"
              >
                Suuri (1.35x)
              </button>
              <button
                type="button"
                onClick={() => setActiveSize('glow')}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeSize === 'glow'
                    ? 'bg-amber-800 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="1.45x koko ja laajennettu hehkukehä"
              >
                Sykkivä hehku
              </button>
            </div>
          </div>

          {/* Kaneettinuotit Highlight Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-stone-800 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highlightCadences}
                onChange={(e) => setHighlightCadences(e.target.checked)}
                className="rounded text-amber-800 focus:ring-amber-700 accent-amber-800 w-3.5 h-3.5"
              />
              <span>Korosta kaneettinuotit (kadenssit)</span>
            </label>
            <span className="text-[11px] text-stone-500 hidden lg:inline">
              (korostaa mediatio- ja terminatio-käänteet erottumaan resitoinnista)
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        onClick={handleSvgClick}
        className="p-6 md:p-8 bg-[#FBF9F5] overflow-x-auto min-h-[220px] flex items-center justify-center relative cursor-crosshair"
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="w-full max-w-4xl"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>

      {/* Unboxed Metadata Footer (Strictly Zero-Pill format!) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-stone-50 border-t border-stone-200 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span>{score.title || 'Psalmisävelmä'}</span>
          <span aria-hidden="true">·</span>
          <span>{score.mode || 'Modus'}</span>
          <span aria-hidden="true">·</span>
          <span>Sävellaji: {score.key}</span>
          {score.tenorNote && (
            <>
              <span aria-hidden="true">·</span>
              <span>Resitatiivisävel (tuba): <strong className="font-semibold text-stone-700">{score.tenorNote.toUpperCase()}</strong></span>
            </>
          )}
          {highlightCadences && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-900 font-medium">Kaneetit korostettu</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-stone-400">
          <span>{score.tokens.filter(t => t.type === 'note').length} säveltä</span>
          <span aria-hidden="true">·</span>
          <span>Klikkaa nuottia kuunnellaksesi sävelkorkeus</span>
        </div>
      </div>
    </div>
  );
};

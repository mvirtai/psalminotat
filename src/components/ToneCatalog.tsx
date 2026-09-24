import React, { useState } from 'react';
import { PSALM_TONE_PRESETS } from '../lib/tones';
import { PsalmPreset } from '../types/music';
import { Play, ArrowRight, BookOpen, Music, Check } from 'lucide-react';
import { parsePsalmCode } from '../lib/parser';
import { synth } from '../lib/synth';

interface ToneCatalogProps {
  onSelectTone: (preset: PsalmPreset) => void;
}

export const ToneCatalog: React.FC<ToneCatalogProps> = ({ onSelectTone }) => {
  const [filter, setFilter] = useState<'all' | 'gregorian' | 'finnish' | 'canticle' | 'taize'>('all');
  const [auditioningId, setAuditioningId] = useState<string | null>(null);

  const filtered = PSALM_TONE_PRESETS.filter(p => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const handleAudition = (preset: PsalmPreset) => {
    if (auditioningId === preset.id) {
      synth.stop();
      setAuditioningId(null);
      return;
    }

    synth.stop();
    setAuditioningId(preset.id);
    const parsed = parsePsalmCode(preset.code);
    synth.playScore(parsed, 75, undefined, () => {
      setAuditioningId(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner & Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2
            className="text-xl font-bold tracking-tight text-stone-900 font-serif"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Psalmitonuskirjasto
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Läntisen kirkon ja Suomen ev.lut. kirkon viralliset psalmisävelmät resitointiin ja liturgiseen lauluun.
          </p>
        </div>

        {/* Category Filter Buttons (Functional Tabs) */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Kaikki ({PSALM_TONE_PRESETS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('gregorian')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'gregorian'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Gregoriaaniset (I–VIII & Peregrinus)
          </button>
          <button
            type="button"
            onClick={() => setFilter('finnish')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'finnish'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Suomalaiset virsikirjan sävelet
          </button>
          <button
            type="button"
            onClick={() => setFilter('canticle')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'canticle'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ylistysvirret (Magnificat)
          </button>
          <button
            type="button"
            onClick={() => setFilter('taize')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'taize'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Taizé
          </button>
        </div>
      </div>

      {/* Grid of Psalm Tone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(tone => {
          const isAuditioning = auditioningId === tone.id;

          return (
            <div
              key={tone.id}
              className="flex flex-col justify-between p-5 bg-white border border-stone-200 rounded-lg hover:border-amber-300 hover:shadow-sm transition-all duration-150"
            >
              <div>
                {/* Unboxed Metadata Header (No static pill badges!) */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1.5">
                  <span className="font-semibold text-amber-900">{tone.mode}</span>
                  <span aria-hidden="true">·</span>
                  <span>Tuba: <strong>{tone.tuba}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Finalis: {tone.finalis}</span>
                </div>

                <h3
                  className="text-base font-bold text-stone-900 font-serif"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {tone.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{tone.subtitle}</p>

                <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                  {tone.description}
                </p>

                {/* Sample Verse Preview */}
                <div className="mt-3.5 p-2.5 bg-stone-50 border-l-2 border-amber-700 rounded-r text-[12px] italic text-stone-700 font-serif">
                  "{tone.sampleVerse}"
                </div>

                <div className="mt-2 text-[11px] text-stone-400">
                  <span className="font-medium text-stone-500">Käyttö:</span> {tone.liturgicalUse}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 mt-5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleAudition(tone)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                    isAuditioning
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isAuditioning ? 'text-amber-900 fill-amber-900' : 'text-stone-500 fill-stone-500'}`} />
                  <span>{isAuditioning ? 'Soi...' : 'Kuuntele'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTone(tone)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded transition-colors cursor-pointer shadow-xs"
                >
                  <span>Avaa studioon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

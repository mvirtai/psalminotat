import React, { useState } from 'react';
import { ParsedScore } from '../types/music';
import { renderScoreToSvg } from '../lib/engraver';
import { synth } from '../lib/synth';
import { Play, Square } from 'lucide-react';

export const PracticeView: React.FC<{ score: ParsedScore }> = ({ score }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const svgMarkup = renderScoreToSvg(score, { style: 'modern', showLyrics: true, activeNoteColor: 'amber', activeNoteSize: 'large', highlightCadences: true });

  const togglePlay = () => {
    if (isPlaying) { synth.stop(); setIsPlaying(false); }
    else { setIsPlaying(true); synth.playScore(score, 70, () => {}, () => setIsPlaying(false)); }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white min-h-screen">
      <h1 className="text-4xl font-serif font-bold mb-8 text-stone-900">{score.title}</h1>
      
      {/* Large Notation */}
      <div className="w-full max-w-6xl mb-12 border border-stone-100 rounded-lg shadow-sm" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
      
      {/* Large Lyrics */}
      <div className="text-3xl font-serif leading-loose text-center max-w-4xl text-stone-800 mb-16">
        {score.tokens.filter(t => t.type === 'note').map((t, i) => (
          <span key={i} className="mx-1">{t.lyric}</span>
        ))}
      </div>

      {/* Basic Playback */}
      <button 
        onClick={togglePlay} 
        className="p-8 rounded-full bg-amber-800 text-white cursor-pointer hover:bg-amber-900 transition-transform hover:scale-105 shadow-lg"
      >
        {isPlaying ? <Square size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
      </button>
    </div>
  );
};

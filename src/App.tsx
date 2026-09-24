/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { NotationCanvas } from './components/NotationCanvas';
import { CodeEditor } from './components/CodeEditor';
import { PlaybackControls } from './components/PlaybackControls';
import { ToneCatalog } from './components/ToneCatalog';
import { ApiExplorer } from './components/ApiExplorer';
import { LiturgicalGuide } from './components/LiturgicalGuide';
import { PracticeView } from './components/PracticeView';
import { ExportModal } from './components/ExportModal';
import { PSALM_TONE_PRESETS } from './lib/tones';
import { parsePsalmCode, transposeScore } from './lib/parser';
import { synth } from './lib/synth';
import { ActiveNoteColor, ActiveNoteSize, ClefType, NoteToken, PsalmPreset, StaffStyle } from './types/music';
import { Bookmark, Sparkles, SlidersHorizontal, Music, ChevronDown, Mic } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'catalog' | 'api' | 'guide' | 'practice'>('studio');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tonus-1');
  const [code, setCode] = useState<string>(PSALM_TONE_PRESETS[0].code);

  const [style, setStyle] = useState<StaffStyle>('modern');
  const [clef, setClef] = useState<ClefType>('treble');
  const [tempo, setTempo] = useState<number>(70);
  const [transpose, setTranspose] = useState<number>(0);
  const [showLyrics, setShowLyrics] = useState<boolean>(true);
  const [showSectionLabels, setShowSectionLabels] = useState<boolean>(true);
  const [activeNoteColor, setActiveNoteColor] = useState<ActiveNoteColor>('amber');
  const [activeNoteSize, setActiveNoteSize] = useState<ActiveNoteSize>('large');
  const [highlightCadences, setHighlightCadences] = useState<boolean>(true);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  // Parse code in real time
  const baseScore = useMemo(() => {
    return parsePsalmCode(code);
  }, [code]);

  // Apply transposition and clef override
  const activeScore = useMemo(() => {
    const s = transposeScore(baseScore, transpose);
    return {
      ...s,
      clef: clef || s.clef
    };
  }, [baseScore, transpose, clef]);

  // Stop playback when unmounting or changing score
  useEffect(() => {
    return () => {
      synth.stop();
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
    synth.playScore(
      activeScore,
      tempo,
      (token: NoteToken | null) => {
        setActiveNoteId(token ? token.id : null);
      },
      () => {
        setIsPlaying(false);
        setActiveNoteId(null);
      }
    );
  };

  const handleStop = () => {
    synth.stop();
    setIsPlaying(false);
    setActiveNoteId(null);
  };

  const handleSelectPreset = (preset: PsalmPreset) => {
    handleStop();
    setSelectedPresetId(preset.id);
    setCode(preset.code);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={handleStop}
        onExportClick={() => setExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Studio Header / Fast Preset Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <h1
                  className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-serif"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  Psalmisävelmästudio
                </h1>
                <span className="text-xs text-stone-400 hidden sm:inline">|</span>
                <p className="text-xs text-stone-500 hidden sm:inline">
                  Kokeile ja havainnollista melodioita yksinkertaisella nuottikoodilla.
                </p>
              </div>

              {/* Quick Preset Selector Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-stone-500 whitespace-nowrap">Valitse sävelmä:</span>
                <div className="relative">
                  <select
                    value={selectedPresetId}
                    onChange={(e) => {
                      const found = PSALM_TONE_PRESETS.find(p => p.id === e.target.value);
                      if (found) handleSelectPreset(found);
                    }}
                    className="text-xs font-medium py-1.5 pl-3 pr-8 bg-white border border-stone-300 rounded-md text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-700 cursor-pointer shadow-2xs"
                  >
                    <optgroup label="Gregoriaaniset kirkkosävelmät">
                      {PSALM_TONE_PRESETS.filter(p => p.category === 'gregorian').map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Suomen ev.lut. kirkko">
                      {PSALM_TONE_PRESETS.filter(p => p.category === 'finnish').map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Ylistysvirret ja Taizé">
                      {PSALM_TONE_PRESETS.filter(p => p.category !== 'gregorian' && p.category !== 'finnish').map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Stage: Notation Canvas */}
            <NotationCanvas
              score={activeScore}
              style={style}
              setStyle={setStyle}
              showLyrics={showLyrics}
              setShowLyrics={setShowLyrics}
              showSectionLabels={showSectionLabels}
              setShowSectionLabels={setShowSectionLabels}
              activeNoteId={activeNoteId}
              activeNoteColor={activeNoteColor}
              setActiveNoteColor={setActiveNoteColor}
              activeNoteSize={activeNoteSize}
              setActiveNoteSize={setActiveNoteSize}
              highlightCadences={highlightCadences}
              setHighlightCadences={setHighlightCadences}
            />

            {/* Playback & Synthesizer Controls */}
            <PlaybackControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onStop={handleStop}
              tempo={tempo}
              setTempo={setTempo}
              transpose={transpose}
              setTranspose={setTranspose}
              clef={clef}
              setClef={setClef}
            />

            {/* Code Editor Deck */}
            <div className="grid grid-cols-1 gap-6">
              <CodeEditor
                code={code}
                onChange={setCode}
                score={activeScore}
              />
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <ToneCatalog onSelectTone={handleSelectPreset} />
        )}

        {activeTab === 'api' && (
          <ApiExplorer />
        )}

        {activeTab === 'guide' && (
          <LiturgicalGuide />
        )}

        {activeTab === 'practice' && (
          <PracticeView score={activeScore} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-stone-100/50 py-4 px-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">PsalmiNotat</span>
            <span aria-hidden="true">·</span>
            <span>Liturginen sävelmä- ja nuottimikropalvelu</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Standardi SVG & MIDI -yhteensopivuus</span>
            <span aria-hidden="true">·</span>
            <span>Virkamusiikki & kirkkolaulu</span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        score={activeScore}
        style={style}
        tempo={tempo}
        highlightCadences={highlightCadences}
      />
    </div>
  );
}

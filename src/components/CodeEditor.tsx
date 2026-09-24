import React, { useRef } from 'react';
import { ParsedScore } from '../types/music';
import { AlertCircle, Plus, Sparkles, HelpCircle } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  score: ParsedScore;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  score,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(code + ' ' + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = code.substring(0, start) + textToInsert + code.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 10);
  };

  return (
    <div className="flex flex-col bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden h-full">
      {/* Header & Quick Snippet Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-stone-100/70 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-800 font-serif" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
            Sävelmäkoodi (DSL)
          </span>
          <span className="text-[11px] text-stone-500">· Reaaliaikainen päivitys</span>
        </div>

        {/* Quick Insert Buttons */}
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          <span className="text-stone-400 mr-1 hidden sm:inline">Lisää:</span>
          <button
            type="button"
            onClick={() => insertAtCursor('\n[Intonatio] ')}
            className="px-2 py-0.5 bg-white hover:bg-stone-50 border border-stone-300 rounded text-stone-700 transition-colors cursor-pointer"
            title="Lisää Intonatio (alkusävelmä)"
          >
            + Intonatio
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor('\n[Tenor] A4~ ')}
            className="px-2 py-0.5 bg-white hover:bg-stone-50 border border-stone-300 rounded text-stone-700 transition-colors cursor-pointer font-medium"
            title="Lisää Tenor (resitatiivisävel)"
          >
            + Tenor (~)
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor(' | ')}
            className="px-2 py-0.5 bg-white hover:bg-stone-50 border border-stone-300 rounded text-stone-700 transition-colors cursor-pointer"
            title="Lisää Mediatio (puolivälin taite * / |)"
          >
            + Mediatio (|)
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor('\n[Terminatio] ')}
            className="px-2 py-0.5 bg-white hover:bg-stone-50 border border-stone-300 rounded text-stone-700 transition-colors cursor-pointer"
            title="Lisää Terminatio (päätöskadenssi)"
          >
            + Terminatio
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor(' † ')}
            className="px-2 py-0.5 bg-white hover:bg-stone-50 border border-stone-300 rounded text-stone-700 transition-colors cursor-pointer"
            title="Lisää Flexa († -lasku)"
          >
            + Flexa (†)
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor(' ||\n')}
            className="px-2 py-0.5 bg-white hover:bg-stone-50 border border-stone-300 rounded text-stone-700 transition-colors cursor-pointer"
            title="Lisää kaksoisviiva"
          >
            + Päätös (||)
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[220px]">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`title: Tonus I\nkey: F\nlyrics: Her-ra on mi-nun pai-me-ne-ni...\n\n[Intonatio] F4 G4\n[Tenor] A4~\n[Mediatio] G4 A4 F4 |\n[Tenor] A4~\n[Terminatio] G4 F4 E4 D4 ||`}
          className="w-full h-full min-h-[240px] p-4 text-xs sm:text-sm font-mono leading-relaxed bg-white text-stone-900 resize-y focus:outline-none focus:ring-1 focus:ring-amber-700 border-none select-text"
          spellCheck={false}
        />
      </div>

      {/* Quick Pitch Palette */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 bg-stone-50 border-t border-stone-200 text-xs">
        <span className="text-stone-500 font-medium mr-1 text-[11px]">Sävelet:</span>
        {['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'B4', 'C5', 'D5'].map(pitch => (
          <button
            key={pitch}
            type="button"
            onClick={() => insertAtCursor(pitch + ' ')}
            className="px-2 py-0.5 text-xs font-mono font-medium bg-white hover:bg-amber-50 hover:border-amber-400 border border-stone-300 rounded text-stone-800 transition-colors cursor-pointer"
          >
            {pitch}
          </button>
        ))}
        <span className="text-stone-300 mx-1">|</span>
        <button
          type="button"
          onClick={() => insertAtCursor('~ ')}
          className="px-2 py-0.5 text-xs font-mono font-medium bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded text-amber-900 transition-colors cursor-pointer"
          title="Merkitse edellinen sävel resitatiiviksi (pitkä sävel)"
        >
          ~ (resitointi)
        </button>
      </div>

      {/* Errors or Hint Bar */}
      {score.errors.length > 0 ? (
        <div className="flex items-start gap-2 px-4 py-2 bg-rose-50 border-t border-rose-200 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Huomio koodissa:</span>
            <ul className="list-disc list-inside mt-0.5 space-y-0.5">
              {score.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-1.5 bg-stone-50/50 border-t border-stone-100 text-[11px] text-stone-400">
          <span>Syntaksi: Kirjoita säveliä (esim. F4 G4 A4~), osioita [Intonatio] ja jakomerkkejä | tai ||</span>
          <span>lyrics: tavutettu-teksti-tähän</span>
        </div>
      )}
    </div>
  );
};

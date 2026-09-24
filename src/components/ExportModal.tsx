import React, { useState } from 'react';
import { ParsedScore, StaffStyle } from '../types/music';
import { renderScoreToSvg } from '../lib/engraver';
import { generateMidiFile } from '../lib/midi';
import { Download, X, Copy, Check, FileText, Music, Printer } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: ParsedScore;
  style: StaffStyle;
  tempo: number;
  highlightCadences?: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  score,
  style,
  tempo,
  highlightCadences = true,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const svgContent = renderScoreToSvg(score, {
    style,
    clef: score.clef,
    showLyrics: true,
    showSectionLabels: true,
    highlightCadences,
  });

  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(score.title || 'psalmi').toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadMidi = () => {
    const midiBytes = generateMidiFile(score, tempo);
    const blob = new Blob([midiBytes.buffer as ArrayBuffer], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(score.title || 'psalmi').toLowerCase().replace(/[^a-z0-9]/g, '_')}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySvgText = () => {
    navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${score.title || 'Psalmisävelmä'}</title>
          <style>
            body { margin: 40px; font-family: sans-serif; text-align: center; }
            h1 { font-family: serif; font-size: 20px; margin-bottom: 24px; }
            svg { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <h1>${score.title}</h1>
          ${svgContent}
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-stone-700" />
            <h3
              className="text-sm font-bold text-stone-900 font-serif"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Vie nuotti & äänitiedostot
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 cursor-pointer p-1 rounded hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Options */}
        <div className="p-5 space-y-4 text-xs">
          {/* SVG Option */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-lg hover:border-amber-400 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-900 rounded-md mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Vektori-SVG (.svg)</h4>
                <p className="text-stone-500 mt-0.5 text-[11px]">
                  Täydellinen julkaisuihin, messulehtisiin, InDesigniin ja verkkosivuille ilman laadun heikkenemistä.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copySvgText}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded text-stone-700 font-medium cursor-pointer"
                title="Kopioi leikepöydälle"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={downloadSvg}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded cursor-pointer shadow-xs whitespace-nowrap"
              >
                Lataa
              </button>
            </div>
          </div>

          {/* MIDI Option */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-lg hover:border-amber-400 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-900 rounded-md mt-0.5">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Standardi MIDI (.mid)</h4>
                <p className="text-stone-500 mt-0.5 text-[11px]">
                  Digitaalinen nuottidata urku- ja soitinohjelmille (MuseScore, Sibelius, DAW, urkusynteesit).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadMidi}
              className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded cursor-pointer shadow-xs whitespace-nowrap"
            >
              Lataa
            </button>
          </div>

          {/* Print Option */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-lg hover:border-amber-400 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-stone-200 text-stone-800 rounded-md mt-0.5">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Tulostus / PDF</h4>
                <p className="text-stone-500 mt-0.5 text-[11px]">
                  Avaa puhdas tulostusikkuna paperitulostetta tai PDF-tallennusta varten.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded cursor-pointer whitespace-nowrap"
            >
              Tulosta
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer font-medium"
          >
            Sulje
          </button>
        </div>
      </div>
    </div>
  );
};

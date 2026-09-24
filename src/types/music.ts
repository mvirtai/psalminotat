/**
 * Musical notation and Psalm tone types for PsalmiNotat
 */

export type PsalmSection = 'intonatio' | 'tenor' | 'flexa' | 'mediatio' | 'terminatio' | 'other';

export type ClefType = 'treble' | 'bass' | 'chant-c' | 'chant-f';

export type StaffStyle = 'modern' | 'chant';

export type ActiveNoteColor = 'amber' | 'crimson' | 'emerald' | 'sapphire' | 'violet';

export type ActiveNoteSize = 'normal' | 'large' | 'glow';

export interface NoteToken {
  id: string;
  type: 'note' | 'barline' | 'flexa' | 'rest';
  pitch: string;       // e.g. "a4", "bb4", "g4"
  step: string;        // "A", "B", "C", "D", "E", "F", "G"
  octave: number;      // 3, 4, 5
  accidental?: '#' | 'b' | 'n';
  isReciting: boolean; // Tenor / reciting note with extended breath/fermata/double whole
  isCadence?: boolean; // Kaneetti / kadenssinuotti (mediatio / terminatio)
  duration: string;    // 'w', 'h', 'q', '8' or 'rec'
  durationValue: number; // for audio playback duration in beats
  lyric?: string;      // Syllable under this note
  section: PsalmSection;
  barType?: 'single' | 'double' | 'final' | 'flexa';
  originalText?: string;
}

export interface ParsedScore {
  title: string;
  mode?: string;
  clef: ClefType;
  key: string;
  tenorNote?: string;
  rawCode: string;
  lyrics: string[];
  tokens: NoteToken[];
  sections: {
    name: string;
    section: PsalmSection;
    tokens: NoteToken[];
  }[];
  errors: string[];
}

export interface PsalmPreset {
  id: string;
  name: string;
  subtitle: string;
  category: 'gregorian' | 'finnish' | 'canticle' | 'taize';
  mode: string;
  finalis: string;
  tuba: string;
  description: string;
  code: string;
  sampleVerse: string;
  liturgicalUse: string;
}

export interface RenderRequest {
  code: string;
  style?: StaffStyle;
  clef?: ClefType;
  transpose?: number; // semitones (-12 to +12)
  showLyrics?: boolean;
  showSectionLabels?: boolean;
  width?: number;
}

export interface RenderResult {
  svg: string;
  tokens: NoteToken[];
  score: ParsedScore;
  meta: {
    notesCount: number;
    durationBeats: number;
    mode: string;
    key: string;
    style: StaffStyle;
  };
}

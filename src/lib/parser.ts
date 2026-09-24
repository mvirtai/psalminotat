import { ClefType, NoteToken, ParsedScore, PsalmSection } from '../types/music';

const NOTE_STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const SEMITONE_MAP: Record<string, number> = {
  'C': 0, 'C#': 1, 'DB': 1,
  'D': 2, 'D#': 3, 'EB': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'GB': 6,
  'G': 7, 'G#': 8, 'AB': 8,
  'A': 9, 'A#': 10, 'BB': 10,
  'B': 11
};

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function pitchToMidi(step: string, octave: number, accidental?: '#' | 'b' | 'n'): number {
  const normStep = step.toUpperCase();
  let semi = SEMITONE_MAP[normStep] ?? 0;
  if (accidental === '#') semi += 1;
  if (accidental === 'b') semi -= 1;
  return (octave + 1) * 12 + semi;
}

export function midiToPitch(midi: number): { step: string; octave: number; accidental?: '#' | 'b' } {
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const names = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  const name = names[noteIndex];
  if (name.includes('#')) {
    return { step: name[0], octave, accidental: '#' };
  } else if (name.includes('b')) {
    return { step: name[0], octave, accidental: 'b' };
  }
  return { step: name, octave };
}

export function parsePsalmCode(code: string): ParsedScore {
  const lines = code.split('\n');
  let title = 'Psalmisävelmä';
  let mode = '';
  let clef: ClefType = 'treble';
  let key = 'C';
  let tenorNote = '';
  const lyrics: string[] = [];
  const errors: string[] = [];

  const tokens: NoteToken[] = [];
  let currentSection: PsalmSection = 'other';
  let tokenId = 0;

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) {
      continue;
    }

    // Metadata lines
    if (line.toLowerCase().startsWith('title:')) {
      title = line.substring(6).trim();
      continue;
    }
    if (line.toLowerCase().startsWith('mode:')) {
      mode = line.substring(5).trim();
      continue;
    }
    if (line.toLowerCase().startsWith('clef:')) {
      const cVal = line.substring(5).trim().toLowerCase();
      if (['treble', 'bass', 'chant-c', 'chant-f'].includes(cVal)) {
        clef = cVal as ClefType;
      }
      continue;
    }
    if (line.toLowerCase().startsWith('key:')) {
      key = line.substring(4).trim().toUpperCase();
      continue;
    }
    if (line.toLowerCase().startsWith('lyrics:') || line.toLowerCase().startsWith('text:')) {
      const lyricText = line.substring(line.indexOf(':') + 1).trim();
      // Split into syllables (words split by '-' or spaces)
      const rawSyls = lyricText.split(/[\s\-]+/).filter(Boolean);
      lyrics.push(...rawSyls);
      continue;
    }

    // Section header line, e.g. [Intonatio], [Tenor], [Mediatio], [Terminatio], [Flexa]
    const sectionMatch = line.match(/^\[([a-zA-ZäöÄÖåÅ]+)\](.*)$/);
    if (sectionMatch) {
      const secName = sectionMatch[1].toLowerCase();
      if (secName.includes('intonat') || secName.includes('alku')) currentSection = 'intonatio';
      else if (secName.includes('tenor') || secName.includes('tuba') || secName.includes('resit')) currentSection = 'tenor';
      else if (secName.includes('flexa') || secName.includes('taite')) currentSection = 'flexa';
      else if (secName.includes('mediat') || secName.includes('keski') || secName.includes('puoli')) currentSection = 'mediatio';
      else if (secName.includes('terminat') || secName.includes('paatos') || secName.includes('päätös') || secName.includes('final')) currentSection = 'terminatio';
      else currentSection = 'other';

      const remainder = sectionMatch[2].trim();
      if (remainder) {
        parseNoteString(remainder, currentSection, tokens, tokenId, errors);
      }
      continue;
    }

    // Standard musical content line
    parseNoteString(line, currentSection, tokens, tokenId, errors);
  }

  // Auto-map lyrics onto notes
  if (lyrics.length > 0) {
    let sylIdx = 0;
    for (const tok of tokens) {
      if (tok.type === 'note') {
        if (sylIdx < lyrics.length) {
          tok.lyric = lyrics[sylIdx++];
        }
      }
    }
  }

  // Find tenor note if not explicit
  const recToken = tokens.find(t => t.isReciting);
  if (recToken) {
    tenorNote = recToken.pitch;
  }

  // Group tokens into logical sections
  const sections: { name: string; section: PsalmSection; tokens: NoteToken[] }[] = [];
  let currentGroup: { name: string; section: PsalmSection; tokens: NoteToken[] } | null = null;

  for (const tok of tokens) {
    if (!currentGroup || currentGroup.section !== tok.section) {
      currentGroup = {
        name: getSectionDisplayName(tok.section),
        section: tok.section,
        tokens: []
      };
      sections.push(currentGroup);
    }
    currentGroup.tokens.push(tok);
  }

  return {
    title,
    mode,
    clef,
    key,
    tenorNote,
    rawCode: code,
    lyrics,
    tokens,
    sections,
    errors
  };
}

function parseNoteString(
  line: string,
  section: PsalmSection,
  tokens: NoteToken[],
  idCounter: number,
  errors: string[]
) {
  // Normalize tokens by space
  // We handle bar lines ||, |, †, and note symbols
  const rawParts = line.split(/\s+/).filter(Boolean);

  for (const part of rawParts) {
    // Check for bar lines
    if (part === '||') {
      tokens.push({
        id: `bar-${tokens.length}-${Date.now()}`,
        type: 'barline',
        pitch: '',
        step: '',
        octave: 4,
        isReciting: false,
        duration: 'b',
        durationValue: 0,
        section,
        barType: 'final'
      });
      continue;
    }
    if (part === '|') {
      tokens.push({
        id: `bar-${tokens.length}-${Date.now()}`,
        type: 'barline',
        pitch: '',
        step: '',
        octave: 4,
        isReciting: false,
        duration: 'b',
        durationValue: 0,
        section,
        barType: 'single'
      });
      continue;
    }
    if (part === '†' || part.toLowerCase() === 'flexa') {
      tokens.push({
        id: `flexa-${tokens.length}-${Date.now()}`,
        type: 'flexa',
        pitch: '',
        step: '',
        octave: 4,
        isReciting: false,
        duration: 'b',
        durationValue: 0,
        section: 'flexa',
        barType: 'flexa'
      });
      continue;
    }

    // Check for note pattern:
    // e.g. "F4", "A4~", "Bb4", "G4/2", "C5(rec)", "[A4]"
    let clean = part;
    let isReciting = false;

    if (clean.endsWith('~') || clean.includes('(rec)') || clean.includes('[rec]')) {
      isReciting = true;
      clean = clean.replace('~', '').replace('(rec)', '').replace('[rec]', '');
    }
    if (clean.startsWith('[') && clean.endsWith(']')) {
      isReciting = true;
      clean = clean.slice(1, -1);
    }
    if (section === 'tenor') {
      isReciting = true;
    }

    // Parse note step, accidental, octave, duration
    // Regex: ^([A-Ga-g])([#b]?)([0-9]?)(?:[\/:]?([0-9whq]+))?$
    const match = clean.match(/^([a-gA-G])([#b]?)([2-6]?)(?:[\/:]?([1248whq]+))?$/);
    if (!match) {
      // might be an attached barline, e.g. "D4||" or "F4|"
      if (clean.endsWith('||')) {
        const noteSub = clean.slice(0, -2);
        parseNoteString(noteSub, section, tokens, idCounter, errors);
        tokens.push({
          id: `bar-${tokens.length}`,
          type: 'barline',
          pitch: '',
          step: '',
          octave: 4,
          isReciting: false,
          duration: 'b',
          durationValue: 0,
          section,
          barType: 'final'
        });
        continue;
      }
      if (clean.endsWith('|')) {
        const noteSub = clean.slice(0, -1);
        parseNoteString(noteSub, section, tokens, idCounter, errors);
        tokens.push({
          id: `bar-${tokens.length}`,
          type: 'barline',
          pitch: '',
          step: '',
          octave: 4,
          isReciting: false,
          duration: 'b',
          durationValue: 0,
          section,
          barType: 'single'
        });
        continue;
      }

      errors.push(`Tuntematon sävel tai merkki: "${part}"`);
      continue;
    }

    const step = match[1].toUpperCase();
    const accidental = (match[2] as '#' | 'b') || undefined;
    const octave = match[3] ? parseInt(match[3], 10) : 4;
    const durRaw = match[4] || (isReciting ? 'w' : '4');

    const pitchStr = `${step.toLowerCase()}${accidental || ''}${octave}`;
    
    // Duration in beats for playback
    let durationValue = 1; // 1 beat default
    if (isReciting) {
      durationValue = 2.5; // prolonged reciting tone
    } else if (durRaw === '1' || durRaw === 'w') {
      durationValue = 2;
    } else if (durRaw === '2' || durRaw === 'h') {
      durationValue = 1.5;
    } else if (durRaw === '8') {
      durationValue = 0.5;
    }

    const isCadence = section === 'mediatio' || section === 'terminatio' || section === 'flexa';

    tokens.push({
      id: `note-${tokens.length}-${pitchStr}`,
      type: 'note',
      pitch: pitchStr,
      step,
      octave,
      accidental,
      isReciting,
      isCadence,
      duration: isReciting ? 'rec' : durRaw,
      durationValue,
      section,
      originalText: part
    });
  }
}

export function getSectionDisplayName(sec: PsalmSection): string {
  switch (sec) {
    case 'intonatio': return 'Intonatio (Alku)';
    case 'tenor': return 'Tenor (Resitaatio)';
    case 'flexa': return 'Flexa († Taite)';
    case 'mediatio': return 'Mediatio (* Puoliväli)';
    case 'terminatio': return 'Terminatio (Päätös)';
    default: return 'Sävelmä';
  }
}

export function transposeScore(score: ParsedScore, semitones: number): ParsedScore {
  if (semitones === 0) return score;

  const newTokens = score.tokens.map(tok => {
    if (tok.type !== 'note') return { ...tok };
    const currentMidi = pitchToMidi(tok.step, tok.octave, tok.accidental);
    const newMidi = currentMidi + semitones;
    const { step, octave, accidental } = midiToPitch(newMidi);
    const pitch = `${step.toLowerCase()}${accidental || ''}${octave}`;

    return {
      ...tok,
      step,
      octave,
      accidental,
      pitch
    };
  });

  return {
    ...score,
    tokens: newTokens,
    sections: score.sections.map(sec => ({
      ...sec,
      tokens: sec.tokens.map(tok => {
        if (tok.type !== 'note') return { ...tok };
        const currentMidi = pitchToMidi(tok.step, tok.octave, tok.accidental);
        const newMidi = currentMidi + semitones;
        const { step, octave, accidental } = midiToPitch(newMidi);
        return {
          ...tok,
          step,
          octave,
          accidental,
          pitch: `${step.toLowerCase()}${accidental || ''}${octave}`
        };
      })
    }))
  };
}

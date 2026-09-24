import { ActiveNoteColor, ActiveNoteSize, ClefType, NoteToken, ParsedScore, StaffStyle } from '../types/music';

export interface EngraveOptions {
  style?: StaffStyle;
  clef?: ClefType;
  showLyrics?: boolean;
  showSectionLabels?: boolean;
  activeNoteId?: string | null;
  activeNoteColor?: ActiveNoteColor;
  activeNoteSize?: ActiveNoteSize;
  highlightCadences?: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
}

export const ACTIVE_COLOR_MAP: Record<ActiveNoteColor, { primary: string; light: string; glow: string; text: string; label: string }> = {
  amber: { primary: '#B45309', light: '#FEF3C7', glow: '#FDE68A', text: '#92400E', label: 'Meripihka / Kulta' },
  crimson: { primary: '#BE123C', light: '#FFE4E6', glow: '#FECDD3', text: '#9F1239', label: 'Rubiini / Punainen' },
  emerald: { primary: '#047857', light: '#D1FAE5', glow: '#A7F3D0', text: '#065F46', label: 'Smaragdi / Vihreä' },
  sapphire: { primary: '#1D4ED8', light: '#DBEAFE', glow: '#BFDBFE', text: '#1E40AF', label: 'Safiiri / Sininen' },
  violet: { primary: '#6D28D9', light: '#EDE9FE', glow: '#DDD6FE', text: '#5B21B6', label: 'Liturginen violetti' },
};

// Map pitch to vertical staff step offset (relative to line 1 = 0)
// For Treble Clef:
// E4 = 0 (bottom line)
// F4 = 1, G4 = 2, A4 = 3, B4 = 4, C5 = 5, D5 = 6, E5 = 7, F5 = 8 (top line)
// D4 = -1, C4 = -2 (ledger line 1 below)
function getTrebleStaffStep(step: string, octave: number): number {
  const stepOffsets: Record<string, number> = {
    'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
  };
  const baseOffset = stepOffsets[step.toUpperCase()] ?? 2;
  return (octave - 4) * 7 + baseOffset - 2;
}

function getBassStaffStep(step: string, octave: number): number {
  const stepOffsets: Record<string, number> = {
    'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
  };
  const baseOffset = stepOffsets[step.toUpperCase()] ?? 4;
  return (octave - 3) * 7 + baseOffset + 1;
}

export function renderScoreToSvg(score: ParsedScore, options: EngraveOptions = {}): string {
  const style = options.style || 'modern';
  const clef = options.clef || score.clef || 'treble';
  const showLyrics = options.showLyrics ?? true;
  const showSectionLabels = options.showSectionLabels ?? true;
  const activeNoteId = options.activeNoteId ?? null;
  const activeNoteColor = options.activeNoteColor || 'amber';
  const activeNoteSize = options.activeNoteSize || 'large';
  const highlightCadences = options.highlightCadences ?? true;

  const mergedOpts: EngraveOptions = {
    ...options,
    style,
    clef,
    showLyrics,
    showSectionLabels,
    activeNoteId,
    activeNoteColor,
    activeNoteSize,
    highlightCadences
  };

  if (style === 'chant') {
    return renderChantSvg(score, mergedOpts);
  }

  return renderModernSvg(score, mergedOpts);
}

function renderModernSvg(score: ParsedScore, options: EngraveOptions): string {
  const lineSpacing = 10;
  const staffTopY = 70; // Y of top staff line
  const staffBottomY = staffTopY + 4 * lineSpacing; // 40px height
  const clef = options.clef || 'treble';
  const activeNoteId = options.activeNoteId;
  const showLyrics = options.showLyrics ?? true;
  const colorScheme = ACTIVE_COLOR_MAP[options.activeNoteColor || 'amber'];
  const activeSize = options.activeNoteSize || 'large';
  const highlightCadences = options.highlightCadences ?? true;

  const scaleFactor = activeSize === 'large' ? 1.35 : activeSize === 'glow' ? 1.45 : 1.0;

  // Calculate note spacing
  const startX = 85; // after clef & key sig
  const noteSpacing = 46;
  const barSpacing = 30;

  let currentX = startX;
  const elementPositions: { token: NoteToken; x: number; y: number }[] = [];

  for (const token of score.tokens) {
    if (token.type === 'barline' || token.type === 'flexa') {
      currentX += barSpacing / 2;
      elementPositions.push({ token, x: currentX, y: staffTopY });
      currentX += barSpacing / 2;
    } else {
      const stepOffset = clef === 'bass' 
        ? getBassStaffStep(token.step, token.octave)
        : getTrebleStaffStep(token.step, token.octave);
      const noteY = staffBottomY - stepOffset * (lineSpacing / 2);
      elementPositions.push({ token, x: currentX, y: noteY });
      currentX += token.isReciting ? noteSpacing + 20 : noteSpacing;
    }
  }

  const contentWidth = Math.max(760, currentX + 44);
  const totalHeight = 180;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${contentWidth} ${totalHeight}" width="100%" height="${totalHeight}" class="select-none font-sans">
  <defs>
    <filter id="note-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="pulse-halo" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="5.5" result="blur2" />
      <feComposite in="SourceGraphic" in2="blur2" operator="over" />
    </filter>
  </defs>
  <!-- Background Paper Plate -->
  <rect width="100%" height="100%" fill="#FAF8F5" rx="8" />
  
  <!-- Header Title -->
  <text x="36" y="32" font-family="'Cinzel', serif" font-weight="700" font-size="15" fill="#292524" letter-spacing="0.04em">${escapeXml(score.title)}</text>
  ${score.mode ? `<text x="${contentWidth - 36}" y="32" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="12" fill="#78716C">${escapeXml(score.mode)}</text>` : ''}

  <!-- 5 Staff Lines -->
  <g stroke="#44403C" stroke-width="1.15" stroke-linecap="round">
    <line x1="36" y1="${staffTopY}" x2="${contentWidth - 36}" y2="${staffTopY}" />
    <line x1="36" y1="${staffTopY + lineSpacing}" x2="${contentWidth - 36}" y2="${staffTopY + lineSpacing}" />
    <line x1="36" y1="${staffTopY + 2 * lineSpacing}" x2="${contentWidth - 36}" y2="${staffTopY + 2 * lineSpacing}" />
    <line x1="36" y1="${staffTopY + 3 * lineSpacing}" x2="${contentWidth - 36}" y2="${staffTopY + 3 * lineSpacing}" />
    <line x1="36" y1="${staffBottomY}" x2="${contentWidth - 36}" y2="${staffBottomY}" />
  </g>

  <!-- Clef (Treble or Bass) -->
  ${clef === 'bass' ? renderBassClef(42, staffTopY + 10) : renderTrebleClef(40, staffTopY + 28)}

  <!-- Key Signature (if F major has Bb, G major has F#) -->
  ${renderKeySignature(score.key, clef, 66, staffTopY, lineSpacing)}
`;

  // Draw Section Labels above the notes if enabled
  if (options.showSectionLabels && score.sections.length > 0) {
    svg += `<g font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="600">`;
    let secStartIdx = 0;
    for (const sec of score.sections) {
      if (sec.tokens.length === 0) continue;
      const firstElem = elementPositions[secStartIdx];
      const lastElem = elementPositions[secStartIdx + sec.tokens.length - 1];
      if (firstElem && lastElem) {
        const midX = (firstElem.x + lastElem.x) / 2;
        const isCadenceSec = sec.section === 'mediatio' || sec.section === 'terminatio' || sec.section === 'flexa';
        const labelText = getShortSectionLabel(sec.section);
        const labelColor = (highlightCadences && isCadenceSec) ? '#9A3412' : '#78716C';
        const bracketColor = (highlightCadences && isCadenceSec) ? '#EA580C' : '#D6D3D1';

        if (labelText) {
          svg += `<text x="${midX}" y="${staffTopY - 16}" text-anchor="middle" fill="${labelColor}" letter-spacing="0.03em">${labelText}</text>`;
          // Horizontal bracket line
          svg += `<path d="M${firstElem.x - 6} ${staffTopY - 10} L${lastElem.x + 6} ${staffTopY - 10}" stroke="${bracketColor}" stroke-width="${isCadenceSec && highlightCadences ? 1.2 : 0.75}" fill="none" stroke-dasharray="${isCadenceSec && highlightCadences ? 'none' : '2 2'}" />`;
        }
      }
      secStartIdx += sec.tokens.length;
    }
    svg += `</g>`;
  }

  // Draw Notes and Barlines
  for (const item of elementPositions) {
    const { token, x, y } = item;
    const isActive = activeNoteId === token.id;
    const isCadence = Boolean(token.isCadence);

    if (token.type === 'barline') {
      if (token.barType === 'final') {
        svg += `
          <!-- Double Barline -->
          <line x1="${x - 3}" y1="${staffTopY}" x2="${x - 3}" y2="${staffBottomY}" stroke="#292524" stroke-width="1.2" />
          <line x1="${x + 2}" y1="${staffTopY}" x2="${x + 2}" y2="${staffBottomY}" stroke="#292524" stroke-width="2.5" />
        `;
      } else {
        svg += `
          <!-- Single Barline (Mediatio) -->
          <line x1="${x}" y1="${staffTopY}" x2="${x}" y2="${staffBottomY}" stroke="#44403C" stroke-width="1.5" />
          <text x="${x}" y="${staffTopY - 2}" text-anchor="middle" font-size="12" font-family="'Cinzel', serif" fill="#78716C">*</text>
        `;
      }
      continue;
    }

    if (token.type === 'flexa') {
      svg += `
        <!-- Flexa barline with dagger -->
        <line x1="${x}" y1="${staffTopY + 10}" x2="${x}" y2="${staffBottomY - 10}" stroke="#78716C" stroke-width="1.2" stroke-dasharray="2 2" />
        <text x="${x}" y="${staffTopY - 2}" text-anchor="middle" font-size="12" font-family="serif" fill="#78716C">†</text>
      `;
      continue;
    }

    // Ledger Lines
    if (y > staffBottomY + 2) {
      for (let ly = staffBottomY + lineSpacing; ly <= y + 2; ly += lineSpacing) {
        svg += `<line x1="${x - 11}" y1="${ly}" x2="${x + 11}" y2="${ly}" stroke="#44403C" stroke-width="1.1" />`;
      }
    } else if (y < staffTopY - 2) {
      for (let ly = staffTopY - lineSpacing; ly >= y - 2; ly -= lineSpacing) {
        svg += `<line x1="${x - 11}" y1="${ly}" x2="${x + 11}" y2="${ly}" stroke="#44403C" stroke-width="1.1" />`;
      }
    }

    // Active Note Glow & Halo
    if (isActive) {
      if (activeSize === 'glow') {
        svg += `<circle cx="${x}" cy="${y}" r="22" fill="${colorScheme.glow}" opacity="0.45" filter="url(#pulse-halo)" />`;
        svg += `<circle cx="${x}" cy="${y}" r="14" fill="${colorScheme.light}" stroke="${colorScheme.primary}" stroke-width="1.5" opacity="0.85" filter="url(#note-glow)" />`;
      } else if (activeSize === 'large') {
        svg += `<circle cx="${x}" cy="${y}" r="17" fill="${colorScheme.glow}" opacity="0.65" filter="url(#note-glow)" />`;
      } else {
        svg += `<circle cx="${x}" cy="${y}" r="13" fill="${colorScheme.glow}" opacity="0.6" filter="url(#note-glow)" />`;
      }
    }

    // Determine colors
    let noteColor = '#1C1917';
    if (isActive) {
      noteColor = colorScheme.primary;
    } else if (highlightCadences && isCadence) {
      // Distinct kaneetti / cadence note tint
      noteColor = '#9A3412'; // Warm rich terracotta
    }

    // Cadence note indicator (accent arc above note for singer orientation)
    if (highlightCadences && isCadence && !token.isReciting) {
      svg += `
        <!-- Kaneetti accent curve -->
        <path d="M${x - 4} ${y - 10} Q${x} ${y - 13} ${x + 4} ${y - 10}" fill="none" stroke="${isActive ? colorScheme.primary : '#EA580C'}" stroke-width="1.3" />
      `;
    }

    if (token.isReciting) {
      // Liturgical Brevis / Reciting Note (Open rectangular notehead)
      const bWidth = isActive ? 14 * scaleFactor : 14;
      const bHeight = isActive ? 9 * scaleFactor : 9;
      const bHalfW = bWidth / 2;
      const bHalfH = bHeight / 2;

      svg += `
        <g class="cursor-pointer transition-transform" data-note-id="${token.id}">
          <!-- Brevis Box / Reciting Notehead -->
          <rect x="${x - bHalfW}" y="${y - bHalfH}" width="${bWidth}" height="${bHeight}" rx="1.5" fill="#FAF8F5" stroke="${noteColor}" stroke-width="${isActive ? 2.5 : 2}" />
          <line x1="${x - bHalfW}" y1="${y - bHalfH - 3.5}" x2="${x - bHalfW}" y2="${y + bHalfH + 3.5}" stroke="${noteColor}" stroke-width="${isActive ? 2.2 : 1.8}" />
          <line x1="${x + bHalfW}" y1="${y - bHalfH - 3.5}" x2="${x + bHalfW}" y2="${y + bHalfH + 3.5}" stroke="${noteColor}" stroke-width="${isActive ? 2.2 : 1.8}" />
          <!-- Tenor indicator / tenuto -->
          <line x1="${x - 6}" y1="${y - bHalfH - 6}" x2="${x + 6}" y2="${y - bHalfH - 6}" stroke="${noteColor}" stroke-width="1.5" />
          <text x="${x}" y="${y - bHalfH - 9}" text-anchor="middle" font-size="8.5" font-family="'Plus Jakarta Sans', sans-serif" font-weight="${isActive ? '700' : '600'}" fill="${noteColor}">tenor</text>
        </g>
      `;
    } else {
      // Standard chant notehead (filled angled oval)
      const stemUp = y >= staffTopY + 2 * lineSpacing;
      const stemLength = isActive ? 27 * scaleFactor : 26;
      const rx = isActive ? 5.8 * scaleFactor : 5.8;
      const ry = isActive ? 4.2 * scaleFactor : 4.2;
      const stemOffset = stemUp ? rx - 0.8 : -(rx - 0.8);
      const stemX = x + stemOffset;
      const stemEndY = stemUp ? y - stemLength : y + stemLength;

      svg += `
        <g class="cursor-pointer" data-note-id="${token.id}">
          <!-- Accidental if any -->
          ${token.accidental === '#' ? `<text x="${x - (isActive ? 14 : 12)}" y="${y + 4.5}" font-family="'Plus Jakarta Sans', sans-serif" font-size="${isActive ? 15 : 13}" font-weight="bold" fill="${noteColor}">♯</text>` : ''}
          ${token.accidental === 'b' ? `<text x="${x - (isActive ? 14 : 12)}" y="${y + 4.5}" font-family="'Plus Jakarta Sans', sans-serif" font-size="${isActive ? 15 : 13}" font-weight="bold" fill="${noteColor}">♭</text>` : ''}
          <!-- Notehead ellipse -->
          <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(-20 ${x} ${y})" fill="${noteColor}" />
          <!-- Stem -->
          <line x1="${stemX}" y1="${y}" x2="${stemX}" y2="${stemEndY}" stroke="${noteColor}" stroke-width="${isActive ? 1.8 : 1.4}" />
        </g>
      `;
    }

    // Syllable lyrics under note
    if (showLyrics && token.lyric) {
      if (isActive) {
        // Highlighted active lyric syllable
        const textLen = token.lyric.length * 7.5 + 10;
        svg += `
          <rect x="${x - textLen / 2}" y="${staffBottomY + 14}" width="${textLen}" height="18" rx="4" fill="${colorScheme.light}" stroke="${colorScheme.primary}" stroke-width="1" />
          <text x="${x}" y="${staffBottomY + 27}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="${colorScheme.text}">${escapeXml(token.lyric)}</text>
        `;
      } else {
        const lyricColor = (highlightCadences && isCadence) ? '#7C2D12' : '#292524';
        const lyricWeight = (highlightCadences && isCadence) ? '600' : '500';
        svg += `
          <text x="${x}" y="${staffBottomY + 26}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="12.5" font-weight="${lyricWeight}" fill="${lyricColor}">${escapeXml(token.lyric)}</text>
        `;
      }
    }
  }

  svg += `</svg>`;
  return svg;
}

function renderChantSvg(score: ParsedScore, options: EngraveOptions): string {
  // Gregorian 4-line staff with neume-style quadratum notes
  const lineSpacing = 12;
  const staffTopY = 65;
  const staffBottomY = staffTopY + 3 * lineSpacing; // 36px total height for 4 lines
  const activeNoteId = options.activeNoteId;
  const colorScheme = ACTIVE_COLOR_MAP[options.activeNoteColor || 'amber'];
  const activeSize = options.activeNoteSize || 'large';
  const highlightCadences = options.highlightCadences ?? true;
  const scaleFactor = activeSize === 'large' ? 1.35 : activeSize === 'glow' ? 1.45 : 1.0;

  const startX = 75;
  const noteSpacing = 44;
  const barSpacing = 30;

  let currentX = startX;
  const elementPositions: { token: NoteToken; x: number; y: number }[] = [];

  for (const token of score.tokens) {
    if (token.type === 'barline' || token.type === 'flexa') {
      currentX += barSpacing / 2;
      elementPositions.push({ token, x: currentX, y: staffTopY });
      currentX += barSpacing / 2;
    } else {
      const stepOffset = getTrebleStaffStep(token.step, token.octave) - 1;
      const noteY = staffBottomY - stepOffset * (lineSpacing / 2);
      elementPositions.push({ token, x: currentX, y: noteY });
      currentX += token.isReciting ? noteSpacing + 18 : noteSpacing;
    }
  }

  const contentWidth = Math.max(760, currentX + 44);
  const totalHeight = 175;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${contentWidth} ${totalHeight}" width="100%" height="${totalHeight}" class="select-none font-sans">
  <defs>
    <filter id="chant-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Parchment Texture Background -->
  <rect width="100%" height="100%" fill="#FBF8F2" rx="8" />

  <!-- Header Title -->
  <text x="36" y="30" font-family="'Cinzel', serif" font-weight="700" font-size="15" fill="#1C1917" letter-spacing="0.04em">${escapeXml(score.title)}</text>
  <text x="${contentWidth - 36}" y="30" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="11" fill="#854D0E">GREGORIAANINEN 4-VIIVAINEN NOTAATIO</text>

  <!-- 4 Crimson / Iron-gall Staff Lines -->
  <g stroke="#991B1B" stroke-width="1.3" stroke-linecap="round" opacity="0.85">
    <line x1="36" y1="${staffTopY}" x2="${contentWidth - 36}" y2="${staffTopY}" />
    <line x1="36" y1="${staffTopY + lineSpacing}" x2="${contentWidth - 36}" y2="${staffTopY + lineSpacing}" />
    <line x1="36" y1="${staffTopY + 2 * lineSpacing}" x2="${contentWidth - 36}" y2="${staffTopY + 2 * lineSpacing}" />
    <line x1="36" y1="${staffBottomY}" x2="${contentWidth - 36}" y2="${staffBottomY}" />
  </g>

  <!-- Gregorian C-Clef (Do-clef) on line 3 -->
  <g transform="translate(42, ${staffTopY + lineSpacing - 4})">
    <path d="M0 0 L4 0 L4 16 L0 16 Z" fill="#1C1917" />
    <path d="M8 -3 L14 5 L14 11 L8 19 Z" fill="#1C1917" />
    <line x1="4" y1="8" x2="10" y2="8" stroke="#1C1917" stroke-width="2" />
  </g>
`;

  // Draw Neumes (Punctum quadratum, virga, podatus)
  for (const item of elementPositions) {
    const { token, x, y } = item;
    const isActive = activeNoteId === token.id;
    const isCadence = Boolean(token.isCadence);

    if (token.type === 'barline') {
      if (token.barType === 'final') {
        svg += `
          <line x1="${x - 2}" y1="${staffTopY}" x2="${x - 2}" y2="${staffBottomY}" stroke="#1C1917" stroke-width="1.4" />
          <line x1="${x + 2}" y1="${staffTopY}" x2="${x + 2}" y2="${staffBottomY}" stroke="#1C1917" stroke-width="2.6" />
        `;
      } else {
        svg += `
          <!-- Divisio Maior (Mediatio) -->
          <line x1="${x}" y1="${staffTopY}" x2="${x}" y2="${staffBottomY}" stroke="#1C1917" stroke-width="1.6" />
          <text x="${x}" y="${staffTopY - 4}" text-anchor="middle" font-size="11" font-family="'Cinzel', serif" fill="#78716C">*</text>
        `;
      }
      continue;
    }

    if (token.type === 'flexa') {
      svg += `
        <!-- Divisio Minima (Flexa) -->
        <line x1="${x}" y1="${staffTopY + 8}" x2="${x}" y2="${staffBottomY - 8}" stroke="#78716C" stroke-width="1.2" />
        <text x="${x}" y="${staffTopY - 4}" text-anchor="middle" font-size="11" font-family="serif" fill="#78716C">†</text>
      `;
      continue;
    }

    // Active Note Highlight Halo
    if (isActive) {
      const haloR = activeSize === 'glow' ? 22 : 16;
      svg += `<rect x="${x - haloR}" y="${y - haloR}" width="${haloR * 2}" height="${haloR * 2}" fill="${colorScheme.glow}" opacity="${activeSize === 'glow' ? '0.85' : '0.65'}" rx="5" filter="url(#chant-glow)" />`;
    }

    let noteColor = '#1C1917';
    if (isActive) {
      noteColor = colorScheme.primary;
    } else if (highlightCadences && isCadence) {
      noteColor = '#9A3412'; // Distinct Gregorian Kaneetti vermilion
    }

    if (token.isReciting) {
      // Gregorian reciting note (Virga with double punctum / tenuto)
      const vW = isActive ? 16 * scaleFactor : 16;
      const vH = isActive ? 9 * scaleFactor : 9;
      svg += `
        <g data-note-id="${token.id}">
          <rect x="${x - vW / 2}" y="${y - vH / 2}" width="${vW}" height="${vH}" fill="${noteColor}" rx="1" />
          <line x1="${x + vW / 2}" y1="${y - vH / 2}" x2="${x + vW / 2}" y2="${y + 13}" stroke="${noteColor}" stroke-width="${isActive ? 2.2 : 1.8}" />
          <line x1="${x - vW / 2}" y1="${y - vH / 2 - 4}" x2="${x + vW / 2}" y2="${y - vH / 2 - 4}" stroke="${noteColor}" stroke-width="1.4" />
          <text x="${x}" y="${y - vH / 2 - 7}" text-anchor="middle" font-size="8" font-family="'Plus Jakarta Sans', sans-serif" font-weight="${isActive ? '700' : '600'}" fill="${noteColor}">tuba</text>
        </g>
      `;
    } else {
      // Punctum quadratum (Square chant neume)
      const qW = isActive ? 10 * scaleFactor : 10;
      const qH = isActive ? 9 * scaleFactor : 9;
      svg += `
        <g data-note-id="${token.id}">
          ${highlightCadences && isCadence && !isActive ? `<path d="M${x - 4} ${y - 8} Q${x} ${y - 11} ${x + 4} ${y - 8}" fill="none" stroke="#EA580C" stroke-width="1.2" />` : ''}
          <rect x="${x - qW / 2}" y="${y - qH / 2}" width="${qW}" height="${qH}" fill="${noteColor}" rx="1" transform="rotate(-3 ${x} ${y})" />
        </g>
      `;
    }

    // Lyrics
    if (options.showLyrics && token.lyric) {
      if (isActive) {
        const textLen = token.lyric.length * 7.5 + 10;
        svg += `
          <rect x="${x - textLen / 2}" y="${staffBottomY + 13}" width="${textLen}" height="17" rx="3.5" fill="${colorScheme.light}" stroke="${colorScheme.primary}" stroke-width="1" />
          <text x="${x}" y="${staffBottomY + 25}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="12.5" font-weight="700" fill="${colorScheme.text}">${escapeXml(token.lyric)}</text>
        `;
      } else {
        const lyricColor = (highlightCadences && isCadence) ? '#7C2D12' : '#292524';
        const lyricWeight = (highlightCadences && isCadence) ? '600' : '500';
        svg += `
          <text x="${x}" y="${staffBottomY + 24}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="${lyricWeight}" fill="${lyricColor}">${escapeXml(token.lyric)}</text>
        `;
      }
    }
  }

  svg += `</svg>`;
  return svg;
}

function renderTrebleClef(x: number, y: number): string {
  return `
    <g transform="translate(${x}, ${y - 42}) scale(0.62)">
      <path d="M16 48 C16 45 18 42 21 42 C24 42 26 44 26 47 C26 50 24 53 21 53 C18 53 15 50 15 46 C15 38 23 32 30 26 C35 22 38 17 38 11 C38 4 33 0 26 0 C21 0 16 3 14 7 L17 9 C18 6 22 4 25 4 C30 4 33 7 33 12 C33 17 30 22 25 26 C20 30 11 37 11 46 C11 54 17 58 24 58 C32 58 39 52 39 42 C39 31 29 23 20 23 C14 23 9 27 9 33 C9 39 13 43 18 43 C22 43 25 40 25 36 C25 32 22 29 18 29 C17 29 16 30 15 31 C16 27 19 25 23 25 C30 25 35 32 35 41 C35 49 29 54 22 54 C17 54 13 50 13 45 L13 65 C13 71 8 75 3 75 C0 75 -3 73 -3 70 C-3 68 0 66 3 66 C6 66 8 68 8 71 C8 68 11 65 11 60 L11 48 Z" fill="#1C1917" />
    </g>
  `;
}

function renderBassClef(x: number, y: number): string {
  return `
    <g transform="translate(${x}, ${y - 12}) scale(0.58)">
      <path d="M4 14 C4 8 9 3 16 3 C23 3 28 8 28 15 C28 23 22 30 12 38 L10 36 C18 29 24 23 24 16 C24 10 20 6 15 6 C10 6 7 10 7 14 C7 17 9 19 12 19 C14 19 16 17 16 15 C16 13 14 11 12 11 C10 11 9 12 8 13 Z" fill="#1C1917" />
      <circle cx="34" cy="10" r="3.2" fill="#1C1917" />
      <circle cx="34" cy="20" r="3.2" fill="#1C1917" />
    </g>
  `;
}

function renderKeySignature(key: string, clef: ClefType, x: number, staffTopY: number, lineSpacing: number): string {
  const normKey = key.toUpperCase();
  if (normKey === 'F') {
    const flatY = clef === 'bass' ? staffTopY + 3 * lineSpacing : staffTopY + 2 * lineSpacing;
    return `<text x="${x}" y="${flatY + 5}" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#1C1917">♭</text>`;
  }
  if (normKey === 'G') {
    const sharpY = clef === 'bass' ? staffTopY + lineSpacing : staffTopY;
    return `<text x="${x}" y="${sharpY + 4}" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#1C1917">♯</text>`;
  }
  if (normKey === 'D') {
    return `
      <text x="${x}" y="${staffTopY + 4}" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#1C1917">♯</text>
      <text x="${x + 9}" y="${staffTopY + 14}" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="bold" fill="#1C1917">♯</text>
    `;
  }
  return '';
}

function getShortSectionLabel(sec: string): string {
  switch (sec) {
    case 'intonatio': return 'Intonatio (Alku)';
    case 'tenor': return 'Tenor (Resitaatio)';
    case 'flexa': return 'Flexa (†)';
    case 'mediatio': return 'Mediatio (* Kaneetti)';
    case 'terminatio': return 'Terminatio (|| Kaneetti)';
    default: return '';
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

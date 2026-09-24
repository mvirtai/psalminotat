import { ParsedScore } from '../types/music';
import { pitchToMidi } from './parser';

/**
 * Creates a Standard MIDI File (SMF Format 0) from a ParsedScore
 */
export function generateMidiFile(score: ParsedScore, tempoBpm: number = 70): Uint8Array {
  const ticksPerQuarter = 480;
  const trackEvents: number[] = [];

  // Set Tempo Meta Event: FF 51 03 (microseconds per quarter note)
  const usPerQuarter = Math.round(60000000 / tempoBpm);
  trackEvents.push(
    0x00, // Delta time 0
    0xFF, 0x51, 0x03,
    (usPerQuarter >> 16) & 0xFF,
    (usPerQuarter >> 8) & 0xFF,
    usPerQuarter & 0xFF
  );

  // Set Instrument / Program Change: Church Organ (Preset 19)
  trackEvents.push(
    0x00, // Delta time 0
    0xC0, 0x13 // Program Change Channel 0, patch 19 (Church Organ)
  );

  let pendingDelta = 0;

  for (const token of score.tokens) {
    if (token.type === 'barline') {
      // Pause at barline
      pendingDelta += ticksPerQuarter / 2;
      continue;
    }
    if (token.type === 'flexa') {
      pendingDelta += ticksPerQuarter / 4;
      continue;
    }
    if (token.type === 'note') {
      const midiNote = pitchToMidi(token.step, token.octave, token.accidental);
      const noteDurationTicks = Math.round(token.durationValue * ticksPerQuarter);

      // Note On event (Delta, 0x90, note, velocity 80)
      writeVarLen(pendingDelta, trackEvents);
      trackEvents.push(0x90, midiNote, 0x50);

      // Note Off event (Delta = noteDurationTicks, 0x80, note, 0)
      writeVarLen(noteDurationTicks, trackEvents);
      trackEvents.push(0x80, midiNote, 0x00);

      pendingDelta = Math.round(ticksPerQuarter * 0.05); // slight articulation gap
    }
  }

  // End of Track Meta Event: FF 2F 00
  writeVarLen(pendingDelta, trackEvents);
  trackEvents.push(0xFF, 0x2F, 0x00);

  // Header chunk: 'MThd', length 6, format 0, 1 track, ticksPerQuarter
  const header = [
    0x4D, 0x54, 0x68, 0x64, // 'MThd'
    0x00, 0x00, 0x00, 0x06, // chunk length 6
    0x00, 0x00,             // format 0
    0x00, 0x01,             // 1 track
    (ticksPerQuarter >> 8) & 0xFF, ticksPerQuarter & 0xFF // division
  ];

  // Track chunk: 'MTrk', length, data
  const trackLen = trackEvents.length;
  const trackHeader = [
    0x4D, 0x54, 0x72, 0x6B, // 'MTrk'
    (trackLen >> 24) & 0xFF,
    (trackLen >> 16) & 0xFF,
    (trackLen >> 8) & 0xFF,
    trackLen & 0xFF
  ];

  const total = new Uint8Array(header.length + trackHeader.length + trackEvents.length);
  total.set(header, 0);
  total.set(trackHeader, header.length);
  total.set(trackEvents, header.length + trackHeader.length);

  return total;
}

function writeVarLen(value: number, out: number[]) {
  let buffer = value & 0x7F;
  while ((value >>= 7) > 0) {
    buffer <<= 8;
    buffer |= 0x80;
    buffer += (value & 0x7F);
  }
  while (true) {
    out.push(buffer & 0xFF);
    if (buffer & 0x80) {
      buffer >>= 8;
    } else {
      break;
    }
  }
}

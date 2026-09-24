import { NoteToken, ParsedScore } from '../types/music';
import { midiToFrequency, pitchToMidi } from './parser';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: any = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNodes: GainNode[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSinglePitch(step: string, octave: number, accidental?: '#' | 'b' | 'n', durationSec = 1.0) {
    this.initContext();
    if (!this.ctx) return;

    const midi = pitchToMidi(step, octave, accidental);
    const freq = midiToFrequency(midi);
    this.synthesizeOrganTone(freq, this.ctx.currentTime, durationSec);
  }

  public async playScore(
    score: ParsedScore,
    tempoBpm: number = 70,
    onNoteChange?: (token: NoteToken | null) => void,
    onFinished?: () => void
  ) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const beatDuration = 60 / tempoBpm;

    // Filter to playable notes and pauses
    const tokens = score.tokens;
    let accumulatedTime = 0;

    for (let i = 0; i < tokens.length; i++) {
      if (!this.isPlaying) break;
      const tok = tokens[i];

      if (tok.type === 'barline') {
        // Subtle caesura / breath pause at bar lines
        const pauseSec = tok.barType === 'single' ? beatDuration * 0.8 : beatDuration * 1.2;
        await this.delay(pauseSec * 1000);
        continue;
      }

      if (tok.type === 'flexa') {
        await this.delay(beatDuration * 0.5 * 1000);
        continue;
      }

      if (tok.type === 'note') {
        if (onNoteChange) onNoteChange(tok);

        const midi = pitchToMidi(tok.step, tok.octave, tok.accidental);
        const freq = midiToFrequency(midi);
        const noteDurationSec = tok.durationValue * beatDuration;

        this.synthesizeOrganTone(freq, this.ctx.currentTime, noteDurationSec * 0.92);

        await this.delay(noteDurationSec * 1000);

        if (onNoteChange) onNoteChange(null);
      }
    }

    this.isPlaying = false;
    if (onNoteChange) onNoteChange(null);
    if (onFinished) onFinished();
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    for (const gain of this.activeGainNodes) {
      try {
        if (this.ctx) {
          gain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
      } catch (e) {}
    }
    for (const osc of this.activeOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    }
    this.activeOscillators = [];
    this.activeGainNodes = [];
  }

  private synthesizeOrganTone(freq: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, startTime);
    // Smooth organ pipe attack (35ms)
    masterGain.gain.exponentialRampToValueAtTime(0.28, startTime + 0.035);
    // Sustain
    masterGain.gain.setValueAtTime(0.28, startTime + duration - 0.05);
    // Gentle release (50ms)
    masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    masterGain.connect(this.ctx.destination);
    this.activeGainNodes.push(masterGain);

    // Warm principal flute/diapason pipe organ timbre with 3 harmonics:
    // 1. Fundamental (sine)
    // 2. 2nd Harmonic / Octave (sine, muted)
    // 3. 3rd Harmonic / Quint (sine, soft)
    // 4. Sub-octave (warmth)
    const harmonics = [
      { type: 'sine' as OscillatorType, mult: 1, gain: 0.65 },
      { type: 'triangle' as OscillatorType, mult: 1, gain: 0.35 },
      { type: 'sine' as OscillatorType, mult: 2, gain: 0.25 },
      { type: 'sine' as OscillatorType, mult: 3, gain: 0.12 },
      { type: 'sine' as OscillatorType, mult: 0.5, gain: 0.15 },
    ];

    harmonics.forEach(h => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();
      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.mult, startTime);
      hGain.gain.setValueAtTime(h.gain, startTime);

      osc.connect(hGain);
      hGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);

      this.activeOscillators.push(osc);
    });

    // Cleanup after stop
    setTimeout(() => {
      const idx = this.activeGainNodes.indexOf(masterGain);
      if (idx !== -1) this.activeGainNodes.splice(idx, 1);
    }, (duration + 0.1) * 1000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.currentTimeout = setTimeout(resolve, ms);
    });
  }
}

export const synth = new AudioEngine();

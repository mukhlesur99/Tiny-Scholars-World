/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageCode } from './types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private volume: number = 0.8;
  private speechRate: number = 1.0;

  constructor() {
    // AudioContext will initialize on first user interaction to comply with browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSettings(soundEnabled: boolean, voiceEnabled: boolean, volume: number, speechRate: number) {
    this.soundEnabled = soundEnabled;
    this.voiceEnabled = voiceEnabled;
    this.volume = volume;
    this.speechRate = speechRate;
  }

  /**
   * Cheerful, musical chime for correct answers (ascending harmonic chime)
   */
  public playCorrect() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, this.ctx!.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.45);
    });
  }

  /**
   * Gentle, encouraging bounce tone for retry (soft warm mallet)
   */
  public playGentleRetry() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.26);
  }

  /**
   * Subtle bubble pop for UI buttons, counting taps, or card flips
   */
  public playPop() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 480 + Math.random() * 80;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.18 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.1);
  }

  /**
   * Celebratory victory fanfare when completing a level
   */
  public playFanfare() {
    if (!this.soundEnabled || this.volume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const arpeggio = [
      { f: 523.25, t: 0.0, d: 0.15 }, // C5
      { f: 659.25, t: 0.12, d: 0.15 }, // E5
      { f: 783.99, t: 0.24, d: 0.15 }, // G5
      { f: 1046.5, t: 0.36, d: 0.4 },  // C6
      { f: 1318.5, t: 0.52, d: 0.6 },  // E6
    ];

    arpeggio.forEach(({ f, t, d }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime + t);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.3 * this.volume, this.ctx!.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + t + d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + t);
      osc.stop(this.ctx!.currentTime + t + d + 0.05);
    });
  }

  /**
   * Speaks prompt or feedback text using the browser's built-in Web SpeechSynthesis API.
   * Completely offline on modern Android devices with Google Speech Services.
   */
  public speak(text: string, lang: LanguageCode = 'en') {
    if (!this.voiceEnabled || this.volume <= 0) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langTags: Record<LanguageCode, string> = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        bn: 'bn-BD',
      };
      utterance.lang = langTags[lang] || 'en-US';
      utterance.rate = this.speechRate;
      utterance.pitch = 1.15; // Slightly friendly high pitch for kids
      utterance.volume = this.volume;

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[WonderTots Audio] Speech synthesis error:', err);
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new SoundEngine();

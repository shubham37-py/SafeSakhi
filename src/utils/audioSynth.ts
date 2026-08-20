// SafeTransit Web Audio API Sound Synthesizer & Emergency Siren Engine

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isSirenRunning: boolean = false;
  private sirenOsc: OscillatorNode | null = null;
  private sirenLfo: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenLfoGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft high-tech check-in prompt chime
  playCheckInChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.18); // A5

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch {
      // Ignore audio failure
    }
  }

  // Silent SOS Escalation Ping (Guardian Alert Tone)
  playSosAlertTone() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.12);
      osc.frequency.linearRampToValueAtTime(700, now + 0.24);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.36);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }

  // Continuous Police/Emergency Siren that loops until explicitly stopped by user reaction
  startContinuousSiren() {
    if (this.isSirenRunning) return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Main Siren Tone Oscillator (Sweeps between 650Hz and 1150Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // 2. Low Frequency Oscillator (LFO) to modulate pitch continuously (wail effect: 1.2 Hz cycle)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = 'triangle'; // Rich, piercing emergency tone
      osc.frequency.setValueAtTime(850, now);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(1.4, now); // ~1.4 sweeps per second
      lfoGain.gain.setValueAtTime(280, now); // Modulates frequency by +/- 280 Hz (570Hz -> 1130Hz)

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Volume Gain with soft attack ramp
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      lfo.start(now);

      this.sirenOsc = osc;
      this.sirenLfo = lfo;
      this.sirenGain = gain;
      this.sirenLfoGain = lfoGain;
      this.isSirenRunning = true;
    } catch {
      // Ignore audio error
    }
  }

  // Stop siren immediately on any user reaction
  stopSiren() {
    if (!this.isSirenRunning) return;

    try {
      if (this.ctx && this.sirenGain) {
        const now = this.ctx.currentTime;
        this.sirenGain.gain.linearRampToValueAtTime(0.0001, now + 0.08);

        setTimeout(() => {
          try {
            this.sirenOsc?.stop();
            this.sirenLfo?.stop();
            this.sirenOsc?.disconnect();
            this.sirenLfo?.disconnect();
            this.sirenGain?.disconnect();
            this.sirenLfoGain?.disconnect();
          } catch {
            // Safe cleanup
          }
          this.sirenOsc = null;
          this.sirenLfo = null;
          this.sirenGain = null;
          this.sirenLfoGain = null;
          this.isSirenRunning = false;
        }, 100);
      } else {
        this.isSirenRunning = false;
      }
    } catch {
      this.isSirenRunning = false;
    }
  }

  // Backwards compatible method name (starts continuous siren)
  playPanicSiren() {
    this.startContinuousSiren();
  }

  getSirenStatus(): boolean {
    return this.isSirenRunning;
  }
}

export const soundEngine = new AudioEngine();

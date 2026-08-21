// SafeTransit High-Fidelity Tactical Danger Siren & Audio Synthesis Engine

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isSirenRunning: boolean = false;
  private primaryOsc: OscillatorNode | null = null;
  private detunedOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private mainGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfoGain: GainNode | null = null;
  private subLfoGain: GainNode | null = null;

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

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch {
      // Ignore audio failure
    }
  }

  // Sharp high-urgency SOS escalation warning burst
  playSosAlertTone() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      // Rapid high-urgency 3-step warning chirp
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1320, now + 0.1);
      osc1.frequency.setValueAtTime(1760, now + 0.2);

      osc2.frequency.setValueAtTime(888, now);
      osc2.frequency.setValueAtTime(1332, now + 0.1);
      osc2.frequency.setValueAtTime(1776, now + 0.2);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.48);
      osc2.stop(now + 0.48);
    } catch {
      // Ignore
    }
  }

  // Hyper-Realistic Multi-Harmonic Tactical Danger Siren (Loops until acknowledged)
  startContinuousSiren() {
    if (this.isSirenRunning) return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Primary High-Bite Horn (Sawtooth 700Hz - 1350Hz)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(950, now);

      // 2. Detuned Harmonic Oscillator (Creates acoustic dissonance / piercing urgency)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.detune.setValueAtTime(14, now); // +14 cents detune for authentic acoustic pressure
      osc2.frequency.setValueAtTime(950, now);

      // 3. Sub-Harmonic Body Oscillator (Gives siren heavy physical presence/sub-bass rumble)
      const oscSub = this.ctx.createOscillator();
      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(475, now); // Lower octave

      // 4. LFO Pitch Modulator (Urgent emergency wail sweep at 1.8 Hz)
      const lfo = this.ctx.createOscillator();
      lfo.type = 'triangle'; // Triangular sweep (sharp rise and fall)
      lfo.frequency.setValueAtTime(1.8, now); // 1.8 wail cycles per second

      // LFO Gain for Main Horns (+/- 340 Hz swing: 610Hz -> 1290Hz)
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(340, now);

      // LFO Gain for Sub Horn (+/- 170 Hz swing: 305Hz -> 645Hz)
      const subLfoGain = this.ctx.createGain();
      subLfoGain.gain.setValueAtTime(170, now);

      lfo.connect(lfoGain);
      lfo.connect(subLfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);
      subLfoGain.connect(oscSub.frequency);

      // 5. Acoustic Resonant Filter (Emulates megaphone horn acoustics)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(2.2, now);

      // 6. Master Siren Gain with smooth attack
      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.32, now + 0.15); // Powerful, clear alarm volume

      // Connect Signal Chain
      osc1.connect(filter);
      osc2.connect(filter);
      oscSub.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      // Start all nodes
      osc1.start(now);
      osc2.start(now);
      oscSub.start(now);
      lfo.start(now);

      this.primaryOsc = osc1;
      this.detunedOsc = osc2;
      this.subOsc = oscSub;
      this.lfo = lfo;
      this.lfoGain = lfoGain;
      this.subLfoGain = subLfoGain;
      this.filter = filter;
      this.mainGain = mainGain;
      this.isSirenRunning = true;
    } catch {
      // Ignore audio error
    }
  }

  // Smoothly silence siren immediately on any user reaction
  stopSiren() {
    if (!this.isSirenRunning) return;

    try {
      if (this.ctx && this.mainGain) {
        const now = this.ctx.currentTime;
        this.mainGain.gain.linearRampToValueAtTime(0.0001, now + 0.08);

        setTimeout(() => {
          try {
            this.primaryOsc?.stop();
            this.detunedOsc?.stop();
            this.subOsc?.stop();
            this.lfo?.stop();

            this.primaryOsc?.disconnect();
            this.detunedOsc?.disconnect();
            this.subOsc?.disconnect();
            this.lfo?.disconnect();
            this.lfoGain?.disconnect();
            this.subLfoGain?.disconnect();
            this.filter?.disconnect();
            this.mainGain?.disconnect();
          } catch {
            // Safe cleanup
          }
          this.primaryOsc = null;
          this.detunedOsc = null;
          this.subOsc = null;
          this.lfo = null;
          this.lfoGain = null;
          this.subLfoGain = null;
          this.filter = null;
          this.mainGain = null;
          this.isSirenRunning = false;
        }, 100);
      } else {
        this.isSirenRunning = false;
      }
    } catch {
      this.isSirenRunning = false;
    }
  }

  playPanicSiren() {
    this.startContinuousSiren();
  }

  getSirenStatus(): boolean {
    return this.isSirenRunning;
  }
}

export const soundEngine = new AudioEngine();

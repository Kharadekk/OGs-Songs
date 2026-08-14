/**
 * Authentic Web Audio API Vintage Sound Effects Synthesizer
 * Generates needle crackles, tape deck mechanics, radio tuning whistles, and camera clicks.
 */

class VintageAudioFX {
  private ctx: AudioContext | null = null;
  private crackleNode: AudioBufferSourceNode | null = null;
  private crackleGain: GainNode | null = null;
  private isCracklePlaying = false;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Generates continuous authentic 1970s Vinyl Crackle & Surface Noise
   */
  public startVinylCrackle(volume = 0.25) {
    if (this.isCracklePlaying) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 4; // 4 seconds loop
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        // Pink noise base
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        let sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;

        // Occasional randomized needle pops/scratches
        if (Math.random() < 0.0018) {
          const popAmplitude = (Math.random() > 0.8 ? 0.8 : 0.35) * (Math.random() > 0.5 ? 1 : -1);
          sample += popAmplitude;
        }

        // Tiny groove ticks
        if (Math.random() < 0.008) {
          sample += (Math.random() * 0.12 - 0.06);
        }

        data[i] = sample;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Bandpass filter to match turntable needle frequency response
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1800;
      bandpass.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.value = volume;

      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(0);
      this.crackleNode = noiseSource;
      this.crackleGain = gain;
      this.isCracklePlaying = true;
    } catch {
      // Audio context might fail before first gesture
    }
  }

  public setVinylCrackleVolume(volume: number) {
    if (this.crackleGain && this.ctx) {
      this.crackleGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stopVinylCrackle() {
    if (this.crackleGain && this.ctx) {
      try {
        this.crackleGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.crackleGain.disconnect();
      } catch {
        // ignore
      }
      this.crackleGain = null;
    }
    if (this.crackleNode) {
      try {
        this.crackleNode.stop();
        this.crackleNode.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.crackleNode = null;
    }
    this.isCracklePlaying = false;
  }

  /**
   * Turntable Needle Drop / Cue Sound
   */
  public playNeedleDrop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);

      // Add a needle scratch burst
      setTimeout(() => {
        this.playMechanicalClick();
      }, 50);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Vintage Cassette Deck Mechanical Button Click (Play/Stop/Eject punch)
   */
  public playCassetteDeckClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // Metallic snap
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(620, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

      gain1.gain.setValueAtTime(0.6, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.09);

      // Low mechanical thud
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(120, ctx.currentTime + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.14);

      gain2.gain.setValueAtTime(0.7, ctx.currentTime + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.02);
      osc2.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  /**
   * Vintage Analog Radio Frequency Tuning Sweep & Whistle
   */
  public playRadioTuningDial(freqHz = 800) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // Whistle heterodyne
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqHz, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqHz * 1.5 + (Math.random() * 400 - 200), ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);

      // White noise burst for dial static
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1200;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.16);
    } catch {
      // ignore
    }
  }

  /**
   * Vintage Camera Shutter Click + Capacitor Strobe Flash
   */
  public playCameraShutter() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // First shutter curtain click
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(900, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      gain1.gain.setValueAtTime(0.5, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.05);

      // Second shutter snap (60ms later)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(1400, ctx.currentTime + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.6, ctx.currentTime + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.06);
      osc2.stop(ctx.currentTime + 0.14);

      // Capacitor recharge high-pitch whine
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(2200, ctx.currentTime + 0.18);
      osc3.frequency.exponentialRampToValueAtTime(7500, ctx.currentTime + 0.8);
      gain3.gain.setValueAtTime(0.08, ctx.currentTime + 0.18);
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(ctx.currentTime + 0.18);
      osc3.stop(ctx.currentTime + 0.85);
    } catch {
      // ignore
    }
  }

  /**
   * Generic mechanical switch / rotary knob tick
   */
  public playMechanicalClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // ignore
    }
  }

  /**
   * Match Strike / Lantern Ignition Sound
   */
  public playLanternIgnite() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
    } catch {
      // ignore
    }
  }
}

export const vintageAudio = new VintageAudioFX();

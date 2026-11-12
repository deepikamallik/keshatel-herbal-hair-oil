/**
 * KAISEI // AUDIO ENGINE
 * Web Audio API Procedural Synthesizer & Sound FX Generator
 * No external dependencies or audio files required.
 */

class AnimeAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.isPlayingBGM = false;
        this.bgmGain = null;
        this.sfxGain = null;
        this.bgmInterval = null;
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.filter = null;
        this.analyser = null;
        this.dataArray = null;

        // Pentatonic Insen/Hirajoshi scale frequencies (A minor anime feel)
        // A2, E3, A3, B3, C4, E4, F4, A4, B4, C5, E5, F5, A5
        this.scale = [110, 164.81, 220, 246.94, 261.63, 329.63, 349.23, 440, 493.88, 523.25, 659.25, 698.46, 880];
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master gains
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Analyser for UI visualizer bars
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.masterGain.connect(this.analyser);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        if (!this.ctx) this.init();
        this.resume();

        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return !this.isMuted;
    }

    startBGM() {
        if (this.isPlayingBGM || !this.ctx) return;
        this.isPlayingBGM = true;
        this.resume();

        const t = this.ctx.currentTime;

        // Warm ambient drone base
        this.droneOsc1 = this.ctx.createOscillator();
        this.droneOsc2 = this.ctx.createOscillator();
        const droneFilter = this.ctx.createBiquadFilter();

        this.droneOsc1.type = 'sawtooth';
        this.droneOsc1.frequency.setValueAtTime(55, t); // A1 sub-bass

        this.droneOsc2.type = 'sine';
        this.droneOsc2.frequency.setValueAtTime(110.3, t); // A2 slight detune for warmth

        droneFilter.type = 'lowpass';
        droneFilter.frequency.setValueAtTime(260, t);
        droneFilter.Q.setValueAtTime(2, t);

        const droneVol = this.ctx.createGain();
        droneVol.gain.setValueAtTime(0.01, t);
        droneVol.gain.exponentialRampToValueAtTime(0.18, t + 4);

        this.droneOsc1.connect(droneFilter);
        this.droneOsc2.connect(droneFilter);
        droneFilter.connect(droneVol);
        droneVol.connect(this.bgmGain);

        this.droneOsc1.start();
        this.droneOsc2.start();

        // Shimmering celestial koto/bell melody sequencer
        this.bgmInterval = setInterval(() => {
            if (!this.isPlayingBGM || this.isMuted) return;
            // Play a gentle pentatonic chord or arpeggio note
            const count = Math.random() > 0.6 ? 2 : 1;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const noteIdx = Math.floor(Math.random() * (this.scale.length - 3)) + 3;
                    const freq = this.scale[noteIdx];
                    this.playBellNote(freq, 0.08);
                }, i * 280);
            }
        }, 1800);
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
        if (this.droneOsc1) {
            try {
                this.droneOsc1.stop();
                this.droneOsc2.stop();
            } catch (e) {}
            this.droneOsc1 = null;
            this.droneOsc2 = null;
        }
    }

    playBellNote(freq, volume = 0.1) {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const harm = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 2.01, t); // Ethereal chime harmonic

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(volume, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

        osc.connect(gain);
        harm.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(t);
        harm.start(t);
        osc.stop(t + 2.5);
        harm.stop(t + 2.5);
    }

    // UI Sound FX
    playHover() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, t); // D5
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.08); // A5

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.13);
    }

    playClick() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1046.5, t); // C6
        osc.frequency.exponentialRampToValueAtTime(440, t + 0.06);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.09);
    }

    // Anime Katana Air Slash sound effect
    playSlash() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        // White noise whoosh
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(4500, t + 0.1);
        filter.frequency.exponentialRampToValueAtTime(400, t + 0.3);
        filter.Q.setValueAtTime(4, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.sfxGain);

        // Resonant blade chime
        const bladeOsc = this.ctx.createOscillator();
        const bladeGain = this.ctx.createGain();
        bladeOsc.type = 'sine';
        bladeOsc.frequency.setValueAtTime(1320, t + 0.04);
        bladeOsc.frequency.exponentialRampToValueAtTime(880, t + 0.35);

        bladeGain.gain.setValueAtTime(0.001, t);
        bladeGain.gain.setValueAtTime(0.15, t + 0.04);
        bladeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        bladeOsc.connect(bladeGain);
        bladeGain.connect(this.sfxGain);

        noise.start(t);
        bladeOsc.start(t + 0.04);
        bladeOsc.stop(t + 0.46);
    }

    // Elemental Switch sound
    playElementalSwitch() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.18);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, t);
        filter.frequency.exponentialRampToValueAtTime(3500, t + 0.18);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.32);
    }

    // Ultimate Power Burst sound
    playUltimate() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        // Sub blast
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(160, t);
        sub.frequency.exponentialRampToValueAtTime(40, t + 0.8);

        subGain.gain.setValueAtTime(0.4, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        sub.connect(subGain);
        subGain.connect(this.sfxGain);

        // Chime explosion
        [440, 659.25, 880, 1318.5].forEach((f, idx) => {
            const chime = this.ctx.createOscillator();
            const cGain = this.ctx.createGain();
            chime.type = 'triangle';
            chime.frequency.setValueAtTime(f, t + idx * 0.06);

            cGain.gain.setValueAtTime(0.1, t + idx * 0.06);
            cGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

            chime.connect(cGain);
            cGain.connect(this.sfxGain);

            chime.start(t + idx * 0.06);
            chime.stop(t + 1.25);
        });

        sub.start(t);
        sub.stop(t + 0.95);
    }

    // Success dispatch sound
    playSuccess() {
        if (!this.ctx || this.isMuted) return;
        this.resume();
        const t = this.ctx.currentTime;

        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.09);

            gain.gain.setValueAtTime(0.1, t + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.6);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(t + idx * 0.09);
            osc.stop(t + idx * 0.09 + 0.65);
        });
    }

    // Visualizer data helper
    getVisualizerData() {
        if (!this.analyser || this.isMuted || !this.isPlayingBGM) return null;
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }
}

// Global instance
window.animeAudio = new AnimeAudioEngine();

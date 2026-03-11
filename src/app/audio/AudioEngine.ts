import * as Tone from 'tone'

// Forked from sampler/src/audio/AudioEngine.js
// Adapted for Lobster Sound aesthetic - minimal, abstract instrument

class AudioEngine {
  initialized: boolean
  players: Record<string, Tone.Player>
  padChannels: Record<string, { gain: Tone.Gain; panner: Tone.Panner; volume: number; pan: number; pitch: number }>
  effectsChain: Record<string, any>
  effectsBypassed: Record<string, boolean>
  masterGain: Tone.Gain | null
  limiter: Tone.Limiter | null
  meter: Tone.Meter | null
  analyser: Tone.Analyser | null
  sampleUrls: Record<string, string>
  maxVoices: number
  activeVoices: number

  constructor() {
    this.initialized = false
    this.players = {}
    this.padChannels = {}
    this.effectsChain = {}
    this.effectsBypassed = {}
    this.masterGain = null
    this.limiter = null
    this.meter = null
    this.analyser = null
    this.sampleUrls = {}
    this.maxVoices = 32
    this.activeVoices = 0
  }

  async init() {
    if (this.initialized) return

    await Tone.start()
    console.log('Lobster Audio Engine started')

    // Create master meter for VU
    this.meter = new Tone.Meter({ smoothing: 0.8 })
    this.analyser = new Tone.Analyser('waveform', 256)

    // Filter (LP/HP switchable)
    this.effectsChain.filter = new Tone.Filter({
      frequency: 20000,
      type: 'lowpass',
      rolloff: -24,
      Q: 1
    })
    this.effectsBypassed.filter = false

    // Drive/Distortion
    this.effectsChain.drive = new Tone.Distortion({
      distortion: 0,
      wet: 1,
      oversample: '4x'
    })
    this.effectsBypassed.drive = false

    // Delay
    this.effectsChain.delay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.3,
      wet: 0
    })
    this.effectsBypassed.delay = false

    // Reverb
    this.effectsChain.reverb = new Tone.Reverb({
      decay: 2.5,
      wet: 0,
      preDelay: 0.01
    })
    this.effectsBypassed.reverb = false

    // Generate reverb impulse
    this.effectsChain.reverb.generate().catch((err: Error) => {
      console.warn('Reverb generation failed:', err)
    })

    // Compressor
    this.effectsChain.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    })
    this.effectsBypassed.compressor = false

    // Master limiter
    this.limiter = new Tone.Limiter(-1)

    // Master gain
    this.masterGain = new Tone.Gain(0.8)

    // Chain everything
    this.effectsChain.filter.chain(
      this.effectsChain.drive,
      this.effectsChain.delay,
      this.effectsChain.reverb,
      this.effectsChain.compressor,
      this.limiter,
      this.masterGain,
      this.meter,
      this.analyser,
      Tone.Destination
    )

    this.initialized = true
    console.log('Lobster Audio Engine initialized')
  }

  _createPadChannel(padId: string) {
    if (this.padChannels[padId]) {
      this.padChannels[padId].gain.dispose()
      this.padChannels[padId].panner.dispose()
    }

    const gain = new Tone.Gain(1)
    const panner = new Tone.Panner(0)

    gain.connect(panner)
    panner.connect(this.effectsChain.filter)

    this.padChannels[padId] = {
      gain,
      panner,
      volume: 1,
      pan: 0,
      pitch: 0
    }
  }

  async loadSample(padId: string, url: string): Promise<{ duration: number; numberOfChannels: number; sampleRate: number }> {
    return new Promise((resolve, reject) => {
      if (this.players[padId]) {
        this.players[padId].dispose()
      }

      if (this.sampleUrls[padId]) {
        URL.revokeObjectURL(this.sampleUrls[padId])
      }

      this._createPadChannel(padId)

      const player = new Tone.Player({
        url: url,
        onload: () => {
          console.log(`Pad ${padId} loaded`)
          resolve({
            duration: player.buffer.duration,
            numberOfChannels: player.buffer.numberOfChannels,
            sampleRate: player.buffer.sampleRate
          })
        },
        onerror: (err) => {
          console.error(`Pad ${padId} failed to load:`, err)
          reject(err)
        }
      }).connect(this.padChannels[padId].gain)

      this.players[padId] = player
      this.sampleUrls[padId] = url
    })
  }

  async loadSampleFromFile(padId: string, file: File) {
    const url = URL.createObjectURL(file)
    try {
      const info = await this.loadSample(padId, url)
      return info
    } catch (err) {
      URL.revokeObjectURL(url)
      throw err
    }
  }

  getWaveformData(padId: string): number[] | null {
    const player = this.players[padId]
    if (!player || !player.loaded) return null

    const buffer = player.buffer
    const channelData = buffer.getChannelData(0)
    const samples = 64
    const blockSize = Math.floor(channelData.length / samples)
    const waveform: number[] = []

    for (let i = 0; i < samples; i++) {
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j])
      }
      waveform.push(sum / blockSize)
    }

    const max = Math.max(...waveform)
    return waveform.map(v => v / (max || 1))
  }

  triggerPad(padId: string): boolean {
    if (!this.initialized) {
      console.warn('Audio engine not initialized')
      return false
    }

    const player = this.players[padId]
    if (!player || !player.loaded) return false

    if (this.activeVoices >= this.maxVoices) {
      console.warn('Max voices reached')
      return false
    }

    const channel = this.padChannels[padId]
    if (channel && channel.pitch !== 0) {
      player.playbackRate = Math.pow(2, channel.pitch / 12)
    } else {
      player.playbackRate = 1
    }

    try {
      if (player.state === 'started') {
        player.stop()
      }
      player.start()
      this.activeVoices++

      const duration = player.buffer.duration / player.playbackRate
      setTimeout(() => {
        this.activeVoices = Math.max(0, this.activeVoices - 1)
      }, duration * 1000)

      return true
    } catch (err) {
      console.error('Trigger error:', err)
      return false
    }
  }

  stopPad(padId: string) {
    const player = this.players[padId]
    if (player && player.state === 'started') {
      player.stop()
      this.activeVoices = Math.max(0, this.activeVoices - 1)
    }
  }

  stopAll() {
    Object.keys(this.players).forEach(padId => {
      this.stopPad(padId)
    })
    this.activeVoices = 0
  }

  // Per-pad controls
  setPadVolume(padId: string, volume: number) {
    const channel = this.padChannels[padId]
    if (channel) {
      channel.volume = volume
      channel.gain.gain.rampTo(volume, 0.05)
    }
  }

  setPadPan(padId: string, pan: number) {
    const channel = this.padChannels[padId]
    if (channel) {
      channel.pan = pan
      channel.panner.pan.rampTo(pan, 0.05)
    }
  }

  setPadPitch(padId: string, semitones: number) {
    const channel = this.padChannels[padId]
    if (channel) {
      channel.pitch = semitones
    }
  }

  // Effect controls
  setEffectBypassed(effectName: string, bypassed: boolean) {
    if (this.effectsChain[effectName]) {
      this.effectsBypassed[effectName] = bypassed
      this.effectsChain[effectName].wet.value = bypassed ? 0 : 1
    }
  }

  setFilterFrequency(freq: number) {
    this.effectsChain.filter.frequency.rampTo(Math.min(20000, Math.max(20, freq)), 0.1)
  }

  setFilterType(type: 'lowpass' | 'highpass') {
    this.effectsChain.filter.type = type
  }

  setFilterQ(q: number) {
    this.effectsChain.filter.Q.value = Math.min(30, Math.max(0.1, q))
  }

  setDrive(amount: number) {
    this.effectsChain.drive.distortion = Math.min(1, Math.max(0, amount))
  }

  setDelayTime(time: number) {
    this.effectsChain.delay.delayTime.rampTo(time, 0.1)
  }

  setDelayFeedback(feedback: number) {
    this.effectsChain.delay.feedback.rampTo(Math.min(0.95, feedback), 0.1)
  }

  setDelayMix(wet: number) {
    this.effectsChain.delay.wet.rampTo(wet, 0.1)
  }

  setReverbDecay(decay: number) {
    this.effectsChain.reverb.decay = decay
  }

  setReverbMix(wet: number) {
    this.effectsChain.reverb.wet.rampTo(wet, 0.1)
  }

  setMasterVolume(volume: number) {
    this.masterGain?.gain.rampTo(volume, 0.1)
  }

  // Metering
  getMeterLevel(): number {
    if (!this.meter) return -Infinity
    return this.meter.getValue() as number
  }

  getWaveform(): Float32Array {
    if (!this.analyser) return new Float32Array(256)
    return this.analyser.getValue() as Float32Array
  }

  // Cleanup
  dispose() {
    this.stopAll()

    Object.values(this.players).forEach(p => p.dispose())
    this.players = {}

    Object.values(this.sampleUrls).forEach(url => URL.revokeObjectURL(url))
    this.sampleUrls = {}

    Object.values(this.padChannels).forEach(ch => {
      ch.gain.dispose()
      ch.panner.dispose()
    })
    this.padChannels = {}

    Object.values(this.effectsChain).forEach(fx => fx.dispose())
    this.effectsChain = {}

    this.limiter?.dispose()
    this.masterGain?.dispose()
    this.meter?.dispose()
    this.analyser?.dispose()

    this.initialized = false
  }
}

// Singleton
export const audioEngine = new AudioEngine()
export default audioEngine

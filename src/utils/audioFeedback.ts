function createAudioContext() {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

  if (!AudioContextConstructor) {
    return null
  }

  return new AudioContextConstructor()
}

export function playFeedback(type: 'correct' | 'wrong') {
  const audioContext = createAudioContext()

  if (!audioContext) {
    return
  }

  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = type === 'correct' ? 'triangle' : 'sawtooth'
  oscillator.frequency.setValueAtTime(type === 'correct' ? 720 : 210, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    type === 'correct' ? 880 : 120,
    audioContext.currentTime + 0.22,
  )

  gain.gain.setValueAtTime(0.001, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.07, audioContext.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.24)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.24)
}

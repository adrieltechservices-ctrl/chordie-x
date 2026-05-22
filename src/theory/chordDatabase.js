export const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const FLAT_NAMES  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const getNoteName = (midiNumber, mode = "sharps") => {
  const pitchIndex = midiNumber % 12;
  return mode === "flats" ? FLAT_NAMES[pitchIndex] : SHARP_NAMES[pitchIndex];
};

export const normalizeIntervals = (intervals) => {
  return [
    ...new Set(
      intervals.map((i) => ((i % 12) + 12) % 12)
    ),
  ].sort((a, b) => a - b);
};

export const CHORD_PROFILES = [
  // --- 1. SINGLETONS, MONOPHONIC & INTEGRITY MARKS ---
  { name: " (Note)", intervals: [0], quality: "Single Note" },
  { name: "5", intervals: [0, 7], quality: "Power Chord" },
  { name: "(no3)", intervals: [0, 7, 12], quality: "Power Chord / Octave Bypass" },

  // --- 2. STANDARD OPEN & CLOSED TRIADS ---
  { name: "", intervals: [0, 4, 7], quality: "Major Triad" },
  { name: "m", intervals: [0, 3, 7], quality: "Minor Triad" },
  { name: "sus4", intervals: [0, 5, 7], quality: "Suspended 4th" },
  { name: "sus2", intervals: [0, 2, 7], quality: "Suspended 2nd" },
  { name: "dim", intervals: [0, 3, 6], quality: "Diminished Triad" },
  { name: "aug", intervals: [0, 4, 8], quality: "Augmented Triad" },

  // --- 3. FOUR-NOTE SEVENTH CHORDS & DIATONIC SIXTH voicings ---
  { name: "7", intervals: [0, 4, 7, 10], quality: "Dominant 7th" },
  { name: "maj7", intervals: [0, 4, 7, 11], quality: "Major 7th" },
  { name: "m7", intervals: [0, 3, 7, 10], quality: "Minor 7th" },
  { name: "m7b5", intervals: [0, 3, 6, 10], quality: "Half-Diminished 7th" },
  { name: "dim7", intervals: [0, 3, 6, 9], quality: "Fully Diminished 7th" },
  { name: "6", intervals: [0, 4, 7, 9], quality: "Major 6th" },
  { name: "m6", intervals: [0, 3, 7, 9], quality: "Minor 6th" },
  { name: "m(maj7)", intervals: [0, 3, 7, 11], quality: "Minor-Major 7th" },
  { name: "7sus4", intervals: [0, 5, 7, 10], quality: "7 Suspended 4th" },
  { name: "maj7#5", intervals: [0, 4, 8, 11], quality: "Major 7th Sharp 5" },
  { name: "7#5", intervals: [0, 4, 8, 10], quality: "Dominant 7th Sharp 5" },

  // --- 4. JAZZ EXTENSIONS (9ths, 11ths, 13ths) ---
  { name: "9", intervals: [0, 4, 7, 10, 14], quality: "Dominant 9th" },
  { name: "maj9", intervals: [0, 4, 7, 11, 14], quality: "Major 9th" },
  { name: "m9", intervals: [0, 3, 7, 10, 14], quality: "Minor 9th" },
  { name: "11", intervals: [0, 4, 7, 10, 14, 17], quality: "Dominant 11th" },
  { name: "maj11", intervals: [0, 4, 7, 11, 14, 17], quality: "Major 11th" },
  { name: "m11", intervals: [0, 3, 7, 10, 14, 17], quality: "Minor 11th" },
  { name: "13", intervals: [0, 4, 7, 10, 14, 17, 21], quality: "Dominant 13th" },
  { name: "maj13", intervals: [0, 4, 7, 11, 14, 17, 21], quality: "Major 13th" },
  { name: "m13", intervals: [0, 3, 7, 10, 14, 17, 21], quality: "Minor 13th" },

  // --- 5. ROOTLESS SHELL VOICINGS & HYBRID ADDS ---
  { name: "9sus4", intervals: [0, 5, 7, 10, 14], quality: "9 Suspended 4th" },
  { name: "13(shell)", intervals: [0, 4, 10, 14, 21], quality: "Dominant 13th (Shell)" },
  { name: "13(rootless)", intervals: [0, 4, 10, 21], quality: "Dominant 13th (Rootless Shell)" },
  { name: "maj9(no5)", intervals: [0, 4, 11, 14], quality: "Major 9th Shell" },
  { name: "m9(no5)", intervals: [0, 3, 10, 14], quality: "Minor 9th Shell" },
  { name: "6/9", intervals: [0, 4, 7, 9, 14], quality: "Major 6/9" },
  { name: "m6/9", intervals: [0, 3, 7, 9, 14], quality: "Minor 6/9" },
  { name: "add9", intervals: [0, 4, 7, 14], quality: "Major Added 9" },
  { name: "m(add9)", intervals: [0, 3, 7, 14], quality: "Minor Added 9" },
  { name: "m7sus4", intervals: [0, 5, 7, 10, 15], quality: "Minor 7th Suspended 4th" },

  // --- 6. ADVANCED  ALTERED MOVEMENT SETS ---
  { name: "7(b9#9#5)", intervals: [0, 1, 3, 4, 8, 10], quality: "Altered Dominant" },
  { name: "7(b9)", intervals: [0, 4, 7, 10, 13], quality: "Dominant 7th Flat 9" },
  { name: "7(#9)", intervals: [0, 4, 7, 10, 15], quality: "Dominant 7th Sharp 9" },
  { name: "7(#11)", intervals: [0, 4, 7, 10, 18], quality: "Dominant 7th Sharp 11" },
  { name: "7(b13)", intervals: [0, 4, 7, 10, 20], quality: "Dominant 7th Flat 13" },
  { name: "maj7(#11)", intervals: [0, 4, 7, 11, 18], quality: "Major 7th Sharp 11" },
  { name: "7(b9,b5)", intervals: [0, 4, 6, 10, 13], quality: "Dominant 7th Flat 5 Flat 9" },
  { name: "7(#9,b5)", intervals: [0, 4, 6, 10, 15], quality: "Dominant 7th Flat 5 Sharp 9" }
];

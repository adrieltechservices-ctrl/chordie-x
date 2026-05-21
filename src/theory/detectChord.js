import { CHORD_PROFILES, getNoteName } from "./chordDatabase";

export function detectChords(activeMidiNotes, accidentalMode = "sharps") {
  if (!activeMidiNotes || activeMidiNotes.length === 0) return [];

  const sortedMidi = [...activeMidiNotes].sort((a, b) => a - b);
  const bassMidi = sortedMidi[0];
  const bassName = getNoteName(bassMidi, accidentalMode);

  const pitchClasses = Array.from(new Set(sortedMidi.map((n) => n % 12)));
  let bestMatches = [];
  let highestScore = -1;
  let closestFallbacks = [];
  let bestFuzzyScore = 0;

  for (let rootCandidate = 0; rootCandidate < 12; rootCandidate++) {
    const activeIntervals = pitchClasses.map((pc) => (pc - rootCandidate + 12) % 12);

    CHORD_PROFILES.forEach((profile) => {
      const profileIntervals = profile.intervals.map((i) => i % 12);
      const matchesProfile = activeIntervals.filter(i => profileIntervals.includes(i));
      const matchCount = new Set(matchesProfile).size;
      const totalUniqueProfile = new Set(profileIntervals).size;

      const rootName = getNoteName(rootCandidate, accidentalMode);
      const isAbsoluteRoot = rootCandidate === (bassMidi % 12);
      
      const chordName = isAbsoluteRoot 
        ? `${rootName}${profile.name}` 
        : `${rootName}${profile.name} / ${bassName}`;

      if (matchCount === totalUniqueProfile && pitchClasses.length === totalUniqueProfile) {
        const score = isAbsoluteRoot ? 100 : 80;
        bestMatches.push({ chordName, quality: profile.quality, isInversion: !isAbsoluteRoot, score });
        if (score > highestScore) highestScore = score;
      }

      const fuzzyScore = matchCount / Math.max(pitchClasses.length, totalUniqueProfile);
      if (fuzzyScore > bestFuzzyScore) {
        bestFuzzyScore = fuzzyScore;
        closestFallbacks = [{
          chordName: `${chordName} (Approx)`,
          quality: `Implied ${profile.quality}`,
          isInversion: !isAbsoluteRoot,
          score: 10
        }];
      }
    });
  }

  if (bestMatches.length > 0) {
    return bestMatches.sort((a, b) => b.score - a.score);
  }
  return closestFallbacks.slice(0, 3);
}

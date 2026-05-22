import {
  CHORD_PROFILES,
  getNoteName,
  normalizeIntervals,
} from "./chordDatabase";

export function detectChords(
  activeMidiNotes,
  accidentalMode = "sharps"
) {
  if (!activeMidiNotes || activeMidiNotes.length === 0) {
    return [];
  }

  // SORT MIDI NOTES
  const sortedMidi = [...activeMidiNotes].sort(
    (a, b) => a - b
  );

  // LOWEST NOTE = BASS
  const bassMidi = sortedMidi[0];

  const bassName = getNoteName(
    bassMidi,
    accidentalMode
  );

  // UNIQUE PITCH CLASSES
  const pitchClasses = [
    ...new Set(
      sortedMidi.map(
        (n) => ((n % 12) + 12) % 12
      )
    ),
  ];

  // SINGLE NOTE DETECTION
  if (pitchClasses.length === 1) {
    const singleName = getNoteName(
      pitchClasses[0],
      accidentalMode
    );

    return [
      {
        chordName: singleName,
        quality: "Single Note",
        isInversion: false,
        score: 100,
      },
    ];
  }

  let bestMatches = [];
  let highestScore = -Infinity;

  let fallbackMatches = [];
  let bestFallbackScore = 0;

  // TRY EVERY PITCH AS ROOT
  for (let rootCandidate = 0; rootCandidate < 12; rootCandidate++) {
    // BUILD INTERVALS RELATIVE TO ROOT
    const activeIntervals = normalizeIntervals(
      pitchClasses.map(
        (pc) => (pc - rootCandidate + 12) % 12
      )
    );

    for (const profile of CHORD_PROFILES) {
      // NORMALIZE PROFILE
      const profileIntervals = normalizeIntervals(
        profile.intervals
      );

      const activeSet = new Set(activeIntervals);
      const profileSet = new Set(profileIntervals);

      // MATCHED INTERVALS
      const matchedIntervals = profileIntervals.filter(
        (interval) => activeSet.has(interval)
      );

      const matchCount =
        new Set(matchedIntervals).size;

      // ROOT NAME
      const rootName = getNoteName(
        rootCandidate,
        accidentalMode
      );

      // INVERSION CHECK
      const isAbsoluteRoot =
        rootCandidate ===
        (((bassMidi % 12) + 12) % 12);

      // BUILD DISPLAY NAME
      const chordName = isAbsoluteRoot
        ? `${rootName}${profile.name}`
        : `${rootName}${profile.name} / ${bassName}`;

      // =========================
      // SCORING ENGINE
      // =========================

      let score = 0;

      // ROOT PRESENT
      if (activeSet.has(0)) {
        score += 10;
      }

      // 3RD PRESENT
      if (
        activeSet.has(3) ||
        activeSet.has(4)
      ) {
        score += 8;
      }

      // 7TH PRESENT
      if (
        activeSet.has(10) ||
        activeSet.has(11)
      ) {
        score += 6;
      }

      // GENERAL PROFILE MATCHES
      score += matchCount * 4;

      // PERFECT PROFILE BONUS
      if (
        matchCount === profileSet.size &&
        activeIntervals.length === profileSet.size
      ) {
        score += 30;
      }

      // CLOSE PARTIAL MATCH BONUS
      const coverage =
        matchCount / profileSet.size;

      score += coverage * 20;

      // SMALL PENALTY FOR EXTRA NOTES
      const extraNotes =
        activeIntervals.length - matchCount;

      score -= extraNotes * 1.5;

      // ROOT POSITION BONUS
      if (isAbsoluteRoot) {
        score += 8;
      }

      // =========================
      // ACCEPT GOOD MATCHES
      // =========================

      if (score >= 18) {
        bestMatches.push({
          chordName,
          quality: profile.quality,
          isInversion: !isAbsoluteRoot,
          score,
          root: rootName,
          intervals: activeIntervals,
          matchedIntervals,
          coverage,
        });

        if (score > highestScore) {
          highestScore = score;
        }
      }

      // =========================
      // FUZZY FALLBACKS
      // =========================

      const fuzzyScore =
        matchCount /
        Math.max(
          activeIntervals.length,
          profileIntervals.length
        );

      if (fuzzyScore > bestFallbackScore) {
        bestFallbackScore = fuzzyScore;

        fallbackMatches = [
          {
            chordName: `${chordName} (Approx)`,
            quality: `Implied ${profile.quality}`,
            isInversion: !isAbsoluteRoot,
            score: fuzzyScore * 10,
            root: rootName,
          },
        ];
      }
    }
  }

  // =========================
  // REMOVE DUPLICATES
  // =========================

  const uniqueMatches = [];
  const seen = new Set();

  bestMatches
    .sort((a, b) => b.score - a.score)
    .forEach((match) => {
      if (!seen.has(match.chordName)) {
        seen.add(match.chordName);
        uniqueMatches.push(match);
      }
    });

  // =========================
  // RETURN BEST MATCHES
  // =========================

  if (uniqueMatches.length > 0) {
    return uniqueMatches.slice(0, 8);
  }

  // =========================
  // FALLBACKS
  // =========================

  return fallbackMatches.slice(0, 3);
}
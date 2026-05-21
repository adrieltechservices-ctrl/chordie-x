import React from "react";
import { useStore } from "../store/useStore";

export default function ChordDisplay() {
  const detectedChords =
    useStore((state) => state.detectedChords) ?? [];

  const activeNotes =
    useStore((state) => state.activeNotes) ?? [];

  const theme =
    useStore((state) => state.theme);

  const primaryChord =
    detectedChords.length > 0
      ? detectedChords[0]
      : null;

  const hasNotes = activeNotes.length > 0;
  const hasChord = !!primaryChord;

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {/* MAIN ANALYSIS */}
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 mb-4">
          Detected Voicing
        </span>

        {/* EMPTY */}
        {!hasNotes && (
          <div className="space-y-2">
            <h2
              className={`text-5xl font-thin tracking-tight ${
                theme === "dark"
                  ? "text-zinc-700"
                  : "text-zinc-300"
              }`}
            >
              —
            </h2>

            <p
              className={`text-sm italic ${
                theme === "dark"
                  ? "text-zinc-500"
                  : "text-zinc-400"
              }`}
            >
              Play notes on your MIDI keyboard...
            </p>
          </div>
        )}

        {/* UNRECOGNIZED */}
        {hasNotes && !hasChord && (
          <div className="space-y-3">
            <h1
              className={`text-5xl font-extralight tracking-tight ${
                theme === "dark"
                  ? "text-red-400"
                  : "text-red-500"
              }`}
            >
              Unrecognized
            </h1>

            <div className="flex flex-wrap gap-2 pt-1">
              {activeNotes.map((note, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs font-medium border ${
                    theme === "dark"
                      ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                      : "bg-zinc-100 border-zinc-200 text-zinc-700"
                  }`}
                >
                  MIDI {note}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOGNIZED */}
        {hasChord && (
          <div className="space-y-4">
            <div>
              <h1
                className={`text-6xl xl:text-7xl font-extralight tracking-tight leading-none ${
                  theme === "dark"
                    ? "text-sky-300"
                    : "text-sky-600"
                }`}
              >
                {primaryChord.chordName}
              </h1>

              <div className="flex items-center gap-2 mt-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    theme === "dark"
                      ? "bg-emerald-400"
                      : "bg-emerald-500"
                  }`}
                />

                <p
                  className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${
                    theme === "dark"
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }`}
                >
                  {primaryChord.quality || "Unknown Quality"}

                  {primaryChord.isInversion
                    ? " • Inversion"
                    : " • Root Position"}
                </p>
              </div>
            </div>

            {/* NOTE LIST */}
            <div className="flex flex-wrap gap-2 pt-2">
              {activeNotes.map((note, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs font-medium border ${
                    theme === "dark"
                      ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                      : "bg-zinc-100 border-zinc-200 text-zinc-700"
                  }`}
                >
                  MIDI {note}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div
        className={`w-full md:w-[280px] border-t md:border-t-0 md:border-l px-6 py-6 ${
          theme === "dark"
            ? "border-zinc-800 bg-[#0f1012]"
            : "border-zinc-200 bg-zinc-50"
        }`}
      >
        <div className="space-y-6">
          {/* ALT CHORDS */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 block mb-4">
              Alternate Names
            </span>

            {detectedChords.length <= 1 ? (
              <p
                className={`text-sm italic ${
                  theme === "dark"
                    ? "text-zinc-600"
                    : "text-zinc-400"
                }`}
              >
                No alternate interpretations
              </p>
            ) : (
              <div className="space-y-2">
                {detectedChords
                  .slice(1)
                  .map((chord, index) => (
                    <div
                      key={index}
                      className={`text-sm transition-colors cursor-default ${
                        theme === "dark"
                          ? "text-zinc-300 hover:text-sky-300"
                          : "text-zinc-700 hover:text-sky-600"
                      }`}
                    >
                      {chord.chordName}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* MIDI COUNT */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 block mb-3">
              Input
            </span>

            <div
              className={`text-sm ${
                theme === "dark"
                  ? "text-zinc-300"
                  : "text-zinc-700"
              }`}
            >
              {activeNotes.length} active note
              {activeNotes.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
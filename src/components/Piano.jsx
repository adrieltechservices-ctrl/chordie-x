import React from "react";
import { useStore } from "../store/useStore";

const OCTAVE_NOTES = [
  { note: "C", isBlack: false },
  { note: "C#", isBlack: true },
  { note: "D", isBlack: false },
  { note: "D#", isBlack: true },
  { note: "E", isBlack: false },
  { note: "F", isBlack: false },
  { note: "F#", isBlack: true },
  { note: "G", isBlack: false },
  { note: "G#", isBlack: true },
  { note: "A", isBlack: false },
  { note: "A#", isBlack: true },
  { note: "B", isBlack: false },
];

const WHITE_KEY_WIDTH = 24;
const BLACK_KEY_WIDTH = 14;

const generate88Keys = () => {
  const layout = [];

  layout.push({
    name: "A0",
    isBlack: false,
    midiNumber: 21,
    label: "",
  });

  layout.push({
    name: "A#0",
    isBlack: true,
    midiNumber: 22,
    label: "",
  });

  layout.push({
    name: "B0",
    isBlack: false,
    midiNumber: 23,
    label: "",
  });

  for (let octave = 1; octave <= 7; octave++) {
    OCTAVE_NOTES.forEach((item, index) => {
      const midiNumber = 24 + (octave - 1) * 12 + index;

      layout.push({
        name: `${item.note}${octave}`,
        isBlack: item.isBlack,
        midiNumber,
        label: item.note === "C" ? `C${octave}` : "",
      });
    });
  }

  layout.push({
    name: "C8",
    isBlack: false,
    midiNumber: 108,
    label: "C8",
  });

  return layout;
};

const keyboardLayout = generate88Keys();

export default function Piano() {
  const activeNotes = useStore((state) => state.activeNotes);
  const theme = useStore((state) => state.theme);
  const { noteOn, noteOff } = useStore();

  const whiteKeys = keyboardLayout.filter((k) => !k.isBlack);

  const getActiveNoteName = (midiNum) => {
    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    return noteNames[midiNum % 12];
  };

  return (
    <div
      className={`w-full border-t overflow-hidden select-none transition-colors duration-200 ${
        theme === "dark"
          ? "bg-[#0b0b0d] border-zinc-800"
          : "bg-zinc-100 border-zinc-300"
      }`}
    >
      <div className="relative w-full h-[220px]">
        {/* WHITE KEYS */}
        <div className="absolute inset-0 flex">
          {whiteKeys.map((key) => {
            const isActive = activeNotes.includes(key.midiNumber);

            return (
              <button
                key={key.midiNumber}
                onMouseDown={() => noteOn(key.midiNumber)}
                onMouseUp={() => noteOff(key.midiNumber)}
                className={`
                  relative flex-1 h-full border-r transition-all duration-75
                  flex flex-col items-center justify-end pb-2
                  ${
                    isActive
                      ? theme === "dark"
                        ? "bg-sky-200 border-sky-400"
                        : "bg-sky-100 border-sky-300"
                      : theme === "dark"
                      ? "bg-zinc-100 border-zinc-400 hover:bg-zinc-200"
                      : "bg-white border-zinc-300 hover:bg-zinc-50"
                  }
                `}
              >
                {/* ACTIVE INDICATOR */}
                <div
                  className={`absolute top-2 w-1.5 h-1.5 rounded-full transition-opacity ${
                    isActive
                      ? "opacity-100 bg-sky-500"
                      : "opacity-0"
                  }`}
                />

                {/* ACTIVE NOTE NAME */}
                <div
                  className={`absolute top-5 text-[9px] font-semibold tracking-tight transition-all ${
                    isActive
                      ? "opacity-100 text-sky-500"
                      : "opacity-0"
                  }`}
                >
                  {getActiveNoteName(key.midiNumber)}
                </div>

                {/* OCTAVE LABEL */}
                <span
                  className={`text-[9px] font-medium tracking-tight ${
                    theme === "dark"
                      ? "text-zinc-500"
                      : "text-zinc-400"
                  }`}
                >
                  {key.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* BLACK KEYS */}
        {keyboardLayout.map((key, index) => {
          if (!key.isBlack) return null;

          const isActive = activeNotes.includes(key.midiNumber);

          const precedingWhiteKeys = keyboardLayout
            .slice(0, index)
            .filter((k) => !k.isBlack).length;

          const leftPercent =
            (precedingWhiteKeys / whiteKeys.length) * 100;

          return (
            <div
              key={key.midiNumber}
              className="absolute top-0 z-30"
              style={{
                left: `calc(${leftPercent}% - ${BLACK_KEY_WIDTH / 2}px)`,
                width: `${BLACK_KEY_WIDTH}px`,
              }}
            >
              {/* ACTIVE NOTE */}
              <div
                className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold transition-all ${
                  isActive
                    ? "opacity-100 text-sky-400"
                    : "opacity-0"
                }`}
              >
                {getActiveNoteName(key.midiNumber)}
              </div>

              <button
                onMouseDown={() => noteOn(key.midiNumber)}
                onMouseUp={() => noteOff(key.midiNumber)}
                className={`
                  w-full h-[138px]
                  border-x border-b
                  transition-all duration-75
                  shadow-none
                  ${
                    isActive
                      ? "bg-sky-500 border-sky-400"
                      : theme === "dark"
                      ? "bg-black border-zinc-800 hover:bg-zinc-900"
                      : "bg-zinc-900 border-black hover:bg-black"
                  }
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
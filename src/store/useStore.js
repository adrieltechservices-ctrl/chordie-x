import { create } from "zustand";
import { detectChords } from "../theory/detectChord";

export const useStore = create((set, get) => ({
  activeNotes: [],       
  heldPhysicalNotes: [], 
  detectedChords: [],
  isSustainActive: false,
  theme: "dark",

  // --- ChordieApp Native Features Store States ---
  accidentalMode: "sharps",          // "sharps" or "flats"
  showAlternateChords: true,         // Toggle alternate names checklist
  showNoteNamesLabels: true,         // Toggle key character tags
  displaySustainedNotesOnPiano: true,// Toggle visual hold markers
  noteOnColor: "bg-purple-500",      // Custom note key themes
  dotColor: "bg-purple-500",         // Custom tracking dots
  activeKey: "C",

  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setAccidentalMode: (mode) => set((state) => {
    const nextNotes = state.activeNotes;
    return { accidentalMode: mode, detectedChords: detectChords(nextNotes, mode) };
  }),
  setShowAlternateChords: (val) => set({ showAlternateChords: val }),
  setShowNoteNamesLabels: (val) => set({ showNoteNamesLabels: val }),
  setDisplaySustainedNotesOnPiano: (val) => set({ displaySustainedNotesOnPiano: val }),
  setNoteOnColor: (color) => set({ noteOnColor: color }),
  setDotColor: (color) => set({ dotColor: color }),
  setActiveKey: (key) => set({ activeKey: key }),

  noteOn: (midiNumber) => {
    set((state) => {
      const held = state.heldPhysicalNotes.includes(midiNumber) ? state.heldPhysicalNotes : [...state.heldPhysicalNotes, midiNumber];
      const active = state.activeNotes.includes(midiNumber) ? state.activeNotes : [...state.activeNotes, midiNumber];
      return { heldPhysicalNotes: held, activeNotes: active, detectedChords: detectChords(active, state.accidentalMode) };
    });
  },

  noteOff: (midiNumber) => {
    set((state) => {
      const held = state.heldPhysicalNotes.filter((n) => n !== midiNumber);
      const active = state.isSustainActive && state.displaySustainedNotesOnPiano
        ? state.activeNotes
        : state.activeNotes.filter((n) => n !== midiNumber);
      return { heldPhysicalNotes: held, activeNotes: active, detectedChords: detectChords(active, state.accidentalMode) };
    });
  },

  setSustain: (isActive) => {
    set((state) => {
      const nextActiveNotes = isActive ? state.activeNotes : [...state.heldPhysicalNotes];
      return { isSustainActive: isActive, activeNotes: nextActiveNotes, detectedChords: detectChords(nextActiveNotes, state.accidentalMode) };
    });
  },

  clearNotes: () => set({ activeNotes: [], heldPhysicalNotes: [], detectedChords: [] }),
}));

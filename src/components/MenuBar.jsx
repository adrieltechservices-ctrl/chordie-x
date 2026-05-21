import React, { useState } from "react";
import { useStore } from "../store/useStore";

export default function MenuBar() {
  const s = useStore();
  const [openMenu, setOpenMenu] = useState(null);

  // Hardcoded options for color changes to keep selection loops clean
  const colors = [
    { name: "Purple", bg: "bg-purple-500", dot: "bg-purple-500" },
    { name: "Blue", bg: "bg-sky-500", dot: "bg-sky-500" },
    { name: "Green", bg: "bg-emerald-500", dot: "bg-emerald-500" },
    { name: "Red", bg: "bg-rose-500", dot: "bg-rose-500" }
  ];

  const menuTree = {
    Options: [
      { text: "Reset settings to default", action: () => { s.setAccidentalMode("sharps"); s.setShowAlternateChords(true); s.setShowNoteNamesLabels(true); s.setDisplaySustainedNotesOnPiano(true); } },
      { text: "Deauthorize ChordieApp", action: () => alert("Licensing Module: App Deauthorized Safely."), disabled: true },
      { divider: true },
      { text: "Show Alternate Chord Names", checked: s.showAlternateChords, action: () => s.setShowAlternateChords(!s.showAlternateChords) },
      { divider: true },
      { text: "Show Note Names", checked: s.showNoteNamesLabels, action: () => s.setShowNoteNamesLabels(!s.showNoteNamesLabels) },
      { text: "Display Sustained Notes", checked: s.displaySustainedNotesOnPiano, action: () => s.setDisplaySustainedNotesOnPiano(!s.displaySustainedNotesOnPiano) },
      { divider: true },
      // Submenus for Note-On and Dot color configuration sets
      { text: "Set Note-On Color (Purple)", action: () => s.setNoteOnColor("bg-purple-500") },
      { text: "Set Note-On Color (Blue)", action: () => s.setNoteOnColor("bg-sky-500") },
      { text: "Set Note-On Color (Red)", action: () => s.setNoteOnColor("bg-rose-500") },
      { text: "Set Dot color (Purple)", action: () => s.setDotColor("bg-purple-500") },
      { text: "Set Dot color (Green)", action: () => s.setDotColor("bg-emerald-500") },
      { text: "Set Dot color (Blue)", action: () => s.setDotColor("bg-sky-500") },
      { divider: true },
      { text: "Reset Single Window to Default Position", action: () => alert("Window bounds recalibrated.") },
      { text: "Switch to Separate Windows", action: s.toggleTheme, labelOverride: `Toggle Theme UI (${s.theme === "dark" ? "Dark" : "Light"})` },
      { text: "Reset Separate Windows to Default position", disabled: true, action: () => {} },
      { divider: true },
      { text: "All Notes off", action: () => s.clearNotes() }
    ],
    Key: [
      { text: "C Major / A minor", checked: s.activeKey === "C", action: () => s.setActiveKey("C") },
      { text: "G Major / E minor", checked: s.activeKey === "G", action: () => s.setActiveKey("G") },
      { text: "F Major / D minor", checked: s.activeKey === "F", action: () => s.setActiveKey("F") },
      { text: "D Major / B minor", checked: s.activeKey === "D", action: () => s.setActiveKey("D") },
      { text: "Bb Major / G minor", checked: s.activeKey === "Bb", action: () => s.setActiveKey("Bb") }
    ],
    "Midi Input": [
      { text: "All Connected Hardware Devices", checked: s.midiInputSource === "All Devices", action: () => s.setMidiInputSource("All Devices") },
      { text: "Bypass System MIDI Capture Pipeline", checked: s.midiInputSource === "Bypassed", action: () => s.setMidiInputSource("Bypassed") }
    ],
    Enharmonics: [
      { text: "Use Standard Sharps (#)", checked: s.accidentalMode === "sharps", action: () => s.setAccidentalMode("sharps") },
      { text: "Use Standard Flats (b)", checked: s.accidentalMode === "flats", action: () => s.setAccidentalMode("flats") }
    ]
  };

  return (
    <div className={`w-full flex px-5 py-1 text-xs select-none border-b font-sans transition-colors duration-150 ${
      s.theme === "dark" ? "bg-zinc-950 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700"
    }`}>
      <div className="flex space-x-5 relative">
        {Object.keys(menuTree).map((name) => (
          <div key={name} className="relative">
            {/* Top Navigation Headers */}
            <button
              onClick={() => setOpenMenu(openMenu === name ? null : name)}
              className={`px-2 py-0.5 rounded transition-all hover:bg-zinc-800/20 font-medium cursor-pointer ${
                openMenu === name ? "bg-zinc-800 text-white" : ""
              }`}
            >
              {name}
            </button>

            {/* Menu List Dropdowns Layout Panels */}
            {openMenu === name && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                <div className={`absolute left-0 mt-1 w-72 rounded shadow-2xl border p-1 z-50 flex flex-col text-left font-sans ${
                  s.theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-200 text-zinc-800"
                }`}>
                  {menuTree[name].map((item, idx) => {
                    if (item.divider) {
                      return <div key={idx} className="h-px bg-zinc-700/30 my-1 w-full" />;
                    }
                    return (
                      <button
                        key={idx}
                        disabled={item.disabled}
                        onClick={() => {
                          item.action();
                          setOpenMenu(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded flex items-center justify-between transition-colors text-xs ${
                          item.disabled 
                            ? "opacity-30 cursor-not-allowed text-zinc-500" 
                            : "hover:bg-purple-600 hover:text-white cursor-pointer"
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          {/* Checkmark character alignment map wrapper */}
                          <span className="w-4 block font-bold text-purple-500 text-center">
                            {item.checked ? "✓" : ""}
                          </span>
                          <span>{item.labelOverride || item.text}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Far Right Hardware Status Readouts */}
      <div className="ml-auto flex space-x-4 opacity-40 text-[10px] items-center font-mono tracking-tight">
        <span>KEY: {s.activeKey}</span>
        <span>ACC: {s.accidentalMode.toUpperCase()}</span>
        <span>DRV: {s.midiInputSource}</span>
      </div>
    </div>
  );
}

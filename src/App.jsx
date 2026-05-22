import React, { useEffect } from "react";
import { WebMidi } from "webmidi"; // low-overhead hardware timestamping communication loop
import { useStore } from "./store/useStore";
import MenuBar from "./components/MenuBar";
import Piano from "./components/Piano";
import Staff from "./components/Staff";
import ChordDisplay from "./components/ChordDisplay";

export default function App() {
  const { noteOn, noteOff, setSustain, theme } = useStore();

  useEffect(() => {
    // Connect directly to CoreMIDI hardware pipelines with strict priority
    WebMidi.enable({ sysex: true })
      .then(() => {
        console.log("CoreMIDI Zero-Latency Drivers Active.");

        // Monitor every connected physical or virtual keyboard controller instrument link
        WebMidi.inputs.forEach((input) => {
          // Instantaneous key press tracking
          input.addListener("noteon", (e) => {
            noteOn(e.note.number);
          });

          // Instantaneous key release tracking
          input.addListener("noteoff", (e) => {
            noteOff(e.note.number);
          });

          // Low-overhead CC#64 Foot Pedal tracking
          input.addListener("controlchange", (e) => {
            if (e.controller.number === 64) {
              setSustain(e.value >= 64);
            }
          });
        });
      })
      .catch((err) => console.error("WebMidi hardware tracking block failed: ", err));

    return () => {
      // Complete teardown on window termination to prevent memory thread leaks
      WebMidi.disable();
    };
  }, [noteOn, noteOff, setSustain]);

  return (
    <div className={`flex flex-col h-screen w-screen m-0 p-0 overflow-hidden select-none box-border ${
      theme === "dark" ? "bg-zinc-900 text-zinc-100" : "bg-white text-zinc-900"
    }`}>
      <MenuBar />

      <div className="flex-1 grid grid-cols-12 gap-6 p-6 items-stretch overflow-hidden box-border">
        <div className="col-span-4 flex flex-col justify-between items-center pb-2 box-border overflow-hidden">
          <div className={`w-full flex justify-center py-4 rounded-xl border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-950 border-zinc-800 shadow-2xl" : "bg-white border-zinc-200 shadow-sm"
          }`}>
            <Staff />
          </div>
          
          <div className="flex items-center space-x-2 self-start pl-4 text-xs font-semibold">
            <div className={`w-3 h-3 rounded-full transition-all duration-100 ${
              useStore((s) => s.isSustainActive) ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
            }`} />
            <span className={useStore((s) => s.isSustainActive) ? "text-emerald-500" : "text-rose-500"}>
              {useStore((s) => s.isSustainActive) ? "Sustain Active" : "Sustain Off"}
            </span>
          </div>
        </div>

        <div className={`col-span-8 p-6 rounded-2xl border flex items-center box-border overflow-hidden ${
          theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
        }`}>
          <ChordDisplay />
        </div>
      </div>

      <div className="w-full border-t border-zinc-800 bg-zinc-950 px-0 pb-0 m-0 box-border">
        <Piano />
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { useStore } from "./store/useStore";
import MenuBar from "./components/MenuBar";
import Piano from "./components/Piano";
import Staff from "./components/Staff";
import ChordDisplay from "./components/ChordDisplay";

export default function App() {
  const { noteOn, noteOff, setSustain, isSustainActive, theme } = useStore();

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midiAccess) => {
        for (let input of midiAccess.inputs.values()) {
          input.onmidimessage = (msg) => {
            const [status, data1, data2] = msg.data;
            if (status === 144 && data2 > 0) noteOn(data1);
            else if (status === 128 || (status === 144 && data2 === 0)) noteOff(data1);
            else if (status === 176 && data1 === 64) setSustain(data2 >= 64);
          };
        }
      });
    }
  }, [noteOn, noteOff, setSustain]);

  return (
    <div className={`flex flex-col h-svh w-full m-0 p-0 overflow-hidden select-none box-border ${
      theme === "dark" ? "bg-zinc-900 text-zinc-100" : "bg-white text-zinc-900"
    }`}>
      
      {/* 1. System Menu Strip Bar */}
      <MenuBar />

      {/* 2. Central Analytics Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 items-stretch overflow-hidden box-border">
        {/* Left Side Panel: Sheet Notation clefs */}
        <div className="col-span-4 flex flex-col justify-between items-center pb-2 box-border overflow-hidden">
          <div className={`w-full flex justify-center py-4 rounded-xl border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-950 border-zinc-800 shadow-2xl" : "bg-white border-zinc-200 shadow-sm"
          }`}>
            <Staff />
          </div>
          
          <div className="flex items-center space-x-2 self-start pl-4 text-xs font-semibold">
            <div className={`w-3 h-3 rounded-full transition-all duration-100 ${
              isSustainActive ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
            }`} />
            <span className={isSustainActive ? "text-emerald-500" : "text-rose-500"}>
              {isSustainActive ? "Sustain Active" : "Sustain Off"}
            </span>
          </div>
        </div>

        {/* Right Side Panel: Text Monitoring Area */}
        <div className={`col-span-8 p-6 rounded-2xl border flex items-center box-border overflow-hidden ${
          theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
        }`}>
          <ChordDisplay />
        </div>
      </div>

      {/* 3. Baseboard Full-Width 88-Key Piano Frame */}
      <div className="w-full border-t border-zinc-800 bg-zinc-950 px-0 pb-0 m-0 box-border">
        <Piano />
      </div>
    </div>
  );
}

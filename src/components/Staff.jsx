import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Accidental, Formatter, Voice } from "vexflow";
import { useStore } from "../store/useStore";

// Convert absolute MIDI values directly to exact pitch strings for VexFlow register placements
const midiToVexObject = (midi) => {
  const noteNames = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
  const noteName = noteNames[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { 
    key: `${noteName}/${octave}`, 
    isSharp: noteName.includes("#"),
    midi 
  };
};

export default function Staff() {
  const containerRef = useRef(null);
  const activeNotes = useStore((state) => state.activeNotes) || [];
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // 1. Explicitly purge the SVG node container canvas element to prevent ghost overlapping artifacts
    containerRef.current.innerHTML = "";

    try {
      // 2. Initialize VexFlow using the reliable, baseline standalone Renderer
      // Passing 2 directly specifies the core SVG vector generation loop engine across all v5 environments
      const renderer = new Renderer(containerRef.current, 2);
      renderer.resize(400, 240);
      const context = renderer.getContext();

      // 3. Configure Theme-based Vector Contrast Colors directly without using shaky CSS filters
      const vectorColor = theme === "dark" ? "#f3f4f6" : "#1f2937";
      context.setFillStyle(vectorColor);
      context.setStrokeStyle(vectorColor);

      // 4. Generate and DRAW the permanent Grand Staff line frames immediately
      const trebleStave = new Stave(20, 10, 350).addClef("treble").setContext(context);
      trebleStave.setStyle({ fillStyle: vectorColor, strokeStyle: vectorColor });
      trebleStave.draw();

      const bassStave = new Stave(20, 110, 350).addClef("bass").setContext(context);
      bassStave.setStyle({ fillStyle: vectorColor, strokeStyle: vectorColor });
      bassStave.draw();

      // If no notes are currently active, break execution path here leaving empty clean clef lines visible
      if (activeNotes.length === 0) return;

      // 5. Partition notes while matching strict registration rules
      const vexNotesObjects = activeNotes.map(midiToVexObject);
      
      const trebleGroup = vexNotesObjects
        .filter(obj => obj.midi >= 60)
        .sort((a, b) => a.midi - b.midi);

      const bassGroup = vexNotesObjects
        .filter(obj => obj.midi < 60)
        .sort((a, b) => a.midi - b.midi);

      // 6. Render Treble Voices with strict accidentals mapping indexes
      if (trebleGroup.length > 0) {
        const keys = trebleGroup.map(o => o.key);
        const trebleNote = new StaveNote({ keys: keys, duration: "w", clef: "treble" });
        
        // Explicitly bind the Stave object reference context to give layout positions down to notes
        trebleNote.setStave(trebleStave);
        trebleNote.setStyle({ fillStyle: vectorColor, strokeStyle: vectorColor });
        
        trebleGroup.forEach((noteObj, idx) => {
          if (noteObj.isSharp) {
            const acc = new Accidental("#");
            acc.setStyle({ fillStyle: vectorColor, strokeStyle: vectorColor });
            trebleNote.addModifier(acc, idx);
          }
        });

        const trebleVoice = new Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
        trebleVoice.addTickables([trebleNote]);
        
        new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 300);
        trebleVoice.draw(context, trebleStave);
      }

      // 7. Render Bass Voices with strict accidentals mapping indexes
      if (bassGroup.length > 0) {
        const keys = bassGroup.map(o => o.key);
        const bassNote = new StaveNote({ keys: keys, duration: "w", clef: "bass" });
        
        // Explicitly bind the Stave object reference context to give layout positions down to notes
        bassNote.setStave(bassStave);
        bassNote.setStyle({ fillStyle: vectorColor, strokeStyle: vectorColor });
        
        bassGroup.forEach((noteObj, idx) => {
          if (noteObj.isSharp) {
            const acc = new Accidental("#");
            acc.setStyle({ fillStyle: vectorColor, strokeStyle: vectorColor });
            bassNote.addModifier(acc, idx);
          }
        });

        const bassVoice = new Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
        bassVoice.addTickables([bassNote]);
        
        new Formatter().joinVoices([bassVoice]).format([bassVoice], 300);
        bassVoice.draw(context, bassStave);
      }

    } catch (pipelineException) {
      console.error("VexFlow compilation halted safely without thread crash: ", pipelineException);
    }
  }, [activeNotes, theme]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center bg-transparent"
    />
  );
}

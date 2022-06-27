import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';

import { useScore } from 'react-native-vexflow';
import Vex from 'vexflow';

export default function Music({ bar, tsNum, tsDenum, barNum }) {
  const { StaveNote, Annotation, Voice, Formatter, Tuplet } = Vex.Flow;
  const [context, stave] = useScore({
    contextSize: { x: 310, y: 100 }, // this determine the canvas size
    staveOffset: { x: 0, y: 0 }, // this determine the starting point of the staff relative to top-right corner of canvas
    staveWidth: 300, // ofc, stave width
    timeSig: `${tsNum}/${tsDenum}`, // time signiture
  });

  let tuples = [];

  let newBars = bar.map((time, i) => {
    time.note = time.note || 'q';

    let noteData = {
      keys: ['c/5'],
      duration: time.note,
    };
    let dot = false;
    time?.mod?.forEach((mod) => {
      if (typeof mod === 'number') {
        tuples.push([i, time.mod.toString()]);
      } else if (mod === 'd') {
        dot = true;
        noteData.dots = 1;
      }
    });

    const note = new StaveNote(noteData);

    if (dot) {
      note.addDotToAll();
    }

    if (time.hand) {
      note.addAnnotation(
        0,
        new Annotation(time.hand)
          .setFont('Arial', 10)
          .setVerticalJustification('bottom')
      );
    }

    return note;
  });
  let voice = new Voice({ num_beats: tsNum, beat_value: tsDenum });
  voice.addTickables(newBars);

  let formatter = new Formatter().joinVoices([voice]).format([voice], 200);

  // Render voice
  voice.draw(context, stave);
  return <View>{context.render()}</View>;
}

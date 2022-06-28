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
  console.log('bar', bar);
  console.log(bar.reduce((acc, curr) => acc + curr.round, 0));
  const { StaveNote, Annotation, Voice, Formatter, Tuplet, RESOLUTION } =
    Vex.Flow;
  const [context, stave] = useScore({
    contextSize: { x: 310, y: 100 }, // this determine the canvas size
    staveOffset: { x: 0, y: 0 }, // this determine the starting point of the staff relative to top-right corner of canvas
    staveWidth: 300, // ofc, stave width
    timeSig: `${tsNum}/${tsDenum}`, // time signiture
  });

  let tuples = [];

  let newBar = bar.map((time, i) => {
    time.note = time.note || 'q';

    let noteData = {
      keys: ['c/5'],
      duration: time.note,
    };
    let dot = false;
    time?.mod?.forEach((mod) => {
      if (typeof mod === 'number') {
        tuples.push([i, mod, 2]);
      } else if (mod === 'd') {
        dot = true;
        noteData.dots = 1;
      }
    });

    let note = new StaveNote(noteData);

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
  voice.setStrict(false);
  console.log('tuples', tuples);

  voice.addTickables(newBar);

  let formatter = new Formatter().joinVoices([voice]).format([voice], 200);

  // Render tuplets
  const newTups = [];
  if (tuples.length > 0) {
    let start = 0;
    for (let i = 0; i < tuples.length; i++) {
      if (
        !tuples[i + 1] ||
        tuples[i + 1][0] - 1 !== tuples[i][0] ||
        tuples[i + 1][1] !== tuples[i][1] ||
        tuples[i + 1][2] !== tuples[i][2]
      ) {
        // debugger;
        console.log(
          tuples[start][0],
          tuples[i][0] + 1,
          tuples[i][1],
          tuples[i][2]
        );
        newTups.push(
          new Tuplet(newBar.slice(tuples[start][0], tuples[i][0] + 1), {
            num_notes: tuples[i][1],
            notes_occupied: tuples[i][2],
          })
        );
        start = i + 1;
      }
    }

    console.log(newTups);
    // debugger;
  }
  // Render voice
  voice.draw(context, stave);
  newTups.forEach((tup) => tup.setContext(context).draw());
  return <View>{context.render()}</View>;
}

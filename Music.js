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

export default function Music({ times, tsNum, tsDenum }) {
  const { StaveNote, Annotation, Voice, Formatter } = Vex.Flow;
  const [context, stave] = useScore({
    contextSize: { x: 310, y: 150 }, // this determine the canvas size
    staveOffset: { x: 5, y: 5 }, // this determine the starting point of the staff relative to top-right corner of canvas
    staveWidth: 300, // ofc, stave width
    timeSig: `${tsNum}/${tsDenum}`, // time signiture
  });

  let tuples = [];

  let notes = times.map((time, i) => {
    console.log(time);

    time.note = time.note || 'q';

    if (time?.note?.includes('-')) {
      console.log('dashed');
      let splitTime = time.note.split('-', '');
      tuples.push([i, splitTime[0]]);
      time.note = splitTime[1];
    }

    let noteData = {
      keys: ['c/5'],
      duration: time.note,
      dots: time.note.includes('d') ? 1 : 0,
    };

    const note = new StaveNote(noteData);

    if (time?.note?.includes('d')) {
      // console.log('dotted');
      // let note = new StaveNote({
      //   keys: ['c/5'],
      //   duration: time.note,
      //   dots: 1,
      // }).addAnnotation(
      //   0,
      //   new Annotation(time.hand)
      //     .setFont('Arial', 10)
      //     .setVerticalJustification('bottom')
      // );
      // note.addDotToAll();
      // return note;
    }

    // console.log(time);
    // console.log('normal');
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
  console.log(notes.length);
  notes.forEach((note, i) => {
    console.log(note.duration, note.dots);
  });
  var voice = new Voice({ num_beats: tsNum, beat_value: tsDenum });
  voice.addTickables(notes);

  let formatter = new Formatter().joinVoices([voice]).format([voice], 200);

  // Render voice
  voice.draw(context, stave);
  return <View>{context.render()}</View>;
}

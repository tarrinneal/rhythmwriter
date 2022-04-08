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

export default function Music({ times }) {
  const VF = Vex.Flow;
  const [context, stave] = useScore({
    contextSize: { x: 310, y: 150 }, // this determine the canvas size
    staveOffset: { x: 5, y: 5 }, // this determine the starting point of the staff relative to top-right corner of canvas
    staveWidth: 300, // ofc, stave width
    // timeSig: '4/4', // time signiture
  });

  let notes = times.map((time, i) => {
    return new VF.StaveNote({ keys: ['c/5'], duration: '8' }).addAnnotation(
      0,
      new VF.Annotation(time.hand)
        .setFont('Arial', 10)
        .setVerticalJustification('bottom')
    );
  });

  var voice = new VF.Voice({ num_beats: notes.length, beat_value: 8 });
  voice.addTickables(notes);

  let formatter = new VF.Formatter().joinVoices([voice]).format([voice], 200);

  // Render voice
  voice.draw(context, stave);
  return <View>{context.render()}</View>;
}

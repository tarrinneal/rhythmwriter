import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Met from './Met';

const noteValues = {
  4: 'whole',
  3: 'dotted half',
  2: 'half',
  1.5: 'dotted-quarter',
  1: 'quarter',
  0.75: 'dotted-eighth',
  0.666: 'quarter-triplet',
  0.5: 'eighth',
  0.333: 'triplet',
  0.25: 'sixteenth',
  0.166: 'sixtuplet',
  0.125: 'thirty-second',
  0.0625: 'sixty-fourth',
};

const noteRounder = (num) => {
  if (num < 0.1) {
    return 0.0625;
  } else if (num < 0.145) {
    return 0.125;
  } else if (num < 0.2) {
    return 0.166;
  } else if (num < 0.29) {
    return 0.25;
  } else if (num < 0.42) {
    return 0.333;
  } else if (num < 0.58) {
    return 0.5;
  } else if (num < 0.7) {
    return 0.666;
  } else if (num < 0.88) {
    return 0.75;
  } else {
    return Math.floor((num + 0.15) * 4) / 4;
  }
};

export default function App() {
  const [times, setTimes] = useState([]);
  const [tempo, setTempo] = useState(180);
  const [notesCompleted, setNotesCompleted] = useState(false);

  const buttonPress = async (hand) => {
    setTimes([...times, { hand, time: global.nativePerformanceNow() }]);
    setNotesCompleted(false);
  };

  const calculateNotes = async () => {
    let tempS = 60 / tempo;
    let newTimes = times.map((time, i) => {
      let dif = times[i + 1] ? times[i + 1].time - time.time : tempS * 1000;
      let difS = dif / 1000;
      let unround = difS / tempS;
      let round = noteRounder(unround);
      let remain;
      if (round > 1) {
        oldRound = round;
        round = Math.floor(round);
        remain = oldRound - round;
      }
      let note = noteValues[round];

      return {
        hand: time.hand,
        time: time.time,
        note: note || 'unknown',
        rest: noteValues[remain],
      };
    });
    await setTimes(newTimes);
    setNotesCompleted(true);
  };

  return (
    <>
      <StatusBar style='auto' />
      <View style={styles.container}>
        <View style={styles.notes}>
          {times.map((time, i) => (
            <Text key={time.hand + i}>
              {notesCompleted
                ? time.rest
                  ? time.note + ' note ' + time.rest + ' rest '
                  : time.note + ' note '
                : time.hand}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.notes}>
        <Pressable
          onPress={() => setTimes([])}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.reset,
          ]}
        >
          {({ pressed }) => <Text style={styles.text}>Reset</Text>}
        </Pressable>
        <Pressable
          onPress={calculateNotes}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.reset,
          ]}
        >
          {({ pressed }) => <Text style={styles.text}>Calculate Notes</Text>}
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Pressable
            onTouchStart={() => buttonPress('L')}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              },
              styles.wrapperCustom,
            ]}
          >
            {({ pressed }) => <Text style={styles.text}>Left</Text>}
          </Pressable>
          <Pressable
            onTouchStart={() => buttonPress('R')}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              },
              styles.wrapperCustom,
            ]}
          >
            {({ pressed }) => <Text style={styles.text}>Right</Text>}
          </Pressable>
        </View>
      </View>

      <Met tempo={tempo} setTempo={setTempo} />
    </>
  );
}

const styles = StyleSheet.create({
  notes: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#748',
    flexWrap: 'wrap',
  },
  reset: {
    height: 40,
    minWidth: 80,
    margin: 12,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#748',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    color: '#999',
  },
  wrapperCustom: {
    width: 150,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 25,
  },
  buttonRow: {
    flexDirection: 'row',
  },
});

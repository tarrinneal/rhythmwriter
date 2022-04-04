import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Met from './Met';

const noteValues = {
  1: '𝅘𝅥',
  0.75: '𝅘𝅥𝅮.',
  0.666: '3𝅘𝅥',
  0.5: '𝅘𝅥𝅮',
  0.333: '3𝅘𝅥𝅮',
  0.25: '𝅘𝅥𝅯',
  0.166: '3𝅘𝅥𝅯',
  0.125: '𝅘𝅥𝅰',
  0.0625: '𝅘𝅥𝅱',
};

const restValues = {
  1: '𝄽',
  0.75: '𝄾𝄿',
  0.666: '3𝄽',
  0.5: '𝄾',
  0.333: '3𝄾',
  0.25: '𝄿',
  0.166: '3𝄿',
  0.125: '𝅀',
  0.0625: '𝅁',
};

const noteRounder = (num) => {
  if (num === 0) {
    return 0;
  } else if (num < 0.1) {
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
    return 1;
  }
};

export default function App() {
  const [times, setTimes] = useState([]);
  const [tempo, setTempo] = useState(180);
  const [notesCompleted, setNotesCompleted] = useState(false);

  const buttonPress = async (hand, mod) => {
    setTimes([...times, { hand, mod, time: global.nativePerformanceNow() }]);
    setNotesCompleted(false);
  };

  const calculateNotes = async () => {
    let tempS = 60 / tempo;
    let newTimes = times.map((time, i) => {
      let dif = times[i + 1] ? times[i + 1].time - time.time : tempS * 1000;
      let difS = dif / 1000;
      let unround = difS / tempS;
      let remain = 0;
      let longRest = 0;
      if (unround > 1) {
        let remainder = unround - 1;
        console.log(remainder);
        unround = 1;
        longRest = Math.floor(remainder);
        console.log(longRest);
        remain = remainder - longRest < 0.2 ? 0 : remainder - longRest;
        console.log(remain);
      }
      let round = noteRounder(unround);
      let note = noteValues[round];

      let rest = restValues[noteRounder(remain)];

      return {
        ...time,
        note,
        rest,
        longRest,
      };
    });
    console.log(newTimes);
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
                ? `${time.mod ? time.mod : ''}${time.note} ${
                    time.longRest ? time.longRest + ' beats of rest ' : ''
                  }${time.rest ? time.rest + ' ' : ''}`
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
            onTouchStart={() => buttonPress('L', '^')}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              },
              styles.wrapperCustomSmall,
            ]}
          >
            {({ pressed }) => <Text style={styles.text}>^L</Text>}
          </Pressable>
          <Pressable
            onTouchStart={() => buttonPress('R', '^')}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
              },
              styles.wrapperCustomSmall,
            ]}
          >
            {({ pressed }) => <Text style={styles.text}>^R</Text>}
          </Pressable>
        </View>
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
            {({ pressed }) => <Text style={styles.text}>L</Text>}
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
            {({ pressed }) => <Text style={styles.text}>R</Text>}
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
  wrapperCustomSmall: {
    width: 150,
    height: 75,
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

import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Met from './Met';

const noteValues = {
  4: 'whole',
  3: 'dotted half',
  2: 'half',
  1.5: 'dotted quarter',
  1: 'quarter',
  0.75: 'dotted eighth',
  0.666: 'quarter triplet',
  0.5: 'eighth',
  0.25: 'sixteenth',
  0.333: 'triplet',
  0.166: 'sixtuplet',
  0.125: 'thirty-second',
};

export default function App() {
  const [times, setTimes] = useState([]);
  const [tempo, setTempo] = useState(180);
  const [notesCompleted, setNotesCompleted] = useState(false);

  const buttonPress = async (hand) => {
    // await setTimes([...times, new Date().toTimeString()]);
    setTimes([...times, { hand, time: new Date() }]);
    setNotesCompleted(false);
  };

  const calculateNotes = async () => {
    const notes = [];
    setNotesCompleted(true);
  };

  return (
    <>
      <StatusBar style='auto' />
      <View style={styles.container}>
        <View style={styles.notes}>
          {!notesCompleted &&
            times.map((time, i) => (
              <Text key={time.hand + i}>{time.hand}</Text>
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

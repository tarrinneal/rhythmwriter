import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Met from './Met';

export default function App() {
  const [times, setTimes] = useState([]);
  const buttonPress = async (hand) => {
    // await setTimes([...times, new Date().toTimeString()]);
    setTimes([...times, hand]);
  };

  return (
    <>
      <StatusBar style='auto' />
      <View style={styles.container}>
        <View style={styles.notes}>
          {times.map((time, i) => (
            <Text key={time + i}>{time}</Text>
          ))}
        </View>
      </View>
      <View style={styles.container}>
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

      <Met />
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
    flexWrap: 'wrap',
  },
  reset: {
    height: 40,
    width: 40,
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
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
  },
});

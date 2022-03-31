import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import Met from './Met';

export default function App() {
  const [times, setTimes] = useState([]);
  const buttonPress = async () => {
    await setTimes([...times, new Date().toTimeString()]);
  };

  return (
    <>
      <View style={styles.container}>
        {times.map((time, i) => (
          <Text key={time + i}>{time}</Text>
        ))}
        <StatusBar style='auto' />
      </View>
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Pressable
            onPress={buttonPress}
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
            onPress={buttonPress}
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
  container: {
    flex: 1,
    backgroundColor: '#748',
    alignItems: 'center',
    justifyContent: 'center',
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

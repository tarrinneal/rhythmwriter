import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-web';
import React, { useState } from 'react';

export default function App() {
  const [times, setTimes] = useState([]);
  const buttonPress = async () => {
    await setTimes([...times, new Date().toTimeString()]);
  };

  return (
    <>
      <View style={styles.container}>
        {times.map((time) => (
          <Text>{time}</Text>
        ))}
        <StatusBar style='auto' />
      </View>
      <View style={styles.container}>
        <Pressable
          onPress={buttonPress}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.wrapperCustom,
          ]}
        >
          {({ pressed }) => (
            <Text style={styles.text}>{pressed ? 'Pressed!' : 'Press Me'}</Text>
          )}
        </Pressable>
      </View>
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
});

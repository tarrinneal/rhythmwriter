import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export default function Met() {
  const [tempo, setTempo] = useState(180);
  const [metOn, setMetOn] = useState(false);
  const [sound, setSound] = useState();

  const buttonPress = async () => {
    if (tempo === '') {
      alert('Please enter a tempo');
      return;
    }
    if (metOn) {
      clearInterval(met);
    } else {
      runMet();
      met = setInterval(runMet, (60 / tempo) * 1000);
    }
    setMetOn((metOn) => !metOn);
  };

  const runMet = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/beepLow.mp3')
    );
    setSound(sound);
    sound.playAsync();
  };

  const updateTempo = async (tempo) => {
    if (+tempo > 0) {
      setTempo(tempo);
    } else if (tempo === '') {
      setTempo('');
    } else {
      alert('Tempo must be greater than 0');
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={buttonPress}
        style={() => [
          {
            backgroundColor: metOn ? 'rgb(210, 230, 255)' : 'white',
          },
          styles.wrapperCustom,
        ]}
      >
        {() => <Text style={styles.text}>{metOn ? 'Stop' : 'Met'}</Text>}
      </Pressable>
      <TextInput
        style={styles.input}
        onChangeText={updateTempo}
        value={tempo.toString()}
        placeholder='Tempo'
        keyboardType='numeric'
      />
    </View>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

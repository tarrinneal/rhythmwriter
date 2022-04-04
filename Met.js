import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export default function Met({ tempo, setTempo }) {
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
        onSubmitEditing={Keyboard.dismiss}
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
    flexDirection: 'row',
    backgroundColor: '#748',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
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
  wrapperCustom: {
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

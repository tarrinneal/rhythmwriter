import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";

export default function Met({ tempo, setTempo }) {
  const [metOn, setMetOn] = useState(false);
  const [sound, setSound] = useState();

  const buttonPress = async () => {
    if (tempo === "") {
      alert("Please enter a tempo");
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
      require("./assets/beepLow.mp3")
    );
    setSound(sound);
    sound.playAsync();
  };

  const updateTempo = async (tempo) => {
    if (+tempo > 0) {
      setTempo(tempo);
    } else if (tempo === "") {
      setTempo("");
    } else {
      alert("Tempo must be greater than 0");
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
    // <View style={styles}>
    <View style={styles.metContainer}>
      <Pressable
        onPress={buttonPress}
        style={() => [
          {
            backgroundColor: metOn ? "rgb(210, 230, 255)" : "white",
          },
          styles.wrapperCustom,
        ]}
      >
        {() => <Text style={styles.text}>{metOn ? "Stop" : "Play"}</Text>}
      </Pressable>
      <TextInput
        style={styles.input}
        onChangeText={updateTempo}
        onSubmitEditing={Keyboard.dismiss}
        value={tempo.toString()}
        placeholder="Tempo"
        keyboardType="numeric"
      ></TextInput>
    </View>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    height: "20%",
  },
  text: {
    color: "white",
  },
  input: {
    fontSize: 50,
    color: "white",
    height: 40,
    margin: 12,
    maxWidth: 90,
  },
  wrapperCustom: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  metContainer: {
    backgroundColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 100,
    marginRight: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "white",
  },
});

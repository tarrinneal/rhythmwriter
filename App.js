import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import Met from "./Met";

const noteValues = {
  1: "𝅘𝅥",
  0.75: "𝅘𝅥𝅮.",
  0.666: "3𝅘𝅥",
  0.5: "𝅘𝅥𝅮",
  0.333: "3𝅘𝅥𝅮",
  0.25: "𝅘𝅥𝅯",
  0.166: "3𝅘𝅥𝅯",
  0.125: "𝅘𝅥𝅰",
  0.0625: "𝅘𝅥𝅱",
};

const restValues = {
  1: "𝄽",
  0.75: "𝄾𝄿",
  0.666: "3𝄽",
  0.5: "𝄾",
  0.333: "3𝄾",
  0.25: "𝄿",
  0.166: "3𝄿",
  0.125: "𝅀",
  0.0625: "𝅁",
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
      <View style={styles.appContainer}>
        <View style={styles.noteContainer}>
          {times.map((time, i) => (
            <Text key={time.hand + i}>
              {notesCompleted
                ? `${time.mod ? time.mod : ""}${time.note} ${
                    time.longRest ? time.longRest + " beats of rest " : ""
                  }${time.rest ? time.rest + " " : ""}`
                : time.hand}
            </Text>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => setTimes([])}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              },
              styles.buttons,
            ]}
          >
            {({ pressed }) => <Text style={styles.text}>Reset</Text>}
          </Pressable>
          <Pressable
            onPress={calculateNotes}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              },
              styles.buttons,
            ]}
          >
            {({ pressed }) => <Text style={styles.text}>Calculate</Text>}
          </Pressable>
        </View>
        <Met tempo={tempo} setTempo={setTempo} />

        <View style={styles.drummingContainer}>
          <View style={styles.firstButtonRow}>
            <Pressable
              onTouchStart={() => buttonPress("L", "^")}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
                styles.accentButtons,
              ]}
            >
              {({ pressed }) => <Text style={{ color: "black" }}>^L</Text>}
            </Pressable>
            <Pressable
              onTouchStart={() => buttonPress("R", "^")}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
                styles.accentButtons,
              ]}
            >
              {({ pressed }) => <Text style={{ color: "black" }}>^R</Text>}
            </Pressable>
          </View>
          <View style={styles.secondButtonRow}>
            <Pressable
              onTouchStart={() => buttonPress("L")}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
                styles.drumButtons,
              ]}
            >
              {({ pressed }) => <Text style={styles.text}>L</Text>}
            </Pressable>
            <Pressable
              onTouchStart={() => buttonPress("R")}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
                styles.drumButtons,
              ]}
            >
              {({ pressed }) => <Text style={styles.text}>R</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    height: "100%",
    // borderColor: "white",
    // borderWidth: 2,
    backgroundColor: "black",
    padding: 15,
  },
  noteContainer: {
    borderWidth: 3,
    borderColor: "gray",
    borderRadius: 20,
    height: "20%",
    backgroundColor: "white",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 30,
  },
  buttonContainer: {
    height: "10%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  notes: {
    shadowColor: "#14FF8E",
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    flexWrap: "wrap",
    height: 1,
  },
  buttons: {
    shadowColor: "#14FF8E",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    width: "43%",
    shadowOpacity: 0.75,
    shadowRadius: 15,
    borderColor: "#14FF8E",
    elevation: 5,
    borderRadius: 5,
    color: "white",
    borderWidth: 1,
    backgroundColor: "black",
    height: 40,
    minWidth: 80,
    margin: 15,
    justifyContent: "center",
    alignSelf: "center",
  },
  drummingContainer: {
    height: "50%",
    flex: 1,
    // backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  drumButtons: {
    shadowColor: "#14FF8E",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    width: "50%",
    shadowOpacity: 0.75,
    shadowRadius: 10,
    borderColor: "#14FF8E",
    // width: 180,
    height: "95%",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "black",
    // marginLeft: 10,
    // marginRight: 10,
    // marginLeft: 10,
    // marginRight: 10,
  },
  accentButtons: {
    width: "50%",
    height: "85%",
    // margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  firstButtonRow: {
    height: "30%",
    width: "90%",
    maxWidth: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // gap: 10,
  },
  secondButtonRow: {
    display: "flex",
    height: "70%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
  },
});

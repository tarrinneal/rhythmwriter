import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

// const { Accidental, Annotation } = Vex.Flow;

import Met from './Met';
import Music from './Music';

const noteValues = {
  1: ['q'],
  0.75: ['8', 'd'],
  0.666: ['q', 3],
  0.5: ['8'],
  0.333: ['8', 3],
  0.25: ['16'],
  0.166: ['16', 3],
  0.125: ['32'],
  0.0625: ['64'],
};

const noteOrder = [1, 0.75, 0.666, 0.5, 0.333, 0.25, 0.166, 0.125, 0.0625];

const noteRounder = (num) => {
  if (num < 0.01) {
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
  const [calculatedTimes, setCalculatedTimes] = useState([]);
  const [tempo, setTempo] = useState(180);
  const [notesCompleted, setNotesCompleted] = useState(false);
  const [tsNum, setTsNum] = useState(4);
  const [tsDenum, setTsDenum] = useState(4);

  const buttonPress = async (hand, mod) => {
    await setTimes([
      ...times,
      { hand, mod, time: global.nativePerformanceNow() },
    ]);
    await setNotesCompleted(false);
  };

  const reset = () => {
    setTimes([]);
    setCalculatedTimes([]);
    setNotesCompleted(false);
  };

  const calculateNotes = async () => {
    let tempS = 60 / tempo;
    const newTimes = [];
    times.forEach((time, i) => {
      let dif = times[i + 1] ? times[i + 1].time - time.time : tempS * 1000;
      let difS = dif / 1000;
      let unround = difS / tempS;
      let remain = 0;
      let longRest = 0;
      if (unround > 1) {
        let remainder = unround - 1;
        unround = 1;
        longRest = Math.floor(remainder);
        remain = remainder - longRest < 0.2 ? 0 : remainder - longRest;
      }
      let round = noteRounder(unround);
      let [note, ...mods] = noteValues[round];
      console.log(mods, time.mod);
      if (time.mod) {
        mods.push(...time.mod);
      }

      let rest = noteRounder(remain);

      newTimes.push({
        ...time,
        round,
        note,
        mod: mods,
      });
      if (rest) {
        let [note, ...mod] = noteValues[rest];
        newTimes.push({
          round: rest,
          note: note + 'r',
          mod,
        });
      }

      while (longRest > 0) {
        newTimes.push({
          round: 1,
          note: 'qr',
        });
        longRest--;
      }
    });

    const bars = groupByBar(newTimes);
    setCalculatedTimes(bars);
  };

  groupByBar = (times) => {
    const barLen = (tsNum / tsDenum) * 4;
    let bars = [];
    let bar = [];
    let barLeft = barLen;

    times.forEach((time, i) => {
      if (barLeft <= 0) {
        bars.push(bar);
        bar = [];
        barLeft = barLen;
      }
      if (barLeft > time.round) {
        bar.push(time);
        barLeft -= time.round;
      } else {
        let diff = noteRounder(time.round - barLeft);
        let [note, ...diffMod] = noteValues[diff];
        while (barLeft > 0) {
          const next = addNextNote(bar, barLeft, time);
          bar.push(next);
          barLeft = noteRounder(barLeft - next.round);
        }
        times.splice(i + 1, 0, {
          ...time,
          round: diff,
          hand: undefined,
          mod: diffMod,
          note: note + 'r',
        });
      }
    });
    if (bar.length > 0) {
      const remain = [];
      while (barLeft > 0) {
        if (barLeft > 1) {
          remain.push({
            round: 1,
            note: 'qr',
          });
          barLeft -= 1;
        } else {
          const next = addNextNote(bar, barLeft, null, true);
          bar.push(next);
          barLeft = noteRounder(barLeft - next.round);
        }
      }
      bar.push(...remain);
      bars.push(bar);
    }
    return bars;
  };

  const addNextNote = (bar, barLeft, oldNote = null, rest = false) => {
    let r = rest ? 'r' : '';
    let hand = oldNote ? oldNote.hand : undefined;
    if (barLeft <= 0) {
      return;
    }

    if (barLeft >= 1) {
      return {
        round: 1,
        note: 'q' + r,
        hand,
      };
    }

    if (barLeft % 0.5 === 0) {
      return {
        round: 0.5,
        note: '8' + r,
        hand,
      };
    }

    if (barLeft % 0.25 === 0) {
      return {
        round: 0.25,
        note: '16' + r,
        hand,
      };
    }

    if (barLeft % 0.125 === 0) {
      return {
        round: 0.125,
        note: '32' + r,
        hand,
      };
    }

    if (barLeft % 0.0625 === 0) {
      return {
        round: 0.0625,
        note: '64' + r,
        hand,
      };
    }

    if (barLeft >= 0.666) {
      return {
        round: 0.666,
        note: 'q' + r,
        hand,
        mod: [3],
      };
    }

    if (barLeft >= 0.333) {
      return {
        round: 0.333,
        note: '8' + r,
        hand,
        mod: [3],
      };
    }

    if (barLeft >= 0.166) {
      return {
        round: 0.166,
        note: '16' + r,
        hand,
        mod: [3],
      };
    }

    return {
      round: 0.0625,
      note: '32' + r,
      hand,
    };
  };

  return (
    <>
      <View style={styles.appContainer}>
        <View style={styles.noteContainer}>
          {calculatedTimes.length > 0
            ? calculatedTimes.map((bar, barNum) => (
                <Music
                  bar={bar}
                  barNum={barNum}
                  tsNum={tsNum}
                  tsDenum={tsDenum}
                />
              ))
            : times.map((time, i) => (
                <Text key={time.hand + i}>
                  {notesCompleted
                    ? `${time.mod ? time.mod : ''}${time.note} ${
                        time.longRest ? time.longRest + ' beats of rest ' : ''
                      }${time.rest ? time.rest + ' ' : ''}`
                    : time.hand}
                </Text>
              ))}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={reset}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
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
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
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
              onTouchStart={() => buttonPress('L', '>')}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                },
                styles.accentButtons,
              ]}
            >
              {({ pressed }) => <Text style={{ color: 'black' }}>{'>'}L</Text>}
            </Pressable>
            <Pressable
              onTouchStart={() => buttonPress('R', '>')}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                },
                styles.accentButtons,
              ]}
            >
              {({ pressed }) => <Text style={{ color: 'black' }}>{'>'}R</Text>}
            </Pressable>
          </View>
          <View style={styles.secondButtonRow}>
            <Pressable
              onTouchStart={() => buttonPress('L')}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                },
                styles.drumButtons,
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
    height: '100%',
    // borderColor: "white",
    // borderWidth: 2,
    backgroundColor: 'white',
    padding: 15,
  },
  noteContainer: {
    borderWidth: 3,
    borderColor: 'gray',
    borderRadius: 20,
    height: '20%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 30,
  },
  buttonContainer: {
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  notes: {
    shadowColor: '#14FF8E',
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    flexWrap: 'wrap',
    height: 1,
  },
  buttons: {
    shadowColor: '#14FF8E',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    width: '43%',
    shadowOpacity: 0.75,
    shadowRadius: 15,
    borderColor: '#14FF8E',
    elevation: 5,
    borderRadius: 5,
    color: 'white',
    borderWidth: 1,
    backgroundColor: 'black',
    height: 40,
    minWidth: 80,
    margin: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  drummingContainer: {
    height: '50%',
    flex: 1,
    // backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  drumButtons: {
    shadowColor: '#14FF8E',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    width: '50%',
    shadowOpacity: 0.75,
    shadowRadius: 10,
    borderColor: '#14FF8E',
    // width: 180,
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: 'black',
    // marginLeft: 10,
    // marginRight: 10,
    // marginLeft: 10,
    // marginRight: 10,
  },
  accentButtons: {
    width: '50%',
    height: '85%',
    // margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
  },
  firstButtonRow: {
    height: '30%',
    width: '90%',
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // gap: 10,
  },
  secondButtonRow: {
    display: 'flex',
    height: '70%',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

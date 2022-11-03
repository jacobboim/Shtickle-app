import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  Button,
  Alert,
  Share,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { colors, colorsToEmoji } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { SlideInDown, SlideInLeft } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import "@expo/match-media";

import { useMediaQuery } from "react-responsive";
const Number = ({ number, label }) => (
  <View style={styles.numberCnt}>
    <Text style={styles.topText}>{number}</Text>
    <Text style={styles.bottomText}>{label}</Text>
  </View>
);

const GuessDistributionLine = ({ position, amount, percentage }) => {
  return (
    <View style={styles.GuessDistributionLineCnt}>
      <Text style={styles.GuessDistributionText}>{position}</Text>
      <View
        style={{
          alignSelf: "stretch",
          padding: 5,
          margin: 5,
          backgroundColor: colors.grey,
          width: `${percentage}%`,
          minWidth: "7%",
        }}
      >
        <Text style={styles.GuessDistributionText}>{amount}</Text>
      </View>
    </View>
  );
};

const GuessDistribution = ({ distribution }) => {
  if (!distribution) {
    return null;
  }

  const sum = distribution.reduce((total, dist) => dist + total, 0);
  return (
    <>
      <Text style={styles.subTitle}>GUESS DISTRIBUTION</Text>

      <View style={styles.guessCnt}>
        {distribution.map((dist, index) => (
          <GuessDistributionLine
            key={index}
            position={index + 1}
            amount={dist}
            percentage={(dist / sum) * 100}
          />
        ))}
      </View>
    </>
  );
};

const EndScreens = ({
  won = false,
  rows,
  getCellBGColor,
  changeGameState,
  onRestart,
  empojiListForShare,
  navigation,
  solution,
  // showToast,
}) => {
  const [timer, setTimer] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [maxSteak, setMaxSteak] = useState(0);
  const [distribution, setDistribution] = useState(null);
  const [selected, setSelected] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [reveal, setReveal] = useState(false);
  const { navigate, reset } = useNavigation();
  const [lastWord, setLastWord] = useState(null);

  useEffect(() => {
    readState();
  }, [changeGameState]);

  const onShare = async () => {
    // const textMap = rows
    //   .map((row, i) =>
    //     row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
    //   )
    //   .filter((row) => row)
    //   .join("\n");
    const textMap = empojiListForShare;
    const getRowLength = rows.map((row) => row.length);
    const getIndexZero = getRowLength[0];

    const changeText = () => {
      if (getIndexZero === 6 && won === true) {
        return `${textMap} \n🟩🟩🟩🟩🟩🟩 `;
      } else if (getIndexZero === 5 && won === true) {
        return `${textMap} \n🟩🟩🟩🟩🟩 `;
      } else if (getIndexZero === 6 && won !== "won") {
        return `${textMap} \n⬛⬛⬛⬛⬛⬛ `;
      } else if (getIndexZero === 5 && won !== "won") {
        return `${textMap} \n⬛⬛⬛⬛⬛ `;
      } else {
        return `${textMap}`;
      }
    };

    // console.log(changeText(), "textMap");
    try {
      const result = await Share.share({
        message: `Shtickle results for the word: ${lastWord} \n ${changeText()}`,
        url: changeText(),
        // message: `Shtickle results for the word: ${lastWord} \n ${empojiListForShare}`,
        // url: empojiListForShare,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    // const updateTime = () => {
    //   const now = new Date();
    //   // const tommorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    //   const tommorrow = new Date(
    //     now.getFullYear(),
    //     now.getMonth(),
    //     now.getDate() + 1
    //   );

    //   setTimer((tommorrow - now) / 1000);
    // };
    const updateTime = () => {
      const now = new Date();
      const nowSeconds = now.getSeconds();
      const oneMinute = nowSeconds + 60;
      let hours = Math.floor(
        (nowSeconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((nowSeconds % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((nowSeconds % (1000 * 60)) / 1000);

      const tommorrow = new Date(nowSeconds + 90);
      // const tommorrow = new Date(
      //   now.getFullYear(),
      //   now.getMonth(),
      //   now.getDate() + 1
      // );
      // console.log(nowSeconds, "nowSeconds");
      // console.log(tommorrow, "tomorrow");

      setTimer(oneMinute - nowSeconds);
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = () => {
    const hours = Math.floor(timer / (60 * 60));
    const minutes = Math.floor((timer % (60 * 60)) / 60);
    const seconds = Math.floor(timer % 60);
    return `${hours}:${minutes}:${seconds}`;
  };

  const readState = async () => {
    const dataString = await AsyncStorage.getItem(`@game`);
    let data;
    try {
      data = JSON.parse(dataString);
      //   console.log(data);
    } catch (e) {
      console.log("error reading state", e);
    }
    const keys = Object.keys(data);
    const values = Object.values(data);
    setPlayed(keys.length);
    //get the last work

    // console.log(values[values.length - 1], "values");
    const getLastEntry = values[values.length - 1];
    const getlastWord = getLastEntry.word;
    setLastWord(getlastWord);
    console.log(getlastWord, " this is last word");

    const numberOfWins = values.filter(
      (game) => game.gameState === "won"
    ).length;
    setWinRate(Math.floor((100 * numberOfWins) / keys.length));

    let _curStreak = 0;
    let prevDay = 0;
    let maxStreak = 0;
    keys.forEach((key) => {
      const day = parseInt(key.split("-")[4]);
      const hour = parseInt(key.split("-")[5]);
      const keys = Object.values(key);
      const changeToString = keys.map((key) => key[0]).join("");

      console.log(changeToString, "dafsdy");
      if (data[key].gameState === "won" && _curStreak === 0) {
        _curStreak += 1;
      } else if (
        data[key].gameState === "won" &&
        prevDay + 1 === changeToString
      ) {
        _curStreak += 1;
      } else {
        if (_curStreak > maxStreak) {
          maxStreak = _curStreak;
        }
        _curStreak = data[key].gameState === "won" ? 1 : 0;
      }
      prevDay = changeToString;
    });
    setCurStreak(_curStreak);
    setMaxSteak(maxStreak);

    //guess distribution
    const dist = [0, 0, 0, 0, 0, 0];
    values.map((game) => {
      if (game.gameState === "won") {
        const tries = game.rows.filter((row) => row[0]).length;
        dist[tries] = dist[tries] + 1;
      }
    });
    setDistribution(dist);
  };

  const Ref = useRef(null);

  // The state for our timer
  const [timers, setTimers] = useState("00:00:00");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimers = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimers(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    setTimers("00:00:60");

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimers(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button
  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  const handleNewGame = () => {
    if (timers === "00:00:00") {
      onRestart();
    } else if (timers !== "00:00:00") {
      timerDone();
    }
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: `The word was: ${lastWord}`,
      // text2: `${word}`,
      visibilityTime: 2800,
      topOffset: 200,
    });
  };

  const timerDone = () => {
    Toast.show({
      type: "error",
      text1: `Please wait for the timer below to reset`,
      // text2: `while the timer resets`,
      visibilityTime: 2000,
      topOffset: 150,
    });
  };

  // console.log(lastWord, "last word is here:     ");
  const isMobile = useMediaQuery({ query: "(max-width: 1290px)" });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text
        entering={SlideInLeft.delay(150).springify().mass(0.5)}
        style={[
          isMobile ? styles.titleIphone : styles.titleIpad,
          ,
          { color: won ? "green" : "red", fontWeight: won ? "bold" : "300" },
        ]}
      >
        {won ? "You Won!" : "Try Again Soon"}
      </Animated.Text>
      {won ? (
        <Text></Text>
      ) : (
        <Pressable
          onPress={showToast}
          onTouchStart={() => setReveal(!reveal)}
          onTouchEnd={() => setReveal(false)}
          //   flex: 1,
          style={{
            backgroundColor: reveal ? "#F56B5E" : "#FD1E08",
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            height: 39,
            width: "29%",
            marginTop: 2,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Reveal Word
          </Text>
        </Pressable>
      )}

      <Animated.View
        entering={SlideInLeft.delay(250).springify().mass(0.5)}
        style={{
          width: " 100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 90,
        }}
      >
        <Text style={styles.subTitle}>STATISTICS</Text>

        <View style={styles.row}>
          <Number number={played} label={"Played"} />
          <Number number={winRate} label={"Win %"} />
          {/* <Number number={curStreak} label={"Curr Streak"} />
          <Number number={maxSteak} label={"Max Streak"} /> */}
        </View>
      </Animated.View>

      <Animated.View
        entering={SlideInLeft.delay(300).springify().mass(0.5)}
        style={{ width: "98%" }}
      >
        {/* <GuessDistribution distribution={distribution} /> */}
      </Animated.View>

      <Animated.View
        entering={SlideInLeft.delay(330).springify().mass(0.5)}
        style={{ flexDirection: "row", padding: 10, width: "40%" }}
      >
        <Pressable
          onPress={onShare}
          onTouchStart={() => setSelected(!selected)}
          onTouchEnd={() => setSelected(false)}
          style={{
            flex: 1,
            backgroundColor: selected ? "#3985EF" : "#0064f0",
            borderRadius: 25,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              color: colors.lightgrey,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 21,
              marginRight: 10,
            }}
          >
            Share
          </Text>

          <Feather name="share-2" size={22} color="white" />
        </Pressable>
      </Animated.View>
      {/* <Button title="Play Again!" onPress={handleNewGame} color="white" /> */}

      <Animated.View
        entering={SlideInLeft.delay(360).springify().mass(0.5)}
        style={{ alignItems: "center", marginTop: 150 }}
      >
        <Text style={{ color: colors.lightgrey }}>Next Shtickle</Text>
        <Text
          style={{
            color: colors.lightgrey,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          {timers}
          {/* {formatSeconds()} */}
        </Text>
        <Pressable
          onPress={handleNewGame}
          onTouchStart={() => setPlayAgain(!playAgain)}
          onTouchEnd={() => setPlayAgain(false)}
          //   flex: 1,
          style={{
            backgroundColor: timers === "00:00:00" ? "#0064f0" : "#24335D",

            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            height: 60,
            width: 200,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: timers === "00:00:00" ? "white" : "#4B68B8",

              fontSize: 25,
            }}
          >
            Play Again!
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10172a",
    alignItems: "center",
    width: "100%",
  },
  titleIpad: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
    marginVertical: 90,
  },

  titleIphone: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 25,
    color: colors.lightgrey,
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  topText: {
    fontSize: 38,
    color: colors.lightgrey,
    fontWeight: "bold",
  },
  bottomText: {
    color: colors.lightgrey,
    fontSize: 18,
  },

  numberCnt: {
    alignItems: "center",
    margin: 10,
    width: "25%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  GuessDistributionLineCnt: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  GuessDistributionText: {
    color: colors.lightgrey,
  },
  GuessDistributionLineBar: {
    alignSelf: "stretch",
    backgroundColor: colors.grey,
    margin: 5,
    padding: 5,
  },
  guessCnt: {
    width: "100%",
    padding: 20,
  },
});

export default EndScreens;

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { colors, colorsToEmoji } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { SlideInDown, SlideInLeft } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

const EndScreen = ({
  won = false,
  rows,
  getCellBGColor,
  changeGameState,
  onRestart,
}) => {
  const [timer, setTimer] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [maxSteak, setMaxSteak] = useState(0);
  const [distribution, setDistribution] = useState(null);
  const [selected, setSelected] = useState(false);
  const { navigate, reset } = useNavigation();

  useEffect(() => {
    console.log(changeGameState, "changeGameStafsdftes");
    readState();
  }, [changeGameState]);

  const share = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");

    const textToShare = `Shtickle \n ${textMap}`;

    // Clipboard.setString(textToshare);
    // Clipboard.setStringAsync(textToShare);
    Alert.alert("Copied to clipboard!");
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
      console.log(data);
    } catch (e) {
      console.log("error reading state", e);
    }
    const keys = Object.keys(data);
    const values = Object.values(data);
    setPlayed(keys.length);

    const numberOfWins = values.filter(
      (game) => game.gameState === "won"
    ).length;
    setWinRate(Math.floor((100 * numberOfWins) / keys.length));

    let _curStreak = 0;
    let prevDay = 0;
    let maxStreak = 0;
    keys.forEach((key) => {
      const day = parseInt(key.split("-")[1]);
      if (data[key].gameState === "won" && _curStreak === 0) {
        _curStreak += 1;
      } else if (data[key].gameState === "won" && prevDay + 1 === day) {
        _curStreak += 1;
      } else {
        if (_curStreak > maxStreak) {
          maxStreak = _curStreak;
        }
        _curStreak = data[key].gameState === "won" ? 1 : 0;
      }
      prevDay = day;
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

  //new timer
  // We need ref in this, because we are dealing
  // with JS setInterval to keep track of it and
  // stop it when needed
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
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
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
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimers("00:00:60");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
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

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
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
      changeGameState("playing");
    } else if (timers !== "00:00:00") {
      Alert.alert(
        "Please wait",
        "for the timer to be reset",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          // { text: "OK", onPress: () => changeGameState("playing") },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text
        entering={SlideInLeft.delay(150).springify().mass(0.5)}
        style={styles.title}
      >
        {won ? "You Won!" : "Try Again Soon"}
      </Animated.Text>

      <Animated.View
        entering={SlideInLeft.delay(250).springify().mass(0.5)}
        style={{
          width: " 100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.subTitle}>STATISTICS</Text>

        <View style={styles.row}>
          <Number number={played} label={"Played"} />
          <Number number={winRate} label={"Win %"} />
          <Number number={curStreak} label={"Curr Streak"} />
          <Number number={maxSteak} label={"Max Streak"} />
        </View>
      </Animated.View>

      <Animated.View
        entering={SlideInLeft.delay(300).springify().mass(0.5)}
        style={{ width: "98%" }}
      >
        <GuessDistribution distribution={distribution} />
      </Animated.View>

      <Animated.View
        entering={SlideInLeft.delay(330).springify().mass(0.5)}
        style={{ flexDirection: "row", padding: 10 }}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
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
        </View>
        <Pressable
          onPress={share}
          onTouchStart={() => setSelected(!selected)}
          onTouchEnd={() => setSelected(false)}
          style={{
            flex: 1,
            backgroundColor: selected ? "#91C070" : colors.primary,
            borderRadius: 25,
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
              fontSize: 18,
              marginRight: 10,
            }}
          >
            Share
          </Text>

          <Feather name="share-2" size={24} color="white" />
        </Pressable>
      </Animated.View>
      <Button title="Play Again" onPress={handleNewGame} />
      <Button title="Restart" onPress={onRestart} />
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
  title: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 20,
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

export default EndScreen;

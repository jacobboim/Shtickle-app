import { useState, useEffect, useContext, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  Alert,
  Pressable,
  TouchableOpacity,
  Switch,
  Modal,
  Easing,
  Image,
  ActivityIndicator,
  Animated as AnimatedNative,
} from "react-native";
import * as Linking from "expo-linking";

import { ThemeContext } from "../config/themeContext";
import { colors, CLEAR, ENTER, colorsToEmoji } from "../constants";
// import Keyboard from "./src/components/Keyboard";
import Keyboard from "../components/Keyboard";
import useWordBank from "../components/useWordBank";
import words from "../components/words";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { ICONS } from "../../assets";
import styles from "../components/ShtickleGame.styles";
import { copyArray, getDayOfTheYear, getYear, getDayKey } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EndScreen from "../components/EndScreen";
import { useNavigation } from "@react-navigation/native";
import EndScreens from "./EndScreens";
import Animated, {
  SlideInDown,
  SlideInLeft,
  ZoomIn,
  FlipInEasyY,
} from "react-native-reanimated";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../config/themeContext";

//get random number between 0 and 100
const getRandomNumber = () => {
  return Math.floor(Math.random() * 107);
};

const dayOfTheYear = getDayOfTheYear();
const dayKey = getDayKey();

const randomNumber = getRandomNumber();

const Game = () => {
  // AsyncStorage.removeItem("@game");
  const NUMBER_OF_TRIES = 6;
  const { getNewWord, getAWord, wordBankCheck } = useWordBank();
  const [solution, setSolution] = useState("");
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [randomNum, setRandomNum] = useState(null);
  const [word, setWord] = useState(null);
  const [stateLetters, setStateLetters] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [mode, setMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ourWebsite, setOurWebsite] = useState(false);
  const [currentWord, setCurrentWord] = useState([]);
  const [history, setHistory] = useState([]); // each guess is a string
  const [newGamePressesed, setNewGamePressesed] = useState(false);
  const [emailPress, setEmailPress] = useState(false);
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(0).fill(""))
  );

  const theme = useContext(themeContext);

  const translation = useRef(new AnimatedNative.Value(0)).current;
  //reset game
  useEffect(() => {
    AnimatedNative.loop(
      AnimatedNative.timing(translation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,

        useNativeDriver: true,
      })
    ).start();
  }, [gameState, randomNum]);

  useEffect(() => {
    // setRandomNum(getNewWord);
    const getNumPlzWord = getNewWord();

    console.log(getNumPlzWord, " dsfwr23");

    const word = words[getNewWord()];
    setWord(word);
    const emptyArray = [];
    emptyArray.push(word);

    const letters = word.split(""); // ["h", "e", "l", "l", "o"]
    setStateLetters(letters);
  }, [gameState, randomNum]);
  console.log(currentWord, "current wossssrd");

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  useEffect(() => {
    if (loaded) {
      persistState();
    }
  }, [rows, curRow, curCol, gameState, randomNum]);

  useEffect(() => {
    // setCurrentWord(word);

    readState();
  }, []);

  const resetGame = () => {
    setNewGamePressesed(true);
    setGameState("playing");
    setCurRow(0);
    setCurCol(0);

    // setRandomNum(getNewWord);
    setRows(
      new Array(NUMBER_OF_TRIES).fill(new Array(stateLetters?.length).fill(""))
    );
  };

  const EndResetGame = () => {
    setNewGamePressesed(false);
    setGameState("playing");
  };

  console.log(stateLetters, "stateLetters");

  const persistState = async () => {
    const dataForToday = {
      rows,
      curRow,
      curCol,
      gameState,
      randomNum,
      word,
    };

    try {
      let existingStateString = await AsyncStorage.getItem("@game");
      let existingState = existingStateString
        ? JSON.parse(existingStateString)
        : {};

      existingState[dayKey] = dataForToday;

      const dataString = JSON.stringify(existingState);
      // console.log(dataString, "dataString");
      await AsyncStorage.setItem(`@game`, dataString);
    } catch (e) {
      console.log("error saving state", e);
    }
  };

  const readState = async () => {
    const dataString = await AsyncStorage.getItem(`@game`);
    // console.log(dataString);
    try {
      const data = JSON.parse(dataString);
      // console.log(data, "im the dataaaa");
      const day = data[dayKey];
      setRows(day.rows);
      setCurRow(day.curRow);
      setCurCol(day.curCol);
      setGameState(day.gameState);
      setRandomNum(day.randomNum);
      setWord(day.word);
    } catch (e) {
      console.log("error reading state", e);
    }

    setLoaded(true);
  };

  // const word = words[randomNum];
  // console.log(word);

  // const letters = word.split(""); // ["h", "e", "l", "l", "o"]

  const checkGameState = () => {
    if (checkIfWon() && gameState !== "won") {
      setTimeout(() => {
        setGameState("won");
      }, 1000);
    } else if (checkIfLost() && gameState !== "lost") {
      setTimeout(() => {
        setGameState("lost");
      }, 1000);
    }
  };

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === stateLetters[i]);
  };

  const checkIfLost = () => {
    return !checkIfWon() && curRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        const emptyArray = [];
        emptyArray.push((rows[curRow] = updatedRows[curRow]));
        // const getword = (rows[curRow][curCol] = key);
        const flatten = emptyArray.flat();
        const join = flatten.join("");

        setHistory((prevHistory) => {
          return [...prevHistory, join];
        });

        if (!wordBankCheck.includes(join)) {
          console.log("not in wordbank");
          showToast();
          // Alert.alert("Not in wordbank");
        } else if (history.includes(join)) {
          console.log("you already tried that word.");
          // Alert.alert("ALREADY USED");
          showToastAlreadyUsed();
        } else {
          setCurRow(curRow + 1);
          setCurCol(0);
          console.log("Valid Word");
          // setCurrentWord(join);
        }
        console.log(join, "updatedRosdfsdsfgsgergews");
      }

      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row >= curRow) {
      return theme.black;
    }

    if (letter === stateLetters[col]) {
      return theme.primary;
    }

    if (stateLetters.includes(letter)) {
      return theme.secondary;
    }

    return theme.darkgrey;
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  };

  const greenCaps = getAllLettersWithColor(theme.primary);
  const yellowCaps = getAllLettersWithColor(theme.secondary);
  const greyCaps = getAllLettersWithColor(theme.darkgrey);
  const getCellStyle = (i, j) => [
    styles.cell,
    {
      borderColor: isCellActive(i, j) ? theme.lightgrey : theme.darkgrey,
      backgroundColor: getCellBGColor(i, j),
    },
  ];

  if (!loaded) {
    return <ActivityIndicator size="large" color={theme.primary} />;
  }
  const endScreenReset = () => {
    setNewGamePressesed(false);
    setGameState("playing");
    setCurRow(0);
    setCurCol(0);
    setRandomNum(getNewWord);
    setRows(
      new Array(NUMBER_OF_TRIES).fill(new Array(stateLetters?.length).fill(""))
    );
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: `Not a valid word`,
      // text2: `${word}`,
      visibilityTime: 1500,
      topOffset: 100,
    });
  };

  const showToastAlreadyUsed = () => {
    Toast.show({
      type: "success",
      text1: `Already Used`,
      // text2: `${word}`,
      visibilityTime: 1500,
      topOffset: 100,
    });
  };

  if (gameState !== "playing") {
    return (
      <EndScreens
        won={gameState === "won"}
        rows={rows}
        onRestart={() => EndResetGame()}
        getCellBGColor={getCellBGColor}
        changeGameState={(gameState) => setGameState(gameState)}
        solution={word}
        // showToast={showToast}
      />
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <StatusBar style="light" />
      <View
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <AntDesign
          name="infocirlceo"
          size={32}
          color={theme.info}
          onPress={() => setModalVisible(true)}
        />
        {/* <Text style={[styles.title, { color: theme.title }]}>SHTICKLE</Text> */}
        <Image
          source={ICONS.shticklePng}
          style={{
            width: "50%",
            height: "87%",
            marginBottom: 3,
            marginTop: 10,
          }}
        />

        {/* <AnimatedNative.Text
          entering={SlideInLeft.delay(500)}
          style={[
            styles.title,
            {
              color: theme.title,
              transform: [
                // { translateX: translation },
                {
                  rotate: translation.interpolate({
                    inputRange: [0, 10],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        > */}
        {/* SHTICKLE */}
        {/* </AnimatedNative.Text> */}
        {/* <Switch
          // style={{ padding÷Left: "0%" }}
          value={mode}
          trackColor={{ false: "white", true: "lightgreen" }}
          thumbColor={mode ? "white" : "black"}
          ios_backgroundColor="lightgreen"
          onValueChange={(value) => {
            setMode(value);
            EventRegister.emit("changeTheme", value);
          }}
        /> */}
        <Pressable
          onPress={() => {
            setMode(!mode);
            EventRegister.emit("changeTheme", mode);
          }}
        >
          <AnimatedNative.View
            style={[
              styles.title,
              {
                color: theme.title,
                transform: [
                  // { translateX: translation },
                  {
                    rotate: translation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={mode === true ? ICONS.blackSun : ICONS.whiteSun}
            />
          </AnimatedNative.View>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>HOW TO PLAY</Text>
              <Text style={{ textAlign: "center", fontSize: 15 }}>
                Guess the <Text style={{ fontWeight: "bold" }}>SHTICKLE</Text>{" "}
                in 6 tries. After each guess, the color of the tiles will change
                to show how close your guess was to the word.
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.modalCellCorrect}>S</Text>
                <Text style={styles.modalCell}>H</Text>
                <Text style={styles.modalCell}>T</Text>
                <Text style={styles.modalCell}>I</Text>
                <Text style={styles.modalCell}>C</Text>
                <Text style={styles.modalCell}>K</Text>
              </View>
              <Text style={styles.modalInfoLetter}>
                The letter S is in the word and in the correct spot.
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.modalCell}>S</Text>
                <Text style={styles.modalCell}>I</Text>
                <Text style={styles.modalCell}>M</Text>
                <Text style={styles.modalCell}>C</Text>
                <Text style={styles.modalCellInWord}>H</Text>
                <Text style={styles.modalCell}>A</Text>
              </View>
              <Text style={styles.modalInfoLetter}>
                The letter H is in the word but in the wrong spot.
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.modalCell}>M</Text>
                <Text style={styles.modalCell}>I</Text>
                <Text style={styles.modalCellNotWord}>K</Text>
                <Text style={styles.modalCell}>V</Text>
                <Text style={styles.modalCell}>A</Text>
                <Text style={styles.modalCell}>H</Text>
              </View>
              <Text style={styles.modalInfoLetter}>
                The letter K is not in the word.
              </Text>

              {/* <Text>
                Contact Developer:
                <Button
                  onPress={() =>
                    Linking.openURL(
                      "mailto:jacob.boim.development@gmail.com"
                    ).catch((error) => {
                      console.log(error);
                    })
                  }
                  title="jacob.boim.development@gmail.com"
                />
              </Text> */}

              <Pressable
                onTouchStart={() => setEmailPress(!emailPress)}
                onTouchEnd={() => setEmailPress(false)}
                style={{
                  marginTop: 10,
                }}
                onPress={() =>
                  Linking.openURL(
                    "mailto:jacob.boim.development@gmail.com"
                  ).catch((error) => {
                    console.log(error);
                  })
                }
              >
                <Text>
                  Contact Developer:{" "}
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      backgroundColor: emailPress ? "darkgray" : "white",
                    }}
                  >
                    jacob.boim.development@gmail.com
                  </Text>{" "}
                </Text>
              </Pressable>

              {/* <Pressable
                onTouchStart={() => setOurWebsite(!ourWebsite)}
                onTouchEnd={() => setOurWebsite(false)}
                style={{
                  marginTop: 20,
                  backgroundColor: ourWebsite ? "darkgray" : "lightgray",

                  borderRadius: 18,
                  padding: 9,
                }}
                onPress={() =>
                  Linking.openURL(
                    "https://shtickle-wordle-clone.netlify.app/"
                  ).catch((error) => {
                    console.log(error);
                  })
                }
              >
                <Text>Our Website</Text>
              </Pressable> */}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {newGamePressesed ? (
        <Text style={styles.title}></Text>
      ) : (
        <>
          <Pressable
            onPress={resetGame}
            onTouchStart={() => setPlayAgain(!playAgain)}
            onTouchEnd={() => setPlayAgain(false)}
            style={{
              backgroundColor: playAgain ? "darkgray" : "#818384",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 65,
              width: "50%",
              marginTop: 30,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 28,
              }}
            >
              Start Game
            </Text>
          </Pressable>
        </>
      )}

      {newGamePressesed ? (
        <>
          <ScrollView style={styles.map}>
            {rows.map((row, i) => (
              <Animated.View
                entering={SlideInLeft.delay(i * 90)}
                key={`row-${i}`}
                style={styles.row}
              >
                {row.map((letter, j) => (
                  <>
                    {i < curRow && (
                      <Animated.View
                        entering={FlipInEasyY.delay(j * 100)}
                        key={`cell-color-${i}-${j}`}
                        style={getCellStyle(i, j)}
                      >
                        <Text
                          style={[styles.cellText, { color: theme.cellText }]}
                        >
                          {letter.toUpperCase()}
                        </Text>
                      </Animated.View>
                    )}
                    {i === curRow && !!letter && (
                      <Animated.View
                        entering={ZoomIn}
                        key={`cell-active-${i}-${j}`}
                        style={getCellStyle(i, j)}
                      >
                        <Text
                          style={[styles.cellText, { color: theme.cellText }]}
                        >
                          {letter.toUpperCase()}
                        </Text>
                      </Animated.View>
                    )}
                    {!letter && (
                      <View key={`cell-${i}-${j}`} style={getCellStyle(i, j)}>
                        <Text
                          style={[styles.cellText, { color: theme.cellText }]}
                        >
                          {letter.toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </>
                ))}
              </Animated.View>
            ))}
          </ScrollView>
          <View style={{ marginBottom: 45 }}>
            <Keyboard
              onKeyPressed={onKeyPressed}
              greenCaps={greenCaps}
              yellowCaps={yellowCaps}
              greyCaps={greyCaps}
            />
          </View>
        </>
      ) : (
        <Text style={styles.title}></Text>
      )}
    </SafeAreaView>
  );
};

export default Game;

import { View, Text, Pressable } from "react-native";
import { keys, ENTER, CLEAR, colors } from "../../constants";
import styles, { keyWidth } from "./Keyboard.styles";
import Animated, { SlideInDown } from "react-native-reanimated";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../../config/themeContext";
import { useState, useContext } from "react";

import "@expo/match-media";

import { useMediaQuery } from "react-responsive";

const Keyboard = ({
  onKeyPressed = () => {},
  greenCaps = [],
  yellowCaps = [],
  greyCaps = [],
  pressedKey = "",
}) => {
  const isLongButton = (key) => {
    return key === ENTER || key === CLEAR;
  };
  const theme = useContext(themeContext);

  const getKeyBGColor = (key) => {
    if (greenCaps.includes(key)) {
      return theme.primary;
    }
    if (yellowCaps.includes(key)) {
      return theme.secondary;
    }
    if (greyCaps.includes(key)) {
      return theme.darkgrey;
    }
    return theme.keyBoardLetterColor;
  };

  const [keyDown, setKeyDown] = useState("");

  const isTablet = useMediaQuery({ query: "(min-width: 1300px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 1290px)" });
  return (
    <Animated.View
      entering={SlideInDown.duration(1300).springify().mass(0.5)}
      style={styles.keyboard}
    >
      {keys.map((keyRow, i) => (
        <View style={styles.row} key={`row-${i}`}>
          {keyRow.map((key, index) => (
            <Pressable
              onPress={() => onKeyPressed(key)}
              onTouchStart={() => setKeyDown(key)}
              onTouchEnd={() => setKeyDown("")}
              key={key}
              style={[
                [
                  isMobile ? styles.keyIphone : styles.key,
                  { backgroundColor: theme.keyBackgroundColor },
                ],
                isLongButton(key) ? { width: keyWidth * 1.4 } : {},
                {
                  // backgroundColor: getKeyBGColor(key),
                  backgroundColor:
                    key === keyDown ? "#B6BAC2" : getKeyBGColor(key),
                },
              ]}
            >
              <Text
                style={[
                  isMobile ? styles.keyTextIphone : styles.keyText,
                  {
                    color: theme.keyLetterColor,
                  },
                ]}
              >
                {/* {console.log(keyDown, "this is keu down")} */}
                {key.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

export default Keyboard;

import { View, Text, Pressable } from "react-native";
import { keys, ENTER, CLEAR, colors } from "../../constants";
import styles, { keyWidth } from "./Keyboard.styles";
import Animated, { SlideInDown } from "react-native-reanimated";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../../config/themeContext";
import { useState, useContext } from "react";
const Keyboard = ({
  onKeyPressed = () => {},
  greenCaps = [],
  yellowCaps = [],
  greyCaps = [],
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

  return (
    <Animated.View
      entering={SlideInDown.duration(1300).springify().mass(0.5)}
      style={styles.keyboard}
    >
      {keys.map((keyRow, i) => (
        <View style={styles.row} key={`row-${i}`}>
          {keyRow.map((key) => (
            <Pressable
              onPress={() => onKeyPressed(key)}
              //   disabled={greyCaps.includes(key)}
              key={key}
              style={[
                [styles.key, { backgroundColor: theme.keyBackgroundColor }],
                isLongButton(key) ? { width: keyWidth * 1.4 } : {},
                { backgroundColor: getKeyBGColor(key) },
              ]}
            >
              <Text style={[styles.keyText, { color: theme.keyLetterColor }]}>
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

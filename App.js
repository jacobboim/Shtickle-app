import { StatusBar } from "expo-status-bar";

import { StyleSheet, Text, View, Button, Image } from "react-native";

import { useEffect, useState } from "react";
import { AppRegistry } from "react-native";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import ShtickleGame from "./src/screens/ShtickleGame";
import EndScreens from "./src/screens/EndScreens";

import TabStack from "./src/navigation/TabStack";

import { EventRegister } from "react-native-event-listeners";

import themeContext from "./src/config/themeContext";
import theme from "./src/config/theme";
import Toast, { SuccessToast, ErrorToast } from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 25,
    height: 25,
    // activeColor: "white",
    tabBarActiveTintColor: "blue",
    tabBarInactiveTintColor: "yellow",
  },
  logo: {
    width: 66,
    height: 58,
  },
});

const Stack = createNativeStackNavigator();

const App = () => {
  const [mode, setMode] = useState(true);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (data) => {
        setMode(data);
        console.log(data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });
  useEffect(() => {
    const prepare = async () => {
      // keep splash screen visible
      await SplashScreen.preventAutoHideAsync();

      // pre-load your stuff
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // hide splash screen
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  const toastConfig = {
    success: (props) => (
      <SuccessToast
        {...props}
        style={{ borderLeftColor: "red" }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        text1Style={{
          fontSize: 25,
          fontWeight: "400",
        }}
        text2Style={{
          fontSize: 25,
          fontWeight: "400",
          color: "black",
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red", width: "95%" }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        text1Style={{
          fontSize: 17,
          width: "100%",
        }}
        text2Style={{
          fontSize: 17,
          width: "100%",

          // textAlign: "center",
        }}
      />
    ),
  };
  return (
    <>
      <themeContext.Provider value={mode === true ? theme.dark : theme.light}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Shtickle" component={ShtickleGame} />
            <Stack.Screen name="EndScreens" component={EndScreens} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </themeContext.Provider>

      {/* <ShtickleGame /> */}
    </>
  );
};

AppRegistry.registerComponent(<Text>shtickle-expo</Text>, () => App);

export default App;

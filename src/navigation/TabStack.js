import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
import ShtickleGame from "../screens/ShtickleGame";
import Schedule from "../screens/Schedule";
import Search from "../screens/Search";
import More from "../screens/More";
import EndScreens from "../screens/EndScreens";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ICONS } from "../../assets";

const TabStack = () => {
  const [colors, setColor] = React.useState("#4a8f52");

  // const handlePress = () => {
  //   if (color === "#fff") {
  //     setColor("#000");
  //   }
  // };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#10172a",
          paddingBottom: 25,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          letterSpacing: 1,
          marginTop: 5,
        },
        tabBarIcon: ({ focused, color }) => {
          let name;
          if (route.name === "Shtickle") {
            name = `alpha-s-box`;
          } else if (route.name === "Contact") {
            name = `information-outline`;
          } else {
            name = `information-outline`;
          }
          return (
            <MaterialCommunityIcons
              name={name}
              size={36}
              style={{
                tintColor: color,
                color:
                  route.name === "Shtickle"
                    ? "#4a8f52"
                    : route.name === "Contact"
                    ? "white"
                    : "white",
              }}
            />
          );
        },

        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Shtickle" component={ShtickleGame} />
      <Tab.Screen name="EndScreens" component={EndScreens} />
      {/* <Tab.Screen name="Contact" component={Schedule} /> */}
    </Tab.Navigator>
  );
};

export default TabStack;

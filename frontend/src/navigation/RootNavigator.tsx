import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawingScreen } from "../screens/DrawingScreen";

export type RootStackParamList = {
  Drawing: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Drawing" component={DrawingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};




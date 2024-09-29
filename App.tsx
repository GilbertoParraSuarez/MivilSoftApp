import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/views/LoginScreen';
import DashboardScreen from './src/views/DashboardScreen';
import IniciarTrabajo from './src/views/IniciarTrabajo';
import ControlSoporteScreen from "./src/views/ControlSoporteScreen";
import FinTrabajoScreen from './src/views/FinTrabajoScreen';
import ConfirmacionScreen from './src/views/ConfirmacionScreen';
import ConfirmacionIdScreen from './src/views/ConfirmacionIdScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="IniciarTrabajo" component={IniciarTrabajo} />
        <Stack.Screen name="ControlSoporteScreen" component={ControlSoporteScreen} />
        <Stack.Screen name="FinTrabajoScreen" component={FinTrabajoScreen} />
        <Stack.Screen name="ConfirmacionScreen" component={ConfirmacionScreen} />
        <Stack.Screen name="ConfirmacionIdScreen" component={ConfirmacionIdScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

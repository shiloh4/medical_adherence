import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import PrescriptionDetails from '../screens/PrescriptionDetails';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PrescriptionDetails" component={PrescriptionDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

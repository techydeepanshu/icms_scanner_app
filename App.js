import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scaner from './src/screens/Scaner';

import ShowData from './src/DisplayData/ShowData';

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Scaner'>
        <Stack.Screen name="Scaner" component={Scaner} />
        
        <Stack.Screen name="ShowData" component={ShowData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


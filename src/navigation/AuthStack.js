import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Login from './src/screens/Login';
import Home from '../screens/Home';
import Scaner from '../screens/Scaner';
import Dropdown from '../screens/Dropdown';
import Preview from '../screens/Preview';
import ShowData from '../DisplayData/ShowData';
import ImageShow from '../screens/ImageShow';
import Login from '../screens/Login';
import Login2 from '../screens/Login2';
const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login2'>
      <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Scaner" component={Scaner} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Login2" component={Login2} options={{ headerShown: false ,gestureEnabled: false }}/>
        <Stack.Screen name="ShowData" component={ShowData} />
        <Stack.Screen
          name="Dropdown"
          component={Dropdown}
          options={{headerShown: true}}
        />
        <Stack.Screen name="Preview" component={Preview} />
        <Stack.Screen name="ImageShow" component={ImageShow} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


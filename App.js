import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Scaner from './src/screens/Scaner';
import Dropdown from './src/screens/Dropdown';
import Preview from './src/screens/Preview';
import ShowData from './src/DisplayData/ShowData';
import ImageShow from './src/screens/ImageShow';

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Scaner" component={Scaner} />
        {/*<Stack.Screen name="Login" component={Login} />*/}
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


import React,{useEffect,useState} from 'react';
import { View, Text ,StyleSheet,ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Scaner from './src/screens/Scaner';
import Dropdown from './src/screens/Dropdown';
import Preview from './src/screens/Preview';
import ShowData from './src/DisplayData/ShowData';
import ImageShow from './src/screens/ImageShow';
import Login from './src/screens/Login';
import Login2 from './src/screens/Login2';

// import Providers from './src/navigation/Providers'
// import Routes from './src/navigation/Routes'
// import { AuthProvider } from './src/navigation/AuthProvider';

import auth from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen'
import AppStack from './src/navigation/AppStack'
import AuthStack from './src/navigation/AuthStack'
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createNativeStackNavigator();


export default function App(){
  SplashScreen.hide();
  const [userAuth,setUserAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const {user,setUser} = useContext(AuthContext);
  // const [initializing,setInitializing] = useState(true)

  // const onAuthStateChanged = (user)=>{
  //     setUser(user)
  //     if(initializing) setInitializing(false)
  // }

  // useEffect(() => {
  //     // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //     // return subscriber
  //     SplashScreen.hide()
  // }, []);

  // if(initializing) return null;

  const SingOutUser = async () =>{
    const res = await auth().signOut().then(async() => {
      // Sign-out successful.
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      setIsLoading(false)
    }).catch((error) => {
      // An error happened.
      console.log(error)
      Alert.alert('Error Occured')
      setIsLoading(false)
    });
  }


  const authCredantial = async ()=>{
    setIsLoading(true)
    try {
      
      let username = await AsyncStorage.getItem('username')
      let password = await AsyncStorage.getItem('password')
  
      console.log("username : ",username)
      console.log("password : ",password)
  
      if(username!==null&&password!==null){
        const res =  await auth().signInWithEmailAndPassword(username,password)
                                         console.log("res : ",res)
                                         if(res){
                                          setUserAuth(true)
                                          setIsLoading(false)
                                         }else{
                                          setUserAuth(false)
                                          setIsLoading(false)
                                         }
                                         setIsLoading(false)
      }
      setIsLoading(false)
    } catch (error) {
      SingOutUser()
    }


  }
useEffect(() => {
  authCredantial()
}, []);


if(isLoading){
  return (
    <View style={[styles.container2, styles.horizontal]}>
    <ActivityIndicator size="large" color="black"/>
    </View>
  )
}
  return(
      userAuth ? <AppStack/> : <AuthStack/>
     
  )

}

const styles = StyleSheet.create({
  container: {
    color: "white"
  },
  text: {
    fontSize: 30,
    color: "white",
    marginTop: 70,
    textAlign: "center"
  },
  container2: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
import {
  View,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
// import MapView from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
import Dropdown from './Dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
const Home = ({navigation}) => {
  const Imagemain = require('../assets/Home_image2.png');
  const [loading, setLoading] = useState(false);

  const todropdownSupporter = () => {
    navigation.navigate('Dropdown');
    setLoading(false);
  };

  const todropdown = () => {
    setLoading(true);
    setTimeout(todropdownSupporter, 10);
  };

  const SingOutUser = async () =>{
    const res = await auth().signOut().then(async() => {
      // Sign-out successful.
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      navigation.navigate('Login2')
    }).catch((error) => {
      // An error happened.
      console.log(error)
      Alert.alert('Error Occured')
    });
  }

  return (
    <View>
            
      <View
        style={styles.container}
        title="Select Invoice"
        >
        {loading ? (<>
          <ActivityIndicator style={{marginTop:'60%'}} animating={loading} size="large" color="#0000ff" />
          <Text pointerEvents="none" style={styles.buttonText2}>
            Loading invoices Please wait...
          </Text>
          </>
        ) : (
          <ImageBackground source={Imagemain} resizeMode='cover' style={{...styles.backgroundImage,width: '100%', height: '100%' }}>
          <TouchableOpacity onPress={todropdown}>
          <View style={styles.buttonText}>
            <Text style={{fontSize:30}}>SCAN 🖨️</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={SingOutUser}>
            <View style={styles.signOut}>
              <Text style={{fontSize:18}}>Logout</Text>
            </View>
          </TouchableOpacity>
          </ImageBackground>
        )}
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    
    borderRadius: 50,
    paddingHorizontal: 100,
    paddingVertical: 10,
    backgroundColor: '#6498ed',
    borderColor: '#0000ff',
    borderWidth: 1,
    fontSize: 20,
    top: '1100%',
    alignSelf: 'center',
    color: '#fff',
  },
  buttonText2: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#000',
    padding: 13,

  },
  signOut: {
    borderRadius: 50,
    paddingHorizontal: 100,
    paddingVertical: 10,
    // backgroundColor: '#6498ed',
    borderColor: '#0000ff',
    // borderWidth: 1,
    fontSize: 20,
    top: '1550%',
    alignSelf: 'center',
    color: '#fff',
    // marginBottom:30,
   
  },
  backgroundImage: {
    // flex: 1,
    // width: null,
    // height: null,
    backgroundColor: 'red',
    opacity: 0.8,
  },
});
export default Home;

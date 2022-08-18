import React, { useState } from 'react';
import { Button, TextInput, StyleSheet,View, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {
  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    console.log(phoneNumber);
    setConfirm(!null);
    Alert.alert('it might take some time to get the code, please wait');
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log("confirmation : ",confirmation)
    setConfirm(confirmation);
    Alert.alert('code has been sent to your phone'); 
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
      console.log("code confirmed");
      navigation.navigate('Home')
    } catch (error) {
      console.log('Invalid code.');
    Alert.alert('Invalid code. Please try again.');

    }
  }

  if (!confirm) {
    return (
      <View >
      <Button

        title="Phone Number Sign In"
        onPress={() => signInWithPhoneNumber('+919050615561')}
      ></Button>
<View style={styles.space} ></View>
      <Button 
       style={styles.button}
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      ></Button>
      </View>
    );
  }

  return (
    <>
      <TextInput value={code} onChangeText={text => setCode(text)} />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
      <Button title="Go Back"onPress={()=> setConfirm(null)} />
      <Button 
       style={styles.button}
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      ></Button>


    </>
  );

}

export default Login

const styles = StyleSheet.create({

  button:{
marginLeft:20,
marginTop:20,
marginRight:10,
backgroundColor:"red",
  },

  space: {
    width: 20, // or whatever size you need
    height: 20,
  },
})
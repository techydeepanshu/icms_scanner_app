// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, BackHandler,KeyboardAvoidingView,Keyboard,ScrollView } from 'react-native';
// import CheckBox from 'react-native-check-box'
import axios from 'axios';
import auth from '@react-native-firebase/auth';

import { AuthContext } from '../navigation/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login2 = ({ navigation }) => {
    const [check, setCheck] = useState(false)
    const [loader, setLoader] = useState(false)
    const [loginLoader, setLoginLoader] = useState(false)
    const [userData, setUserData] = useState({ username: "", password: "" })



    return (
        <View style={{ backgroundColor: "#276F98", flex: 1, justifyContent: "center", alignItems: "center" }}>
            {loader ? <View style={styles.loader}><ActivityIndicator /></View> :
                <View style={{marginBottom:280}}>
                    <View>
                        <Text style={styles.text}>Scanner <Text style={styles.textlogin}>Login</Text></Text>
                        <Text style={styles.ptext}>you can reach us anytime via info@vervebot.io</Text>
                    </View>
                    <View>
                
                        <TextInput
                            style={styles.textinput}
                            placeholder="Email"
                            placeholderTextColor="grey"
                            value={userData.username}
                            autoCapitalize='none'
                            onChangeText={(e) => {
                                setUserData((prev) => {
                                    return {
                                        ...prev, username: e
                                    }
                                })
                            }}
                        />
                     
                   
                        <TextInput
                            style={styles.textinput}
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor="grey"
                            value={userData.password}
                            autoCapitalize='none'
                            onChangeText={(e) => {
                                setUserData((prev) => {
                                    return {
                                        ...prev, password: e
                                    }
                                })
                            }}
                        />
                       
                        
                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity
                                // disabled={!check}
                                onPress={async (e) => {
                                    // setLoader(true)
                                    // setTimeout(() => {
                                    //     setLoader(false)
                                    // }, 5000)
                                    try {
                                        setLoginLoader(true)
                                        if (userData.username !== "" && userData.password !== "") {
                                            // Alert.alert("login success")
                                            // setUserData({ username: "", password: "" })
                                            // AuthUser()
                                            const res = await auth().signInWithEmailAndPassword(userData.username, userData.password)
                                            console.log("res : ", res)
                                            if (res) {
                                                AsyncStorage.setItem("username", userData.username)
                                                AsyncStorage.setItem("password", userData.password)
                                                navigation.navigate('Home')
                                                setLoginLoader(false)
                                            }
                                            setLoginLoader(false)
                                            // navigation.navigate("Home")
                                        } else {
                                            Alert.alert("username and password are incorrect")
                                            setLoginLoader(false)
                                        }
                                    } catch (err) {
                                        Alert.alert("Error Occured")
                                        setLoginLoader(false)
                                    }

                                }}
                            >
                                <View style={{ ...styles.submitBtm, backgroundColor: check ? "#a0eaff" : "white" }}>

                                {loginLoader ? <ActivityIndicator color="#276F98" style={styles.loginTxt}/> :<Text style={styles.loginTxt}>Login</Text>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
      },
    text: {
        color: "#74195b",
        fontSize: 37,
        textAlign: "left",
        marginTop: 25,
        // backgroundColor:"green",
        // paddingLeft: 20,
        // borderRadius:30
        textAlign: "center",
        fontWeight: '700'
    },
    textlogin: {
        color: "white",
        fontSize: 37,
        textAlign: "left",
        marginTop: 25,
        // backgroundColor:"green",
        // paddingLeft: 20,
        // borderRadius:30
        textAlign: "center",
        fontWeight: '400'
    },
    ptext: {
        color: "white",
        fontSize: 18,
        textAlign: "left",
        marginTop: 10,
        // backgroundColor:"green",
        // paddingLeft: 20,
        textAlign: "center",
        padding: 10
    },
    textinput: {
        backgroundColor: "white",
        // width:"100%",
        // justifyContent:"center",
        marginTop: 20,
        padding: 20,
        borderRadius: 8,
        borderColor: "#ebebebdb",
        borderWidth: 0.6,
        borderColor: "black",
        color: "black",
        // placeholderTextColor:"grey" ,
        width: 320,
        fontSize:20
    },
    submitBtm: {
        color: "white",
        fontSize: 18,
        backgroundColor: "green",
        // width: "30%",
        // marginLeft: 20,
        borderRadius: 50,
        // borderColor: "#ebebebdb",
        // borderWidth: 0.6,
        paddingLeft: 80,
        paddingRight: 80,
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: "center",
        justifyContent: "center",
        marginTop: 30
    },
    loader: {
        minHeight: "100%",
        // display:'flex',
        // flex:1,
        justifyContent: "center",
        // alignItems:"center",
        position: "absolute",
        // textAlign:"center",
        alignSelf: "center",
        textAlignVertical: "center",
        marginTop: "50%",
        // backgroundColor:"white"


    },
    loginTxt:{
        fontSize:20,
        width:50,
        height:25,
    }
})

export default Login2;

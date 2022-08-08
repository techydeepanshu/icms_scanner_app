import React, { useRef, useState, useEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from "react-native"
import Permissions from 'react-native-permissions';
import PDFScanner from "@woonivers/react-native-document-scanner"
import { TesseractService } from "../services/TesserartService";
import { chooseFilter } from "../utils/filterData";

import { useRoute } from "@react-navigation/native";

// import img from "/Users/vervebot/Desktop/vs_projects/icms_scanner/Scanner/src/img/0004.jpg"

export default function Scaner({navigation}) {
  const pdfScannerElement = useRef(null)
  const [data, setData] = useState([])
  const [savedImg, setSavedImg] = useState([]);
  const [allowed, setAllowed] = useState(false)
  const [flash, setFlash] = useState(false)
  const [uploadedFilesName, setUploadedFilesName] = useState()
  const route = useRoute();
  const tesseractService = new TesseractService();
  console.log("select names",savedImg)

const img = "/Users/vervebot/Desktop/vs_projects/icms_scanner/Scanner/src/img/0004.jpg";


console.log("without crop",data)

  useEffect(() => {
    async function requestCamera() {
      const result = await Permissions.request(Platform.OS === "android" ? "android.permission.CAMERA" : "ios.permission.CAMERA")
      if (result === "granted") setAllowed(true)
    }
    requestCamera()
  }, [])

  function handleOnPressRetry() {
    setData({})
  }

  const ResetSavedImg = () => {
    setSavedImg([])
  }

  const FlashLight = () => {
    setFlash(!flash)
  }

  const emptydata = () => {
    setData({})
  }

  function handleOnOk() {
    setSavedImg(current => [...current, data.croppedImage]);

    setTimeout(emptydata,100) 
  } 
  function handleOnPress() {
    pdfScannerElement.current.capture()
  }
  if (!allowed) {
    console.log("You must accept camera permission")
    return (<View style={styles.permissions}>
      <Text>You must accept camera permission</Text>
    </View>)
  }
  if (data.croppedImage) {
    console.log("data", data)
    return (
      <React.Fragment>

<TouchableOpacity style={styles.imagePadding}>
   </TouchableOpacity>
           <Image source={{ uri: data.croppedImage }} style={styles.preview} />
<TouchableOpacity style={styles.imagePadding}> 
</TouchableOpacity>

        <TouchableOpacity onPress={handleOnPressRetry} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={handleOnOk} style={styles.button2}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <PDFScanner
        ref={pdfScannerElement}
        style={styles.scanner}
        onPictureTaken={setData}
        overlayColor="rgba(255,130,0, 0.7)"
        enableTorch={flash}
        quality={0.5}
        detectionCountBeforeCapture={5}
        detectionRefreshRateInMS={50}
      />
      <TouchableOpacity onPress={async()=>{


        let ocrdata  = await Promise.all(uploadedFilesName.map(async (file)=>{
          const res = await tesseractService.GetOCRData(file)
          
          console.log("res GetOCRData : ",res)
          let filterdata = chooseFilter("chetak", res.body);
          console.log("filterdata : ",filterdata)
          return filterdata
        }))
        console.log("ocrdata : ",ocrdata)
        let newData = [];
        ocrdata.forEach((data) => (newData = [...newData, ...data]));
        console.log("newData : ",newData)



      }} style={styles.button}>
        <Text style={{...styles.buttonText,fontSize:60}}>◉</Text>
      </TouchableOpacity>

      <TouchableOpacity  style={styles.button3}
      onPress={async ()=>{
        console.log("img3 : ",img)
        const res = await tesseractService.PostImage([img]);
        console.log("postImage : ",res)
        // setUploadedFilesName(res)

        navigation.navigate('ShowData',{
          filename:res,
          selectedInvoice:"chetak"
        })
      }}
      >
        <Text style={styles.buttonText}>✅: {savedImg.length}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ResetSavedImg}  style={styles.button4}>
        <Text style={styles.buttonText}>❌</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={FlashLight}  style={styles.button5}>
      { flash?<Text style={styles.buttonText}>☀️</Text>: <Text style={styles.buttonText}>⛅</Text>} 
      </TouchableOpacity>

    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  scanner: {
    flex: 1,
    aspectRatio: undefined,
    marginTop:130,
    marginBottom:130,
    
  },
  button: {
    alignSelf: "center",
    position: "absolute",
    bottom: 32,
  },
  button2: {
    alignSelf:"flex-start",
    position: "absolute",
    bottom: 32,
    left:20,
  },
  button3:{
    alignSelf:"flex-start",
    position: "absolute",
    bottom: 32,
    left:20,
  },
  button4:{
    alignSelf:"flex-end",
    position: "absolute",
    bottom: 32,
    right:20,
  },
  button5:{
    alignSelf:"flex-end",
    position: "absolute",
    bottom: 32,
    right:80,
  },
  buttonText: {
    borderRadius: 10,
    padding: 6,
    backgroundColor: "#fff",
    fontSize: 25,
  },
  preview: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  
  },
  imagePadding:{
marginTop:130,
  },
  permissions: {
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  }
})

// import 'react-native-gesture-handler';
// import { View, Text } from 'react-native'
// import React from 'react'
// import Home from './screens/home'
// import Login from './screens/login'
// import SearchPlaces from './screens/searchPlaces'
// import Rides from './screens/rides'
// import Scaner from './screens/scaner'
// import MemberPlaces from './screens/memberPlaces';
// import auth from '@react-native-firebase/auth';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//     <Stack.Navigator initialRouteName="Home">
//     <Stack.Screen name="Login" component={Login} />
//     <Stack.Screen name="Home" component={Home} />
//     <Stack.Screen name="SearchPlaces" component={SearchPlaces} />
//     <Stack.Screen name="Rides" component={Rides} />
//     <Stack.Screen name="MemberPlaces" component={MemberPlaces} />
//     <Stack.Screen name="Scaner" component={Scaner} />

  
//     </Stack.Navigator>
//   </NavigationContainer>
//   )

// }

// export default App

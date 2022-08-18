import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { TesseractService } from "../services/TesserartService";

let DeviceWidth = Dimensions.get('window').width;
let DeviceHeight = Dimensions.get('window').height;

const Preview = ({ navigation }) => {
  const to_Img_Preview = image => {
    console.log('image : ', image);
    navigation.navigate('ImageShow', {
      uri: image,
    });
  };
  const tesseractService = new TesseractService();

  const route = useRoute();
  const [invoice, setInvoice] = useState(route.params.invoice);
  const [savedImg, setSavedImg] = useState(route.params.savedImg);
  const [loading, setLoading] = useState(false);

  var to_Delete = '';
  const delete_image = image => {
    console.log('image', image);
    to_Delete = image;
    var filteredArray = savedImg.filter(function (e) {
      return e !== to_Delete;
    });
    setSavedImg(filteredArray);
    console.log('filteredArray', filteredArray);
  };

  console.log('select names', savedImg);
  return (
    <View>
    <Text
    style={{
      fontSize: 20,
      alignSelf: 'flex-start',
      left: 7,
      color: '#6498ed',
      padding: 13,
      alignSelf: 'center',
    }}>
   {invoice} :  {savedImg.length}
  </Text>
  <ScrollView style={{marginBottom: 220}}>
    <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap',padding:10}}>
      {savedImg.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => to_Img_Preview(image)}>
          <Image
            source={{uri: image}}
            style={{
              width: DeviceWidth / 3 - 6,
              height: DeviceHeight / 4,
              marginHorizontal: 2,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => delete_image(image)}
            style={{
              alignItems: 'center',
              padding: 10,
              marginBottom: 10,
              marginHorizontal: 2,
              backgroundColor: '#ff6161',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            <Text style={{color:'white'}}>Delete</Text>
          </TouchableOpacity>
          {/* </View> */}
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>

{loading ?
      
         <View style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 110,

          fontSize: 30,
          // paddingEnd: 30,
          // paddingStart: 30,
          // paddingVertical: 16,
          borderRadius: 9,
        }}>
          <ActivityIndicator animating={loading} size="large" color="#0000ff" />
          <View>
            <Text >Uploading, Please wait...</Text></View>
        </View> :
        <TouchableOpacity
        onPress={async () => {
          setLoading(true)
          console.log("img3 : ", savedImg)
          const res = await tesseractService.PostImage(savedImg);
          console.log("postImage : ", res)
          // setUploadedFilesName(res)

          navigation.navigate('ShowData', {
            filename: res,
            selectedInvoice: invoice
          })
          setLoading(false)
        }}
      >
        <View
        style={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 110,
          backgroundColor: '#6498ed',
          fontSize: 30,
          paddingEnd: 30,
          paddingStart: 30,
          paddingVertical: 16,
          borderRadius: 22,
          // borderWidth:15
        }}>
          <Text
          style={{
            // alignSelf: 'center',
            // position: 'absolute',
            // bottom: 110,
            // backgroundColor: '#6498ed',
            fontSize: 25,
            // paddingEnd: 30,
            // paddingStart: 30,
            // paddingVertical: 16,
            // borderRadius: 22,
            // borderWidth:15
          }}
           >
            SCAN
          </Text>
          </View>
        
        </TouchableOpacity>}
      
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({});

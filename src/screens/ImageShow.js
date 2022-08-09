import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';

let DeviceWidth = Dimensions.get('window').width;
let DeviceHeight = Dimensions.get('window').height;

const ImageShow = () => {
  const route = useRoute();
  const [uri, setUri] = useState(route.params.uri);
  console.log('props : ', uri);
  return (
    <View>
      <ScrollView style={{marginBottom: 10}}>
        <Image
          source={{uri}}
          style={{
            width: DeviceWidth,
            height: DeviceHeight,
          }}></Image>
      </ScrollView>
    </View>
  );
};

export default ImageShow;

const styles = StyleSheet.create({});

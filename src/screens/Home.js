import {
  View,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
// import MapView from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
import Dropdown from './Dropdown';
const Home = ({ navigation }) => {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAW3OdhetYZf8wTKXqiFD8CRaIx02w7a38';
  const origin = { latitude: 37.3318456, longitude: -122.0296002 };
  const destination = { latitude: 37.771707, longitude: -122.4053769 };

  const [loading, setLoading] = useState(false);

  const todropdownSupporter = () => {
    navigation.navigate('Dropdown');
    setLoading(false);
  };

  const todropdown = () => {
    setLoading(true);
    setTimeout(todropdownSupporter, 10);
  };

  return (
    <View>
      <View style={{ margin: '40%' }}></View>
      {loading ? (
        <ActivityIndicator animating={loading} size="large" color="#0000ff" />
      ) : (
        null
      )}
      <TouchableOpacity
        style={styles.container}
        title="Select Invoice"
        onPress={todropdown}>
        {loading ? (
          <Text pointerEvents="none" style={styles.buttonText2}>
            Loading invoices Please wait...
          </Text>
        ) : (
          <View style={styles.buttonText}>
            <Text style={{
              fontSize: 20,
              alignSelf: 'center',
              color: '#fff',
            }}>SCAN 🖨️</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = new StyleSheet.create({
  buttonText: {
    borderRadius: 20,
    padding: 30,
    backgroundColor: '#000',
    fontSize: 20,
    alignSelf: 'center',
    color: '#fff',
  },
  buttonText2: {
    borderRadius: 20,

    fontSize: 20,
    alignSelf: 'center',
    color: '#000',
  },
});
export default Home;

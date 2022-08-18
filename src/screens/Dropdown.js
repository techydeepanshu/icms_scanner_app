import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React from 'react';
import {dropdownOptions} from '../utils/invoiceList';
import {useState, useEffect} from 'react';

const Dropdown = ({navigation}) => {
  const [search, setSearch] = useState('');
  const setvaluefunction = params => {
    console.log('data : ', params);
    navigation.navigate('Scaner', {
      invoice: params,
    });
  };

  return (
    <View>
      <TextInput
        onChangeText={val => setSearch(val)}
        placeholder="🔍     e.g. 'Dawn food' "
        style={{
          backgroundColor: '#d6d6d6',
          marginVertical: 15,
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: 10,
          fontSize: 20,
          alignSelf: 'center',
          width: '80%',
          color: '#000',
          paddingLeft: 20,
          paddingVertical: 10,
        }}></TextInput>
      <ScrollView>
        {dropdownOptions
          .filter(
            home =>
              home.slug.includes(search) ||
              home.slug.includes(search.toLowerCase()),
          )
          .map((home, index) => (
            <View>
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setvaluefunction(home.slug);
                }}>
                <View
            
                  style={{
                    backgroundColor: '#f2f2f2',
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                    padding: 16,
                  }}>
                  <Text   style={{fontSize: 20, color: 'black'}}>
                    {' ◦ '}
                    {home.value}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({});

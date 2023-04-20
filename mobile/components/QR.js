import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { logout } from '../helper/Auth';
import moment from 'moment';
import axios from 'axios';
import { DEFAULT_HOST } from '../host';
export default function QR({ navigation }) {
  const [token, setToken] = useState('');
  const [profileData, setProfile] = useState([]);
  const [qr, setQR] = useState('');

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      const value1 = await AsyncStorage.getItem('id');
      if (value !== null) {
        setToken(value);
        setId(value1);
        return '';
      } else return '';
    } catch (e) {
      return '';
    }
  };
  getUser();

  const config = {};
  config.headers = {
    Authorization: 'Bearer ' + token,
  };
  const url = `${DEFAULT_HOST}/users/profile`;

  useEffect(() => {
    const f = async () => {
      try {
        if (token !== '') {
          const result = await axios.get(url, config);
          if (result.data.success) {
            console.log(result.data)
            result.data.data.user.user_date_of_birth = moment(result.data.data.user.user_date_of_birth, 'DD-MM-YYYY');
            setProfile(result.data.data.user);
            setQR(result.data.data.qr);
            // setE(result.data.data.user.user_verified_email);
          } else {
            console.log('failed');
            return;
          }
        } else {
          getUser();
          const result = await axios.get(url, config);
          if (result.data.success) {
            result.data.data.user.user_date_of_birth = moment(result.data.data.user.user_date_of_birth, 'DD-MM-YYYY');
            setProfile(result.data.data.user);
            setQR(result.data.data.qr);
            // setE(result.data.data.user.user_verified_email);
          } else {
            console.log('failed');
            return;
          }
        }
      } catch (error) {
        // console.log(error)
        return;
      }
    };
    f();
    return;
  }, [token]);
  return (
    //   <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
    //
    //     {/* <Button title="Đăng xuất" onPress={Logout}></Button> */}
    //     {/* */}
    //   </View>, backgroundColor: "#cccccc"
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('../assets/logo1.png')} style={styles.logo} />
      <Text style={styles.text}>Xin chào {profileData.user_fullname}! </Text>
      <Text style={styles.text1}>* Cung cấp mã QR sau khi được yêu cầu xác thực:</Text>
      {qr !== '' ? (
        <Image source={{ uri: qr }} style={styles.qr} />
      ) : (
        <ActivityIndicator size="small" color="#00bfff" />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  qr: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginTop: 10,
  },
  text: {
    color: '#00bfff',
    fontSize: 18,
  },
  text1: {
    color: 'red',
    fontSize: 14,
  },
});

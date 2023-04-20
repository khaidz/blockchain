import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Card } from 'react-native-paper';
import { DEFAULT_HOST } from '../host';
export default function Prescription({ mbId }) {
  const [token, setToken] = useState('');
  const [sData, setS] = useState([]);

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        setToken(value);
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
  const url = `${DEFAULT_HOST}/patient/search-prescription?field=prescription_medical_bill_id&value=` + mbId;

  useEffect(() => {
    const f = async () => {
      try {
        if (token !== '') {
          const result = await axios.get(url, config);
          if (result.data.success) {
            setS(result.data.data);
            return;
          } else {
            console.log('failed');
            return;
          }
        } else {
          getUser();
          const result = await axios.get(url, config);
          if (result.data.success) {
            setS(result.data.data);
            return;
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

    if (token !== '') {
      f();
    } else {
      getUser();
      f();
    }
    return;
  }, [token]);

  // style={{ flex: 1,justifyContent: 'flex-start', alignItems: 'center'}}
  return (
    <View>
      {sData.length !== 0 ? (
        <View>
          {sData.map((element) => {
            return (
              <Card key={element.prescription_id} style={styles.view}>
                <Text style={styles.text1}>{element.prescription_drug_name}</Text>
                <Text> - Số viên: {element.drug_numbers}</Text>
                <Text> - Cách dùng thuốc: {element.prescription_doctor_instruction}</Text>
              </Card>
            );
          })}
        </View>
      ) : (
        <View>
          <Text>Không tìm thấy đơn thuốc!</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#00bfff',
  },
  view: {
    margin: 15,
    padding: 5,
    borderWidth: 1,
  },
  text1: {
    fontWeight: 'bold',
    margin: 5,
  },
});

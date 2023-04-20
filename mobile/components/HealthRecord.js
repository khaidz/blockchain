import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { Title, DataTable, Modal, Portal, Provider, TouchableRipple } from 'react-native-paper';
import moment from 'moment';
import getFullTime from '../helper/FullTime';
import MedicalBill from './MedicalBill';
import { DEFAULT_HOST } from '../host';
export default function HealthRecord({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState({});
  const containerStyle = { backgroundColor: 'white', marginTop: 20, padding: 10 }; // ,
  const [token, setToken] = useState('');
  const [id, setId] = useState('');
  const [hr, setHR] = useState([]);
  const [change, setChange] = useState(false);
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

  useEffect(() => {
    const f = async () => {
      try {
        const url = `${DEFAULT_HOST}/patient/search-medical-bill?field=medical_bill_patient_id&value=` + id;
        const result = await axios.get(url, config);
        if (result.data.success) {
          result.data.data.sort((e, f) => {
            return moment(new Date(f.medical_bill_created_at)) - moment(new Date(e.medical_bill_created_at));
          });
          setHR(result.data.data);
          setChange(false);
          return;
        } else {
          return;
        }
      } catch (error) {
        return;
      }
    };
    f();
    return;
  }, [id, token, visible, change]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const viewMedicalBill = (e) => {
    setValue(e);
    showModal();
  };

  return (
    <Provider>
      <ScrollView onTouchStart={() => setChange(true)}>
        {hr.length !== 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Ngày khám</DataTable.Title>
              <DataTable.Title>Thao tác</DataTable.Title>
            </DataTable.Header>

            {hr.map((element) => {
              return (
                <DataTable.Row key={element.medical_bill_id}>
                  <DataTable.Cell>{getFullTime(element.medical_bill_created_at)}</DataTable.Cell>
                  <DataTable.Cell>
                    <Button type="link" title="Xem phiếu khám" onPress={() => viewMedicalBill(element)}></Button>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        ) : (
          <View style={styles.view}>
            <ActivityIndicator color="#00bfff" size="small" />
            <Text style={styles.text}>Bạn chưa có phiếu khám!</Text>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Button onPress={hideModal} title="X" color="#00bfff"></Button>
          <Title style={styles.title}>Phiếu khám - {getFullTime(value.medical_bill_created_at)} </Title>
          <MedicalBill value={value}></MedicalBill>
        </Modal>
      </Portal>
    </Provider>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#00bfff',
  },
  view: {
    marginHorizontal: 70,
    marginVertical: 200,
  },
  title: {
    color: 'brown',
    fontSize: 16,
  },
  button: {
    margin: 100,
    marginTop: 10,
    borderRadius: 80,
  },
});

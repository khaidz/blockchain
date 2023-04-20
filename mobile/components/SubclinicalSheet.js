import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { List, Divider, Modal, Card } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DEFAULT_HOST } from '@/host';
export default function SubclinicalSheet({ mbId }) {
  const [token, setToken] = useState('');
  const [pData, setP] = useState([]);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState('');
  const [title, setTitle] = useState('');

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
  const url = `${DEFAULT_HOST}/patient/search-subclinical-sheet?field=subclinical_sheet_medical_bill_id&value=` + mbId;

  useEffect(() => {
    const f = async () => {
      try {
        const result = await axios.get(url, config);
        if (result.data.success) {
          setP(result.data.data);
          return;
        } else {
          console.log('failed');
          return;
        }
      } catch (error) {
        // console.log(error)
        return;
      }
    };
    f();
    return;
  }, [token]);

  const handleView = async (value1, value2) => {
    setVisible(true);
    setShow(value1);
    setTitle(value2);
  };
  const hideModal = async () => {
    setVisible(false);
  };

  // style={{ flex: 1,justifyContent: 'flex-start', alignItems: 'center'}}
  return (
    <View>
      {pData.length !== 0 ? (
        <View>
          {pData.map((element) => {
            return (
              <View key={element.subclinical_sheet_id}>
                {/* <Card style={styles.card}> */}
                <View>
                  <Text style={styles.text1}>{element.subclinical_name}</Text>
                  <Text style={styles.text2}>{element.subclinical_sheet_results}</Text>
                </View>
                {element.subclinical_sheet_images !== undefined ? (
                  <View>
                    {element.subclinical_sheet_images.map((e) => {
                      return (
                        <View key={e.uid} style={styles.view}>
                          <TouchableOpacity onPress={() => handleView(e.name, element.subclinical_name)}>
                            <Image
                              source={{
                                uri: `${DEFAULT_HOST}/upload/` + e.name,
                              }}
                              style={styles.image}
                            ></Image>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View></View>
                )}
                {/* </Card> */}
              </View>
            );
          })}
        </View>
      ) : (
        <View>
          <Text>Không tìm thấy kết quả cận lâm sàng!</Text>
        </View>
      )}

      <Modal visible={visible} onDismiss={hideModal} style={styles.view}>
        <TouchableOpacity onPress={hideModal}>
          <Text>{title}</Text>
          <Image
            source={{
              uri: `${DEFAULT_HOST}/upload/` + show,
            }}
            style={styles.show}
            resizeMode="center"
          ></Image>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#00bfff',
  },
  image: {
    width: 100,
    height: 100,
  },
  view: {
    backgroundColor: 'white',
    marginTop: 0,
  },
  show: {
    width: 320,
    height: 320,
  },
  card: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
  },
  text1: {
    fontWeight: 'bold',
    margin: 5,
  },
  text2: {
    fontSize: 13,
    color: 'silver',
    margin: 5,
  },
});

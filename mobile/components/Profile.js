import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { logout } from '../helper/Auth';
import axios from 'axios';
import { Card, List, Title, Divider, Appbar } from 'react-native-paper';
import getFullTime from '../helper/FullTime';

export default function Profile({ navigation }) {
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const [token, setToken] = useState('');
  // const [id, setId] = useState("");
  const [profileData, setProfile] = useState([]);
  const [verifyE, setE] = useState(false);
  const [qr, setQR] = useState('');
  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      const value1 = await AsyncStorage.getItem('id');
      if (value !== null) {
        setToken(value);
        setId(value1);
        // console.log("========="+ value);
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
            setProfile(result.data.data.user);
            setQR(result.data.data.qr);
            setE(result.data.data.user.user_verified_email);
          } else {
            console.log('failed');
            return;
          }
        } else {
          getUser();
          const result = await axios.get(url, config);
          if (result.data.success) {
            setProfile(result.data.data.user);
            setQR(result.data.data.qr);
            setE(result.data.data.user.user_verified_email);
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

  // style={{ flex: 1,justifyContent: 'flex-start', alignItems: 'center'}}
  return (
    <View>
      <ScrollView>
        <Card>
          <View>
            <List.Item title="Họ và tên" description={profileData.user_fullname} />

            <Divider />
            <Divider />
            <List.Item title="Giới tính" description={profileData.user_gender} />
            <Divider />
            <Divider />

            <List.Item title="Ngày sinh" description={profileData.user_date_of_birth} />

            <Divider />
            <Divider />

            <List.Item title="Email" description={profileData.user_email} />
            <Divider />
            <Divider />

            <List.Item title="Số điện thoại" description={profileData.user_phone} />
            <Divider />
            <Divider />

            <List.Item title="Địa chỉ" description={profileData.user_address} />
            <Divider />
            <Divider />

            <List.Item title="Số CMND/CCCD" description={profileData.user_identity_card} />

            <Divider />
            <Divider />

            {/* <List.Item
                            title="Số BHYT"
                            description={profileData.user_BHYT}
                        />
                            <Divider/>
                            <Divider/> */}

            <List.Item title="Nghề nghiệp" description={profileData.user_job} />
            <Divider />
            <Divider />

            <List.Item title="Nơi làm việc" description={profileData.user_workplace} />
            <Divider />
            <Divider />

            <List.Item title="Họ tên người thân" description={profileData.user_family_name} />
            <Divider />
            <Divider />

            <List.Item title="Số điện thoại người thân" description={profileData.user_family_phone} />
            <Divider />
            <Divider />

            <List.Item title="Ngày tạo tài khoản" description={getFullTime(profileData.user_created_at)} />
            <Divider />
            <Divider />
            <Text style={styles.note}>* Liên hệ quầy lễ tân để chỉnh sửa hồ sơ của bạn</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#00bfff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  note: {
    margin: 10,
    color: 'red',
  },
});

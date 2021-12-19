import React, {useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, TextInput, Button, Alert,StyleSheet, Text, Image,KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import axios from "axios";
import {login, logout} from '../helper/Auth';

export default function ChangePassword ({navigation}){

    const [newPassword, setNewPass] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [repeatPassword, setRepeatPass] = useState('');
    const [token, setToken] = useState("");
    const getUser = async () => {  
        try {    
            const value = await AsyncStorage.getItem('token');
            if(value !== null) {    
                setToken(value); 
                return "" 
            }  
            else return ""
        } catch(e) 
        {    
            return ""
        }
    }
    getUser();
    const config = {};
    config.headers = {
        Authorization: "Bearer "+token
    };

    const onChangePass = async () => {
        getUser();
        // Alert.alert(token+"");
        if(newPassword === "" || repeatPassword ==="" || oldPass === "") { Alert.alert("Vui lòng điền đầy đủ các trường"); return }
        if(newPassword.length < 8) { Alert.alert("Mật khẩu mới phải có từ 8 kí tự"); return }
        if(newPassword !== repeatPassword) {Alert.alert("Nhập lại khẩu không khớp"); return}

        const url = 'http://192.168.1.10:3000/users/me/changePassword';
        try {
            const data = {
                oldPass: oldPass, 
                user_password: newPassword
            }
            const rs = await axios.post(url, data, config);
            if(rs.data.success){
                setOldPass("");
                setNewPass("");
                setRepeatPass("");
                Alert.alert("Thành công!","Mật khẩu đã thay đổi! Vui lòng đăng nhập lại để tiếp tục");
                logout();
                navigation.navigate("Login");
            }
            else {
                Alert.alert("Thất bại!",rs.data.message+"");
                return
            }
        } catch (error) {
            Alert.alert("Thất bại!",""+ error)
            console.log(error);
            return
        }
    }
    
    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.view}>
            
            <View style={styles.form}>
                <Text style={styles.note}>* Thao tác sau sẽ làm thay đổi hiện trạng tài khoản của bạn. Bạn sẽ phải đăng nhập lại khi đổi mật khẩu thành công!</Text>
                <Text style={styles.title}>Mật khẩu cũ</Text>
                <TextInput
                    onChangeText={setOldPass}
                    style={styles.input}
                    placeholder='Mật khẩu cũ'
                    secureTextEntry
                    value={oldPass}
                
                >
                </TextInput>
                <Text style={styles.title}>Mật khẩu mới</Text>
                <TextInput
                    onChangeText={setNewPass}
                    style={styles.input}
                    placeholder='Mật khẩu mới'
                    secureTextEntry
                    value={newPassword}
                
                >
                </TextInput>

                <Text style={styles.title}>Nhập lại mật khẩu mới</Text>
                <TextInput
                    onChangeText={setRepeatPass}
                    style={styles.input}
                    placeholder='Nhập lại mật khẩu mới'
                    secureTextEntry
                    value={repeatPassword}
                
                >
                </TextInput>
                
                <View style={styles.button}>
                <Button
                    onPress={onChangePass}
                    title='Xác nhận'
                    color="#00bfff"
                />
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
       )
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 2,
        borderColor: "#00bfff",
        margin: 10,
        padding: 5,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingStart: 10,
        marginHorizontal: 30
    },
    button: {
        marginHorizontal: 60,
        marginTop: 10,
        borderRadius: 80,
    },
    view: {
        
        paddingBottom: 120,
        flex: 1,
        justifyContent: "space-around"
    },
    text: {
        color: "#00bfff",
        fontSize: 28,
        marginHorizontal: 70,
    },
    textP: {
        color: "#00bfff",
        fontSize: 16,
    },
    textFinal: {
        color: "#00bfff",
        fontSize: 16,
        marginLeft: 100

    },
    p: {
        marginTop: 40,
        marginHorizontal: 50,
    },
    form: {
        marginTop: 50
    },
    container: {
        flex: 1
    },
    title: {
        color: "#00bfff",
        marginHorizontal: 30
    },
    note: {
        margin: 5,
        color: 'red'
    }

  });
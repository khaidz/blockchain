import React, {useState, useEffect} from "react";
import {View, TextInput, Button, Alert,StyleSheet, Text, Image} from 'react-native';
import axios from "axios";
import {login} from '../helper/Auth';

export default function Login ({navigation}){
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    

    const onLogin = async () => {
        const url = 'http://192.168.1.10:3000/auth/login-patient';
        try {
            const data = {
                email: email.trim(),
                password: password
            }
            const rs = await axios.post(url, data);
            if(rs.data.success){
                setEmail("");
                setPass("");
                const token0 = rs.data.data.token;
                const user0 = rs.data.data.user;
                login(token0, user0);
                
                if (login){
                navigation.navigate('Home');
                }
                else {
                    Alert.alert("Thất bại!","Đăng nhập không thành công!")
                }
            }
            else {
                Alert.alert("Thất bại!",rs.data.data.message+"");
            }
        } catch (error) {
            Alert.alert("Thất bại!",""+ error)
            console.log(error);
        }
        return
        
    }
    
    return (
        <View style={styles.view}>
            <Image
                style={styles.img}
                source={require('../assets/logo1.png')}
            />
            <Text style={styles.text}>HEALTH RECORD</Text>
            <View style={styles.form}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholder='abc@gmail.com'
                    value={email}
                >
                </TextInput>
                
                <Text style={styles.title}>Mật khẩu</Text>
                <TextInput
                    onChangeText={setPass}
                    style={styles.input}
                    placeholder='Mật khẩu'
                    autoComplete="password"
                    secureTextEntry
                    value={password}
                
                >
                </TextInput>
                
                <View style={styles.button}>
                <Button
                    onPress={onLogin}
                    title='Đăng nhập'
                    color="#00bfff"
                />
                </View>
            </View>
        </View>
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
        marginVertical: 20,
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
    img: {
        width: 80,
        height: 80,
        marginBottom: 10,
        marginTop: 90,
        marginHorizontal: 130
    },
    form: {
        marginTop: 50
    },
    title: {
        color: "#00bfff",
        marginHorizontal: 30
    },
    log: {
        color: "red",
        marginHorizontal: 50,
        fontSize: 12,
        marginBottom: 5
    }

  });
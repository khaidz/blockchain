import React, {useEffect, useState} from 'react';
import {Button,View, Text, StyleSheet, Alert } from 'react-native';
import {  Card, Title } from 'react-native-paper';
import { logout } from '../helper/Auth';


const Logout = ({navigation}) => {
  
    const leaveOut = ()=> {
            logout();
            navigation.navigate("Login")
        }
    // const leaveIn = ()=> {
    //     navigation.navigate("Home")
    // }
    
    
 return ( 
    <Card style={styles.card}>
        <Title style={styles.title}>Xác nhận tiếp tục</Title>
        <Text style={styles.text}>* Bạn sẽ phải đăng nhập lại sau khi thực hiện thao tác này. Vẫn tiếp tục?</Text>
        <View style={styles.button2}>
            <Button title="Đồng ý" onPress={()=> leaveOut()}></Button>
        </View>
        {/* <View style={styles.button2}>
            <Button title="Hủy" onPress={()=> leaveIn()}></Button>
        </View> */}
    </Card>
 )
};


const styles = StyleSheet.create({
    card: {
        marginHorizontal: 40,
        marginVertical: 180
    },
    text: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 30,
         color: 'red'
    },
    button2: {
        marginHorizontal: 60,
        marginTop: 10,
        marginBottom: 20
    },
    title: {
        marginHorizontal: 60,
        color: "#00bfff"
    },
   
})
export default Logout;
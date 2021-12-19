import * as React from 'react'; 
import {useEffect, useState} from 'react'; 
import { View, Text, StyleSheet, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import Home, {HomeScreen} from './components/Home';




function FlashScreen({ navigation }) {
  
  useEffect(() => {
    setTimeout(() => {
       navigation.replace('Login');
    }, 3500);
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image style={styles.img} source={require('./assets/logo1.png')}></Image>
      <Text style={styles.text}>Health Record kính chào quý khách!</Text>
    </View>
  );
  
  
}

const Stack = createNativeStackNavigator();

function App() {


  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FlashScreen" screenOptions={{
        headerShown: false}}
      >
       <Stack.Screen 
          name="FlashScreen" 
          component={FlashScreen}
          options={{
            title: '',
          }}/> 
      <Stack.Screen 
      name="Home"
      component={Home}
      options={{
        headerStyle: {
          backgroundColor: '#00bfff',
        },
        // headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} 
      /> 
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{
          title: 'Đăng nhập',
          headerStyle: {
            backgroundColor: '#00bfff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  img: {
    width: 150,
    height: 150,
    margin: 20,
  },
  text: {
    color: "#00bfff"
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
})
export default App;
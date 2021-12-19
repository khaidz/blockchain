import React from 'react';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Profile from './Profile';
import Logout from './Logout';
import ChangePassword from './ChangePassword';


const Drawer = createDrawerNavigator();

 export default function TabDrawer({navigation}) {
    //  headerShown: false , defaultScreenOptions="Profile"defaultStatus="Profile"
  return (
    <Drawer.Navigator initialRouteName="Profile" >
      <Drawer.Screen 
          name="Profile" 
          component={Profile} 
          options={{title: 'Hồ sơ',
          headerStyle: {
            backgroundColor: '#00bfff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      
      <Drawer.Screen 
        name="ChangePassword" 
        component={ChangePassword} 
        options={{title: 'Đổi mật khẩu',
        headerStyle: {
          backgroundColor: '#00bfff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      
      <Drawer.Screen 
        name="Logout" 
        component={Logout} 
        options={{title: 'Đăng xuất',
        headerStyle: {
          backgroundColor: '#00bfff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />

    </Drawer.Navigator>
  );
}
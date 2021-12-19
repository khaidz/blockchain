import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Profile from './Profile';
import HealthRecord from './HealthRecord';
import QR from "./QR";
import { Drawer } from "react-native-paper";
import TabDrawer from "./Drawer";


const Tab = createBottomTabNavigator();
export default function Home ({navigation}) {

   return (
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                  let iconName;
                  const size=28;
                  if (route.name === 'QR') {
                    iconName = "md-qr-code-sharp";
                   
                    return <Ionicons name={iconName} size={size} color={color} />;
                  } else if (route.name === 'Drawer') {
                    iconName = "profile";
              
                    return <AntDesign name={iconName} size={size} color={color} />
                  } else {
                      iconName = "file-medical-alt"
                      return <FontAwesome5 name={iconName} size={size} color={color} />
                  }
                },
                
                tabBarActiveTintColor: '#00bfff',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 16,
                    marginBottom: 5
                },
                tabBarStyle:{
                    height: 60,
                    padding: 5
                },
                // headerShown: false,
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor: '#00bfff'
                },
              })}>
                <Tab.Screen name="Drawer" component={TabDrawer} options={{title: 'Hồ sơ', headerShown:false}}/>
                <Tab.Screen name="QR" component={QR} options={{title: 'QR Code'}}/>
                <Tab.Screen name="HealthRecord" component={HealthRecord} options={{title: 'Sổ khám bệnh'}}/> 
            </Tab.Navigator>
        
   )
}

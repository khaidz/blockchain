import AsyncStorage from '@react-native-async-storage/async-storage';

async function login  (token0, user0) {
    try{
        await AsyncStorage.setItem('token', token0);
        await AsyncStorage.setItem('id', user0.user_id);
    } catch (e){
        return false
    }
}

async function logout () {
    try{
        
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('id');
        return true
    } catch (e){
        return false
    }
}


export {login, logout}
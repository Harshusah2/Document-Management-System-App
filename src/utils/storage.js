import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeToken(token) {
  await AsyncStorage.setItem('authToken', token);
}

export async function getToken() {
  return AsyncStorage.getItem('authToken');
}
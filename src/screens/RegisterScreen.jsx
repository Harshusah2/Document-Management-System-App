import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ImageBackground, StyleSheet } from 'react-native';
import { registerMobile } from '../api/auth';

export default function RegisterScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await registerMobile(mobile);
      if (response.status) {
        Alert.alert('Success', 'Mobile number registered!');
        navigation.navigate('Login', { mobile });
      } else if (response.data === 'Mobile already registered.') {
        Alert.alert('Info', 'Mobile already registered. Redirecting to login...');
        navigation.navigate('Login', { mobile });
      } else {
        Alert.alert('Error', response.data || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/spongebob.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={{ padding: 16, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 12 }}>Register Mobile Number</Text>
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="Enter your mobile number"
          style={{ borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 4 }}
        />
        <Button
          title={loading ? "Registering..." : "Register"}
          onPress={handleRegister}
          disabled={loading || mobile.length === 0}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    margin: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 8,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#fff',
  },
});
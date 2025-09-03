import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, StyleSheet } from 'react-native';
import { generateOTP } from '../api/auth';

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');

  const handleSendOTP = async () => {
    try {
      const result = await generateOTP(mobile);
      console.log(result); // See what the backend returns
      navigation.navigate('OTP', { mobile });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <Text>Enter Mobile Number</Text>
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="Mobile Number"
          style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
        />
        <Button title="Send OTP" onPress={handleSendOTP} />
      </View>
      <Image
        source={require('../assets/deadpool.png')}
        style={styles.bottomImage}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomImage: {
    width: '100%',
    height: 250,
  },
});
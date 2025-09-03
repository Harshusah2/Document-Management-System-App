import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { validateOTP } from '../api/auth';
import { storeToken } from '../utils/storage';

export default function OTPScreen({ route, navigation }) {
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const { mobile } = route.params;

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await validateOTP(mobile, otp);
      const token = response.token; // Adjust if your backend returns a different key
      await storeToken(token);
      Alert.alert('Success', 'OTP verified successfully!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Enter OTP sent to {mobile}</Text>
      <TextInput
        value={otp}
        onChangeText={setOTP}
        keyboardType="number-pad"
        placeholder="Enter the OTP"
        style={{ borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 4 }}
      />
      <Button 
        title={loading ? "Verifying..." : "Verify OTP"} 
        onPress={handleVerifyOTP}
        disabled={loading || otp.length === 0} />
    </View>
  );
}
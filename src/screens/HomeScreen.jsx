import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      {/* <Text>Home Screen</Text> */}
      <Button
        title="Register to continue"
        onPress={() => navigation.navigate('Registration')}
      />
    </View>
  );
}
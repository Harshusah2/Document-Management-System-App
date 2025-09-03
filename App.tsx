import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function AppContent() {

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
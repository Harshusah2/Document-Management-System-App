import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { storeToken } from '../utils/storage';
import { logout } from '../api/auth';
import { Menu, Provider, IconButton } from 'react-native-paper';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [menuVisible, setMenuVisible] = useState(false);

  const mobile = route.params?.mobile;

  const handleLogout = async () => {
    setMenuVisible(false);
    if (mobile) {
      await logout(mobile);
    }
    await storeToken('');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Registration' }],
    });
  };

  return (
    <Provider>
      <View style={{ flex: 1 }}>
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={handleLogout} title="Logout" />
          </Menu>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Dashboard Screen</Text>
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});
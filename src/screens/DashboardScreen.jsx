import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { storeToken } from '../utils/storage';
import { logout } from '../api/auth';
import { Menu, Provider, IconButton, Button, TextInput, Chip } from 'react-native-paper';
import FileUpload from '../components/FileUpload';
import TagInput from '../components/TagInput';
import DateTimePicker from '@react-native-community/datetimepicker';


const personalNames = ['JohnWick', 'PeterParker', 'TonyStark', 'BruceWayne'];
const professionalDepartments = ['Accounts', 'HR', 'IT', 'Finance'];


export default function DashboardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [menuVisible, setMenuVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [tags, setTags] = useState([]);
  const [remarks, setRemarks] = useState('');

  const mobile = route.params?.mobile;

  // Fetch tags from backend
  const fetchTags = async () => {
    // Replace with your API call
    const res = await fetch('http://10.0.2.2:3001/api/documentManagement/fetchdocumentTags');
    const data = await res.json();
    return data.tags || [];
  };

  // Add new tag to backend
  const addTag = async (tag) => {
    // Replace with your API call
    await fetch('http://10.0.2.2:3001/api/documentManagement/adddocumentTags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
    });
  };

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
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Upload Document</Text>
          <FileUpload file={file} setFile={setFile} />

          <Button mode="outlined" onPress={() => setShowDate(true)} style={{ marginVertical: 8 }}>
            {date ? date.toDateString() : 'Select Date'}
          </Button>
          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowDate(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <Text style={{ marginTop: 8 }}>Category</Text>
          <TextInput
            label="Major Head"
            value={majorHead}
            onChangeText={setMajorHead}
            style={{ marginBottom: 8 }}
          />

          {majorHead === 'Personal' && (
            <TextInput
              label="Name"
              value={minorHead}
              onChangeText={setMinorHead}
              style={{ marginBottom: 8 }}
            />
          )}
          {majorHead === 'Professional' && (
            <TextInput
              label="Department"
              value={minorHead}
              onChangeText={setMinorHead}
              style={{ marginBottom: 8 }}
            />
          )}

          <TagInput tags={tags} setTags={setTags} fetchTags={fetchTags} addTag={addTag} />

          <TextInput
            label="Remarks"
            value={remarks}
            onChangeText={setRemarks}
            multiline
            style={{ marginVertical: 8 }}
          />

          <Button mode="contained" onPress={() => { /* handle upload */ }} style={{ marginTop: 16 }}>
            Upload
          </Button>
        </ScrollView>
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
  content: {
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
});
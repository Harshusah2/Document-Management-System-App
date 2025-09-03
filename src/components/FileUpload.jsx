import React from 'react';
import { View, Button, Text, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';

export default function FileUpload({ file, setFile }) {
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setFile(res);
    } catch (err) {}
  };

  const takePhoto = async () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setFile(response.assets[0]);
      }
    });
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <Button title="Pick Image or PDF" onPress={pickFile} />
      <Button title="Take Photo" onPress={takePhoto} />
      {file && file.type?.includes('image') && (
        <Image source={{ uri: file.uri }} style={{ width: 100, height: 100, marginTop: 8 }} />
      )}
      {file && file.type?.includes('pdf') && (
        <Text style={{ marginTop: 8 }}>PDF Selected: {file.name}</Text>
      )}
    </View>
  );
}
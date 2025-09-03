import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Chip, TextInput } from 'react-native-paper';

export default function TagInput({ tags, setTags, fetchTags, addTag }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchTags().then(setSuggestions);
  }, []);

  const handleAddTag = async () => {
    if (input && !tags.includes(input)) {
      await addTag(input);
      setTags([...tags, input]);
      setInput('');
    }
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {tags.map((tag, idx) => (
          <Chip key={idx} onClose={() => setTags(tags.filter(t => t !== tag))} style={{ margin: 2 }}>
            {tag}
          </Chip>
        ))}
      </View>
      <TextInput
        label="Add Tag"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleAddTag}
        right={<TextInput.Icon icon="plus" onPress={handleAddTag} />}
        style={{ marginTop: 8 }}
      />
    </View>
  );
}
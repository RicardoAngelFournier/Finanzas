import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { supabase } from '@/database/supabaseClient';
import { Dimensions } from 'react-native';

interface Category {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

const CategoriesScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState('#000000');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*');
    if (error) {
      console.error(error);
      Alert.alert('Error fetching categories');
    } else {
      setCategories(data);
    }
  };

  const handleSaveCategory = async () => {
    if (!name || !emoji) {
      Alert.alert('Please enter a name and select an emoji.');
      return;
    }

    const { error } = await supabase
      .from('category')
      .insert([{ name, emoji, color }]);

    if (error) {
      console.error(error);
      Alert.alert('Error saving category');
    } else {
      Alert.alert('Category saved successfully!');
      setName('');
      setEmoji('');
      setColor('#000000');
      fetchCategories(); // Refresh the list
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={[styles.categoryItem, { backgroundColor: item.color || '#f0f0f0' }]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.backcard} />
        <View style={styles.header}>
      <Text style={styles.title}>Create New Category</Text>
      <TextInput
        placeholder="Category Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)} style={styles.emojiButton}>
        <Text style={styles.emojiButtonText}>{emoji || 'Pick an Emoji'}</Text>
      </TouchableOpacity>
      </View>

      {showEmojiPicker && (
        <View style={{ height: 500, backgroundColor: "#fff"}}>
            <EmojiSelector
            onEmojiSelected={(selectedEmoji) => {
                setEmoji(selectedEmoji);
                setShowEmojiPicker(false);
            }}
            category={Categories.symbols} // Optional: Limit to specific categories to reduce load
            />
        </View>
        )}

      <Text style={styles.label}>Pick a Color:</Text>
      <ColorPicker
        value={color}
        onComplete={(color) => setColor(color.hex)}
        style={{ height: 50, width: '100%' }}
      />
      <TouchableOpacity onPress={handleSaveCategory} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Category</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Existing Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
      />
    </View>
  );
};
const { width, height } = Dimensions.get('window');

export default CategoriesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        },
        backcard: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: height * 0.35,
            backgroundColor: '#E6E8FF',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          },
          header: {
            marginTop: 40,
            color: '#000',
          },
  title: {
    fontSize: 21,
    fontFamily: 'Medium',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  emojiButton: {
    backgroundColor: '#9B7EDE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  emojiButtonText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
  },
});

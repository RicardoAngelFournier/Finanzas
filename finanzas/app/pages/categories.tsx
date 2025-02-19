import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Modal, Dimensions } from 'react-native';
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { supabase } from '@/database/supabaseClient';

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
  const [showColor, setShowColor] = useState(false);

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

    const { error } = await supabase.from('category').insert([{ name, emoji, color }]);

    if (error) {
      console.error(error);
      Alert.alert('Error saving category');
    } else {
      Alert.alert('Category saved successfully!');
      setName('');
      setEmoji('');
      setColor('#000000');
      fetchCategories();
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={[styles.categoryItem, { backgroundColor: item.color || '#f0f0f0' }]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const onSelectColor = ({ hex }) => setColor(hex);

  return (
    <View style={styles.container}>
      <View style={styles.backcard} />
      <View style={styles.header}>
        <Text style={styles.title}>Crear nueva categoría</Text>
        <TextInput
          placeholder="Nombre de la categoría"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowEmojiPicker(true)} style={styles.emojiButton}>
          <Text style={styles.subtitle}>{emoji || 'Escoger un emoji'}</Text>
        </TouchableOpacity>
      </View>

      {/* Emoji Picker Modal */}
      <Modal visible={showEmojiPicker} animationType='slide'>
        <View style={styles.modalContainer}>
          <EmojiSelector
            onEmojiSelected={(selectedEmoji) => {
              setEmoji(selectedEmoji);
              setShowEmojiPicker(false);
            }}
            category={Categories.symbols}
          />
          <TouchableOpacity onPress={() => setShowEmojiPicker(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Color Picker Button */}
      <TouchableOpacity onPress={() => setShowColor(true)} style={[styles.colorButton, { backgroundColor: color }]}>
        <Text style={styles.colorButtonText}>Escoger color</Text>
      </TouchableOpacity>

      {/* Color Picker Modal */}
      <Modal visible={showColor} animationType='slide'>
        <View style={styles.modalContainer}>
          <ColorPicker value={color} onComplete={onSelectColor}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>
          <TouchableOpacity onPress={() => setShowColor(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseButtonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Save Button */}
      <TouchableOpacity onPress={handleSaveCategory} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Categoría</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Categorías existentes</Text>
      <View style={styles.listContainer}>
        <FlatList
          scrollEnabled
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
        />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

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
    padding: 12,
    marginBottom: 16,
    fontFamily: 'Regular',
  },
  emojiButton: {
    backgroundColor: '#9B7EDE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Medium',
  },
  colorButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  colorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Medium',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Bold',
  },
  listContainer: {
    marginTop: 10,
    flex: 1,
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
    fontFamily: 'Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CategoriesScreen;

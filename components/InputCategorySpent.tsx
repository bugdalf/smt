// componente de listado de botones

import { Theme, useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IconCategory from "./IconCatergory";

export default function InputCategorySpent() {

  const [selectedCategory, setSelectedCategory] = useState('');

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const categories = [
    { id: 1, name: 'Alimentos' },
    { id: 2, name: 'Transporte' },
    { id: 3, name: 'Salud' },
    { id: 4, name: 'Entretenimiento' },
    { id: 5, name: 'Otros' },
  ];

  return (
    <View style={styles.container}>
      <Text>Ingrese categoría:</Text>
      <IconCategory name="PiggyBank" color="red" size={20} />
      {categories.map((category) => (
        <Pressable
          key={category.id}
          style={[
            styles.button,
            selectedCategory === category.name && styles.selectedButton
          ]}
          onPress={() => setSelectedCategory(category.name)}>
          <Text style={[
            styles.buttonText,
            selectedCategory === category.name && styles.selectedButtonText
          ]}>{category.name}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontFamily: 'GeistMono-Regular',
    color: theme.colors.primary,
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
  },
  selectedButtonText: {
    color: theme.colors.background,
  },
})

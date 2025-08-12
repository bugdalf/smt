import { Theme, useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputInfoSpentProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function InputInfoSpent({
  label,
  value,
  onChangeText,
  placeholder = "Escribe aquí...",
  maxLength = 100,
}: InputInfoSpentProps) {

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [error, setError] = useState('');

  const handleChange = (text: string) => {
    setError('');
    if (text.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres`);
      return;
    }
    onChangeText(text);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 3,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  input: {
    fontFamily: 'GeistMono-Regular',
    color: theme.colors.text,
    fontSize: 16,
    padding: 12,
    minHeight: 48, // Altura mínima para el input
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'GeistMono-Light',
  },
  errorContainer: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
})
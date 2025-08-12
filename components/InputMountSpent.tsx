import { Theme, useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface InputMountSpentProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export default function InputMountSpent({label, value, onChangeText, placeholder = "0.00"}: InputMountSpentProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [error, setError] = useState('');

  // Solo números y punto decimal, máximo 2 decimales
  const handleChange = (text: string) => {
    setError('');

    let cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }

    const numericValue = parseFloat(cleaned);
    if (numericValue > 999999.99) {
      setError('Máximo S/ 999,999.99');
      return;
    }

    onChangeText(cleaned);
  };

  // const formatValue = () => {
  //   if (!value) return '';
  //   const num = parseFloat(value);
  //   if (isNaN(num)) return '';
  //   return num.toLocaleString('es-PE', {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   });
  // };

  return (
    <View style={styles.container}>
      <View style={[
        styles.currencyInputContainer,
        error && styles.errorContainer
      ]}>
        <Text style={styles.currencySymbol}>S/</Text>
        <TextInput
          style={styles.currencyInput}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 3
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    padding: 0,
  },
  currencySymbol: {
    fontFamily: 'GeistMono-Bold',
    fontSize: 16,
    color: theme.colors.text,
    paddingLeft: 12,
    paddingRight: 8,
  },
  currencyInput: {
    flex: 1,
    fontFamily: 'GeistMono-Regular',
    color: theme.colors.text,
    fontSize: 16,
    padding: 12,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 4,
  },
  errorContainer: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  output: {
    fontFamily: 'GeistMono-Light',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
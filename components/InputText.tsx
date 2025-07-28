import { Theme, useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// Paso 1: Definir la interface - qué datos necesita nuestro componente
interface InputTextProps {
  label: string;                    // Texto que aparece arriba del input
  value: string;                    // El valor actual del input
  onChangeText: (value: string) => void; // Función que se ejecuta cuando cambia el texto
  placeholder?: string;             // Texto de ejemplo (opcional)
  maxLength?: number;              // Máximo de caracteres (opcional)
  multiline?: boolean;             // Si permite múltiples líneas (opcional)
}

export default function InputText({
  label, 
  value, 
  onChangeText, 
  placeholder = "Escribe aquí...",
  maxLength = 100,
  multiline = false
}: InputTextProps) {
  
  // Paso 2: Usar el tema (colores) de tu app
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Paso 3: Estado para manejar si hay errores
  const [error, setError] = useState('');

  // Paso 4: Función para validar y procesar el texto
  const handleChange = (text: string) => {
    // Limpiar cualquier error previo
    setError('');

    // Validación: verificar longitud máxima
    if (text.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres`);
      return; // No actualizar si excede el límite
    }

    // Si todo está bien, actualizar el valor
    onChangeText(text);
  };

  // Paso 5: Renderizar el componente
  return (
    <View style={styles.container}>
      {/* Label - título del input */}
      <Text style={styles.label}>{label}</Text>
      
      {/* Container del input - incluye el borde y fondo */}
      <View style={[
        styles.inputContainer,
        error && styles.errorContainer, // Si hay error, cambiar estilo
        multiline && styles.multilineContainer // Si es multilinea, ajustar altura
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput
          ]}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'} // Para multilinea
        />
      </View>
      
      {/* Mostrar error si existe */}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {/* Contador de caracteres */}
      <Text style={styles.counter}>
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}

// Paso 6: Crear los estilos usando el tema
const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  label: {
    fontFamily: 'GeistMono-Light',
    marginBottom: 8,
    color: theme.colors.text,
    fontSize: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'GeistMono-Regular',
    color: theme.colors.text,
    fontSize: 16,
    padding: 12,
    minHeight: 48, // Altura mínima para el input
  },
  multilineContainer: {
    minHeight: 100, // Más altura para texto multilinea
  },
  multilineInput: {
    minHeight: 76, // Ajustar padding interno para multilinea
    textAlignVertical: 'top',
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
  counter: {
    fontFamily: 'GeistMono-Light',
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
});

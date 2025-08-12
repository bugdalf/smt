import { Theme, useTheme } from "@/contexts/ThemeContext";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import IconCategory from "./IconCatergory";
import InputCategorySpent from "./InputCategorySpent";
import InputInfoSpent from "./InputInfoSpent";
import InputMountSpent from "./InputMountSpent";

export default function SpentForm() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<schema.Category | undefined>(undefined);

  const handleSubmit = () => {
    console.log('Guardando...');
    console.log(amount, description, category);

    const insert = async () => {
      try {
        await drizzleDb.insert(schema.spent).values({
          amount: parseFloat(amount),
          description,
          category_id: category?.id || 0,
          date: new Date().toISOString(),
        });
        console.log('Guardado exitosamente');
      } catch (error) {
        console.error('Error al guardar:', error);
      }
    }
    insert();
  }

  return (
    <View style={styles.form}>
      <InputMountSpent
        label="Ingrese monto:"
        value={amount}
        onChangeText={setAmount}
      />
      <InputInfoSpent
        label="Ingrese descripción:"
        value={description}
        onChangeText={setDescription}
      />
      <InputCategorySpent
        category={category}
        onChangeCategory={setCategory}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <IconCategory name="ArrowBigUpDash" color="white" size={25} />
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  form: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    padding: 4
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 99,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

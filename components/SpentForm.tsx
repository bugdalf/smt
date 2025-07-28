import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import InputCategorySpent from "./InputCategorySpent";
import InputInfoSpent from "./InputInfoSpent";
import InputMountSpent from "./InputMountSpent";

export default function SpentForm() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

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
      <Button
        title="Guardar"
        onPress={handleSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    justifyContent: 'space-between',
    gap: 5,
    padding: 20
  },
})

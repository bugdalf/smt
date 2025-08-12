import { Theme, useTheme } from "@/contexts/ThemeContext";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconCategory, { IconName } from "./IconCatergory";
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
  const [categories, setCategories] = useState<schema.Category[]>([])

  const [isVisibleOptions, setIsVisibleOptions] = useState(true);

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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.categories.findMany();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      {isVisibleOptions && (
        <View style={styles.options}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.option}
              onPress={() => setCategory(category)}
            >
              <IconCategory name={category.icon as IconName} color={theme.colors.text} size={20} />
              <Text>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
          isVisibleOptions={isVisibleOptions}
          onSetVisibleOptions={setIsVisibleOptions}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <IconCategory name="ArrowBigUpDash" color="white" size={25} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    width: '100%',
  },
  options: {
    borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    gap: 2,
    padding: 4
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
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

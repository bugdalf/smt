import { ColorKey, Theme, useTheme } from "@/contexts/ThemeContext";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconCategory, { IconName } from "./IconCatergory";
import InputCategorySpent, { Category } from "./InputCategorySpent";
import InputInfoSpent from "./InputInfoSpent";
import InputMountSpent from "./InputMountSpent";

export default function SpentForm() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([])

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
        setCategories(data.map((category) => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color as ColorKey,
        })));
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
          {categories.map((category) => {
            const categoryColor = theme.colors[category.color];
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.option,
                  { backgroundColor: categoryColor }
                ]}
                onPress={() => setCategory(category)}
              >
                <IconCategory
                  name={category.icon as IconName}
                  color={'white'}
                  size={20}
                />
                <Text style={{
                  textAlign: 'center',
                  color: 'white',
                  fontFamily: 'GeistMono-Light',
                  fontSize: 11,
                }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  option: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    gap: 2,
    borderRadius: 6,
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

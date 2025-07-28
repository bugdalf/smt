// componente de listado de botones

import { Theme, useTheme } from "@/contexts/ThemeContext";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IconCategory, { IconName } from "./IconCatergory";

interface InputCategorySpentProps {
  category: schema.Category | undefined;
  onChangeCategory: (value: schema.Category) => void;
}

export default function InputCategorySpent({
  category,
  onChangeCategory,
}: InputCategorySpentProps) {
  const [categories, setCategories] = useState<schema.Category[]>([]);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { theme } = useTheme();
  const styles = createStyles(theme);


  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.categories.findMany();
        setCategories(data);
        console.log(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    load();
  }, []);

  return (
    <View>
      <Text style={styles.text}>Ingrese categoría:</Text>
      <View style={styles.container}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.button,
              category?.id === cat.id && styles.selectedButton
            ]}
            onPress={() => onChangeCategory(cat)}>
            <IconCategory name={cat.icon as IconName} color={category?.id === cat.id ? theme.colors.background : theme.colors.primary} size={20} />
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
  },
  text: {
    fontFamily: 'GeistMono-Regular',
    color: theme.colors.textSecondary,
  },
})

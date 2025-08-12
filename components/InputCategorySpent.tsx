// componente de listado de botones

import { Theme, useTheme } from "@/contexts/ThemeContext";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import IconCategory from "./IconCatergory";

interface InputCategorySpentProps {
  category: schema.Category | undefined;
  isVisibleOptions: boolean;
  onSetVisibleOptions: (value: boolean) => void;
}

export default function InputCategorySpent({
  category,
  isVisibleOptions,
  onSetVisibleOptions,
}: InputCategorySpentProps) {
  const [categories, setCategories] = useState<schema.Category[]>([]);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <TouchableOpacity
        style={styles.buttonTrigger}
        onPress={() => onSetVisibleOptions(!isVisibleOptions)}
        activeOpacity={0.7}
      >
        <IconCategory name="LayoutGrid" color={theme.colors.primary} size={20} />
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  buttonTrigger: {
    width: 42,
    height: 42,
    borderRadius: 99,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

})

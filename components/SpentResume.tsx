import { ColorKey, Theme, useTheme } from "@/contexts/ThemeContext";
import * as schema from '@/db/schema';
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import IconCategory, { IconName } from "./IconCatergory";

export default function SpentResume({ data, categories }: { data: schema.Spent[], categories: schema.Category[] }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  // Calcular directamente con useMemo (más eficiente)
  const total = useMemo(() => {
    return data.reduce((total, item) => total + item.amount, 0)
  }, [data]);

  const groups = useMemo(() => {
    return categories.map((category) => {
      return {
        category: category,
        amount: data.filter((item) => item.category_id === category.id).reduce((total, item) => total + item.amount, 0)
      }
    })
  }, [data, categories]);

  return (
    <View style={styles.container}>
      <View style={styles.total}>
        <Text>Total: </Text>
        <Text>{formatAmount(total)}</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {groups.map((group) => (
          <View key={group.category.id} style={styles.category}>
            <View style={styles.categoryIcon}>
              <View>
                <IconCategory name={group.category.icon as IconName} color={theme.colors[group.category.color as ColorKey]} size={20} />
              </View>
              <Text style={styles.categoryText}>{group.category.name}</Text>
            </View>
            <Text>{formatAmount(group.amount)}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
    backgroundColor: theme.colors.background,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 4,
    margin: 4,
    gap: 4,
  },
  categoryText: {
    fontFamily: 'GeistMono-Light',
    fontSize: 10,
    color: theme.colors.text,
  },
})
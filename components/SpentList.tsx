import { ColorKey, Theme, useTheme } from "@/contexts/ThemeContext";
import * as schema from "@/db/schema";
import { spent } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useMemo } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconCategory, { IconName } from "./IconCatergory";
import { Category } from "./InputCategorySpent";



// Tipado más específico para los datos de gastos
interface SpentItem {
  id: string | number;
  amount: number;
  description: string;
  category_id: string | number;
  date: string;
}

interface SpentListProps {
  setData: (data: schema.Spent[]) => void;
  data: schema.Spent[];
  categories: Category[];
  onItemPress?: (item: SpentItem) => void;
  emptyMessage?: string;
}

export default function SpentList({
  setData,
  data,
  categories,
  onItemPress,
  emptyMessage = "No hay gastos registrados"
}: SpentListProps) {

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  // Memoizar el mapeo de categorías para mejor rendimiento
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {} as Record<string | number, Category>);
  }, [categories]);

  // Formatear el monto como moneda
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const deleteItem = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este elemento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const filteredData = data.filter((item: schema.Spent) => item.id !== id);
            setData(filteredData);
            handleDeleteItem(id);
          },
        },
      ]
    );
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await drizzleDb.delete(spent).where(eq(spent.id, id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  }

  const renderSpentItem = ({ item }: { item: SpentItem }) => {
    const category = categoryMap[item.category_id];

    return (
      <View style={styles.itemContainer}>
        <View style={styles.categoryContainer}>
          <View>
            {category ? (
              <IconCategory name={category?.icon as IconName} color={theme.colors[category?.color as ColorKey]} size={20} />
            ) : (
              <IconCategory name="LayoutGrid" color={theme.colors.text} size={20} />
            )}
          </View>
        </View>
        <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteItem(Number(item.id))}
        >
          <IconCategory name="Trash" color={'red'} size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  // Mostrar mensaje vacío si no hay datos
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderSpentItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  amount: {
    width: 90,
    fontFamily: 'GeistMono-Light',
    fontSize: 14,
    color: theme.colors.text,
  },
  description: {
    flex: 1,
    fontFamily: 'GeistMono-Light',
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
  },
  deleteButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});
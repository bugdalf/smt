import IconCategory from '@/components/IconCatergory';
import { Category } from '@/components/InputCategorySpent';
import SpentForm from '@/components/SpentForm';
import SpentList from '@/components/SpentList';
import SpentResume from '@/components/SpentResume';
import { ColorKey, Theme, useTheme } from '@/contexts/ThemeContext';
import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Link } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [data, setData] = useState<schema.Spent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.spent.findMany();
        setData(data);
      } catch (error) {
        console.error('Error loading gastor:', error);
      }
    };
    load();
  }, [drizzleDb]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.categories.findMany();
        const categoriesData = data.map((category) => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color as ColorKey,
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    load();
  }, [drizzleDb]);

  return (
    <SafeAreaView style={styles.container} >
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Simple Money Tracker</Text>
          <Link href="/modalConfigCategories" style={styles.link}>
            <IconCategory name="Settings" color={theme.colors.text} size={20} />
          </Link>
        </View>
        <SpentResume data={data} categories={categories}/>
        <SpentList setData={setData} data={data} categories={categories}/>
        <SpentForm categories={categories}/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    position: 'relative',
  },
  link: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  title: {
    fontFamily: 'GeistMono-Light',
    fontWeight: '100',
    fontSize: 20,
    textAlign: 'center',
    color: theme.colors.text,
  }
});
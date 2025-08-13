import SpentForm from '@/components/SpentForm';
import SpentList from '@/components/SpentList';
import { Theme, useTheme } from '@/contexts/ThemeContext';
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
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.spent.findMany();
        setData(data);
        // console.log(data);
      } catch (error) {
        console.error('Error loading gastor:', error);
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
          <Link href="/modal">
            Configurar Categorías
          </Link>
        </View>
        <SpentList />
        <SpentForm />
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
  },
  title: {
    fontFamily: 'GeistMono-Light',
    fontWeight: '100',
    fontSize: 20,
    textAlign: 'center',
    color: theme.colors.text,
  }
});
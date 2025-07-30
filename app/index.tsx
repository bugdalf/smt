import SpentForm from '@/components/SpentForm';
import SpentList from '@/components/SpentList';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { KeyboardAvoidingView, useKeyboardAnimation } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [data, setData] = useState<schema.Spent[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { height, progress } = useKeyboardAnimation();

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });


  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.spent.findMany();
        setData(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
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
        </View>
        <SpentForm />
        <SpentList />
        <View style={styles.dataContainer}>
          {data.map((item) => (
            <View key={item.id} style={styles.taskContainer}>
              <Text style={styles.text}>{item.description}</Text>
              <Text style={styles.text}>{item.amount}</Text>
            </View>
          ))}
        </View>

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
    justifyContent: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
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
  },
  dataContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontFamily: 'GeistMono-Regular',
    fontWeight: '400',
    color: theme.colors.text,
    marginBottom: 5,
  }
});
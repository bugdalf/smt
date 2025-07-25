import InputSpent from '@/components/InputSpent';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [data, setData] = useState<schema.Task[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const [amount, setAmount] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await drizzleDb.query.tasks.findMany();
      setData(data);
    };
    load();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Simple Money Tracker</Text>
      <InputSpent label="Ingrese monto:" value={amount} onChangeText={setAmount} />
      
      {/* {data.map((item) => (
        <Text key={item.id} style={styles.text}>{item.name}</Text>
      ))} */}
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontFamily: 'GeistMono-Light',
    fontWeight: '100',
    color: theme.colors.text,
  },
  title2: {
    fontFamily: 'GeistMono-Regular',
    fontWeight: '200',
    color: theme.colors.text,
  },
  title3: {
    fontFamily: 'GeistMono-Medium',
    fontWeight: '300',
    color: theme.colors.text,
  },
  title4: {
    fontFamily: 'GeistMono-SemiBold',
    fontWeight: '400',
    color: theme.colors.text,
  },
  title5: {
    fontFamily: 'GeistMono-Bold',
    fontWeight: '500',
    color: theme.colors.text,
  },
  text: {
    fontFamily: 'GeistMono-Regular',
    fontWeight: '400',
    color: theme.colors.text,
  }
});

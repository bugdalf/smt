import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [data, setData] = useState<schema.Task[]>([]);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

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
      <Text style={styles.title2}>Simple Money Tracker</Text>
      <Text style={styles.title3}>Simple Money Tracker</Text>
      <Text style={styles.title4}>Simple Money Tracker</Text>
      <Text style={styles.title5}>Simple Money Tracker</Text>
      {/* {data.map((item) => (
        <Text key={item.id} style={styles.text}>{item.name}</Text>
      ))} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 2,
  },
  title: {
    fontFamily: 'GeistMono-Light',
    fontWeight: '100',
  },
  title2: {
    fontFamily: 'GeistMono-Regular',
    fontWeight: '200',
  },
  title3: {
    fontFamily: 'GeistMono-Medium',
    fontWeight: '300',
  },
  title4: {
    fontFamily: 'GeistMono-SemiBold',
    fontWeight: '400',
  },
  title5: {
    fontFamily: 'GeistMono-Bold',
    fontWeight: '500',
  }
});

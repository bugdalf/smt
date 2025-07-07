import migrations from '@/drizzle/migrations';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';

export const DATABASE_NAME = 'example';

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    console.log('success', success);
    console.log('error', error);
    if(success) {
      // addDummyData(db);
    }
  }, [success])

  return (
    <Suspense>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{enableChangeListener: true}}
        useSuspense
      >
        <Stack>
          <Stack.Screen name='index' options={{ title: 'Tasks' }}/>
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}

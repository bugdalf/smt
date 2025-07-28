import { ThemeProvider } from '@/contexts/ThemeContext';
import migrations from '@/drizzle/migrations';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import addDummyData from './addDummyData';

export const DATABASE_NAME = 'example';

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);

  const { success } = useMigrations(db, migrations);

  const [fontsLoaded] = useFonts({
    'GeistMono-Light': require('../assets/fonts/GeistMono-Light.ttf'), //300
    'GeistMono-Regular': require('../assets/fonts/GeistMono-Regular.ttf'), //400
    'GeistMono-Medium': require('../assets/fonts/GeistMono-Medium.ttf'), //500
    'GeistMono-SemiBold': require('../assets/fonts/GeistMono-SemiBold.ttf'), //600
    'GeistMono-Bold': require('../assets/fonts/GeistMono-Bold.ttf'), //700
  });

  useEffect(() => {
    if (success) {
      addDummyData(db);
    }
  }, [success])

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Suspense>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense
          >
            <Stack>
              <Stack.Screen name='index' options={{ title: 'Simple Money Tracker', headerShown: false }} />
            </Stack>
          </SQLiteProvider>
        </Suspense>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

import { ThemeProvider } from '@/contexts/ThemeContext';
import migrations from '@/drizzle/migrations';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import addDummyData from './addDummyData';

export const DATABASE_NAME = 'example';

// Componente interno que maneja las migraciones
function DatabaseManager() {
  console.log('DatabaseManager renderizado');

  const database = useSQLiteContext();
  console.log('useSQLiteContext obtenido:', !!database);

  const db = drizzle(database);
  console.log('drizzle db creado:', !!db);

  const { success, error } = useMigrations(db, migrations);
  console.log('Migration status - success:', success, 'error:', error);

  useEffect(() => {
    console.log('useEffect en DatabaseManager - success:', success, 'error:', error);
    // resetDatabase(db);
    if (success) {
      console.log('Ejecutando addDummyData...');
      try {
        addDummyData(db);
        console.log('addDummyData completado');
      } catch (err) {
        console.error('Error en addDummyData:', err);
      }
    }

    if (error) {
      console.error('Error en migraciones:', error);
    }
  }, [success, error, db]);

  return null;
}

export default function RootLayout() {
  console.log('RootLayout renderizado');

  const [fontsLoaded] = useFonts({
    'GeistMono-Light': require('../assets/fonts/GeistMono-Light.ttf'),
    'GeistMono-Regular': require('../assets/fonts/GeistMono-Regular.ttf'),
    'GeistMono-Medium': require('../assets/fonts/GeistMono-Medium.ttf'),
    'GeistMono-SemiBold': require('../assets/fonts/GeistMono-SemiBold.ttf'),
    'GeistMono-Bold': require('../assets/fonts/GeistMono-Bold.ttf'),
  });

  console.log('Fonts loaded:', fontsLoaded);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
        // Remover useSuspense para evitar problemas
        >
          <DatabaseManager />
          <KeyboardProvider>
            <Stack>
              <Stack.Screen
                name='index'
                options={{ title: 'Simple Money Tracker', headerShown: false }}
              />
              <Stack.Screen
                name="modalConfigCategories"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                }}
              />
            </Stack>
          </KeyboardProvider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
import InputInfoSpent from '@/components/InputInfoSpent';
import InputMountSpent from '@/components/InputMountSpent';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [data, setData] = useState<schema.Task[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.tasks.findMany();
        setData(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    load();
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container} >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Simple Money Tracker</Text>
            </View>
            
            <View style={styles.form}>
              <InputMountSpent 
                label="Ingrese monto:" 
                value={amount} 
                onChangeText={setAmount} 
              />
              <InputInfoSpent 
                label="Ingrese descripción:" 
                value={description} 
                onChangeText={setDescription} 
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontFamily: 'GeistMono-Light',
    fontWeight: '100',
    fontSize: 24,
    textAlign: 'center',
    color: theme.colors.text,
  },
  form: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
  },
  dataContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  text: {
    fontFamily: 'GeistMono-Regular',
    fontWeight: '400',
    color: theme.colors.text,
    marginBottom: 5,
  }
});
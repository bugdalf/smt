import TableCategories from "@/components/TableCategories";
import { Theme, useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from "react-native-safe-area-context";


export default function Modal() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Configuración de categorías</Text>
        </View>
        <TableCategories />
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
    justifyContent: 'flex-start',
    padding: 20
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  title: {
    fontFamily: 'GeistMono-SemiBold',
    fontWeight: '100',
    fontSize: 16,
    color: theme.colors.text,
  }
});
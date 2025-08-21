// componente de listado de botones

import { ColorKey, Theme, useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import IconCategory, { IconName } from "./IconCatergory";

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: ColorKey;
}

interface InputCategorySpentProps {
  category: Category | undefined;
  isVisibleOptions: boolean;
  onSetVisibleOptions: (value: boolean) => void;
}

export default function InputCategorySpent({
  category,
  isVisibleOptions,
  onSetVisibleOptions,
}: InputCategorySpentProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <TouchableOpacity
        style={[styles.buttonTrigger, { backgroundColor: theme.colors[category?.color as ColorKey] || theme.colors.primary }]}
        onPress={() => onSetVisibleOptions(!isVisibleOptions)}
        activeOpacity={0.7}
      >
        <IconCategory
          name={category?.icon as IconName || 'LayoutGrid'}
          color={'white'}
          size={20}
          bgColor={theme.colors[category?.color as ColorKey] || theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (theme: Theme) => StyleSheet.create({
  buttonTrigger: {
    width: 42,
    height: 42,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },

})

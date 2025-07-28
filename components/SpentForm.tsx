import { useState } from "react";
import { StyleSheet, View } from "react-native";
import InputCategorySpent from "./InputCategorySpent";
import InputInfoSpent from "./InputInfoSpent";
import InputMountSpent from "./InputMountSpent";

export default function SpentForm() {

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  return (
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
      <InputCategorySpent />
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    justifyContent: 'space-between',
    gap: 5,
    padding: 20
  },
})

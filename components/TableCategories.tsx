import { ColorKey, Theme, useTheme } from '@/contexts/ThemeContext';
import * as schema from "@/db/schema";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ListRenderItem, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IconCategory, { IconName } from './IconCatergory';
import { Category } from './InputCategorySpent';

// Tipificación para el formulario
interface FormData {
  nombre: string;
  icon: string;
  color: ColorKey;
}

export default function CrudTable() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  // Estados para el modal y formulario
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    icon: '',
    color: 'sky',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await drizzleDb.query.categories.findMany();
        setCategoriesData(data.map((category) => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color as ColorKey,
        })));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    load();
  }, []);

  // Función para abrir modal de creación
  const openCreateModal = (): void => {
    setEditingItem(null);
    setFormData({ nombre: '', icon: '', color: 'sky' });
    setModalVisible(true);
  };

  // Función para abrir modal de edición
  const openEditModal = (item: Category): void => {
    setEditingItem(item);
    setFormData({
      nombre: item.name,
      icon: item.icon,
      color: item.color,
    });
    setModalVisible(true);
  };

  // Función para crear nuevo elemento
  const createItem = (): void => {
    if (!formData.nombre || !formData.icon || !formData.color) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // const ageNumber = parseInt(formData.edad);
    // if (isNaN(ageNumber) || ageNumber <= 0) {
    //   Alert.alert('Error', 'La edad debe ser un número válido');
    //   return;
    // }

    const newItem: Category = {
      id: Date.now(),
      name: formData.nombre,
      icon: formData.icon,
      color: formData.color,
    };

    setCategoriesData([...categoriesData, newItem]);
    setModalVisible(false);
    setFormData({ nombre: '', icon: '', color: 'sky' });
  };

  // Función para actualizar elemento
  const updateItem = (): void => {
    if (!editingItem) return;
    
    if (!formData.nombre || !formData.icon || !formData.color) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // const ageNumber = parseInt(formData.edad);
    // if (isNaN(ageNumber) || ageNumber <= 0) {
    //   Alert.alert('Error', 'La edad debe ser un número válido');
    //   return;
    // }

    // const updatedData = data.map((item: User) =>
    //   item.id === editingItem.id
    //     ? {
    //         ...item,
    //         nombre: formData.nombre,
    //         email: formData.email,
    //         edad: ageNumber,
    //       }
    //     : item
    // );

    // setData(updatedData);
    setModalVisible(false);
    setEditingItem(null);
    setFormData({ nombre: '', icon: '', color: 'sky' });
  };

  // Función para eliminar elemento
  const deleteItem = (id: number): void => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este elemento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // const filteredData = data.filter((item: User) => item.id !== id);
            // setData(filteredData);
          },
        },
      ]
    );
  };

  // Función para guardar (crear o actualizar)
  const handleSave = (): void => {
    if (editingItem) {
      updateItem();
    } else {
      createItem();
    }
  };

  // Función para actualizar campos del formulario
  const updateFormField = (field: keyof FormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
  };

  // Renderizar cada fila de la tabla
  const renderTableRow: ListRenderItem<Category> = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { flex: 1.8 }]}>
        <Text style={styles.cellText}>{item.name}</Text>
      </View>
      <View style={[styles.tableCell, { alignItems: 'center' }]}>
        <IconCategory name={item.icon as IconName} color={theme.colors.text} size={20} />
      </View>
      <View style={[styles.tableCell, { alignItems: 'center' }]}>
        <View style={{ backgroundColor: item.color, width: 20, height: 20, borderRadius: 99 }} />
      </View>
      <View style={[styles.actionCell, { alignItems: 'flex-end' }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <IconCategory name="Pencil" size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteItem(item.id)}
        >
          <IconCategory name="Trash" color={'red'} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabecera con título y botón crear */}
      <TouchableOpacity style={styles.createButton} onPress={openCreateModal}>
        <Text style={styles.createButtonText}>+ Nueva Categoría</Text>
      </TouchableOpacity>

      {/* Cabecera de la tabla */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <View style={[styles.tableCell, { flex: 1.8 }]}>
            <Text style={styles.headerText}>Nombre</Text>
          </View>
          <View style={[styles.tableCell, { alignItems: 'center' }]}>
            <Text style={styles.headerText}>Icono</Text>
          </View>
          <View style={[styles.tableCell, { alignItems: 'center' }]}>
            <Text style={styles.headerText}>Color</Text>
          </View>
          <View style={styles.actionCell}>
            <Text style={styles.headerText}></Text>
          </View>
        </View>

        {/* Lista de datos */}
        <FlatList
          data={categoriesData}
          renderItem={renderTableRow}
          keyExtractor={(item: Category) => item.id.toString()}
          style={styles.table}
        />
      </View>


      {/* Modal para crear/editar */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Editar Categoría' : 'Nueva Categoría'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={formData.nombre}
              onChangeText={(text: string) => updateFormField('nombre', text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Icono"
              value={formData.icon}
              onChangeText={(text: string) => updateFormField('icon', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Color"
              value={formData.color}
              onChangeText={(text: string) => updateFormField('color', text)}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>
                  {editingItem ? 'Actualizar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 16,
    gap: 8
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: theme.colors.surface,
    borderWidth: 0.5,
  },
  table: {
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.surface,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  actionCell: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'GeistMono-Regular',
    fontSize: 14,
    color: theme.colors.text,
  },
  cellText: {
    fontFamily: 'GeistMono-Regular',
    fontSize: 14,
    color: '#333',
  },
  actionButton: {
    borderRadius: 4,
    marginHorizontal: 2,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'GeistMono-Bold',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    fontFamily: 'GeistMono-Regular',
    color: 'white',
    fontSize: 16,
  },
});

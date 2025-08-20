import { ColorKey, Theme, useTheme } from '@/contexts/ThemeContext';
import * as schema from "@/db/schema";
import { categories } from '@/db/schema';
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

// Lista de iconos disponibles de Lucide React
const AVAILABLE_ICONS: IconName[] = [
  'House', 'Car', 'ShoppingCart', 'Coffee', 'Utensils',
  'Heart', 'Music', 'Camera', 'Gamepad2', 'Book',
  'Plane', 'Bike', 'Bus', 'Ship',
  'Wallet', 'CreditCard', 'PiggyBank', 'Coins', 'Banknote',
  'Shirt', 'Watch', 'Glasses', 'Headphones', 'Smartphone',
  'Laptop', 'Tv', 'Monitor', 'Keyboard', 'Mouse',
  'Gift', 'PartyPopper', 'Cake', 'Pizza',
  'Dumbbell',
  'Stethoscope', 'Pill', 'Cross', 'Hospital', 'Ambulance',
  'GraduationCap', 'School', 'BookOpen', 'Pencil', 'Calculator',
  'MapPin', 'Globe', 'Compass', 'Mountain', 'Trees',
  'Sun', 'Moon', 'Star', 'Cloud', 'Umbrella'
];

// Lista de colores disponibles
const AVAILABLE_COLORS: { name: string; value: ColorKey; hex: string }[] = [
  { name: 'Azul Cielo', value: 'sky', hex: '#87CEEB' },
  { name: 'Azul', value: 'blue', hex: '#3B82F6' },
  { name: 'Verde', value: 'green', hex: '#10B981' },
  { name: 'Amarillo', value: 'yellow', hex: '#F59E0B' },
  { name: 'Rojo', value: 'red', hex: '#EF4444' },
  { name: 'Púrpura', value: 'purple', hex: '#8B5CF6' },
  { name: 'Rosa', value: 'pink', hex: '#EC4899' },
  { name: 'Naranja', value: 'orange', hex: '#F97316' },
  { name: 'Índigo', value: 'indigo', hex: '#6366F1' },
  { name: 'Esmeralda', value: 'emerald', hex: '#059669' },
  { name: 'Cian', value: 'cyan', hex: '#06B6D4' },
];

export default function CrudTable() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  // Estados para el modal y formulario
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [iconModalVisible, setIconModalVisible] = useState<boolean>(false);
  const [colorModalVisible, setColorModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    icon: 'House',
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
    setFormData({ nombre: '', icon: 'House', color: 'sky' });
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

  // Función para seleccionar icono
  const selectIcon = (iconName: IconName): void => {
    setFormData({ ...formData, icon: iconName });
    setIconModalVisible(false);
  };

  // Función para seleccionar color
  const selectColor = (colorKey: ColorKey): void => {
    setFormData({ ...formData, color: colorKey });
    setColorModalVisible(false);
  };

  // Función para crear nuevo elemento
  const createItem = async (): Promise<void> => {
    if (!formData.nombre || !formData.icon || !formData.color) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const newItem: Category = {
      id: Date.now(),
      name: formData.nombre,
      icon: formData.icon,
      color: formData.color,
    };

    // Insertar en la base de datos
    try {
      await drizzleDb.insert(categories).values(newItem);
    } catch (error) {
      console.error('Error creating category:', error);
    }

    setCategoriesData([...categoriesData, newItem]);
    setModalVisible(false);
    setFormData({ nombre: '', icon: 'House', color: 'sky' });
  };

  // Función para actualizar elemento
  const updateItem = async (): Promise<void> => {
    if (!editingItem) return;
    
    if (!formData.nombre || !formData.icon || !formData.color) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

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

  // Renderizar cada icono en el selector
  const renderIconItem = ({ item }: { item: IconName }) => (
    <TouchableOpacity
      style={styles.iconItem}
      onPress={() => selectIcon(item)}
    >
      <IconCategory name={item} size={28} color={theme.colors.text} />
    </TouchableOpacity>
  );

  // Renderizar cada color en el selector
  const renderColorItem = ({ item }: { item: { name: string; value: ColorKey; hex: string } }) => (
    <TouchableOpacity
      style={[styles.colorItem, { backgroundColor: item.hex }]}
      onPress={() => selectColor(item.value)}
    >
      {formData.color === item.value && (
        <View style={styles.colorSelected}>
          <IconCategory name="Check" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

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

            {/* Campo de icono con selector visual */}
            <View style={styles.iconInputContainer}>
              <Text style={styles.inputLabel}>Icono</Text>
              <TouchableOpacity
                style={styles.iconSelector}
                onPress={() => setIconModalVisible(true)}
              >
                <View style={styles.iconPreview}>
                  {formData.icon ? (
                    <IconCategory 
                      name={formData.icon as IconName} 
                      size={24} 
                      color={theme.colors.text} 
                    />
                  ) : (
                    <Text style={styles.iconPlaceholder}>Seleccionar</Text>
                  )}
                </View>
                <Text style={styles.iconSelectorText}>
                  {formData.icon || 'Toca para seleccionar un icono'}
                </Text>
                <IconCategory name="ChevronDown" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Campo de color con selector visual */}
            <View style={styles.colorInputContainer}>
              <Text style={styles.inputLabel}>Color</Text>
              <TouchableOpacity
                style={styles.colorSelector}
                onPress={() => setColorModalVisible(true)}
              >
                <View style={[styles.colorPreview, { backgroundColor: AVAILABLE_COLORS.find(c => c.value === formData.color)?.hex || '#87CEEB' }]} />
                <Text style={styles.colorSelectorText}>
                  {AVAILABLE_COLORS.find(c => c.value === formData.color)?.name || 'Seleccionar color'}
                </Text>
                <IconCategory name="ChevronDown" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

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

      {/* Modal selector de iconos */}
      <Modal
        visible={iconModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.iconModalOverlay}>
          <View style={styles.iconModalContent}>
            <View style={styles.iconModalHeader}>
              <Text style={styles.iconModalTitle}>Selecciona un Icono</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIconModalVisible(false)}
              >
                <IconCategory name="X" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={AVAILABLE_ICONS}
              renderItem={renderIconItem}
              keyExtractor={(item) => item}
              numColumns={4}
              style={styles.iconList}
              contentContainerStyle={styles.iconListContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal selector de colores */}
      <Modal
        visible={colorModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setColorModalVisible(false)}
      >
        <View style={styles.colorModalOverlay}>
          <View style={styles.colorModalContent}>
            <View style={styles.colorModalHeader}>
              <Text style={styles.colorModalTitle}>Selecciona un Color</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setColorModalVisible(false)}
              >
                <IconCategory name="X" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={AVAILABLE_COLORS}
              renderItem={renderColorItem}
              keyExtractor={(item) => item.value}
              numColumns={4}
              style={styles.colorList}
              contentContainerStyle={styles.colorListContainer}
              showsVerticalScrollIndicator={false}
            />
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
  inputLabel: {
    fontFamily: 'GeistMono-Regular',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  iconInputContainer: {
    marginBottom: 16,
  },
  iconSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  iconPreview: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconPlaceholder: {
    color: '#999',
    fontSize: 12,
  },
  iconSelectorText: {
    flex: 1,
    fontFamily: 'GeistMono-Regular',
    fontSize: 14,
    color: theme.colors.text,
  },
  colorInputContainer: {
    marginBottom: 16,
  },
  colorSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorSelectorText: {
    flex: 1,
    fontFamily: 'GeistMono-Regular',
    fontSize: 14,
    color: theme.colors.text,
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
  // Estilos para el modal de iconos
  iconModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    height: 300,
    maxHeight: '70%',
    padding: 10,
  },
  iconModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconModalTitle: {
    fontFamily: 'GeistMono-Bold',
    fontSize: 14,
    color: theme.colors.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  iconList: {
    flex: 1,
  },
  iconListContainer: {
    paddingBottom: 20,
  },
  iconItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    margin: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconName: {
    marginTop: 4,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'GeistMono-Regular',
  },
  // Estilos para el modal de colores
  colorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    height: 300,
    maxHeight: '70%',
    padding: 10,
  },
  colorModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorModalTitle: {
    fontFamily: 'GeistMono-Bold',
    fontSize: 14,
    color: theme.colors.text,
  },
  colorList: {
    flex: 1,
  },
  colorListContainer: {
    paddingBottom: 10,
  },
  colorItem: {
    flex: 1,
    margin: 4,
    padding: 8,
    borderRadius: 6,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 4,
  },
});
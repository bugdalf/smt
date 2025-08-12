import { categories } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';

export default async function addDummyData (db: ExpoSQLiteDatabase) {
  const value = AsyncStorage.getItemSync('dbInitialized');
  if (value) return;

  console.log('Inserting categories');

  await db.insert(categories).values([
    { name: 'Casados', icon: 'House', color: '#EF4444' },
    { name: 'Carro', icon: 'Car', color: '#3B82F6' },
    { name: 'Banco', icon: 'PiggyBank', color: '#22C55E' },
    { name: 'Comida', icon: 'Hamburger', color: '#22C55E' },
  ])

  AsyncStorage.setItemSync('dbInitialized', 'true');
}

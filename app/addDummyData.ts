import { categories } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';

export default async function addDummyData (db: ExpoSQLiteDatabase) {
  const value = AsyncStorage.getItemSync('dbInitialized');
  if (value) return;

  console.log('Inserting categories');

  await db.insert(categories).values([
    { name: 'Casa', icon: 'House', color: 'red' },
    { name: 'Carro', icon: 'Car', color: 'purple' },
    { name: 'Banco', icon: 'PiggyBank', color: 'blue' },
    { name: 'Comida', icon: 'Hamburger', color: 'green' },
  ])

  AsyncStorage.setItemSync('dbInitialized', 'true');
}

import { categories, spent } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';

export default async function addDummyData (db: ExpoSQLiteDatabase) {
  const value = AsyncStorage.getItemSync('dbInitialized');
  if (value) return;

  console.log('Inserting categories');

  await db.insert(categories).values([
    { name: 'Casa', icon: 'House' },
    { name: 'Carro', icon: 'Car' },
    { name: 'Banco', icon: 'PiggyBank' }, 
  ])

  console.log('Inserting tasks');

  await db.insert(spent).values([
    { amount: 100, description: 'Task 1', category_id: 1, date: new Date().toISOString() },
    { amount: 200, description: 'Task 2', category_id: 1, date: new Date().toISOString() },
    { amount: 300, description: 'Task 3', category_id: 1, date: new Date().toISOString() },
    { amount: 400, description: 'Task 4', category_id: 2, date: new Date().toISOString() },
    { amount: 500, description: 'Task 5', category_id: 2, date: new Date().toISOString() },
    { amount: 600, description: 'Task 6', category_id: 2, date: new Date().toISOString() },
  ])

  AsyncStorage.setItemSync('dbInitialized', 'true');
}

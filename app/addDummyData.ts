import { categories } from "@/db/schema";
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

  AsyncStorage.setItemSync('dbInitialized', 'true');
}

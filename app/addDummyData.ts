import { lists, tasks } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';

export default async function addDummyData (db: ExpoSQLiteDatabase) {
  const value = AsyncStorage.getItemSync('dbInitialized');
  if (value) return;

  console.log('Inserting lists');

  await db.insert(lists).values([
    { name: 'List 1' },
    { name: 'List 2' },
    { name: 'List 3' },
  ])

  console.log('Inserting tasks');

  await db.insert(tasks).values([
    { name: 'Task 1', list_id: 1 },
    { name: 'Task 2', list_id: 1 },
    { name: 'Task 3', list_id: 1 },
    { name: 'Task 4', list_id: 2 },
    { name: 'Task 5', list_id: 2 },
    { name: 'Task 6', list_id: 2 },
    { name: 'Task 7', list_id: 3 },
    { name: 'Task 8', list_id: 3 },
    { name: 'Task 9', list_id: 3 },
  ])

  AsyncStorage.setItemSync('dbInitialized', 'true');
}

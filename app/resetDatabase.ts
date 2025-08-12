import { categories, spent } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import AsyncStorage from 'expo-sqlite/kv-store';

export default async function resetDatabase(db: ExpoSQLiteDatabase) {
  console.log('Resetting database...');
  
  // Delete all data from tables
  await db.delete(spent);
  await db.delete(categories);

  // Reset AsyncStorage flag
  AsyncStorage.removeItemSync('dbInitialized');
  
  // Re-add dummy data
  // await addDummyData(db);
  
  console.log('Database reset complete');
}
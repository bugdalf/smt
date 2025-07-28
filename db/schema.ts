import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const spent = sqliteTable('spent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amount: real('amount').notNull(),
  description: text('description').notNull(),
  category_id: integer('category_id')
    .notNull()
    .references(() => categories.id),
  date: text('date').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
});

// Export Task to use as an interface in your app
export type Spent = typeof spent.$inferSelect;
export type Category = typeof categories.$inferSelect;
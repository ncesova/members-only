import {integer, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const postsTable = pgTable("posts_table", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, {onDelete: "cascade"}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

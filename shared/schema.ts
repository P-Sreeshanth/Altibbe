import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand"),
  category: text("category").notNull(),
  description: text("description"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  question: text("question").notNull(),
  answer: text("answer"),
  questionType: text("question_type").notNull(), // 'basic', 'ai_generated'
  metadata: json("metadata"), // Additional data like options, validation rules
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  transparencyScore: integer("transparency_score").notNull(),
  healthScore: integer("health_score").notNull(),
  ethicalScore: integer("ethical_score").notNull(),
  environmentalScore: integer("environmental_score").notNull(),
  keyFindings: json("key_findings").$type<string[]>().notNull(),
  recommendations: text("recommendations"),
  pdfPath: text("pdf_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const formSessions = pgTable("form_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id),
  currentStep: integer("current_step").default(1),
  formData: json("form_data"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  questions: many(questions),
  reports: many(reports),
  formSessions: many(formSessions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  product: one(products, {
    fields: [questions.productId],
    references: [products.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  product: one(products, {
    fields: [reports.productId],
    references: [products.id],
  }),
}));

export const formSessionsRelations = relations(formSessions, ({ one }) => ({
  product: one(products, {
    fields: [formSessions.productId],
    references: [products.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  userId: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export const insertFormSessionSchema = createInsertSchema(formSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertFormSession = z.infer<typeof insertFormSessionSchema>;
export type FormSession = typeof formSessions.$inferSelect;

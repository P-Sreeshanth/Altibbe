import { 
  users, products, questions, reports, formSessions,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Question, type InsertQuestion,
  type Report, type InsertReport,
  type FormSession, type InsertFormSession
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  getProductsByUser(userId: string): Promise<Product[]>;

  // Questions
  getQuestionsByProduct(productId: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question>;

  // Reports
  getReport(id: string): Promise<Report | undefined>;
  getReportByProduct(productId: string): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;

  // Form Sessions
  getFormSession(id: string): Promise<FormSession | undefined>;
  createFormSession(session: InsertFormSession): Promise<FormSession>;
  updateFormSession(id: string, session: Partial<InsertFormSession>): Promise<FormSession>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: string, updateProduct: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...updateProduct, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async getQuestionsByProduct(productId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.productId, productId));
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }

  async updateQuestion(id: string, updateQuestion: Partial<InsertQuestion>): Promise<Question> {
    const [question] = await db
      .update(questions)
      .set(updateQuestion)
      .where(eq(questions.id, id))
      .returning();
    return question;
  }

  async getReport(id: string): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || undefined;
  }

  async getReportByProduct(productId: string): Promise<Report | undefined> {
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.productId, productId))
      .orderBy(desc(reports.createdAt));
    return report || undefined;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db.insert(reports).values(insertReport).returning();
    return report;
  }

  async getFormSession(id: string): Promise<FormSession | undefined> {
    const [session] = await db.select().from(formSessions).where(eq(formSessions.id, id));
    return session || undefined;
  }

  async createFormSession(insertSession: InsertFormSession): Promise<FormSession> {
    const [session] = await db.insert(formSessions).values(insertSession).returning();
    return session;
  }

  async updateFormSession(id: string, updateSession: Partial<InsertFormSession>): Promise<FormSession> {
    const [session] = await db
      .update(formSessions)
      .set({ ...updateSession, updatedAt: new Date() })
      .where(eq(formSessions.id, id))
      .returning();
    return session;
  }
}

export const storage = new DatabaseStorage();

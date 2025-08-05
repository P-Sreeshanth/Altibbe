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

// Simple mock storage for development when database is not available
class MockStorage implements IStorage {
  private products: Product[] = [];
  private questions: Question[] = [];
  private reports: Report[] = [];
  private nextId = 1;
  private nextQuestionId = 1;
  private nextReportId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    throw new Error("Users not supported in mock storage");
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: (this.nextId++).toString(),
      name: product.name,
      brand: product.brand || null,
      category: product.category,
      description: product.description || null,
      userId: product.userId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    this.products[index] = {
      ...this.products[index],
      ...product,
      updatedAt: new Date()
    };
    return this.products[index];
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    return this.products.filter(p => p.userId === userId);
  }

  async getQuestionsByProduct(productId: string): Promise<Question[]> {
    return this.questions.filter(q => q.productId === productId);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const newQuestion: Question = {
      id: (this.nextQuestionId++).toString(),
      productId: question.productId,
      question: question.question,
      answer: question.answer || null,
      questionType: question.questionType,
      metadata: question.metadata,
      createdAt: new Date()
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }

  async updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question> {
    const index = this.questions.findIndex(q => q.id === id);
    if (index === -1) throw new Error("Question not found");
    
    this.questions[index] = {
      ...this.questions[index],
      ...question
    };
    return this.questions[index];
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.find(r => r.id === id);
  }

  async getReportByProduct(productId: string): Promise<Report | undefined> {
    return this.reports.find(r => r.productId === productId);
  }

  async createReport(report: InsertReport): Promise<Report> {
    const newReport: Report = {
      id: (this.nextReportId++).toString(),
      productId: report.productId,
      transparencyScore: report.transparencyScore,
      healthScore: report.healthScore,
      ethicalScore: report.ethicalScore,
      environmentalScore: report.environmentalScore,
      keyFindings: Array.isArray(report.keyFindings) ? report.keyFindings : [],
      recommendations: report.recommendations || null,
      pdfPath: report.pdfPath || null,
      createdAt: new Date()
    };
    this.reports.push(newReport);
    return newReport;
  }

  async getFormSession(id: string): Promise<FormSession | undefined> {
    return undefined;
  }

  async createFormSession(session: InsertFormSession): Promise<FormSession> {
    throw new Error("Form sessions not supported in mock storage");
  }

  async updateFormSession(id: string, session: Partial<InsertFormSession>): Promise<FormSession> {
    throw new Error("Form sessions not supported in mock storage");
  }
}

// Export the appropriate storage based on database availability
export const storage: IStorage = db ? new DatabaseStorage() : new MockStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFollowUpQuestions, calculateTransparencyScore } from "./services/gemini";
import { generatePDFReport } from "./services/pdf";
import { insertProductSchema, insertQuestionSchema, insertFormSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new product
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Invalid product data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Generate AI questions for a product
  app.post("/api/products/:id/generate-questions", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const existingQuestions = await storage.getQuestionsByProduct(product.id);
      const existingAnswers = existingQuestions.reduce((acc, q) => {
        if (q.answer) {
          acc[q.question] = q.answer;
        }
        return acc;
      }, {} as Record<string, any>);

      const aiQuestions = await generateFollowUpQuestions(
        product.name,
        product.category,
        product.description || undefined,
        existingAnswers
      );

      // Store generated questions in database
      for (const aiQuestion of aiQuestions) {
        await storage.createQuestion({
          productId: product.id,
          question: aiQuestion.question,
          questionType: 'ai_generated',
          metadata: {
            type: aiQuestion.type,
            options: aiQuestion.options
          }
        });
      }

      res.json({ questions: aiQuestions });
    } catch (error) {
      console.error("Error generating AI questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  // Get questions for a product
  app.get("/api/products/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestionsByProduct(req.params.id);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update question answer
  app.patch("/api/questions/:id", async (req, res) => {
    try {
      const { answer } = req.body;
      if (typeof answer !== 'string') {
        return res.status(400).json({ message: "Answer must be a string" });
      }

      const question = await storage.updateQuestion(req.params.id, { answer });
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Generate transparency report
  app.post("/api/products/:id/generate-report", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const questions = await storage.getQuestionsByProduct(product.id);
      const answeredQuestions = questions
        .filter(q => q.answer)
        .map(q => ({ question: q.question, answer: q.answer! }));

      const scoring = await calculateTransparencyScore({
        name: product.name,
        category: product.category,
        description: product.description || undefined,
        questions: answeredQuestions
      });

      const report = await storage.createReport({
        productId: product.id,
        transparencyScore: scoring.transparencyScore,
        healthScore: scoring.healthScore,
        ethicalScore: scoring.ethicalScore,
        environmentalScore: scoring.environmentalScore,
        keyFindings: scoring.keyFindings,
        recommendations: scoring.recommendations
      });

      res.json(report);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Get report for a product
  app.get("/api/products/:id/report", async (req, res) => {
    try {
      const report = await storage.getReportByProduct(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get report by ID
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Generate PDF report
  app.post("/api/reports/:id/pdf", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      const product = await storage.getProduct(report.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const questions = await storage.getQuestionsByProduct(product.id);
      const answeredQuestions = questions
        .filter(q => q.answer)
        .map(q => ({ question: q.question, answer: q.answer! }));

      const fileName = await generatePDFReport({
        product,
        report,
        questions: answeredQuestions
      });

      res.json({ fileName, downloadUrl: `/api/reports/download/${fileName}` });
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Download PDF report
  app.get("/api/reports/download/:fileName", (req, res) => {
    try {
      const fileName = req.params.fileName;
      const filePath = `./reports/${fileName}`;
      res.download(filePath, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(404).json({ message: "File not found" });
        }
      });
    } catch (error) {
      console.error("Error serving PDF:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Form session management
  app.post("/api/form-sessions", async (req, res) => {
    try {
      const validatedData = insertFormSessionSchema.parse(req.body);
      const session = await storage.createFormSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Error creating form session:", error);
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.patch("/api/form-sessions/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const session = await storage.updateFormSession(req.params.id, updateData);
      res.json(session);
    } catch (error) {
      console.error("Error updating form session:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/form-sessions/:id", async (req, res) => {
    try {
      const session = await storage.getFormSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching form session:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

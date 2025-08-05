# Overview

This is a full-stack Product Transparency Website that collects detailed product information through dynamic, AI-powered forms and generates comprehensive transparency reports. The application helps users make informed decisions about products by analyzing health, ethical, and environmental factors through intelligent questioning and scoring.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for robust form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **API Structure**: RESTful endpoints for products, questions, reports, and form sessions
- **AI Integration**: OpenAI GPT-4o for intelligent question generation and transparency scoring
- **PDF Generation**: PDFKit for creating downloadable transparency reports

## Database Schema
- **Products**: Core product information (name, brand, category, description)
- **Questions**: Dynamic AI-generated and basic questions with answers
- **Reports**: Transparency scoring with health, ethical, and environmental metrics
- **Form Sessions**: Multi-step form state management
- **Users**: Basic user authentication and product ownership

## Authentication & Sessions
- Session-based authentication using PostgreSQL session storage
- User-specific product access and report generation
- Secure API endpoints with proper error handling

## Multi-Step Form System
- Progressive form completion with state persistence
- AI-powered dynamic question generation based on product category and previous answers
- Real-time form validation and progress tracking
- Conditional logic for intelligent follow-up questions

## AI-Powered Features
- **Dynamic Question Generation**: Context-aware questions based on product type and category
- **Transparency Scoring**: Multi-dimensional scoring (health, ethical, environmental)
- **Report Generation**: AI-analyzed findings and recommendations

# External Dependencies

## Database
- **Neon Database**: PostgreSQL-compatible serverless database with connection pooling
- **Drizzle Kit**: Database migrations and schema management

## AI Services
- **OpenAI API**: GPT-4o model for question generation and product analysis
- **Natural Language Processing**: Intelligent follow-up question logic based on product context

## UI/UX Components
- **Radix UI**: Headless, accessible component primitives
- **Lucide React**: Consistent icon system
- **shadcn/ui**: Pre-built component library with Tailwind CSS

## Development Tools
- **Replit**: Development environment integration
- **Vite Plugins**: Runtime error overlay and development cartographer
- **TypeScript**: Type checking and IntelliSense across the stack

## File Processing
- **PDFKit**: Server-side PDF report generation
- **File System**: Local report storage with downloadable links

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Cookie-based sessions**: Secure user session management
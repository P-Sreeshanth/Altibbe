# Altibbe - Product Transparency Platform

AI-powered product transparency analysis platform that generates comprehensive reports on health, ethical, and environmental impact through intelligent questioning.

## 🌐 Live Demo
Visit: [https://p-sreeshanth.github.io/Altibbe/](https://p-sreeshanth.github.io/Altibbe/)

## 🚀 Quick GitHub Pages Deployment

### Method 1: Use Pre-built Files (Easiest)
1. All deployment files are in the `docs/` folder
2. Push this repository to GitHub
3. Go to Settings > Pages
4. Set source to "Deploy from a branch"
5. Select "main" branch and "/docs" folder
6. Save - your site will be live!

### Method 2: Build from Source
```bash
npm install
npm run build-github
```

## 📁 Project Structure
```
├── docs/                    # GitHub Pages deployment files
│   ├── index.html          # Main page
│   ├── 404.html           # SPA routing support
│   ├── favicon.svg        # Site icon
│   └── assets/            # CSS & JS files
├── client/                 # React frontend source
├── server/                # Express backend source
├── shared/                # Shared types & schema
└── build-for-github.sh    # Deployment script
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (for full functionality)

### Setup
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run build-github  # For GitHub Pages
```

## 🌟 Features
- **AI-Powered Questions**: Dynamic, context-aware product analysis
- **Transparency Scoring**: Multi-dimensional scoring (health, ethical, environmental)
- **PDF Reports**: Downloadable comprehensive analysis reports
- **Mobile-Responsive**: Works perfectly on all devices
- **SEO Optimized**: Proper meta tags and social sharing

## 🤖 AI Integration
- **Google Gemini API**: For intelligent question generation
- **Dynamic Analysis**: Context-aware follow-up questions
- **Scoring Algorithm**: AI-driven transparency metrics

## 📊 Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, PostgreSQL, Drizzle ORM
- **AI**: Google Gemini API
- **Deployment**: GitHub Pages, Replit

## 🔧 Configuration
Set up environment variables:
```bash
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_url
```

## 📝 License
MIT License - see LICENSE file for details

## 🤝 Contributing
Contributions welcome! Please read our contributing guidelines.

---
Built with ❤️ for product transparency and informed consumer decisions.
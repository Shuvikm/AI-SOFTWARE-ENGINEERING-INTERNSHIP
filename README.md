# OneAtlas — AI Model Discovery & Intelligence Platform

**OneAtlas** is a centralized, production-ready AI intelligence dashboard and exploration platform designed to help developers, AI researchers, and engineering leaders discover, evaluate, compare, and benchmark frontier AI foundation models from top global research labs and cloud providers.

---

## 🌟 Key Features

1. **AI Model Discovery & Explorer**
   - Live search by model name, description, and keywords.
   - Dynamic filters by AI Research Lab (Google DeepMind, OpenAI, Anthropic, Meta, Mistral, Cohere), Provider (Vertex AI, OpenAI Platform, Anthropic Console, Together AI, Groq), Category, and Capabilities.
   - Dual-view interface: Responsive Grid Cards and Detailed List View.
   - Sorting by Popularity, Benchmark Performance, Context Window size, and Release Date.
   - Server-side pagination.

2. **Dedicated Model Detail Pages (`/models/[slug]`)**
   - Comprehensive model architecture specifications (Context Window, Modalities, Token Pricing).
   - Verified benchmark evaluation scores (MMLU, HumanEval, GPQA, SWE-bench).
   - Supported capabilities checklist (multimodal reasoning, function calling, coding, vision).
   - Direct link to side-by-side comparison.

3. **Multi-Model Comparison Engine (`/compare`)**
   - Side-by-side comparative matrix supporting up to 4 AI models simultaneously.
   - Feature, pricing, context window, and modality comparison.
   - Direct benchmark score alignments.

4. **Frontier Rankings & Leaderboards (`/rankings`)**
   - Verified leaderboards across MMLU, HumanEval, GPQA, and SWE-bench.
   - Ranked tables with score indicators and direct model links.

5. **AI Research Labs & Providers Directory (`/companies`, `/providers`)**
   - Dedicated profiles for creator companies and hosting cloud providers.
   - Filtered rosters of models created and hosted by each entity.

6. **Global Search (`TopNavbar`)**
   - Instant multi-entity lookup across Models, Research Labs, and Providers with quick flyout navigation.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend API Handlers**:
  - `GET /api/models` (Search, filter, paginate, sort)
  - `GET /api/models/[slug]` (Single model detail)
  - `GET /api/providers` & `GET /api/providers/[slug]`
  - `GET /api/companies` & `GET /api/companies/[slug]`
  - `GET /api/benchmarks`
  - `GET /api/rankings`
  - `GET /api/search`
  - `GET /api/dashboard/stats`
- **Database**:
  - PostgreSQL hosted on **Neon PostgreSQL** (AWS US East 2 - Ohio)
  - **Prisma ORM 7** with `@prisma/adapter-pg` connection pool adapter.
  - Normalized schema: `Company`, `Provider`, `Model`, `Benchmark`, `ModelBenchmark`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ (Node.js 24 recommended)
- npm

### 2. Environment Variables
Ensure `.env` in `oneatlas/` contains your Neon PostgreSQL connection strings:

```env
DATABASE_URL="postgresql://neondb_owner:***@ep-flat-brook-bddmwuxe-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:***@ep-flat-brook-bddmwuxe.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Seeding
```bash
# Generate the Prisma 7 client
npx prisma generate

# Populate the database with 15 frontier models and verified benchmarks
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Production Build & Linting
```bash
npm run lint
npm run build
npm start
```

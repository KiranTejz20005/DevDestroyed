# 🔥 GitHub Profile Roaster (DevDestroyed)

**An AI-powered GitHub profile analyzer that creates personalized roasts based on developer activity, repositories, and coding patterns.**

---

## ✨ **Features**

### 🎭 **AI-Powered Analysis**
- Extracts and analyzes GitHub repository data and profile bio
- Identifies coding patterns, language preferences, and developer traits
- Generates personalized roasts based on project history
- Creates detailed breakdowns of strengths, weaknesses, love life, and life purpose

### 🎨 **Interactive Experience**
- Chat-style interface with typewriter effects
- Progressive story-mode interactions
- Yes/No question sequences that shape the final roast
- Smooth animations and transitions

### 🌐 **Multi-language Support**
- Complete internationalization with react-i18next
- Dynamic language switching without page reload
- Persistent language preferences

### 📱 **Responsive Design**
- Works seamlessly across all devices
- Optimized for both desktop and mobile
- Clean, modern UI with custom animations

---

## 🛠 **Tech Stack**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **react-i18next** - Internationalization

### **Backend**
- **Hono.js** - Lightweight web framework
- **Node.js** - JavaScript runtime
- **Supabase** - PostgreSQL database and authentication

### **APIs**
- **GitHub REST API** - Repository and profile data extraction
- **Google Gemini AI** - AI-powered content generation (with fallback to OpenRouter/Grok)

---

## 🚀 **Setup & Installation**

### **Prerequisites**
- Node.js 18+
- Supabase account (PostgreSQL database)
- Google Gemini API keys
- (Optional) GitHub Personal Access Token (for higher rate limits)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DevDestroyed
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd Backend
   npm install
   ```

3. **Database Setup**
   
   Run the [setup_supabase.sql](./Backend/setup_supabase.sql) script in your Supabase SQL Editor to create the necessary tables.

4. **Environment setup**
   
   Create `.env` in the Backend directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY_1=your_gemini_api_key_1
   # Add more API keys as needed
   GITHUB_TOKEN=your_github_token
   ```

5. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd Backend
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

---

## 🎮 **Usage**

1. **Enter a GitHub username** in the input field
2. **Wait for analysis** - The system fetches and analyzes the user's repository history
3. **Interactive chat** - Answer questions about the analysis
4. **View results** - Get a comprehensive roast with different categories

---

## 📄 **License**

This project is licensed under the MIT License.
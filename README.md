<h2>✨ DataMint <h2/>
Instantly generate, validate, and export real-world data with AI.

🚦 What the project does
DataMint is a full-stack, open-source platform that empowers you to:

🧠 Generate realistic JSON data from AI prompts or business templates

📑 Validate and preview your data in a beautiful, animated UI

📥 Export datasets as Excel files in one click

🔒 Authenticate securely with JWT-based login/register

📊 Track your activity with a real-time dashboard


💡 Why the project is useful
Save hours on test data creation for development, analytics, or demos

No more manual scripting—just describe your data or pick a template

Export to Excel instantly for sharing, importing, or reporting

Modern, responsive UI with glassmorphism and smooth animations

Open source—use, modify, or contribute freely


How users can get started with the project

Clone the repository:
bash
git clone https://github.com/Ved-ant11/DataMint.git
cd DataMint

Set up the backend:
bash
cd backend
cp .env.example .env    # Fill in your MongoDB URI, JWT secret, etc.
npm install
npm run dev
Set up the frontend:

bash
cd ../frontend
cp .env.example .env    # Set VITE_BACKEND_URL to your backend URL
npm install
npm run dev
Open in your browser:

Deploying?

Frontend: Deploy to Vercel

Backend: Deploy to Render

Set environment variables as described above.

📚 API Overview
Authentication
POST /api/auth/register — Register a new user

POST /api/auth/login — Login and receive JWT

GET /api/auth/me — Get current user (JWT required)

Data Generation
POST /api/json/generate-ai — Generate JSON from AI prompt

POST /api/json/generate — Generate JSON from a template

Excel Export
POST /api/excel/convert — Convert JSON to Excel, returns download link

GET /api/excel/download/:filename — Download Excel file

# Online Job Matching Portal for Local Workers

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to connect local skilled workers (electricians, plumbers, etc.) directly with employers, eliminating middlemen and promoting transparent hiring. Built to support SDG 8: Decent Work and Economic Growth.

## Features

- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Workers, Employers, and Admins.
- **Worker Portal:** Workers can manage their profiles (skills, experience, availability), browse jobs, and apply.
- **Employer Portal:** Employers can post job requirements, manage listings, and view applicants.
- **Admin Portal:** Admins can view platform statistics and manage (delete) users to maintain platform integrity.
- **Responsive UI:** Built with Vite, React, and Tailwind CSS for a modern, fast, and fully responsive user experience.
- **Authentication:** Secure JWT-based authentication with bcrypt password hashing.

## Tech Stack

- **Frontend:** React (Vite), React Router DOM, Tailwind CSS, Axios, React Hook Form, React Hot Toast, Lucide React.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Helmet, CORS, Morgan.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd <repository-directory>
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a \`.env\` file in the \`backend\` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal.
\`\`\`bash
cd frontend
npm install
\`\`\`
Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`

## Deployment Instructions

### Deploying the Backend (Render / Heroku)
1. Push your code to GitHub.
2. Create a new Web Service on Render and connect your repository.
3. Set the Root Directory to \`backend\`.
4. Build Command: \`npm install\`
5. Start Command: \`npm start\`
6. Add Environment Variables: \`MONGO_URI\`, \`JWT_SECRET\`, \`NODE_ENV=production\`.

### Deploying the Frontend (Vercel)
1. Import your GitHub repository to Vercel.
2. Set the Framework Preset to Vite.
3. Set the Root Directory to \`frontend\`.
4. Vercel will automatically configure the build command (\`npm run build\`).
5. Ensure that your backend API URL in the frontend is updated to point to your deployed backend (e.g., using environment variables in Vite like \`VITE_API_URL\`).

## Seed Data & Demo
Currently, you can simply register via the UI as a 'Worker' or 'Employer'. To access the admin dashboard, you can manually update a user's role to \`'admin'\` directly in your MongoDB database instance.

## Documentation
The application follows the MVC pattern on the backend and context-based state management on the frontend. Validation is handled on the client side using React Hook Form.

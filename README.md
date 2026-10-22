# Local Workers Job Portal

A full-stack MERN application that connects local skilled workers with employers, making it easier to discover job opportunities, publish job requirements, and manage applications through a centralized platform.

The project aims to support **UN Sustainable Development Goal 8: Decent Work and Economic Growth** by improving access to local employment opportunities and encouraging transparent hiring.

**Repository:** [local-workers-job-portal](https://github.com/vaishzz-18/local-workers-job-portal)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

Finding reliable local employment can be difficult for skilled workers, while employers may struggle to discover suitable candidates for short-term or skill-specific jobs.

The **Local Workers Job Portal** addresses this problem through a web-based platform where workers and employers can interact directly.

Workers can create profiles, present their skills and experience, explore job listings, and apply for relevant opportunities. Employers can publish job requirements, manage listings, and review applicants. An administrative interface supports platform oversight.

The application uses a React frontend, an Express and Node.js backend, and MongoDB for data persistence.

## Key Features

### Worker Portal

- Register and log in to the platform.
- Create and manage a worker profile.
- Maintain information about skills, experience, and availability.
- Browse available job opportunities.
- Apply for suitable jobs.
- Access relevant application and communication workflows supported by the application.

### Employer Portal

- Register and log in as an employer.
- Publish job requirements.
- Manage job listings.
- View applicants for posted jobs.
- Manage hiring-related activities through the employer interface.

### Admin Portal

- Access administrative functionality based on user roles.
- View platform statistics.
- Manage users, including deleting accounts where permitted.

### Authentication and Authorization

- JWT-based authentication.
- Password hashing with bcrypt.
- Role-based access for workers, employers, and administrators.
- Protected application functionality based on authentication and user roles.

### User Interface

- React-based single-page application.
- Client-side navigation with React Router.
- Responsive layouts styled with Tailwind CSS.
- Form handling and validation with React Hook Form.
- Toast notifications for user feedback.
- Lucide React icons.

### Communication

The application integrates Socket.IO for real-time communication. Cloudinary-related dependencies are included for media storage and upload workflows.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router DOM |
| Styling | Tailwind CSS |
| HTTP requests | Axios |
| Forms and validation | React Hook Form |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Security and middleware | Helmet, CORS, Morgan |
| Real-time communication | Socket.IO |
| Media services | Cloudinary integration |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## Application Architecture

The application follows a client-server architecture.

```text
                 ┌────────────────────────┐
                 │      User Browser      │
                 │   React + Vite UI      │
                 └───────────┬────────────┘
                             │
                      HTTP / REST API
                    Real-time Socket.IO
                             │
                 ┌───────────▼────────────┐
                 │   Express.js Backend   │
                 │ Authentication & APIs  │
                 │ Role-Based Access      │
                 └───────────┬────────────┘
                             │
                 ┌───────────▼────────────┐
                 │       MongoDB          │
                 │   Mongoose Models      │
                 └────────────────────────┘

                 External integrations:
                 Cloudinary media services
```

The frontend communicates with the backend through API requests. The backend processes requests, applies authentication and authorization where required, and interacts with MongoDB through Mongoose. Socket.IO supports real-time communication workflows.

## Project Structure

```text
local-workers-job-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

*The directory tree is illustrative; actual filenames and subdirectories may differ.*

## Getting Started

### Prerequisites

Install the following before running the application:

- [Node.js](https://nodejs.org/) — preferably a supported LTS release.
- npm, included with Node.js.
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a compatible MongoDB instance.
- [Git](https://git-scm.com/) to clone the repository.

### 1. Clone the Repository

```bash
git clone https://github.com/vaishzz-18/local-workers-job-portal.git
cd local-workers-job-portal
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend` directory. Add the following variables with your own configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
FRONTEND_URL=http://localhost:5173
```

If the application uses Cloudinary functionality, configure the Cloudinary credentials required by the backend as well. Use the exact variable names expected by your implementation.

**Never commit real credentials, database connection strings, or secret keys to GitHub.**

### 4. Install Frontend Dependencies

Open a second terminal from the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env` if required and configure the backend URL:

```env
VITE_API_URL=http://localhost:5000
```

Vite exposes variables prefixed with `VITE_` to frontend code. Do not place private credentials in frontend environment variables.

## Running the Application

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend should start on port `5000`, unless another port is configured.

### Start the Frontend

From the `frontend` directory, in a separate terminal:

```bash
npm run dev
```

Open the local URL printed by Vite, typically:

`http://localhost:5173`

Keep both development servers running while using the application.

## Deployment

The application can be deployed with a hosted frontend and backend.

### Backend — Render

1. Push the project to a GitHub repository.
2. Create a Web Service on [Render](https://render.com/).
3. Connect the repository.
4. Set the root directory to `backend`.
5. Set the build command to `npm install`.
6. Set the start command to `npm start`.
7. Configure the required environment variables in the Render dashboard.
8. Ensure the deployed backend can connect to the configured MongoDB instance.

Recommended backend environment variables:

```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Add `PORT` only if required by the hosting configuration; Render normally provides the port through the environment.

### Frontend — Vercel

1. Import the GitHub repository into [Vercel](https://vercel.com/).
2. Set the root directory to `frontend`.
3. Configure the Vite build command as `npm run build`.
4. Set the output directory to `dist`.
5. Add the environment variable:

```env
VITE_API_URL=https://your-backend-service.onrender.com
```

Replace the example domains with the actual deployed URLs.

After deployment, verify that CORS permits the frontend origin and that API requests and real-time connections reach the deployed backend.

## Security Considerations

- Store secrets and database credentials in environment variables.
- Keep `.env` files out of version control.
- Use a strong, randomly generated JWT secret.
- Restrict database access and configure MongoDB network access appropriately.
- Apply authentication and role-based authorization to protected backend routes.
- Configure CORS to permit only the intended frontend origins.
- Avoid exposing private credentials in client-side code or logs.

## Future Enhancements

Potential areas for further development include:

- Worker ratings and reviews.
- Advanced job search and filtering.
- Location-based job discovery.
- Email notifications for job and application updates.
- Improved accessibility and mobile usability.
- Automated testing and continuous integration.
- Enhanced analytics for employers and administrators.

These are proposed enhancements, not claims that every feature is currently implemented.

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with a descriptive message.
5. Open a pull request describing the improvement.

## License

No license has been specified for this repository yet. Add an appropriate license before distributing the project under open-source terms.

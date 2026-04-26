# SocialSphere: Full-Stack Social Engineering

A comprehensive social media platform built with focus on high-performance real-time interactions, data-driven insights, and a polished, professional-grade user experience. 

SocialSphere is a full-stack application developed using the MERN stack (MongoDB, Express, React, Node.js) with a heavy emphasis on architectural clean code, real-time communication, and visual analytics.

## Core Architecture

The project follows a standard monorepo structure, separating concerns between a robust Node.js backend and a highly responsive React frontend.

### Backend (Node.js & Express)
The backend is architected for scalability and maintainability, utilizing an MVC-like pattern for clear separation of logic:
- **Authentication**: Implemented using JWT (JSON Web Tokens) with a dual-token strategy (Access & Refresh tokens) and httpOnly cookies to mitigate XSS and CSRF risks.
- **Real-time Engine**: Built on Socket.IO for instant messaging, real-time notifications, and live engagement updates.
- **Data Modeling**: Mongoose schemas are optimized for relational-style social interactions (follows, likes, threaded comments) while maintaining MongoDB's flexibility.
- **Middleware Architecture**: Utilizes global error handling, file-upload processing (Multer), and multi-layered request validation.

### Frontend (React & Vite)
The client-side experience is built for speed and visual excellence:
- **State Management**: Built on React Context API for lightweight, efficient state synchronization across the auth lifecycle.
- **Design System**: A custom-built CSS design system featuring premium glassmorphism, responsive layouts, and a high-contrast Bright Mode toggle.
- **Data Visualization**: Integrated Recharts for rendering complex user activity and engagement metrics.
- **Optimization**: Leverages Vite for near-instant build times and optimized asset loading.

## Project Structure

```text
social-media-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and third-party configs
│   │   ├── controllers/    # Business logic for all endpoints
│   │   ├── middleware/     # Auth guards, file uploaders, error handlers
│   │   ├── models/         # Mongoose schemas (User, Post, Message, etc.)
│   │   ├── routes/         # Express route definitions
│   │   ├── utils/          # Standardized response/error helpers
│   │   └── socket.js       # Real-time WebSocket initialization
│   └── public/temp/        # Temporary storage for media processing
└── frontend/
    ├── src/
    │   ├── api/            # Axios instance and service layers
    │   ├── components/     # Reusable UI modules (PostCard, Header, etc.)
    │   ├── context/        # Auth and global state providers
    │   ├── pages/          # Full-page view components
    │   ├── styles/         # Global design system (CSS variables)
    │   └── App.jsx         # Main routing and guard logic
    └── public/             # Static assets
```

## Design Philosophy

SocialSphere was designed with a **"Glass-First"** aesthetic. By utilizing semi-transparent surfaces with backdrop-filters, the UI maintains a sense of depth and hierarchy. The primary accent color (Vivid Indigo) was selected for its high visibility in both Dark and Bright modes, ensuring that call-to-action elements remain striking regardless of the user's theme preference.

## Security & Performance

- **DDoS Mitigation**: Implemented body-parser limits (16kb) to prevent payload-based attacks.
- **XSS Protection**: Controlled rendering of user-generated content and secure cookie handling.
- **Optimistic Updates**: Frontend interactions (likes/follows) are designed to feel instantaneous through proactive state management.
- **Scalable Real-time**: Socket events are structured for efficient broadcasting, minimizing server overhead.

## Environment Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
```

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

**Author**: Ranit Naskar  
**Version**: 1.0.0

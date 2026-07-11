# SecureShield AI

**AI-Powered Application Security & Website Security Analysis Platform**

SecureShield AI is an enterprise-grade Application Security Platform that allows security engineers and developers to scan websites for security weaknesses. It analyzes HTTP security headers, cookies, SSL/TLS configurations, and detects the underlying technology stack. Furthermore, it integrates with OpenAI to generate a comprehensive executive summary and OWASP vulnerability mapping.

## Features

- **Automated Scanning**: Instantly detect vulnerabilities in HTTP headers, cookies, and SSL/TLS configurations.
- **AI-Powered Reports**: Get deep insights and remediation steps mapped to OWASP standards using advanced AI.
- **Real-time Dashboard**: Track your security posture over time with an intuitive dashboard and scoring system.
- **PDF Export**: Download detailed security reports as PDF files.
- **Authentication**: Secure JWT-based authentication system.

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS, Chart.js, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Helmet, Rate Limiter
- **AI & Integrations**: OpenAI API, PDFKit

## Project Structure

```
SecureShield-AI/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth Context
│   │   ├── layouts/     # Dashboard layouts
│   │   ├── pages/       # Landing, Login, Dashboard, Scanner, etc.
│   │   ├── App.jsx      # Router configuration
│   │   └── main.jsx     # App entry point
│   └── tailwind.config.js
└── server/              # Node.js backend
    ├── src/
    │   ├── config/      # Database config
    │   ├── controllers/ # API controllers
    │   ├── middleware/  # Auth & error middleware
    │   ├── models/      # Mongoose schemas (User, Scan, Report)
    │   ├── routes/      # Express routes
    │   ├── scanner/     # Core scanning logic (Headers, Cookies, SSL)
    │   └── services/    # AI Service and PDF Service
    ├── server.js        # Server entry point
    └── .env             # Environment variables
```

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secureshield
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
OPENAI_API_KEY=your_openai_api_key
```

## Installation & Setup

1. **Clone the repository** (or navigate to the directory):
   ```bash
   cd SecureShield-AI
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   # Configure your .env file with MongoDB URI and OpenAI Key
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## API Documentation

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user and return JWT
- `GET /api/auth/profile`: Get logged-in user profile
- `POST /api/scan`: Initiate a new scan for a target URL
- `GET /api/scans`: Get all previous scans for the user
- `GET /api/report/:id`: Get the detailed AI report for a scan
- `GET /api/report/:id/pdf`: Download the scan report as a PDF
- `DELETE /api/scan/:id`: Delete a scan history

## Future Enhancements

- Subdomain enumeration using external APIs
- Deeper OWASP ZAP automated integration
- Webhook integrations for CI/CD pipelines
- Team management and multi-tenant capabilities

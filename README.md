# Galkacyo Digital Market

A full-stack e-commerce platform for the Galkacyo Digital Market.

## Features
- Multi-vendor support (Shops)
- Product listing and details
- User authentication and profiles
- Admin dashboard
- WhatsApp integration for purchases

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI

### Installation
1.  Install dependencies:
    ```bash
    npm run install-all
    ```

2.  Environment Variables:
    Create `server/.env` with:
    ```
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```

3.  Run the app:
    ```bash
    npm start
    ```

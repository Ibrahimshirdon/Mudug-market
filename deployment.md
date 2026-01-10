# Mudug Market Deployment Guide

This guide describes how to deploy the Mudug Market application to **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites

- A GitHub account.
- The project pushed to a GitHub repository.

## Step 1: Push to GitHub

1.  Open your terminal in the project root.
2.  Run the following commands:
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

## Step 2: Deploy Backend (Render)

1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    -   **Name**: `mudug-backend` (or similar)
    -   **Root Directory**: `backend`
    -   **Environment**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
5.  **Environment Variables**:
    -   Click "Advanced" or "Environment Variables".
    -   Add `MONGODB_URI`: (Your actual MongoDB connection string from MongoDB Atlas).
    -   Add `JWT_SECRET`: (A generic random string).
    -   Add `PORT`: `10000` (Render default).
6.  Click **Create Web Service**.
7.  Wait for deployment. Once live, copy your backend URL (e.g., `https://mudug-backend.onrender.com`).

## Step 3: Deploy Frontend (Vercel)

1.  Go to [vercel.com](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    -   **Framework Preset**: Vite
    -   **Root Directory**: `frontend` (Click Edit to select the `frontend` folder).
5.  **Environment Variables**:
    -   Expand "Environment Variables".
    -   Key: `VITE_API_URL`
    -   Value: Your Render Backend URL (e.g., `https://mudug-backend.onrender.com/api`).
    -   **Important**: Do not include a trailing slash, and ensure `/api` is appended if your routes expect it (our config logic adds paths like `/auth/login` to this base).
        -   If your backend endpoints are at `/api/...`, set `VITE_API_URL` to `https://mudug-backend.onrender.com/api`.
6.  Click **Deploy**.

## Important Notes

-   **Image Uploads**: Since this app uses local file storage (`uploads/` folder), uploaded images **will disappear** whenever the Render server creates a new deployment or restarts. For production, you should migrate to a cloud storage service like Cloudinary or AWS S3.

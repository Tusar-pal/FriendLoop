# 🚀 FriendLoop

FriendLoop is a modern full-stack social media web application where users can connect with friends, share posts, interact with content, discover new users, and communicate through real-time messaging.

This project was built to gain hands-on experience with real-world full-stack development, authentication, API integration, database management, image uploading, and real-time communication.

## 🌐 Live Demo

🔗 [Live Demo](YOUR_LIVE_DEMO_URL)

## 📂 GitHub Repository

🔗 [GitHub Repository](YOUR_GITHUB_REPO_URL)

---

## ✨ Features

### 🔐 Authentication
- Secure user authentication using Clerk
- User profile management
- Protected routes
- User session handling

### 👥 Social Features
- Create posts
- Like and interact with posts
- Connect with other users
- Discover new users
- View user profiles
- Manage connections

### 💬 Real-Time Messaging
- One-to-one messaging
- Real-time message updates
- Chat interface
- Online connection handling using Server-Sent Events (SSE)

### 🖼️ Media Upload
- Upload profile images
- Upload post images
- Image storage and optimization using ImageKit
- File handling using Multer

### 🔔 Notifications & Updates
- Real-time updates
- Connection requests
- Social interactions

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Tailwind CSS
- Axios
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- Clerk

### Media & File Handling
- ImageKit
- Multer

### Real-Time Communication
- Server-Sent Events (SSE)

### Development Tools
- Git
- GitHub
- Vercel

---

## 📸 Screenshots

### 🏠 Home / Feed

![Feed Screenshot](YOUR_SCREENSHOT_URL)

### 🔍 Discover

![Discover Screenshot](YOUR_SCREENSHOT_URL)

### 💬 Messages

![Messages Screenshot](YOUR_SCREENSHOT_URL)

### 👤 Profile

![Profile Screenshot](YOUR_SCREENSHOT_URL)

---

## ⚙️ Installation

Follow these steps to run FriendLoop locally.

### 1. Clone the repository

### 2. Navigate to the project
cd FriendLoop

### 3. Install frontend dependencies
cd client
npm install

### 4.Install backend dependencies
cd ../server
npm install

### Create a .env file inside the server directory.
PORT=3000
MONGODB_URI=your_mongodb_connection_string

CLERK_SECRET_KEY=your_clerk_secret_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
### For the frontend, create a .env file:
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=your_backend_url

### Start Backend
cd server
npm run server

### Start Frontend
cd client
npm run dev
http://localhost:5173


# 📁 Project Structure

FriendLoop/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── configs/
│   └── server.js
│
├── .gitignore
└── README.md

## 👨‍💻 Author
Tusar Pal

B.Tech CSE Student | Full Stack MERN Developer

Passionate about building real-world applications and continuously improving my development skills.

🔗 GitHub: https://github.com/Tusar-pal/FriendLoop

🔗 LinkedIn: https://www.linkedin.com/in/tusar-pal-633864337?utm_source=share_via&utm_content=profile&utm_medium=member_android
```bash
git clone YOUR_GITHUB_REPO_URL




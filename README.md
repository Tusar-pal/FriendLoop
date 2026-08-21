# 🚀 FriendLoop

FriendLoop is a modern **full-stack social media web application** where users can connect with friends, share posts, interact with content, discover new users, and communicate through real-time messaging.

This project was built to gain hands-on experience with **real-world full-stack development, authentication, REST APIs, database management, media uploads, and real-time communication**.

---

## 🌐 Live Demo

🔗 **Live Demo:** [FriendLoop](https://friend-loop-14g5.vercel.app/)


---

## 📂 GitHub Repository

🔗 **Repository:** [FriendLoop on GitHub](https://github.com/Tusar-pal/FriendLoop)

---

## ✨ Features

### 🔐 Authentication

* Secure authentication using **Clerk**
* User registration and login
* User session management
* Protected application routes
* User profile management

### 👥 Social Features

* Create and publish posts
* Like posts
* View and interact with posts
* Send and manage connection requests
* Connect with other users
* Discover new users
* View user profiles
* Manage connections

### 💬 Real-Time Messaging

* One-to-one private messaging
* Real-time message updates
* Dedicated chat interface
* Online connection handling
* Real-time communication using **Server-Sent Events (SSE)**

### 🖼️ Media Upload

* Upload profile pictures
* Upload images with posts
* Image storage using **ImageKit**
* Image optimization and delivery
* File handling using **Multer**

### 🔔 Notifications & Updates

* Connection request updates
* Social interaction updates
* Real-time application updates

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **Vite**
* **React Router**
* **Tailwind CSS**
* **Axios**
* **JavaScript**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**

### Authentication

* **Clerk**

### Media & File Handling

* **ImageKit**
* **Multer**

### Real-Time Communication

* **Server-Sent Events (SSE)**

### Development & Deployment

* **Git**
* **GitHub**
* **Vercel**

---

## 📸 Screenshots

### 🏠 Home / Feed

<img width="1847" height="853" alt="FriendLoop Feed" src="https://github.com/user-attachments/assets/fdaed205-04a2-4d4b-8367-71d50d7b2088" />

<img width="1873" height="803" alt="FriendLoop Feed 2" src="https://github.com/user-attachments/assets/36e6cca1-e277-4da0-aa0a-7282159aacc1" />

---

### 🔍 Discover

<img width="1919" height="806" alt="FriendLoop Discover" src="https://github.com/user-attachments/assets/e7b83cde-c04a-49db-82ac-a073d9bd3278" />

---

### 💬 Messages

<img width="1879" height="882" alt="FriendLoop Messages" src="https://github.com/user-attachments/assets/e45d44e3-df98-4223-9262-2ac0a4be6d66" />

<img width="1870" height="921" alt="FriendLoop Chat" src="https://github.com/user-attachments/assets/58406c23-dedd-4f65-819e-c43541e8739f" />

---

### 👤 Profile

<img width="1902" height="806" alt="FriendLoop Profile" src="https://github.com/user-attachments/assets/928e7bd4-57f9-4550-a2fb-2140c81476a0" />

---

## ⚙️ Installation

Follow the steps below to run FriendLoop locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Tusar-pal/FriendLoop.git
```

### 2. Navigate to the Project

```bash
cd FriendLoop
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Install Backend Dependencies

Open another terminal or navigate back to the project root:

```bash
cd ../server
npm install
```

---

## 🔐 Environment Variables

### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

CLERK_SECRET_KEY=your_clerk_secret_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### Frontend

Create a `.env` file inside the `client` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

VITE_BACKEND_URL=your_backend_url
```

> ⚠️ Never commit your `.env` files or secret API keys to GitHub.

---

## ▶️ Run the Application

### Start the Backend

From the `server` directory:

```bash
npm run server
```

The backend will run on:

```text
http://localhost:3000
```

### Start the Frontend

Open another terminal and navigate to the client directory:

```bash
cd client
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 📁 Project Structure

```text
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
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── configs/
│   ├── server.js
│   └── ...
│
├── .gitignore
└── README.md
```

---

## 🔄 Application Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ React Frontend   │
                         │ Vite + Tailwind  │
                         └────────┬─────────┘
                                  │
                           REST API / SSE
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Express Backend  │
                         │    Node.js       │
                         └───────┬──────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        ┌──────────┐       ┌──────────┐      ┌──────────┐
        │ MongoDB  │       │  Clerk   │      │ ImageKit │
        │ Database │       │   Auth   │      │  Media   │
        └──────────┘       └──────────┘      └──────────┘
```

---

## 🎯 Project Goals

The main goals of building FriendLoop were to:

* Improve full-stack development skills
* Understand real-world MERN architecture
* Implement authentication using Clerk
* Build and consume REST APIs
* Work with MongoDB and Mongoose
* Implement image upload functionality
* Understand real-time communication using SSE
* Build responsive and user-friendly interfaces
* Practice Git and GitHub workflow
* Deploy a full-stack application

---

## 🚀 Future Improvements

Some features planned for future versions include:

* Push notifications
* Group conversations
* Post comments
* Story sharing
* Advanced user search
* Improved notification system
* Message read receipts
* Typing indicators
* Dark mode
* Advanced privacy settings

---

## 👨‍💻 Author

### Tusar Pal

**B.Tech CSE Student | Full Stack MERN Developer**

Passionate about building real-world applications, solving problems, and continuously improving development skills.

### Connect With Me

* 💻 GitHub: [Tusar Pal](https://github.com/Tusar-pal)
* 🔗 LinkedIn: [Tusar Pal](https://www.linkedin.com/in/tusar-pal-633864337/)

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub.

Thanks for checking out **FriendLoop**! 🚀

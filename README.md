# 🚀 Team Task Manager

A modern full-stack Team Task Management application built with **Next.js**, **MongoDB Atlas**, and **Tailwind CSS**.

This platform enables teams to collaboratively manage projects, assign tasks, monitor progress, and streamline workflow with secure role-based access control.

---

# 🌐 Live Demo

### 🔗 Live Application
masktanager-production.up.railway.app

### 💻 GitHub Repository
https://github.com/mukuln18/MaskTanager.git
---

# ✨ Features

## 🔐 Authentication & Authorization
- Secure Signup/Login system
- JWT Authentication using HTTP-only cookies
- Password hashing with bcrypt
- Protected routes & middleware
- Role-based access control (Admin / Member)

---

## 📁 Project Management
- Create and manage projects
- Add/remove project members
- Track project progress
- Project-based task organization

---

## ✅ Task Management
- Create tasks with due dates
- Assign tasks to team members
- Update task status:
  - Todo
  - In Progress
  - Done
- Overdue task detection
- Task filtering & organization

---

## 📊 Dashboard & Analytics
- Total tasks overview
- Completed task tracking
- Overdue task monitoring
- Recent activity section
- Progress indicators

---

## 🎨 UI/UX
- Modern SaaS-inspired interface
- Fully responsive design
- Clean dashboard layout
- Loading states & empty states
- Reusable UI components
- Built with shadcn/ui + Tailwind CSS

---

# 🛠 Tech Stack

## Frontend
- Next.js 16+ (App Router)
- React 19
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Backend
- Next.js Route Handlers
- REST APIs
- JWT Authentication

## Database
- MongoDB Atlas
- Mongoose ODM

## Security
- bcryptjs
- jose (Edge-compatible JWT)

---

# 📂 Project Structure

```bash
app/
components/
contexts/
lib/
models/
middleware/
public/
```

---

# ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=ADD_YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=ADD_YOUR_SECRET_KEY
JWT_EXPIRES_IN=7d
```

---

# 🚀 Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone ADD_YOUR_GITHUB_REPO_LINK
cd ADD_YOUR_PROJECT_FOLDER_NAME
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Run Development Server

```bash
npm run dev
```

Application runs on:

```bash
http://localhost:3000
```

---

# 👤 Default Admin Logic

The **first registered user** automatically becomes:

```bash
Admin
```

Admins can:
- Create/Delete projects
- Manage users
- Assign project members
- Control project access

---

# 🌐 Deployment (Railway)

This project is optimized for Railway deployment.

## Steps

### 1️⃣ Push project to GitHub

### 2️⃣ Connect repository to Railway

### 3️⃣ Add Environment Variables in Railway

```env
MONGODB_URI=ADD_MONGODB_URI
JWT_SECRET=ADD_SECRET
```

### 4️⃣ Deploy Application

Railway automatically detects Next.js and deploys the app.

---

# 🧪 Production Readiness

✅ Responsive UI  
✅ Secure Authentication  
✅ Protected APIs  
✅ Role-Based Access Control  
✅ Error Handling  
✅ Loading & Empty States  
✅ Clean Scalable Architecture  
✅ Production Build Verified  

---

# 📌 Future Improvements

- Drag & Drop Kanban Board
- Real-time Notifications
- Team Chat
- Activity Timeline
- Email Invitations
- Dark Mode

---

# 👨‍💻 Author

### Name
Mukul

### Role
Full-Stack Developer

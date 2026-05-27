# Task Manager

A full-stack, production-ready Project & Task Management application built with Next.js (App Router), MongoDB, and Tailwind CSS. Designed to provide teams with a seamless experience for managing projects, assigning tasks, and tracking progress.

## 🚀 Features

- **Robust Authentication**: Secure JWT-based authentication with HTTP-only cookies and route-protection middleware.
- **Role-Based Access Control**: Differentiated `admin` and `member` roles. Admins have global privileges (creating projects, managing global users), while members interact within assigned projects.
- **Project Management**: Create, edit, and manage projects. View real-time progress rings tracking task completion.
- **Task Management**: Create tasks, assign them to team members, set due dates, and update statuses (To Do, In Progress, Done).
- **Admin Dashboard**: A global directory where administrators can create, edit, and delete users from the system.
- **Responsive UI/UX**: Beautifully designed interface built with Tailwind CSS and Radix UI (shadcn), ensuring a premium experience on desktop and mobile.

## 🛠 Tech Stack

- **Frontend**: Next.js 16+ (App Router), React 19, Tailwind CSS
- **Backend**: Next.js Route Handlers (Serverless APIs)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jose for Edge compatibility), bcryptjs for password hashing
- **UI Components**: shadcn/ui, Lucide Icons

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd <repository-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=a_super_secure_random_string
   JWT_EXPIRES_IN=7d
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. The first user to register will automatically be assigned the `admin` role!

## 🌐 Deployment (Railway)

This application is optimized for deployment on [Railway](https://railway.app/). 

1. Connect your GitHub repository to Railway.
2. In your Railway project, navigate to the **Variables** tab.
3. Add `MONGODB_URI` and a secure `JWT_SECRET`.
4. Railway will automatically detect the Next.js build script and deploy your application!

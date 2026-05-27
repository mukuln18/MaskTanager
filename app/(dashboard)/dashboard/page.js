"use client";

import { useState, useEffect } from "react";
import { tasksApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentTasks } from "@/components/dashboard/RecentTasks";
import {
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await tasksApi.list();
        setTasks(res.data.tasks || []);
      } catch (err) {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter(
    (t) => t.isOverdue && t.status !== "done"
  ).length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  // Recent 8 tasks (already sorted by dueDate asc on the server)
  const recentTasks = tasks.slice(0, 8);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Page heading */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">{user?.name?.split(" ")[0] || "there"}</span> 👋
        </h2>
        <p className="text-sm font-medium text-muted-foreground mt-1.5">
          Here&apos;s an overview of your tasks and projects.
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Tasks"
          value={total}
          icon={<ListTodo className="w-full h-full" />}
          description="Across all projects"
          color="indigo"
          loading={loading}
        />
        <StatsCard
          title="Completed"
          value={completed}
          icon={<CheckCircle2 className="w-full h-full" />}
          description={total > 0 ? `${Math.round((completed / total) * 100)}% completion rate` : "No tasks yet"}
          color="emerald"
          loading={loading}
        />
        <StatsCard
          title="In Progress"
          value={inProgress}
          icon={<CheckSquare className="w-full h-full" />}
          description="Currently active"
          color="violet"
          loading={loading}
        />
        <StatsCard
          title="Overdue"
          value={overdue}
          icon={<AlertCircle className="w-full h-full" />}
          description="Needs attention"
          color="red"
          loading={loading}
        />
      </motion.div>

      {/* Recent tasks */}
      <motion.div variants={itemVariants}>
        <RecentTasks tasks={recentTasks} loading={loading} />
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/team": "Team",
};

function getTitleFromPath(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/projects/")) return "Project Details";
  return "";
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      // logout already redirects, ignore errors
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-8 bg-background/80 backdrop-blur-md border-b border-border">
      <h1 className="text-lg font-bold text-foreground">{title}</h1>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 h-9 px-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <Avatar className="h-7 w-7 ring-2 ring-background shadow-sm">
              <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-sm font-medium leading-tight">
                {user?.name || "User"}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="pb-2">
                <p className="font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground font-medium truncate">
                  {user?.email}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

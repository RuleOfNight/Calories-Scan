// src/components/user-nav.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, Settings, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes"; // Assuming next-themes is or will be installed
import { useEffect, useState } from "react";

export function UserNav() {
  const { user, logout } = useAuth();
  // const { theme, setTheme } = useTheme(); // Placeholder if next-themes is not part of the current setup
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Basic theme detection for UI toggle, not full next-themes integration
    if (typeof window !== "undefined") {
        setCurrentTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }
  }, []);


  const handleThemeToggle = () => {
    if (currentTheme === 'dark') {
        document.documentElement.classList.remove('dark');
        setCurrentTheme('light');
    } else {
        document.documentElement.classList.add('dark');
        setCurrentTheme('dark');
    }
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(user.name)}`} alt={user.name} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem> */}
           <DropdownMenuItem onClick={handleThemeToggle}>
            {currentTheme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>Toggle Theme</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

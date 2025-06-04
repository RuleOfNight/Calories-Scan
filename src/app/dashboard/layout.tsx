"use client";

import React, { useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/app-logo';
import { SidebarNav, navItems, secondaryNavItems } from '@/components/sidebar-nav';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut } from 'lucide-react';

function DashboardHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" /> {/* Only show on mobile */}
        <AppLogo className="hidden md:flex" iconSize={20} textSize="text-xl" />
      </div>
      <div className="flex items-center gap-4">
        {user ? <UserNav /> : <Skeleton className="h-9 w-9 rounded-full" />}
      </div>
    </header>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full animate-spin" /> 
        <p className="ml-4 text-lg">Loading NutriSnap...</p>
      </div>
    );
  }

  //Additional check
  if (!user && typeof window !== 'undefined') {
    // window.location.href = '/login'; 
    return null; 
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar 
        variant="sidebar" 
        collapsible="icon"
        className="border-r bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="p-2 border-b border-sidebar-border">
         <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <AppLogo className="group-data-[collapsible=icon]:hidden" iconSize={24} textSize="text-2xl" />
            <AppLogo className="hidden group-data-[collapsible=icon]:flex" iconSize={28} textSize="text-2xl" />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

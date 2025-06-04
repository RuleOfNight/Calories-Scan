// src/components/sidebar-nav.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserCircle,
  ScanLine,
  ClipboardList,
  Bot,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  TooltipContent
} from '@/components/ui/sidebar';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  matchExact?: boolean;
  children?: NavItem[];
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}

export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, matchExact: true, tooltip: "Dashboard Overview" },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle, tooltip: "Manage Your Profile" },
  { href: '/dashboard/scan', label: 'Scan Food', icon: ScanLine, tooltip: "Scan or Upload Food Item" },
  { href: '/dashboard/nutrition', label: 'Nutrition Info', icon: ClipboardList, tooltip: "View Nutrition Details" },
  { href: '/dashboard/chatbot', label: 'AI Chatbot', icon: Bot, tooltip: "Ask AI Nutritionist" },
];

export const secondaryNavItems: NavItem[] = [
    // { href: '/dashboard/settings', label: 'Settings', icon: Settings, tooltip: "App Settings" },
    // { href: '/dashboard/help', label: 'Help & Support', icon: LifeBuoy, tooltip: "Get Help" },
];


export function SidebarNav() {
  const pathname = usePathname();

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive = item.matchExact ? pathname === item.href : pathname.startsWith(item.href);
      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            tooltip={item.tooltip || item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
          {item.children && isActive && ( // Show sub-menu if parent is active and children exist
            <SidebarMenuSub>
              {item.children.map((child) => {
                const isChildActive = child.matchExact ? pathname === child.href : pathname.startsWith(child.href);
                return (
                  <SidebarMenuSubItem key={child.href}>
                    <SidebarMenuSubButton asChild isActive={isChildActive}>
                      <Link href={child.href}>
                        {/* <child.icon /> */} {/* Optional: sub-item icon */}
                        <span>{child.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarMenu>
      {renderNavItems(navItems)}
      {secondaryNavItems.length > 0 && (
        <>
          {/* You might want a separator here if you add more items */}
          {/* <SidebarSeparator className="my-2" /> */}
          {renderNavItems(secondaryNavItems)}
        </>
      )}
    </SidebarMenu>
  );
}

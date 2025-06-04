// src/hooks/use-auth.ts
"use client";

import type { UserProfile } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AUTH_KEY = 'nutrisnap_auth_token';
const USER_DATA_KEY = 'nutrisnap_user_data';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    if (token) {
      const storedUserData = localStorage.getItem(USER_DATA_KEY);
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
      } else {
        // Fallback, should ideally not happen in a real app post-signup
        const fallbackUser: UserProfile = { name: 'Demo User', email: 'demo@example.com' };
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(fallbackUser));
        setUser(fallbackUser);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password?: string) => {
    // Mock login
    let existingUser: UserProfile | null = null;
    const storedUserData = localStorage.getItem(USER_DATA_KEY);
    if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        // In a real app with multiple users, you'd search for the user by email.
        // For this mock, we'll just use the stored data if the email matches, or create a new one.
        if (parsedData.email === email) {
            existingUser = parsedData;
        }
    }

    const loggedInUser = existingUser || { name: 'Demo User', email };
    
    localStorage.setItem(AUTH_KEY, 'mock_token');
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    router.push('/dashboard');
  }, [router]);

  const signup = useCallback(async (name: string, email: string, _password?: string) => {
    // Mock signup
    const newUser: UserProfile = { name, email };
    localStorage.setItem(AUTH_KEY, 'mock_token_new_user'); 
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
    setUser(newUser);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    // Keep user data for potential re-login convenience in this mock, or remove it:
    // localStorage.removeItem(USER_DATA_KEY); 
    setUser(null);
    router.push('/login');
  }, [router]);

  const updateUserProfile = useCallback((profileData: Partial<UserProfile>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...profileData };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const getProfile = useCallback((): UserProfile | null => {
    if (typeof window === 'undefined') return null; // Guard for SSR
    const storedUserData = localStorage.getItem(USER_DATA_KEY);
    if (storedUserData) {
      return JSON.parse(storedUserData);
    }
    return user; // Fallback to state if localStorage is somehow empty but user exists in state
  }, [user]);

  // Effect for redirecting if not authenticated
  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard for SSR
    
    const publicPaths = ['/', '/login', '/signup', '/forgot-password'];
    const isPublicPath = publicPaths.includes(pathname);
    
    if (!loading && !user && !isPublicPath) {
      router.push('/login');
    }
    if (!loading && user && (pathname === '/login' || pathname === '/signup')) {
      router.push('/dashboard');
    }

  }, [user, loading, pathname, router]);


  return { user, loading, login, signup, logout, updateUserProfile, getProfile };
}

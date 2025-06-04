// src/app/(auth)/login/page.tsx
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/use-auth';
import { useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Basic validation
      if (!email || !password) {
        toast({
          title: "Missing fields",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      await login(email, password);
      // Redirect is handled by useAuth hook
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.", // Mock error message
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Enter your email and password to access your NutriSnap account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" prefetch={false} className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" prefetch={false} className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

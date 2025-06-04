// src/app/(auth)/forgot-password/page.tsx
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock forgot password logic
    if (!email) {
        toast({
          title: "Missing email",
          description: "Please enter your email address.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Password Reset Email Sent",
      description: "If an account exists for this email, you will receive password reset instructions.",
    });
    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
        <CardDescription>
          {submitted 
            ? "Check your email for reset instructions." 
            : "Enter your email address and we'll send you a link to reset your password."}
        </CardDescription>
      </CardHeader>
      {!submitted ? (
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
            </Button>
          </CardFooter>
        </form>
      ) : null}
      <div className="p-6 pt-0 text-center">
        <Button variant="link" asChild>
          <Link href="/login" className="text-sm text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
          </Link>
        </Button>
      </div>
    </Card>
  );
}

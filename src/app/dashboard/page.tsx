// src/app/dashboard/page.tsx
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ScanLine, Bot, UserCircle, ClipboardList, BarChart3 } from 'lucide-react';
import { calculateBMI } from '@/lib/utils';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    return null;
  }

  const bmi = user.weight && user.height ? calculateBMI(user.weight, user.height) : null;
  let bmiCategory = '';
  let bmiColor = 'text-foreground';

  if (bmi) {
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-blue-500';
    } else if (bmi < 24.9) {
      bmiCategory = 'Normal weight';
      bmiColor = 'text-green-500';
    } else if (bmi < 29.9) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-yellow-500';
    } else {
      bmiCategory = 'Obesity';
      bmiColor = 'text-red-500';
    }
  }

  const quickLinks = [
    { href: '/dashboard/profile', label: 'Update Profile', icon: UserCircle, description: "Keep your info current." },
    { href: '/dashboard/scan', label: 'Scan New Food', icon: ScanLine, description: "Identify your meal." },
    { href: '/dashboard/nutrition', label: 'Check Nutrition', icon: ClipboardList, description: "Explore food data." },
    { href: '/dashboard/chatbot', label: 'Ask AI Expert', icon: Bot, description: "Get health advice." },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome back, {user.name}!</CardTitle>
          <CardDescription>Here's a quick overview of your health journey with NutriSnap.</CardDescription>
        </CardHeader>
        {bmi && (
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
              <BarChart3 className={`h-10 w-10 ${bmiColor}`} />
              <div>
                <p className="text-sm text-muted-foreground">Your current BMI</p>
                <p className={`text-2xl font-bold ${bmiColor}`}>{bmi.toFixed(1)}</p>
                <p className={`text-sm font-semibold ${bmiColor}`}>{bmiCategory}</p>
              </div>
            </div>
             <p className="text-xs text-muted-foreground mt-2">
                Note: BMI is a general indicator. Consult a healthcare professional for personalized advice.
                You can update your weight and height in the <Link href="/dashboard/profile" className="text-primary hover:underline">Profile</Link> section.
            </p>
          </CardContent>
        )}
        {!bmi && user.weight === undefined && user.height === undefined && (
            <CardContent>
                <p className="text-muted-foreground">
                    Update your <Link href="/dashboard/profile" className="text-primary hover:underline">profile</Link> with your weight and height to calculate your BMI.
                </p>
            </CardContent>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {quickLinks.map(link => (
          <Card key={link.href} className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">{link.label}</CardTitle>
              <link.icon className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
            </CardContent>
            <CardFooter>
               <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link href={link.href}>
                  Go <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

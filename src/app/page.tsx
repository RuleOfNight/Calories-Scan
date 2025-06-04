// src/app/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/app-logo';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight, ScanLine, Bot, UserCircle } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 md:p-6 flex justify-between items-center">
        <AppLogo />
        <nav>
          {loading ? (
            <div className="w-24 h-10 bg-muted rounded-md animate-pulse"></div>
          ) : user ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-left">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Snap, Track, Thrive with NutriSnap
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Effortlessly identify food items using your camera, get detailed nutrition information,
                    and receive personalized health advice from our AI chatbot. Take control of your diet today!
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href={user ? "/dashboard" : "/signup"}>
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png?text=Healthy+Food+Collage"
                alt="Healthy Food Collage"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="healthy food"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
                  Everything You Need for Better Nutrition
                </h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From scanning foods to chatting with an AI health assistant, NutriSnap offers a comprehensive suite of tools.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-lg">
                <ScanLine className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Food Scanning</h3>
                <p className="text-sm text-muted-foreground">
                  Instantly identify food items with your camera or by uploading an image.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-lg">
                <UserCircle className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">Profile & BMI</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your profile, track weight and height, and calculate your BMI.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-lg">
                <Bot className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">AI Chatbot</h3>
                <p className="text-sm text-muted-foreground">
                  Get expert nutrition advice and answers to your health questions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} NutriSnap. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

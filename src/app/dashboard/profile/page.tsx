// src/app/dashboard/profile/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/use-auth';
import type { UserProfile } from '@/types';
import { calculateBMI } from '@/lib/utils';
import { useState, type FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    age: undefined,
    weight: undefined,
    height: undefined,
  });
  const [bmi, setBmi] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age,
        weight: user.weight,
        height: user.height,
      });
      if (user.weight && user.height) {
        setBmi(calculateBMI(user.weight, user.height));
      } else {
        setBmi(null);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name === 'age' || name === 'weight' || name === 'height' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: numValue }));

    if (name === 'weight' || name === 'height') {
      const newWeight = name === 'weight' ? parseFloat(value) : formData.weight;
      const newHeight = name === 'height' ? parseFloat(value) : formData.height;
      if (newWeight && newHeight && newHeight > 0) {
        setBmi(calculateBMI(newWeight, newHeight));
      } else {
        setBmi(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!formData.name || !formData.email) {
        toast({ title: "Error", description: "Name and Email are required.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      updateUserProfile({
        name: formData.name,
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <p>Loading profile...</p>;
  if (!user) return null; // Should be redirected

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>Manage your personal information and health details.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} disabled />
                 <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" placeholder="e.g., 30" value={formData.age || ''} onChange={handleChange} min="1" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" name="weight" type="number" placeholder="e.g., 70" step="0.1" value={formData.weight || ''} onChange={handleChange} min="1" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" name="height" type="number" placeholder="e.g., 175" step="0.1" value={formData.height || ''} onChange={handleChange} min="1" disabled={isLoading} />
              </div>
            </div>

            {bmi !== null && (
              <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                <Label>Calculated BMI</Label>
                <p className="text-2xl font-bold text-primary">{bmi.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">
                  {bmi < 18.5 ? 'Underweight' : bmi < 24.9 ? 'Normal weight' : bmi < 29.9 ? 'Overweight' : 'Obesity'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

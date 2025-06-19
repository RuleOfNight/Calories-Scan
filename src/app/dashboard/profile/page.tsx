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
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const NUTRIENTS = [
  { key: 'calories', label: 'Calories', color: '#f59e42', max: 2500 },
  { key: 'carbohydrates', label: 'Carbs', color: '#38bdf8', max: 300 },
  { key: 'protein', label: 'Protein', color: '#22c55e', max: 150 },
  { key: 'fat', label: 'Fat', color: '#f43f5e', max: 70 },
  { key: 'sugar', label: 'Sugar', color: '#eab308', max: 50 },
  { key: 'water', label: 'Water', color: '#0ea5e9', max: 2000 }, // ml
];

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
  const [nutrients, setNutrients] = useState({
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    sugar: 0,
    water: 0,
  });

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


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nutri_daily');
      if (stored) {
        setNutrients(JSON.parse(stored));
      }
    }
  }, []);

  
  // Reset daily
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toISOString().slice(0, 10);
      const lastDate = localStorage.getItem('nutri_daily_date');
      if (lastDate !== today) {

        const empty = { calories: 0, carbohydrates: 0, protein: 0, fat: 0, sugar: 0, water: 0 };
        setNutrients(empty);
        localStorage.setItem('nutri_daily', JSON.stringify(empty));
        localStorage.setItem('nutri_daily_date', today);
      }
    }
  }, []);

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

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Daily Nutrition Progress</CardTitle>
          <CardDescription>Track your daily intake of nutrients and water.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 justify-center">
            {NUTRIENTS.map((nutrient) => {
              type NutrientKey = keyof typeof nutrients;
              const key = nutrient.key as NutrientKey;
              return (
                <div key={nutrient.key} className="flex flex-col items-center">
                  <ResponsiveContainer width={120} height={120}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={55}
                      barSize={15}
                      data={[{ name: nutrient.label, value: Math.min(nutrients[key], nutrient.max), fill: nutrient.color }]}
                    >
                      <PolarAngleAxis type="number" domain={[0, nutrient.max]} angleAxisId={0} tick={false} />
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <span className="mt-2 font-semibold text-sm">{nutrient.label}</span>
                  <span className="text-xs text-muted-foreground">{nutrients[key]} / {nutrient.max} {nutrient.key === 'water' ? 'ml' : nutrient.key === 'calories' ? 'kcal' : 'g'}</span>
                  {nutrient.key === 'water' && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const input = form.elements.namedItem('waterInput') as HTMLInputElement;
                        const addWater = parseInt(input.value, 10) || 0;
                        if (addWater > 0) {
                          const updated = { ...nutrients, water: nutrients.water + addWater };
                          setNutrients(updated);
                          localStorage.setItem('nutri_daily', JSON.stringify(updated));
                          toast({ title: 'Added!', description: `Added ${addWater}ml water.` });
                          input.value = '';
                        }
                      }}
                      className="flex flex-col items-center mt-2 gap-1"
                    >
                      <Input
                        name="waterInput"
                        type="number"
                        min={0}
                        step={50}
                        placeholder="Add water (ml)"
                        className="w-24 text-xs"
                      />
                      <Button type="submit" size="sm" className="mt-1">Add Water</Button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => {
              const empty = { calories: 0, carbohydrates: 0, protein: 0, fat: 0, sugar: 0, water: 0 };
              setNutrients(empty);
              localStorage.setItem('nutri_daily', JSON.stringify(empty));
              localStorage.setItem('nutri_daily_date', new Date().toISOString().slice(0, 10));
              toast({ title: 'Reset!', description: 'Daily nutrition progress has been reset.' });
            }}
          >
            Reset Daily Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

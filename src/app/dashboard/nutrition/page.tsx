// src/app/dashboard/nutrition/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { NutritionData } from '@/types';
import { suggestAlternativeFoods, SuggestAlternativeFoodsInput } from '@/ai/flows/food-suggestions';
import { Loader2, Search, Lightbulb, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';


// Mock function
const fetchMockNutritionData = async (foodName: string): Promise<NutritionData> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // Simple mock data based on food name
  const baseCalories = foodName.length * 20 + 50;
  return {
    foodName: foodName,
    calories: Math.floor(baseCalories + Math.random() * 50),
    protein: Math.floor(baseCalories / 20 + Math.random() * 5),
    carbs: Math.floor(baseCalories / 10 + Math.random() * 10),
    fat: Math.floor(baseCalories / 30 + Math.random() * 3),
    fiber: Math.floor(baseCalories / 50 + Math.random() * 2),
    sugar: Math.floor(baseCalories / 25 + Math.random() * 5),
  };
};



export default function NutritionPage() {
  const searchParams = useSearchParams();
  const initialFood = searchParams.get('food') || '';
  
  const { toast } = useToast();
  const [foodName, setFoodName] = useState(initialFood);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [quantityGrams, setQuantityGrams] = useState<number | ''>('');
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [preferences, setPreferences] = useState('');
  const [alternativeSuggestions, setAlternativeSuggestions] = useState<string[] | null>(null);
  const [suggestionReasoning, setSuggestionReasoning] = useState<string | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleFetchNutrition = async (name?: string) => {
    const foodToFetch = name || foodName;
    if (!foodToFetch) {
      toast({ title: "Missing Food Name", description: "Please enter a food item to search.", variant: "destructive" });
      return;
    }
    setIsLoadingData(true);
    setNutritionData(null);
    try {
      const data = await fetchMockNutritionData(foodToFetch);
      setNutritionData(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch nutrition data.", variant: "destructive" });
    } finally {
      setIsLoadingData(false);
    }
  };


  useEffect(() => {
    if (initialFood) {
      handleFetchNutrition(initialFood);
    }
  }, [initialFood]);


  const handleSuggestAlternatives = async (e: FormEvent) => {
    e.preventDefault();
    if (!nutritionData?.foodName) {
      toast({ title: "No Food Selected", description: "Please fetch nutrition data for a food item first.", variant: "destructive" });
      return;
    }
    setIsLoadingSuggestions(true);
    setAlternativeSuggestions(null);
    setSuggestionReasoning(null);
    try {
      const input: SuggestAlternativeFoodsInput = {
        foodItem: nutritionData.foodName,
        dietaryRestrictions: dietaryRestrictions || undefined,
        preferences: preferences || undefined,
      };
      const result = await suggestAlternativeFoods(input);
      setAlternativeSuggestions(result.suggestions);
      setSuggestionReasoning(result.reasoning);
      toast({ title: "Suggestions Ready!", description: `Found alternatives for ${nutritionData.foodName}.` });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast({ title: "Suggestion Error", description: "Could not fetch alternative food suggestions.", variant: "destructive" });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Food Nutrition Information</CardTitle>
          <CardDescription>Search for a food item to see its nutritional details or get alternative suggestions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <Button variant="outline" onClick={() => setFoodName("Banh Mi")}>Banh Mi</Button>
            <Button variant="outline" onClick={() => setFoodName("Pho")}>Pho</Button>
            <Button variant="outline" onClick={() => setFoodName("Bun Cha")}>Bun Cha</Button>
            <Button variant="outline" onClick={() => setFoodName("Goi Cuon")}>Goi Cuon</Button>
            <Button variant="outline" onClick={() => setFoodName("Com Tam")}>Com Tam</Button>
            <Button variant="outline" onClick={() => setFoodName("Hu Tieu")}>Hu Tieu</Button>
            <Button variant="outline" onClick={() => setFoodName("Cao Lau")}>Cao Lau</Button>
            <Button variant="outline" onClick={() => setFoodName("Chao Long")}>Chao Long</Button>
            <Button variant="outline" onClick={() => setFoodName("Banh Xeo")}>Banh Xeo</Button>
            <Button variant="outline" onClick={() => setFoodName("Ca Kho To")}>Ca Kho To</Button>
            <Button variant="outline" onClick={() => setFoodName("Thit Kho Tau")}>Thit Kho Tau</Button>
            <Button variant="outline" onClick={() => setFoodName("Canh Chua")}>Canh Chua</Button>
            <Button variant="outline" onClick={() => setFoodName("Che")}>Che</Button>
            <Button variant="outline" onClick={() => setFoodName("Tra Sua")}>Tra Sua</Button>
          </div>

          <div className="flex gap-2">
            <Input 
              placeholder="Enter food name (e.g., Apple, Chicken Breast)" 
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFetchNutrition()}
            />
            <Button onClick={() => handleFetchNutrition()} disabled={isLoadingData || !foodName}>
              {isLoadingData ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {isLoadingData && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Fetching nutrition data...</p>
            </div>
          )}

          {nutritionData && !isLoadingData && (
            <>
            {/* Input for quantity in grams */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantityGrams">Quantity (grams)</Label>
              <Input 
                id="quantityGrams"
                type="number"
                placeholder="e.g., 150"
                value={quantityGrams}
                onChange={(e) => setQuantityGrams(Number(e.target.value))}
                min="1"
              />
            </div>


            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{nutritionData.foodName}</CardTitle>
                <CardDescription>Nutritional values per 100g (mock data)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {Object.entries(nutritionData).map(([key, value]) => {
                    if (key === 'foodName') return null;
                    const unit = key === 'calories' ? 'kcal' : 'g';
                    return (
                      <div key={key} className="p-2 bg-background/50 rounded-md shadow-sm">
                        <p className="font-medium capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-lg font-semibold">{value} {unit}</p>
                      </div>
                    );
                  })}
                </div>

              </CardContent>
            </Card>
            </>
          )}
        </CardContent>
      </Card>

      {nutritionData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-accent" /> Suggest Healthy Alternatives</CardTitle>
            <CardDescription>Find healthier options based on your dietary needs and preferences for "{nutritionData.foodName}".</CardDescription>
          </CardHeader>
          <form onSubmit={handleSuggestAlternatives}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions (optional)</Label>
                <Textarea 
                  id="dietaryRestrictions"
                  placeholder="e.g., vegetarian, gluten-free, low-carb"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <Label htmlFor="preferences">Preferences (optional)</Label>
                <Textarea 
                  id="preferences"
                  placeholder="e.g., similar taste, specific cuisine, easy to prepare"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                   className="min-h-[60px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoadingSuggestions}>
                {isLoadingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Get Suggestions
              </Button>
            </CardFooter>
          </form>

          {isLoadingSuggestions && (
             <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Finding alternatives...</p>
              </div>
          )}

          {alternativeSuggestions && suggestionReasoning && !isLoadingSuggestions && (
            <CardContent className="mt-4 space-y-4">
              <h3 className="text-lg font-semibold text-primary">Alternative Food Suggestions:</h3>
              <ul className="list-disc list-inside space-y-1 bg-secondary/30 p-4 rounded-md">
                {alternativeSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold text-primary">Reasoning:</h3>
              <p className="text-sm bg-secondary/30 p-4 rounded-md">{suggestionReasoning}</p>
            </CardContent>
          )}
        </Card>
      )}
       {!nutritionData && !isLoadingData && (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center text-muted-foreground">
            <Image src="https://placehold.co/300x200.png?text=Healthy+Food+Plate" data-ai-hint="healthy food plate" alt="Food Plate" width={300} height={200} className="mx-auto mb-4 rounded-lg" />
              <p>Search for a food item to view its nutritional information and get alternative suggestions.</p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

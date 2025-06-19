// src/app/dashboard/scan/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, Image as ImageIcon, Loader2, FileText, ScanSearch } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, useRef } from 'react';


interface NutritionInfo {
  foodName: string;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  sugar: number;
}

export default function ScanFoodPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [identifiedFood, setIdentifiedFood] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      setIdentifiedFood(null); // Reset previous identification
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    toast({
      title: "Camera Feature",
      description: "Camera access is a planned feature. Please use image upload for now.",
    });

    setPreviewUrl("https://placehold.co/600x400.png?text=Camera+Feed+Placeholder");
    dataAiHint: "camera placeholder"
    setSelectedFile(null);
    setIdentifiedFood("Placeholder Food (from Camera)"); // Mock identification
  };

const processImage = async () => {
  try {
    setIsProcessing(true);
    
    if (!selectedFile) {
      toast({ title: "Error", description: "Please select an image first", variant: "destructive" });
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_LOGMEAL_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    // image segmentation
    const segmentationResponse = await fetch('https://api.logmeal.com/v2/image/segmentation/complete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!segmentationResponse.ok) {
      throw new Error(`Segmentation failed: ${segmentationResponse.statusText}`);
    }

    const segmentationData = await segmentationResponse.json();
    // console.log('Segmentation response:', segmentationData); // Debug log
    const foodId = segmentationData.imageId;
    if (!foodId) {
      throw new Error('No food ID in segmentation response');
    }

    // nutritional info
    const nutritionResponse = await fetch('https://api.logmeal.com/v2/recipe/nutritionalInfo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageId: foodId })
    });

    if (!nutritionResponse.ok) {
      throw new Error(`Nutrition fetch failed: ${nutritionResponse.statusText}`);
    }

    const nutritionData = await nutritionResponse.json();
    // console.log('Nutrition response:', nutritionData); // Debug log


    if (!nutritionData || typeof nutritionData !== 'object') {
      throw new Error('Invalid nutrition data response');
    }


    // Mapping
    const nutritionalInfo = {
      foodName: nutritionData.foodName?.[0] || "Unknown Food",
      calories: nutritionData.nutritional_info?.calories || 0,
      carbohydrates: nutritionData.nutritional_info?.totalNutrients?.CHOCDF?.quantity || 0,
      protein: nutritionData.nutritional_info?.totalNutrients?.PROCNT?.quantity || 0,
      fat: nutritionData.nutritional_info?.totalNutrients?.FAT?.quantity || 0,
      sugar: nutritionData.nutritional_info?.totalNutrients?.SUGAR?.quantity || 0,
    };
    // console.log('Mapped nutrition info:', nutritionalInfo);


    
    setNutritionInfo(nutritionalInfo);
    setIdentifiedFood(nutritionalInfo.foodName);
    toast({ title: "Success", description: "Food analyzed successfully!" });

  } catch (error) {
    console.error('Full error details:', error);
    toast({ 
      title: "Error", 
      description: error instanceof Error ? error.message : "Failed to process image", 
      variant: "destructive" 
    });
  } finally {
    setIsProcessing(false);
  }
};

  const viewNutritionDetails = () => {
    if (identifiedFood) {
      router.push(`/dashboard/nutrition?food=${encodeURIComponent(identifiedFood)}`);
    } else {
      toast({ title: "Not Identified", description: "Please process an image first.", variant: "destructive" });
    }
  };

return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
              <CardTitle className="text-2xl">Scan or Upload Food Item</CardTitle>
              <CardDescription>Use your camera or upload an image to identify food and get its nutritional information.</CardDescription>
              <CardDescription><small>(.jpg or .jepg)</small>.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <Button onClick={handleUploadClick} className="w-full" variant="outline" disabled={isProcessing}>
                      <Upload className="mr-2 h-5 w-5" /> Upload Image
                  </Button>
                  <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                  <Button onClick={handleCameraClick} className="w-full" variant="outline" disabled={isProcessing}>
                      <Camera className="mr-2 h-5 w-5" /> Use Camera
                  </Button>
              </div>

              <div className="flex items-center justify-center p-4 border-2 border-dashed border-border rounded-lg min-h-[200px] bg-muted/30">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Selected food item" width={300} height={200} className="max-w-full max-h-[200px] object-contain rounded-md" />
                ) : (
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                        <p>Image preview will appear here</p>
                    </div>
                )}
              </div>
            </div>
            
            {(selectedFile || (previewUrl && !identifiedFood)) && (
              <Button onClick={processImage} className="w-full mt-4" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ScanSearch className="mr-2 h-5 w-5" />}
                {isProcessing ? "Processing..." : "Identify Food"}
              </Button>
            )}
          </CardContent>
      </Card>


      {nutritionInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
            <CardDescription>Analysis results for <strong>{nutritionInfo.foodName}</strong></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Calories</p>
                  <p className="text-2xl font-bold">{nutritionInfo.calories?.toFixed(1) || 0} kcal</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Carbohydrates</p>
                  <p className="text-2xl font-bold">{nutritionInfo.carbohydrates?.toFixed(1) || 0} kcal</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Protein</p>
                  <p className="text-2xl font-bold">{nutritionInfo.protein?.toFixed(1) || 0} kcal</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Fat</p>
                  <p className="text-2xl font-bold">{nutritionInfo.fat?.toFixed(1) || 0} kcal</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sugar</p>
                  <p className="text-2xl font-bold">{nutritionInfo.sugar?.toFixed(1) || 0} kcal</p>
                </div>
              </div>
            </div>
            <Button className="mt-6 w-full" onClick={() => {
              const prev = JSON.parse(localStorage.getItem('nutri_daily') || '{}');
              const updated = {
                calories: (prev.calories || 0) + (nutritionInfo.calories || 0),
                carbohydrates: (prev.carbohydrates || 0) + (nutritionInfo.carbohydrates || 0),
                protein: (prev.protein || 0) + (nutritionInfo.protein || 0),
                fat: (prev.fat || 0) + (nutritionInfo.fat || 0),
                sugar: (prev.sugar || 0) + (nutritionInfo.sugar || 0),
                water: prev.water || 0,
              };
              localStorage.setItem('nutri_daily', JSON.stringify(updated));
              toast({ title: 'Added!', description: 'Nutrition added to your daily progress.' });
            }}>
              Add to Daily Progress
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

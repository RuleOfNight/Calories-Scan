// src/app/dashboard/scan/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, Image as ImageIcon, Loader2, FileText } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, useRef } from 'react';

export default function ScanFoodPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [identifiedFood, setIdentifiedFood] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setSelectedFile(null); // Clear file if camera is used
    setIdentifiedFood("Placeholder Food (from Camera)"); // Mock identification
  };
  
  const processImage = async () => {
    if (!selectedFile && !identifiedFood) { // Allow processing if food already identified (e.g. from camera mock)
        toast({ title: "No Image", description: "Please select an image or use the camera.", variant: "destructive"});
        return;
    }
    setIsProcessing(true);
    
    // Mock AI processing
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    // Mock identification result
    const mockFoodName = selectedFile ? selectedFile.name.split('.')[0].replace(/[-_]/g, ' ') : identifiedFood || "Unknown Food";
    setIdentifiedFood(mockFoodName);
    
    setIsProcessing(false);
    toast({ title: "Food Identified!", description: `Identified as: ${mockFoodName}. Check nutrition details.` });
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
          
          { (selectedFile || (previewUrl && identifiedFood)) && ( // Show process button if there's a file or a camera mock image
            <Button onClick={processImage} className="w-full mt-4" disabled={isProcessing || !!identifiedFood}>
              {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ScanLine className="mr-2 h-5 w-5" />}
              {identifiedFood ? `Identified: ${identifiedFood}` : "Identify Food"}
            </Button>
          )}

        </CardContent>
        {identifiedFood && (
            <CardFooter>
                <Button onClick={viewNutritionDetails} className="w-full" variant="default">
                    <FileText className="mr-2 h-5 w-5" /> View Nutrition Details for {identifiedFood}
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

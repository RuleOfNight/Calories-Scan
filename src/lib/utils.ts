import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBMI(weightInKg: number, heightInCm: number): number | null {
  if (weightInKg <= 0 || heightInCm <= 0) {
    return null;
  }
  const heightInM = heightInCm / 100;
  const bmi = weightInKg / (heightInM * heightInM);
  return bmi;
}

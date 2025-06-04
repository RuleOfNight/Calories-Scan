import { Leaf } from 'lucide-react';
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function AppLogo({ className, iconSize = 24, textSize = "text-2xl" }: AppLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <Leaf size={iconSize} className="text-primary group-hover:text-accent transition-colors" />
      <h1 className={`font-bold ${textSize} text-foreground group-hover:text-accent transition-colors`}>
        NutriSnap
      </h1>
    </Link>
  );
}

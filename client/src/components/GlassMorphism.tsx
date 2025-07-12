import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassMorphismProps {
  children: ReactNode;
  className?: string;
}

const GlassMorphism = ({ children, className }: GlassMorphismProps) => {
  return (
    <div className={cn("glass-morphism rounded-xl", className)}>
      {children}
    </div>
  );
};

export default GlassMorphism;

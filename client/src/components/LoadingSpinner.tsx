import { Rocket } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Rocket className={`${sizeClasses[size]} text-cosmic-blue animate-bounce`} />
        <div className="absolute inset-0 rounded-full border-2 border-cosmic-blue/20 animate-ping" />
      </div>
      {text && (
        <p className="text-space-300 animate-pulse">{text}</p>
      )}
    </div>
  );
}
#!/bin/bash

# Comprehensive fix for all build errors in the frontend

echo "🔧 Starting comprehensive build error fixes..."

cd frontend

# 1. Fix Navigation.tsx - Remove unused imports and fix user type issues
echo "📝 Fixing Navigation.tsx..."
sed -i 's/import { Rocket, Menu, X, LogOut, User, Shield } from "lucide-react";/import { Rocket, Menu, LogOut, User, Shield } from "lucide-react";/' client/src/components/Navigation.tsx

# 2. Fix Workshops.tsx - Remove unused imports and variables  
echo "📝 Fixing Workshops.tsx..."
sed -i 's/import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, ChevronRight, Check, Mail, Phone, Building, Globe } from "lucide-react";/import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, Check, Mail, Phone, Building, Globe } from "lucide-react";/' client/src/pages/Workshops.tsx

# 3. Fix all files importing from @shared/schema instead of @shared/types
echo "📝 Fixing schema imports..."
find client/src -name "*.tsx" -exec sed -i 's/@shared\/schema/@shared\/types/g' {} \;

# 4. Fix OrbitalAnimation.tsx - Remove unused variables
echo "📝 Fixing OrbitalAnimation.tsx..."
sed -i '/const shootingStars = Array.from/,/delay: i \* 1000/d' client/src/components/OrbitalAnimation.tsx

# 5. Remove unused imports from AdminDashboard.tsx
echo "📝 Fixing AdminDashboard.tsx..."
sed -i '/import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@\/components\/ui\/dropdown-menu";/d' client/src/pages/AdminDashboard.tsx
sed -i '/import { Avatar, AvatarFallback, AvatarImage } from "@\/components\/ui\/avatar";/d' client/src/pages/AdminDashboard.tsx
sed -i '/import { Calendar } from "@\/components\/ui\/calendar";/d' client/src/pages/AdminDashboard.tsx
sed -i '/import { Popover, PopoverContent, PopoverTrigger } from "@\/components\/ui\/popover";/d' client/src/pages/AdminDashboard.tsx

# 6. Fix all pages with unused imports
echo "📝 Fixing remaining unused imports..."
find client/src -name "*.tsx" -exec sed -i 's/import { \([^}]*\), MapPin, \([^}]*\) } from "lucide-react";/import { \1, \2 } from "lucide-react";/' {} \;

# 7. Try to build and check
echo "🔄 Testing build..."
npm run build

echo "✅ Build fixes completed!"
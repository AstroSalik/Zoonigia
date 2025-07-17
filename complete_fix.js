import fs from 'fs';
import path from 'path';

// Fix all remaining build errors comprehensively
const files = [
  'client/src/components/AdminRoute.tsx',
  'client/src/components/Navigation.tsx', 
  'client/src/components/OrbitalAnimation.tsx',
  'client/src/pages/AdminDashboard.tsx',
  'client/src/pages/AdminSimple.tsx',
  'client/src/pages/Blog.tsx',
  'client/src/pages/BlogPost.tsx',
  'client/src/pages/CampaignDetail.tsx',
  'client/src/pages/Campaigns.tsx',
  'client/src/pages/Contact.tsx',
  'client/src/pages/CourseDetail.tsx',
  'client/src/pages/Courses.tsx',
  'client/src/pages/Home.tsx',
  'client/src/pages/Landing.tsx',
  'client/src/pages/Register.tsx',
  'client/src/pages/Schools.tsx',
  'client/src/pages/Workshops.tsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix all @shared/schema imports
    content = content.replace(/@shared\/schema/g, '@shared/types');
    
    // Fix specific files
    if (file.includes('Navigation.tsx')) {
      // Remove X from imports
      content = content.replace(/import { Rocket, Menu, X, LogOut, User as UserIcon, Shield } from "lucide-react";/, 'import { Rocket, Menu, LogOut, User as UserIcon, Shield } from "lucide-react";');
      // Remove isLoading from useAuth
      content = content.replace(/const { user, isAuthenticated, isLoading } = useAuth();/, 'const { user, isAuthenticated } = useAuth();');
    }
    
    if (file.includes('Workshops.tsx')) {
      // Remove ChevronRight from imports  
      content = content.replace(/ChevronRight, /g, '');
      // Remove unused variables
      content = content.replace(/const \[selectedWorkshop, setSelectedWorkshop\] = useState<string \| null>\(null\);/, '');
      content = content.replace(/const queryClient = useQueryClient\(\);/, '');
      content = content.replace(/onError: \(error\) => {/, 'onError: () => {');
      content = content.replace(/const handleRegister = \(workshopId: string\) => {/, 'const handleRegister = () => {');
      content = content.replace(/setSelectedWorkshop\(workshopId\);/, '');
      content = content.replace(/setSelectedWorkshop\(null\);/, '');
      content = content.replace(/onClick={handleRegister}/g, 'onClick={() => setIsDialogOpen(true)}');
    }
    
    // Remove unused imports patterns
    content = content.replace(/, MapPin,/g, ',');
    content = content.replace(/MapPin, /g, '');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('All fixes applied!');
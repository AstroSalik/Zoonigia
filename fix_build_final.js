import fs from 'fs';
import path from 'path';

// Handle specific critical files that need manual fixes
const fixSpecificFiles = () => {
  console.log('Fixing OrbitalAnimation.tsx...');
  let orbitalContent = fs.readFileSync('client/src/components/OrbitalAnimation.tsx', 'utf8');
  // Remove unused imports
  orbitalContent = orbitalContent.replace(/import { MapPin } from "lucide-react";/, '');
  orbitalContent = orbitalContent.replace(/import { MapPin, /g, 'import { ');
  orbitalContent = orbitalContent.replace(/, MapPin/g, '');
  fs.writeFileSync('client/src/components/OrbitalAnimation.tsx', orbitalContent);
  
  console.log('Fixing Workshops.tsx...');
  let workshopsContent = fs.readFileSync('client/src/pages/Workshops.tsx', 'utf8');
  // Remove problematic imports and unused variables
  workshopsContent = workshopsContent.replace(/import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, ChevronRight, Check, Mail, Phone, Building, Globe } from "lucide-react";/, 'import { Calendar, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, Check, Mail, Phone, Building, Globe } from "lucide-react";');
  workshopsContent = workshopsContent.replace(/const \[selectedWorkshop, setSelectedWorkshop\] = useState<string \| null>\(null\);/, '');
  workshopsContent = workshopsContent.replace(/const queryClient = useQueryClient\(\);/, '');
  workshopsContent = workshopsContent.replace(/onError: \(error\) => \{/, 'onError: () => {');
  workshopsContent = workshopsContent.replace(/const handleRegister = \(workshopId: string\) => \{[^}]*\};/, '');
  fs.writeFileSync('client/src/pages/Workshops.tsx', workshopsContent);
  
  console.log('Fixing other files...');
  // Fix all schema imports
  const filesToFix = [
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
    'client/src/pages/Schools.tsx'
  ];
  
  filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/@shared\/schema/g, '@shared/types');
      content = content.replace(/import { MapPin } from "lucide-react";/, '');
      content = content.replace(/import { MapPin, /g, 'import { ');
      content = content.replace(/, MapPin/g, '');
      fs.writeFileSync(file, content);
    }
  });
  
  console.log('All fixes applied!');
};

fixSpecificFiles();
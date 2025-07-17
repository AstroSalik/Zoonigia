import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read and modify files
function fixFile(filePath, fixes) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  fixes.forEach(fix => {
    if (fix.type === 'replace') {
      content = content.replace(fix.from, fix.to);
    } else if (fix.type === 'regex') {
      content = content.replace(new RegExp(fix.pattern, fix.flags), fix.replacement);
    }
  });
  
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed: ${filePath}`);
}

// Define all fixes
const fixes = [
  // Fix Navigation.tsx
  {
    file: 'client/src/components/Navigation.tsx',
    fixes: [
      {
        type: 'replace',
        from: 'import { Rocket, Menu, X, LogOut, User, Shield } from "lucide-react";',
        to: 'import { Rocket, Menu, LogOut, User, Shield } from "lucide-react";'
      },
      {
        type: 'replace',
        from: 'const { user, isAuthenticated, isLoading } = useAuth();',
        to: 'const { user, isAuthenticated } = useAuth();'
      }
    ]
  },
  
  // Fix Workshops.tsx
  {
    file: 'client/src/pages/Workshops.tsx',
    fixes: [
      {
        type: 'replace',
        from: 'ChevronRight, ',
        to: ''
      },
      {
        type: 'replace',
        from: 'const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);',
        to: ''
      },
      {
        type: 'replace',
        from: 'const queryClient = useQueryClient();',
        to: ''
      },
      {
        type: 'replace',
        from: 'onError: (error) => {',
        to: 'onError: () => {'
      },
      {
        type: 'replace',
        from: 'const handleRegister = (workshopId: string) => {',
        to: 'const handleRegister = () => {'
      },
      {
        type: 'replace',
        from: 'setSelectedWorkshop(workshopId);',
        to: ''
      },
      {
        type: 'replace',
        from: 'setSelectedWorkshop(null);',
        to: ''
      },
      {
        type: 'replace',
        from: 'onClick={handleRegister}',
        to: 'onClick={() => setIsDialogOpen(true)}'
      }
    ]
  },
  
  // Fix all @shared/schema imports
  {
    file: 'client/src/components/AdminRoute.tsx',
    fixes: [
      {
        type: 'replace',
        from: '@shared/schema',
        to: '@shared/types'
      }
    ]
  }
];

// Apply all fixes
fixes.forEach(fixGroup => {
  fixFile(fixGroup.file, fixGroup.fixes);
});

// Also fix all other files with schema imports
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
  fixFile(file, [{
    type: 'replace',
    from: '@shared/schema',
    to: '@shared/types'
  }]);
});

console.log('All fixes applied successfully!');
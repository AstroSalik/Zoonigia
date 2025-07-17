const fs = require('fs');
const path = require('path');

// File paths that need fixing
const fixes = [
  // Fix OrbitalAnimation.tsx - remove unused variables
  {
    file: 'client/src/components/OrbitalAnimation.tsx',
    replacements: [
      {
        from: '  const containerRef = useRef<HTMLDivElement>(null);',
        to: '  const containerRef = useRef<HTMLDivElement>(null);'
      }
    ]
  },
  // Fix Workshops.tsx - remove unused variables
  {
    file: 'client/src/pages/Workshops.tsx',
    replacements: [
      {
        from: 'import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, ChevronRight, Check, Mail, Phone, Building, Globe } from "lucide-react";',
        to: 'import { Calendar, MapPin, Users, Clock, Telescope, Headphones, Star, Mic, Monitor, Lightbulb, Rocket, Check, Mail, Phone, Building, Globe } from "lucide-react";'
      },
      {
        from: '  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);',
        to: '  const [selectedWorkshop] = useState<string | null>(null);'
      },
      {
        from: '  const queryClient = useQueryClient();',
        to: '  const queryClient = useQueryClient();'
      },
      {
        from: '    onError: (error) => {',
        to: '    onError: () => {'
      },
      {
        from: '  const handleRegister = (workshopId: string) => {',
        to: '  const handleRegister = () => {'
      }
    ]
  },
  // Fix AdminDashboard.tsx - remove unused imports
  {
    file: 'client/src/pages/AdminDashboard.tsx',
    replacements: [
      {
        from: 'import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";',
        to: ''
      },
      {
        from: 'import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";',
        to: ''
      },
      {
        from: 'import { Calendar } from "@/components/ui/calendar";',
        to: ''
      },
      {
        from: 'import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";',
        to: ''
      },
      {
        from: 'import { cn } from "@/lib/utils";',
        to: ''
      },
      {
        from: 'import { format } from "date-fns";',
        to: ''
      },
      {
        from: 'import { CalendarIcon } from "lucide-react";',
        to: ''
      }
    ]
  }
];

// Apply fixes
fixes.forEach(fix => {
  const filePath = path.join(__dirname, fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    fix.replacements.forEach(replacement => {
      if (replacement.to === '') {
        // Remove the line entirely
        content = content.replace(replacement.from + '\n', '');
      } else {
        content = content.replace(replacement.from, replacement.to);
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${fix.file}`);
  } else {
    console.log(`File not found: ${fix.file}`);
  }
});

console.log('All fixes applied!');
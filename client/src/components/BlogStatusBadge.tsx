import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Eye, 
  Calendar 
} from 'lucide-react';

interface BlogStatusBadgeProps {
  status: string;
  className?: string;
}

const BlogStatusBadge: React.FC<BlogStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          icon: Edit3,
          className: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        };
      case 'under_review':
        return {
          label: 'Under Review',
          icon: Eye,
          className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        };
      case 'published':
        return {
          label: 'Published',
          icon: CheckCircle2,
          className: 'bg-green-500/20 text-green-300 border-green-500/30',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          className: 'bg-red-500/20 text-red-300 border-red-500/30',
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          icon: Calendar,
          className: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        };
      case 'archived':
        return {
          label: 'Archived',
          icon: Clock,
          className: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: 'bg-space-600/20 text-space-300 border-space-600/30',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${className} flex items-center gap-1.5 px-3 py-1`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
};

export default BlogStatusBadge;


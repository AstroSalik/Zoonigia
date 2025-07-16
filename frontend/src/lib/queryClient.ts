import { QueryClient } from '@tanstack/react-query';
import { apiRequest } from './api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      queryFn: async ({ queryKey }) => {
        const [endpoint] = queryKey as [string];
        return await apiRequest('GET', endpoint);
      },
    },
  },
});

export { apiRequest };
import { useQuery } from '@tanstack/react-query';
import { fetchSpirits } from '@/shared/api/spirits';

export const useSpirits = () => {
  return useQuery({
    queryKey: ['spirits'],
    queryFn: fetchSpirits,
    refetchOnWindowFocus: false,
  });
};

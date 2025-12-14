import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spirit } from '@/shared/api/schemas/spirit';

const captureSpirit = async (spiritId: string): Promise<{ success: boolean; message: string; spirit?: Spirit }> => {
  const response = await fetch(`/api/spirits/${spiritId}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spiritId }),
  });
  
  if (!response.ok) {
    throw new Error(`Capture failed: ${response.statusText}`);
  }
  
  return response.json();
};

export const useCaptureSpirit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: captureSpirit,
    
    // OPTIMISTIC UPDATE
    onMutate: async (spiritId) => {
      await queryClient.cancelQueries({ queryKey: ['spirits'] });
      
      const previousSpirits = queryClient.getQueryData<Spirit[]>(['spirits']);
      
      queryClient.setQueryData<Spirit[]>(['spirits'], (old) =>
        old?.map(spirit =>
          spirit.id === spiritId
            ? { ...spirit, status: 'capturing' as const }
            : spirit
        ) || []
      );
      
      return { previousSpirits };
    },
    
    onError: (err, spiritId, context) => {
      if (context?.previousSpirits) {
        queryClient.setQueryData(['spirits'], context.previousSpirits);
      }
      console.error('Capture failed:', err);
    },
    
    onSuccess: (data, spiritId) => {
      if (data.success && data.spirit) {
        queryClient.setQueryData<Spirit[]>(['spirits'], (old) =>
          old?.map(spirit =>
            spirit.id === spiritId ? data.spirit! : spirit
          ) || []
        );
      }
    },
    
   /*  onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['spirits'] });
    }, */
  });
};
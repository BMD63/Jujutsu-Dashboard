'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Spirit } from '@/shared/api/schemas/spirit';
import { toast } from 'react-hot-toast';

export const useSpiritEvents = () => {
  const queryClient = useQueryClient();
  
  const handleSpiritUpdate = useCallback((eventData: any) => {
    try {
      const { id, threatLevel, lastUpdated } = eventData;
      
      // Optimistic update кэша TanStack Query
      queryClient.setQueryData<Spirit[]>(['spirits'], (oldSpirits) => {
        if (!oldSpirits) return oldSpirits;
        
        return oldSpirits.map(spirit => 
          spirit.id === id 
            ? { ...spirit, threatLevel, lastUpdated }
            : spirit
        );
      });
      
      // Уведомление об обновлении 
      toast.success(`Дух обновлён! Новый уровень угрозы: ${threatLevel}`, {
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Failed to process spirit update:', error);
    }
  }, [queryClient]);
  
  useEffect(() => {
    // Создаем подключение к SSE
    const eventSource = new EventSource('/api/events/sse');
    
    eventSource.addEventListener('spirit-updated', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'spirit-updated') {
          handleSpiritUpdate(data.data);
        }
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    });
    
    eventSource.addEventListener('connected', (event) => {
      console.log('SSE connected:', JSON.parse(event.data));
    });
    
    eventSource.addEventListener('error', (error) => {
      console.error('SSE error:', error);
      // При ошибке переподключаемся через 5 секунд
      setTimeout(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          eventSource.close();
          // Можно переподключиться здесь
        }
      }, 5000);
    });
    
    // Очистка при размонтировании
    return () => {
      eventSource.close();
    };
  }, [handleSpiritUpdate]);
};
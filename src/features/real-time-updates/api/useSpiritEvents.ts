'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Spirit } from '@/shared/api/schemas/spirit';
import { toast } from 'react-hot-toast';

const RECONNECT_CONFIG = {
  baseDelay: 1000,
  maxDelay: 30000,
  maxAttempts: 10,
} as const;

export const useSpiritEvents = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSpiritUpdate = useCallback((eventData: any) => {
    try {
      const { id, threatLevel, lastUpdated } = eventData;
      
      // Обновляем кэш, но только для активных духов
      queryClient.setQueryData<Spirit[]>(['spirits'], (oldSpirits) => {
        if (!oldSpirits) return oldSpirits;
        
        return oldSpirits.map(spirit => {
          // Не обновляем captured духов
          if (spirit.status === 'captured') {
            return spirit;
          }
          
          return spirit.id === id 
            ? { ...spirit, threatLevel, lastUpdated }
            : spirit;
        });
      });
      
      toast.success(`Threat level updated: ${threatLevel}`, {
        duration: 2000,
        icon: '⚠️',
      });
      
    } catch (error) {
      console.error('SSE update processing error:', error);
    }
  }, [queryClient]);

  const handleSpiritRespawn = useCallback((eventData: any) => {
    try {
      const { oldSpiritId, newSpirit } = eventData;
      
      // Удаляем captured духа, добавляем нового
      queryClient.setQueryData<Spirit[]>(['spirits'], (oldSpirits) => {
        if (!oldSpirits) return oldSpirits;
        
        // Фильтруем captured духа
        const filtered = oldSpirits.filter(spirit => spirit.id !== oldSpiritId);
        // Добавляем нового духа
        return [...filtered, newSpirit];
      });
      
      toast.success(`New spirit detected in ${newSpirit.location}!`, {
        duration: 3000,
        icon: '🔍',
      });
      
      console.log(`Respawn: removed ${oldSpiritId}, added ${newSpirit.id}`);
      
    } catch (error) {
      console.error('SSE respawn processing error:', error);
    }
  }, [queryClient]);

  const calculateReconnectDelay = (attempt: number): number => {
    const delay = RECONNECT_CONFIG.baseDelay * Math.pow(2, attempt);
    return Math.min(delay, RECONNECT_CONFIG.maxDelay);
  };

  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connectSSE = useCallback(() => {
    disconnectSSE();

    console.log(`SSE connecting (attempt ${reconnectAttempts + 1}/${RECONNECT_CONFIG.maxAttempts})`);
    
    const eventSource = new EventSource('/api/events/sse');
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('connected', () => {
      setIsConnected(true);
      setReconnectAttempts(0);
      console.log('SSE connected successfully');
    });

    eventSource.addEventListener('spirit-updated', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'spirit-updated') {
          handleSpiritUpdate(data.data);
        }
      } catch (error) {
        console.error('SSE event parsing error:', error);
      }
    });

    eventSource.addEventListener('spirit-respawned', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'spirit-respawned') {
          handleSpiritRespawn(data.data);
        }
      } catch (error) {
        console.error('SSE respawn parsing error:', error);
      }
    });

    eventSource.addEventListener('error', (error) => {
      console.error('SSE connection error:', error);
      setIsConnected(false);
      disconnectSSE();
      
      if (reconnectAttempts < RECONNECT_CONFIG.maxAttempts - 1) {
        const delay = calculateReconnectDelay(reconnectAttempts);
        console.log(`Will reconnect in ${delay}ms`);
        
        reconnectTimerRef.current = setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connectSSE();
        }, delay);
      } else {
        console.error('Max reconnection attempts reached');
        toast.error('Real-time updates unavailable. Please refresh the page.', {
          duration: 10000,
          id: 'sse-max-attempts',
        });
      }
    });
  }, [disconnectSSE, handleSpiritUpdate, handleSpiritRespawn, reconnectAttempts]);

  useEffect(() => {
    connectSSE();

    return () => {
      disconnectSSE();
      console.log('SSE cleanup complete');
    };
  }, [connectSSE, disconnectSSE]);

  useEffect(() => {
    console.log(`SSE status: ${isConnected ? 'connected' : 'disconnected'}, attempts: ${reconnectAttempts}`);
  }, [isConnected, reconnectAttempts]);

  return { 
    isConnected, 
    reconnectAttempts,
    maxAttempts: RECONNECT_CONFIG.maxAttempts,
  };
};
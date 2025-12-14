import { NextRequest } from 'next/server';
import { spiritPool } from '@/shared/api/state/spiritPool';

export const dynamic = 'force-dynamic';

// Константы конфигурации
const EVENT_INTERVAL = 5000; // период событий
const RESPAWN_PROBABILITY = 0.5; // шанс респавна
const THREAT_LEVELS = ['low', 'medium', 'high', 'critical'] as const;

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Отправляем начальное событие
      controller.enqueue(
        encoder.encode('event: connected\ndata: {"status":"connected"}\n\n')
      );
      
      const intervalId = setInterval(() => {
        try {
          console.log('SSE tick - counts:', spiritPool.getCounts());
          
          // 1. Обновление threat level случайного активного духа
          const activeSpirit = spiritPool.getRandomActiveSpirit();
          
          if (activeSpirit) {
            const newThreatLevel = THREAT_LEVELS[Math.floor(Math.random() * THREAT_LEVELS.length)];
            const updated = spiritPool.updateThreatLevel(activeSpirit.id, newThreatLevel);
            
            if (updated) {
              const updateEvent = {
                type: 'spirit-updated',
                data: {
                  id: activeSpirit.id,
                  threatLevel: newThreatLevel,
                  lastUpdated: new Date().toISOString(),
                },
                timestamp: new Date().toISOString(),
              };
              
              const message = `event: spirit-updated\ndata: ${JSON.stringify(updateEvent)}\n\n`;
              controller.enqueue(encoder.encode(message));
              
              console.log(`SSE: Updated spirit ${activeSpirit.id} to ${newThreatLevel}`);
            }
          }
          
          // 2. Respawn logic: создаем нового духа взамен captured
          if (Math.random() < RESPAWN_PROBABILITY) {
            const respawnResult = spiritPool.respawnSpirit();
            
            if (respawnResult) {
              const { oldSpiritId, newSpirit } = respawnResult;
              
              const respawnEvent = {
                type: 'spirit-respawned',
                data: {
                  oldSpiritId,
                  newSpirit,
                },
                timestamp: new Date().toISOString(),
              };
              
              const respawnMessage = `event: spirit-respawned\ndata: ${JSON.stringify(respawnEvent)}\n\n`;
              controller.enqueue(encoder.encode(respawnMessage));
              
              console.log(`SSE: Respawned - removed ${oldSpiritId}, added ${newSpirit.id}`);
              console.log('New counts:', spiritPool.getCounts());
            } else {
              console.log('SSE: No captured spirits to respawn');
            }
          }
          
        } catch (error) {
          console.error('SSE error:', error);
        }
      }, EVENT_INTERVAL);
      
      // Очистка при разрыве соединения
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
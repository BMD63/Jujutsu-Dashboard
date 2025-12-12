import { NextRequest } from 'next/server';
import { mockSpirits } from '@/shared/api/mocks/spirits';

export const dynamic = 'force-dynamic';

const EVENT_INTERVAL = 5000; // 5 секунд

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
          // Случайно выбираем духа из моковых данных
          const randomIndex = Math.floor(Math.random() * mockSpirits.length);
          const spirit = mockSpirits[randomIndex];
          
          // Случайно выбираем новый уровень угрозы
          const threatLevels = ['low', 'medium', 'high', 'critical'] as const;
          const newThreatLevel = threatLevels[Math.floor(Math.random() * 4)];
          
          const eventData = {
            type: 'spirit-updated',
            data: {
              id: spirit.id, // Правильный ID из моковых данных
              threatLevel: newThreatLevel,
              lastUpdated: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          };
          
          const message = `event: spirit-updated\ndata: ${JSON.stringify(eventData)}\n\n`;
          controller.enqueue(encoder.encode(message));
          
          console.log(`SSE: Updated spirit ${spirit.id} to ${newThreatLevel}`);
          
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
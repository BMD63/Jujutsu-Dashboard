import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const EVENT_INTERVAL = 5000;

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
          // Имитация обновления духа
          const spiritId = Math.floor(Math.random() * 5) + 1;
          const threatLevels = ['low', 'medium', 'high', 'critical'];
          const newThreatLevel = threatLevels[Math.floor(Math.random() * 4)];
          
          const eventData = {
            type: 'spirit-updated',
            data: {
              id: `spirit-${spiritId}`,
              threatLevel: newThreatLevel,
              lastUpdated: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
          };
          
          const message = `event: spirit-updated\ndata: ${JSON.stringify(eventData)}\n\n`;
          controller.enqueue(encoder.encode(message));
          
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
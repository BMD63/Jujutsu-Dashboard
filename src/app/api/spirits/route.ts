import { NextRequest } from 'next/server';
import { spiritsArraySchema } from '@/shared/api/schemas/spirit';
import { spiritPool } from '@/shared/api/state/spiritPool';

export async function GET(request: NextRequest) {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Получаем активных духов из пула
  const activeSpirits = spiritPool.getActiveSpirits();
  
  // Валидируем данные перед отправкой
  const validatedData = spiritsArraySchema.parse(activeSpirits);
  
  return Response.json(validatedData, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}
import { NextRequest } from 'next/server';
import { spiritsArraySchema } from '@/shared/api/schemas/spirit';
import { mockSpirits } from '@/shared/api/mocks/spirits';

export async function GET(request: NextRequest) {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // ВАЛИДАЦИЯ: проверяем моковые данные через Zod
  const validatedData = spiritsArraySchema.parse(mockSpirits);
  
  return Response.json(validatedData, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { spiritSchema } from '@/shared/api/schemas/spirit';
import { spiritPool } from '@/shared/api/state/spiritPool';

// Схема для запроса
const captureRequestSchema = z.object({
  spiritId: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Получаем и валидируем ID из URL
    const { id } = params;
    
    if (!id || typeof id !== 'string') {
      return Response.json(
        { success: false, message: 'Неверный ID духа' },
        { status: 400 }
      );
    }
    
    // 2. Парсим тело запроса
    const body = await request.json();
    const { spiritId } = captureRequestSchema.parse(body);
    
    // 3. Проверяем соответствие ID
    if (spiritId !== id) {
      return Response.json(
        { success: false, message: 'ID в запросе и URL не совпадают' },
        { status: 400 }
      );
    }
    
    // 4. 30% вероятность ошибки (по условию задачи)
    if (Math.random() < 0.3) {
      return Response.json(
        { 
          success: false, 
          message: 'Дух сопротивляется! Захват не удался.' 
        },
        { status: 500 }
      );
    }
    
    // 5. Захватываем духа через пул
    const capturedSpirit = spiritPool.captureSpirit(spiritId);
    
    if (!capturedSpirit) {
      return Response.json(
        { success: false, message: 'Дух не найден или уже захвачен' },
        { status: 404 }
      );
    }
    
    // 6. Валидируем и возвращаем ответ
    const validatedSpirit = spiritSchema.parse(capturedSpirit);
    
    return Response.json({
      success: true,
      message: 'Дух успешно пойман!',
      spirit: validatedSpirit
    });
    
  } catch (error) {
    console.error('Ошибка захвата духа:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, message: 'Ошибка валидации данных' },
        { status: 400 }
      );
    }
    
    return Response.json(
      { success: false, message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
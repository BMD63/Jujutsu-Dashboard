import { NextRequest } from 'next/server';
import { z } from 'zod';

// Локальные схемы (чтобы избежать проблем с импортом из вложенной директории)
const spiritSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  threatLevel: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.string().min(1),
  status: z.enum(['active', 'capturing', 'captured']),
  lastUpdated: z.string().datetime()
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
    const { spiritId } = z.object({ spiritId: z.string().min(1) }).parse(body);
    
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
    
    // 5. Имитация успешного захвата
    const capturedSpirit = spiritSchema.parse({
      id,
      name: `Захваченный дух ${id.slice(0, 4)}`,
      threatLevel: 'low',
      location: 'Штаб-квартира',
      status: 'captured',
      lastUpdated: new Date().toISOString()
    });
    
    // 6. Возвращаем успешный ответ
    return Response.json({
      success: true,
      message: 'Дух успешно пойман!',
      spirit: capturedSpirit
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
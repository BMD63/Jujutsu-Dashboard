'use client';

import { SpiritsList } from '@/features/spirits-list/ui/SpiritsList/SpiritsList';
import { useSpiritEvents } from '@/features/real-time-updates/api/useSpiritEvents';

export default function MonitoringPage() {
  // Подключаем real-time обновления
  useSpiritEvents();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Мониторинг аномалий</h1>
      <p>Система отслеживания духов в реальном времени</p>
      
      <div style={{ 
        margin: '20px 0', 
        padding: '10px', 
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        🔄 Real-time обновления активны. Уровни угроз меняются каждые 5 секунд.
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Обнаруженные духи</h2>
        <SpiritsList />
      </div>
    </div>
  );
}
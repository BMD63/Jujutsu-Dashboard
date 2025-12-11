import { SpiritsList } from '@/features/spirits-list/ui/SpiritsList/SpiritsList';

export default function MonitoringPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Мониторинг аномалий</h1>
      <p>Система отслеживания духов в реальном времени</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Обнаруженные духи</h2>
        <SpiritsList />
      </div>
    </div>
  );
}
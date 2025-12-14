'use client';

import { SpiritsList } from '@/features/spirits-list/ui/SpiritsList/SpiritsList';
import { useSpiritEvents } from '@/features/real-time-updates/api/useSpiritEvents';
import './monitoring.scss';

export default function MonitoringPage() {
  useSpiritEvents();
  
  return (
    <div className="monitoring-container">
      <header className="monitoring-header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="title-icon">👁️</span>
            Мониторинг аномалий
          </h1>
          <p className="header-subtitle">Система отслеживания духов в реальном времени</p>
          
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-value">9</div>
              <div className="stat-label">Зон мониторинга</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">5s</div>
              <div className="stat-label">Обновление данных</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">50%</div>
              <div className="stat-label">Шанс респавна</div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="monitoring-alert">
        <div className="alert-icon">🔔</div>
        <div className="alert-content">
          <strong>Real-time обновления активны</strong>
          <span>Уровни угроз меняются каждые 5 секунд. Новые духи появляются с вероятностью 50%.</span>
        </div>
      </div>
      
      <main className="monitoring-main">
        <div className="main-header">
          <h2 className="main-title">Обнаруженные духи</h2>
          <div className="threat-legend">
            <div className="legend-item">
              <div className="legend-color low"></div>
              <span>Low</span>
            </div>
            <div className="legend-item">
              <div className="legend-color medium"></div>
              <span>Medium</span>
            </div>
            <div className="legend-item">
              <div className="legend-color high"></div>
              <span>High</span>
            </div>
            <div className="legend-item">
              <div className="legend-color critical"></div>
              <span>Critical</span>
            </div>
          </div>
        </div>
        
        <SpiritsList />
      </main>
    </div>
  );
}
import Link from 'next/link';
import './home.scss';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Jujutsu Dashboard</h1>
        <p className="home-subtitle">Система мониторинга аномалий и духов в реальном времени</p>
        
        <div className="home-features">
          <div className="feature">
            <div className="feature-icon">👁️</div>
            <h3>Real-time мониторинг</h3>
            <p>Отслеживание духов в Токио с SSE обновлениями</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h3>Захват аномалий</h3>
            <p>Optimistic updates с 30% вероятностью ошибки</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Автоматический респавн</h3>
            <p>Цикличный пул духов с random respawn</p>
          </div>
        </div>
        
        <div className="home-tech">
          <h3>Технологический стек:</h3>
          <div className="tech-tags">
            <span className="tech-tag">Next.js 14</span>
            <span className="tech-tag">TanStack Query</span>
            <span className="tech-tag">Zod</span>
            <span className="tech-tag">SCSS Modules</span>
            <span className="tech-tag">Docker</span>
            <span className="tech-tag">FSD Architecture</span>
          </div>
        </div>
        
        <Link href="/monitoring" className="home-button">
          Перейти к дашборду мониторинга →
        </Link>
      </div>
    </div>
  );
}
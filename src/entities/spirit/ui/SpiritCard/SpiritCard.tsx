import { Spirit } from '@/shared/api/schemas/spirit';
import { CaptureButton } from '@/features/capture-spirit/ui/CaptureButton';
import styles from './SpiritCard.module.scss';

interface SpiritCardProps {
  spirit: Spirit;
}

export const SpiritCard = ({ spirit }: SpiritCardProps) => {
  const threatLevelColors = {
    low: '#4CAF50',
    medium: '#FF9800', 
    high: '#F44336',
    critical: '#9C27B0',
  };

  const statusText = {
    active: '👻 Активен',
    capturing: '🔄 Захватывается',
    captured: '🎯 Пойман',
  };

  const isCaptured = spirit.status === 'captured';
  
  return (
    <div className={`${styles.card} ${isCaptured ? styles.capturedCard : ''}`}>
      <h3 className={`${styles.title} ${isCaptured ? styles.capturedTitle : ''}`}>
        {spirit.name}
      </h3>
      
      <div className={styles.threatLevel}>
        <div 
          className={`${styles.threatDot} ${isCaptured ? styles.captured : ''}`}
          style={!isCaptured ? { backgroundColor: threatLevelColors[spirit.threatLevel] } : {}}
        />
        <span className={styles.threatLabel}>
          Уровень: {spirit.threatLevel}
        </span>
      </div>
      
      <p className={styles.info}>📍 {spirit.location}</p>
      <p className={styles.info}>Статус: {statusText[spirit.status]}</p>
      
      <div className={styles.capturedTimeContainer}>
        {spirit.capturedAt && (
          <p className={styles.capturedTime}>
            🕐 Пойман: {new Date(spirit.capturedAt).toLocaleTimeString()}
          </p>
        )}
      </div>
      
      <p className={styles.timestamp}>
        Обновлено: {new Date(spirit.lastUpdated).toLocaleTimeString()}
      </p>
      
      <div className={styles.buttonContainer}>
        <CaptureButton
          spiritId={spirit.id}
          spiritName={spirit.name}
          isCaptured={isCaptured}
        />
      </div>
    </div>
  );
};
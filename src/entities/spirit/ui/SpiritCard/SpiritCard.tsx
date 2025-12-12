import { Spirit } from '@/shared/api/schemas/spirit';
import { CaptureButton } from '@/features/capture-spirit/ui/CaptureButton';
import styles from './SpiritCard.module.scss';

interface SpiritCardProps {
  spirit: Spirit;
}

export const SpiritCard = ({ spirit }: SpiritCardProps) => {
  const statusText = {
    active: '👻 Активен',
    capturing: '🔄 Захватывается',
    captured: '🎯 Пойман',
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{spirit.name}</h3>
      
      <div className={styles.threatLevel}>
        <div className={`${styles.threatDot} ${styles[spirit.threatLevel]}`} />
        <span className={styles.threatLabel}>Уровень: {spirit.threatLevel}</span>
      </div>
      
      <p className={styles.info}>📍 {spirit.location}</p>
      <p className={styles.info}>Статус: {statusText[spirit.status]}</p>
      <p className={styles.timestamp}>
        Обновлено: {new Date(spirit.lastUpdated).toLocaleTimeString()}
      </p>
      
      <div className={styles.buttonContainer}>
        <CaptureButton
          spiritId={spirit.id}
          spiritName={spirit.name}
          isCaptured={spirit.status === 'captured'}
        />
      </div>
    </div>
  );
};
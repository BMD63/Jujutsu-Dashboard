import { Spirit } from '@/shared/api/schemas/spirit';

interface SpiritCardProps {
  spirit: Spirit;
}

export const SpiritCard = ({ spirit }: SpiritCardProps) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px',
      maxWidth: '300px'
    }}>
      <h3>{spirit.name}</h3>
      <p>Уровень угрозы: {spirit.threatLevel}</p>
      <p>Локация: {spirit.location}</p>
      <p>Статус: {spirit.status}</p>
      <button>Capture</button>
    </div>
  );
};
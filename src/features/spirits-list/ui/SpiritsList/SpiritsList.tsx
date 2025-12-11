'use client';

import { useSpirits } from '../../api/useSpirits';
import { SpiritCard } from '@/entities/spirit/ui/SpiritCard/SpiritCard';
import { Spirit } from '@/shared/api/schemas/spirit';

export const SpiritsList = () => {
  const { data: spirits, isLoading, error } = useSpirits();

  if (isLoading) {
    return <div>Загрузка списка духов...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки: {error.message}</div>;
  }

  if (!spirits || spirits.length === 0) {
    return <div>Духи не обнаружены</div>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {spirits.map((spirit: Spirit) => (
        <SpiritCard key={spirit.id} spirit={spirit} />
      ))}
    </div>
  );
};
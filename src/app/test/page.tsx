import { SpiritCard } from '@/entities/spirit/ui/SpiritCard/SpiritCard';
import { mockSpirits } from '@/shared/api/mocks/spirits';

export default function TestPage() {
  return (
    <div>
      <h1>Тест компонента SpiritCard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {mockSpirits.map(spirit => (
          <SpiritCard key={spirit.id} spirit={spirit} />
        ))}
      </div>
    </div>
  );
}
import { spiritsArraySchema } from './schemas/spirit';
import { Spirit } from './schemas/spirit';

export const fetchSpirits = async (): Promise<Spirit[]> => {
  const response = await fetch('/api/spirits');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch spirits: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // ВАЛИДАЦИЯ
  return spiritsArraySchema.parse(data);
};
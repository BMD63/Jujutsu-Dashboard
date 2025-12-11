import { Spirit } from '../schemas/spirit';

export const mockSpirits: Spirit[] = [
  {
    id: '1',
    name: 'Kitsune',
    threatLevel: 'high',
    location: 'Shibuya',
    status: 'active',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Oni',
    threatLevel: 'critical',
    location: 'Shinjuku',
    status: 'active',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Yurei',
    threatLevel: 'medium',
    location: 'Akihabara',
    status: 'active',
    lastUpdated: new Date().toISOString()
  }
];
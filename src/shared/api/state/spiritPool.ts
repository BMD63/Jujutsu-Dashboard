import { Spirit } from '../schemas/spirit';

// Шаблоны духов
const SPIRIT_TEMPLATES = [
  { baseName: 'Kitsune', baseThreat: 'high' as const, preferredLocation: 'Shibuya' },
  { baseName: 'Oni', baseThreat: 'critical' as const, preferredLocation: 'Shinjuku' },
  { baseName: 'Yurei', baseThreat: 'medium' as const, preferredLocation: 'Akihabara' },
  { baseName: 'Tengu', baseThreat: 'low' as const, preferredLocation: 'Ueno Park' },
  { baseName: 'Kappa', baseThreat: 'medium' as const, preferredLocation: 'Sumida River' },
  { baseName: 'Nue', baseThreat: 'high' as const, preferredLocation: 'Roppongi' },
  { baseName: 'Jorogumo', baseThreat: 'critical' as const, preferredLocation: 'Ginza' },
  { baseName: 'Yuki-onna', baseThreat: 'medium' as const, preferredLocation: 'Mount Takao' },
  { baseName: 'Hitodama', baseThreat: 'high' as const, preferredLocation: 'Aokigahara' },
] as const;

// Типы
type SpiritTemplate = typeof SPIRIT_TEMPLATES[number];
type SpiritStatus = 'available' | 'active' | 'captured';
type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';

class SpiritPool {
  private templates: SpiritTemplate[] = [...SPIRIT_TEMPLATES];
  private spirits: Map<string, Spirit> = new Map();
  private status: Map<string, SpiritStatus> = new Map();
  private capturedIds: string[] = []; // Массив captured ID для случайного выбора
  private nextId = 1;

  constructor() {
    // Инициализация: все духи активны
    this.templates.forEach((template, index) => {
      const id = `spirit-${index + 1}`;
      const spirit: Spirit = {
        id,
        name: template.baseName,
        threatLevel: template.baseThreat,
        location: template.preferredLocation,
        status: 'active',
        lastUpdated: new Date().toISOString(),
      };
      
      this.spirits.set(id, spirit);
      this.status.set(id, 'active');
    });
  }

  // Получить все активные духи
  getActiveSpirits(): Spirit[] {
    return Array.from(this.spirits.values())
      .filter(spirit => this.status.get(spirit.id) === 'active')
      .map(spirit => ({ ...spirit }));
  }

  // Получить все захваченные духи
  getCapturedSpirits(): Spirit[] {
    return this.capturedIds
      .map(id => this.spirits.get(id))
      .filter((spirit): spirit is Spirit => spirit !== undefined)
      .map(spirit => ({ ...spirit }));
  }

  // Захватить духа
  captureSpirit(spiritId: string): Spirit | null {
    const spirit = this.spirits.get(spiritId);
    if (!spirit || this.status.get(spiritId) !== 'active') {
      return null;
    }

    const capturedSpirit: Spirit = {
      ...spirit,
      status: 'captured',
      capturedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.spirits.set(spiritId, capturedSpirit);
    this.status.set(spiritId, 'captured');
    this.capturedIds.push(spiritId);

    return { ...capturedSpirit };
  }

  // Респавн нового духа взамен случайного captured
  respawnSpirit(): { oldSpiritId: string; newSpirit: Spirit } | null {
    if (this.capturedIds.length === 0) {
      return null;
    }

    // Выбираем случайного captured духа
    const randomIndex = Math.floor(Math.random() * this.capturedIds.length);
    const oldSpiritId = this.capturedIds.splice(randomIndex, 1)[0];
    const oldSpirit = this.spirits.get(oldSpiritId)!;
    
    // Выбираем случайный шаблон для нового духа
    const template = this.templates[Math.floor(Math.random() * this.templates.length)];
    const newSpiritId = `spirit-new-${this.nextId++}`;
    
    const newSpirit: Spirit = {
      id: newSpiritId,
      name: template.baseName,
      threatLevel: template.baseThreat,
      location: template.preferredLocation,
      status: 'active',
      lastUpdated: new Date().toISOString(),
    };

    // Удаляем старого духа из пула
    this.spirits.delete(oldSpiritId);
    this.status.delete(oldSpiritId);
    
    // Добавляем нового
    this.spirits.set(newSpiritId, newSpirit);
    this.status.set(newSpiritId, 'active');

    return {
      oldSpiritId,
      newSpirit: { ...newSpirit },
    };
  }

  // Обновить уровень угрозы активного духа
  updateThreatLevel(spiritId: string, threatLevel: ThreatLevel): boolean {
    const spirit = this.spirits.get(spiritId);
    if (!spirit || this.status.get(spiritId) !== 'active') {
      return false;
    }

    const updatedSpirit: Spirit = {
      ...spirit,
      threatLevel,
      lastUpdated: new Date().toISOString(),
    };

    this.spirits.set(spiritId, updatedSpirit);
    return true;
  }

  // Получить случайного активного духа
  getRandomActiveSpirit(): Spirit | null {
    const activeSpirits = this.getActiveSpirits();
    if (activeSpirits.length === 0) {
      return null;
    }
    
    return activeSpirits[Math.floor(Math.random() * activeSpirits.length)];
  }

  // Получить количество духов по статусам
  getCounts() {
    return {
      available: 0,
      active: Array.from(this.status.values()).filter(s => s === 'active').length,
      captured: this.capturedIds.length,
    };
  }
}

// Singleton instance
export const spiritPool = new SpiritPool();
import { Study, Record, Analytics } from '../types';

// Mock service - no backend required, works with local storage
class ApiService {
  private mockStudies: Study[] = [];
  private storageKey = 'metep-studies';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.mockStudies = JSON.parse(stored);
      } catch (e) {
        this.mockStudies = [];
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.mockStudies));
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getStudies(): Promise<Study[]> {
    await this.delay(300); // Simulate network delay
    return [...this.mockStudies];
  }

  async getStudy(id: string): Promise<Study> {
    await this.delay(200);
    const study = this.mockStudies.find(s => s.id === id);
    if (!study) {
      throw new Error('Estudio no encontrado');
    }
    return { ...study };
  }

  async createStudy(studyData: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>): Promise<Study> {
    await this.delay(500);
    
    const newStudy: Study = {
      ...studyData,
      id: 'study-' + Date.now(),
      userId: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      records: []
    };
    
    this.mockStudies.push(newStudy);
    this.saveToStorage();
    return { ...newStudy };
  }

  async updateStudy(id: string, studyData: Partial<Study>): Promise<Study> {
    await this.delay(300);
    
    const index = this.mockStudies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Estudio no encontrado');
    }
    
    this.mockStudies[index] = {
      ...this.mockStudies[index],
      ...studyData,
      updatedAt: new Date()
    };
    
    this.saveToStorage();
    return { ...this.mockStudies[index] };
  }

  async deleteStudy(id: string): Promise<void> {
    await this.delay(200);
    
    const index = this.mockStudies.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Estudio no encontrado');
    }
    
    this.mockStudies.splice(index, 1);
    this.saveToStorage();
  }

  async addRecord(studyId: string, recordData: Omit<Record, 'id' | 'timestamp'>): Promise<Record> {
    await this.delay(300);
    
    const study = this.mockStudies.find(s => s.id === studyId);
    if (!study) {
      throw new Error('Estudio no encontrado');
    }
    
    const newRecord: Record = {
      ...recordData,
      id: 'record-' + Date.now(),
      timestamp: new Date()
    };
    
    study.records.push(newRecord);
    study.updatedAt = new Date();
    this.saveToStorage();
    return { ...newRecord };
  }

  async deleteRecord(studyId: string, recordId: string): Promise<void> {
    await this.delay(200);
    
    const study = this.mockStudies.find(s => s.id === studyId);
    if (!study) {
      throw new Error('Estudio no encontrado');
    }
    
    const recordIndex = study.records.findIndex(r => r.id === recordId);
    if (recordIndex === -1) {
      throw new Error('Registro no encontrado');
    }
    
    study.records.splice(recordIndex, 1);
    study.updatedAt = new Date();
    this.saveToStorage();
  }

  async exportStudy(studyId: string): Promise<Blob> {
    await this.delay(500);
    
    const study = this.mockStudies.find(s => s.id === studyId);
    if (!study) {
      throw new Error('Estudio no encontrado');
    }
    
    // Create a simple CSV export
    const csvData = 'Responsable,Supervisor,Línea,Modelo\n' + 
                   `${study.responsable},${study.supervisor},${study.linea},${study.modelo}`;
    
    return new Blob([csvData], { type: 'text/csv' });
  }

  async getAnalytics(studyId: string): Promise<Analytics> {
    await this.delay(300);
    
    const study = this.mockStudies.find(s => s.id === studyId);
    if (!study) {
      throw new Error('Estudio no encontrado');
    }
    
    const totalMicroparos = study.records.filter(r => r.esMicroparo).length;
    const totalRecords = study.records.length;
    
    return {
      totalRecords,
      totalMicroparos,
      tiempoTotalPerdido: study.records.reduce((sum, r) => sum + (r.esMicroparo ? r.desviacion : 0), 0),
      eficiencia: totalRecords > 0 ? 85 : 0,
      porcentajeMicroparos: totalRecords > 0 ? (totalMicroparos / totalRecords) * 100 : 0
    };
  }
}

export const apiService = new ApiService();
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Study {
  id: string;
  userId: string;
  responsable: string;
  supervisor: string;
  linea: string;
  modelo: string;
  familia: string;
  piezasPorHora: number;
  taktime: number;
  tolerancia: number;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
  records: Record[];
}

export interface Record {
  id: string;
  numeroMuestra: number;
  esMicroparo: boolean;
  tiempoCiclo: number;
  desviacion: number;
  fecha: string;
  hora: string;
  categoriaCausa: string;
  comentario: string;
  timestamp: Date;
}

export interface Analytics {
  totalRecords: number;
  totalMicroparos: number;
  tiempoTotalPerdido: number;
  eficiencia: number;
  porcentajeMicroparos: number;
}

export interface StopwatchState {
  time: number;
  isRunning: boolean;
  startTime: number;
}
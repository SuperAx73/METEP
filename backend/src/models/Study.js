import { db } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../utils/logger.js';

export class Study {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.responsable = data.responsable;
    this.supervisor = data.supervisor;
    this.linea = data.linea;
    this.modelo = data.modelo;
    this.familia = data.familia;
    this.piezasPorHora = data.piezasPorHora;
    this.taktime = data.taktime;
    this.tolerancia = data.tolerancia;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.records = data.records || [];
  }

  async save() {
    try {
      const studyRef = db.collection('studies').doc(this.id);
      const studyData = {
        ...this,
        createdAt: this.createdAt,
        updatedAt: new Date()
      };
      
      await studyRef.set(studyData);
      Logger.info(`Study saved: ${this.id}`);
      return this;
    } catch (error) {
      Logger.error('Error saving study:', error);
      throw new Error('Error al guardar el estudio');
    }
  }

  static async findByUserId(userId) {
    try {
      const snapshot = await db.collection('studies')
        .orderBy('createdAt', 'desc')
        .where('userId', '==', userId)
        .get();
      
      return snapshot.docs.map(doc => new Study({ id: doc.id, ...doc.data() }));
    } catch (error) {
      Logger.error('Error finding studies:', error);
      throw new Error('Error al obtener los estudios');
    }
  }

  static async findById(id) {
    try {
      const doc = await db.collection('studies').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return new Study({ id: doc.id, ...doc.data() });
    } catch (error) {
      Logger.error('Error finding study by ID:', error);
      throw new Error('Error al obtener el estudio');
    }
  }

  async addRecord(recordData) {
    try {
      const record = {
        id: uuidv4(),
        ...recordData,
        timestamp: new Date()
      };

      this.records.push(record);
      await this.save();
      Logger.info(`Record added to study: ${this.id}`);
      return record;
    } catch (error) {
      Logger.error('Error adding record:', error);
      throw new Error('Error al agregar el registro');
    }
  }

  async clearRecords() {
    try {
      this.records = [];
      await this.save();
      Logger.info(`Records cleared for study: ${this.id}`);
      return this;
    } catch (error) {
      Logger.error('Error clearing records:', error);
      throw new Error('Error al limpiar los registros');
    }
  }

  getAnalytics() {
    const totalRecords = this.records.length;
    const microparos = this.records.filter(r => r.esMicroparo);
    const totalMicroparos = microparos.length;
    const tiempoTotalPerdido = microparos.reduce((sum, r) => sum + r.desviacion, 0);
    const tiempoTotalMedido = this.records.reduce((sum, r) => sum + r.tiempoCiclo, 0);
    const eficiencia = tiempoTotalMedido > 0 ? (this.taktime * totalRecords) / tiempoTotalMedido : 0;

    return {
      totalRecords,
      totalMicroparos,
      tiempoTotalPerdido,
      eficiencia: Math.round(eficiencia * 100) / 100,
      porcentajeMicroparos: totalRecords > 0 ? Math.round((totalMicroparos / totalRecords) * 100) / 100 : 0
    };
  }
}
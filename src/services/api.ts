import axios, { AxiosResponse } from 'axios';
import { Study, Record, Analytics } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    const auth = (await import('../config/firebase')).auth;
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  }

  private async getHeaders() {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Studies
  async getStudies(): Promise<Study[]> {
    try {
      const headers = await this.getHeaders();
      const response: AxiosResponse<Study[]> = await axios.get(`${this.baseURL}/studies`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching studies:', error);
      throw error;
    }
  }

  async getStudy(id: string): Promise<Study> {
    try {
      const headers = await this.getHeaders();
      const response: AxiosResponse<Study> = await axios.get(`${this.baseURL}/studies/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching study:', error);
      throw error;
    }
  }

  async createStudy(studyData: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>): Promise<Study> {
    try {
      const headers = await this.getHeaders();
      const response: AxiosResponse<Study> = await axios.post(`${this.baseURL}/studies`, studyData, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating study:', error);
      throw error;
    }
  }

  async updateStudy(id: string, studyData: Partial<Study>): Promise<Study> {
    try {
      const headers = await this.getHeaders();
      const response: AxiosResponse<Study> = await axios.put(`${this.baseURL}/studies/${id}`, studyData, { headers });
      return response.data;
    } catch (error) {
      console.error('Error updating study:', error);
      throw error;
    }
  }

  async deleteStudy(id: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      await axios.delete(`${this.baseURL}/studies/${id}`, { headers });
    } catch (error) {
      console.error('Error deleting study:', error);
      throw error;
    }
  }

  // Records
  async addRecord(studyId: string, recordData: Omit<Record, 'id' | 'numeroMuestra' | 'timestamp'>): Promise<Record> {
    try {
      const headers = await this.getHeaders();
      const response: AxiosResponse<Record> = await axios.post(`${this.baseURL}/studies/${studyId}/records`, recordData, { headers });
      return response.data;
    } catch (error) {
      console.error('Error adding record:', error);
      throw error;
    }
  }

  async clearRecords(studyId: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      await axios.delete(`${this.baseURL}/studies/${studyId}/records`, { headers });
    } catch (error) {
      console.error('Error clearing records:', error);
      throw error;
    }
  }

  // Export
  async exportToExcel(studyId: string): Promise<Blob> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/studies/${studyId}/export`, {
        headers,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
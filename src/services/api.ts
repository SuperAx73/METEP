import { Study, Record, Analytics } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error en la petición');
  }
  if (res.status === 204) return undefined as T; // No Content
  return res.json();
}

export async function getStudies(): Promise<Study[]> {
  const res = await fetch(`${API_BASE_URL}/studies`);
  return handleResponse<Study[]>(res);
}

export async function getStudy(id: string): Promise<Study> {
  const res = await fetch(`${API_BASE_URL}/studies/${id}`);
  return handleResponse<Study>(res);
}

export async function createStudy(studyData: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>): Promise<Study> {
  const res = await fetch(`${API_BASE_URL}/studies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studyData),
  });
  return handleResponse<Study>(res);
}

export async function updateStudy(id: string, studyData: Partial<Study>): Promise<Study> {
  const res = await fetch(`${API_BASE_URL}/studies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studyData),
  });
  return handleResponse<Study>(res);
}

export async function deleteStudy(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/studies/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(res);
}

export async function addRecord(studyId: string, recordData: Omit<Record, 'id' | 'timestamp'>): Promise<Record> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recordData),
  });
  return handleResponse<Record>(res);
}

export async function deleteRecord(studyId: string, recordId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/records/${recordId}`, {
    method: 'DELETE',
  });
  await handleResponse<void>(res);
}

export async function exportStudy(studyId: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/export`);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error al exportar');
  }
  return res.blob();
}

export async function getAnalytics(studyId: string): Promise<Analytics> {
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/analytics`);
  return handleResponse<Analytics>(res);
}
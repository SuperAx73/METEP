import { Study, Record, Analytics } from '../types';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function getAuthHeader() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Usuario no autenticado');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error en la petición');
  }
  if (res.status === 204) return undefined as T; // No Content
  return res.json();
}

export async function getStudies(): Promise<Study[]> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/studies`, { headers });
  return handleResponse<Study[]>(res);
}

export async function getStudy(id: string): Promise<Study> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/studies/${id}`, { headers });
  return handleResponse<Study>(res);
}

export async function createStudy(studyData: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>): Promise<Study> {
  const headers = { ...(await getAuthHeader()), 'Content-Type': 'application/json' };
  const res = await fetch(`${API_BASE_URL}/studies`, {
    method: 'POST',
    headers,
    body: JSON.stringify(studyData),
  });
  return handleResponse<Study>(res);
}

export async function updateStudy(id: string, studyData: Partial<Study>): Promise<Study> {
  const headers = { ...(await getAuthHeader()), 'Content-Type': 'application/json' };
  const res = await fetch(`${API_BASE_URL}/studies/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(studyData),
  });
  return handleResponse<Study>(res);
}

export async function deleteStudy(id: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/studies/${id}`, {
    method: 'DELETE',
    headers,
  });
  await handleResponse<void>(res);
}

export async function addRecord(studyId: string, recordData: Omit<Record, 'id' | 'timestamp'>): Promise<Record> {
  const headers = { ...(await getAuthHeader()), 'Content-Type': 'application/json' };
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/records`, {
    method: 'POST',
    headers,
    body: JSON.stringify(recordData),
  });
  return handleResponse<Record>(res);
}

export async function deleteRecord(studyId: string, recordId: string): Promise<void> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/records/${recordId}`, {
    method: 'DELETE',
    headers,
  });
  await handleResponse<void>(res);
}

export async function exportStudy(studyId: string): Promise<Blob> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/export`, { headers });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error al exportar');
  }
  return res.blob();
}

export async function getAnalytics(studyId: string): Promise<Analytics> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/studies/${studyId}/analytics`, { headers });
  return handleResponse<Analytics>(res);
}
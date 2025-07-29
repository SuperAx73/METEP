/**
 * Utilidades para manejo de fechas en la aplicación
 */

/**
 * Convierte una fecha a formato ISO YYYY-MM-DD para el backend
 * @param date - Fecha a convertir
 * @returns String en formato YYYY-MM-DD
 */
export const formatDateForBackend = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Convierte una fecha a formato legible para la UI
 * @param date - Fecha a convertir
 * @returns String en formato localizado
 */
export const formatDateForUI = (date: Date): string => {
  return date.toLocaleDateString();
};

/**
 * Convierte una fecha a formato de hora legible para la UI
 * @param date - Fecha a convertir
 * @returns String en formato de hora localizado
 */
export const formatTimeForUI = (date: Date): string => {
  return date.toLocaleTimeString();
};

/**
 * Crea una fecha actual formateada para el backend
 * @returns String en formato YYYY-MM-DD
 */
export const getCurrentDateForBackend = (): string => {
  return formatDateForBackend(new Date());
};

/**
 * Crea una hora actual formateada para la UI
 * @returns String en formato de hora localizado
 */
export const getCurrentTimeForUI = (): string => {
  return formatTimeForUI(new Date());
}; 
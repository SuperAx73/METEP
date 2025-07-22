import React from 'react';
import { Record } from '../../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface RecordsTableProps {
  records: Record[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Registros</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Muestra
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Microparo
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiempo Ciclo
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Desviación
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora Inicio Microparo
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Máquina
              </th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comentario
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-2 sm:px-6 py-4 text-center text-gray-500">
                  No hay registros disponibles
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className={record.esMicroparo ? 'bg-red-50' : 'bg-green-50'}>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                    {record.numeroMuestra}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      {record.esMicroparo ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-700 font-medium">Sí</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-700 font-medium">No</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {record.tiempoCiclo.toFixed(2)}s
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    <span className={record.desviacion > 0 ? 'text-red-600' : 'text-green-600'}>
                      {record.desviacion > 0 ? '+' : ''}{record.desviacion.toFixed(2)}s
                    </span>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {record.fecha}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {record.hora}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {record.horaInicioMicroparo || ''}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {record.categoriaCausa || '-'}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {record.esMicroparo ? (record.maquina || '-') : ''}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    <div className="max-w-32 truncate" title={record.comentario}>
                      {record.comentario || '-'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordsTable;
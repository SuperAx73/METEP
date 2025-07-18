import React from 'react';
import { Study } from '../../types';
import { Calendar, User, Factory, MoreVertical, Download, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Button from '../UI/Button';

interface StudyCardProps {
  study: Study;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

const StudyCard: React.FC<StudyCardProps> = ({ 
  study, 
  onView, 
  onEdit, 
  onDelete, 
  onExport 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const analytics = {
    totalRecords: study.records.length,
    totalMicroparos: study.records.filter(r => r.esMicroparo).length,
    eficiencia: study.records.length > 0 ? 
      (study.taktime * study.records.length) / study.records.reduce((sum, r) => sum + r.tiempoCiclo, 0) * 100 : 0
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {study.modelo} - {study.familia}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">Línea: {study.linea}</p>
          </div>
          
          <div className="relative self-end sm:self-auto">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => { onEdit(); setShowMenu(false); }}
                    className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => { onExport(); setShowMenu(false); }}
                    className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {study.responsable}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(study.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{analytics.totalRecords}</div>
            <div className="text-xs text-gray-500">Registros</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-red-600">{analytics.totalMicroparos}</div>
            <div className="text-xs text-gray-500">Microparos</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">{analytics.eficiencia.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Eficiencia</div>
          </div>
        </div>
        
        <Button onClick={onView} className="w-full text-xs sm:text-base py-2 sm:py-3">
          Ver Estudio
        </Button>
      </div>
    </div>
  );
};

export default StudyCard;
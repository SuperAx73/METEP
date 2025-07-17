import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Study } from '../types';
import { apiService } from '../services/api';
import { Plus, Search } from 'lucide-react';
import StudyCard from '../components/Study/StudyCard';
import StudyForm from '../components/Study/StudyForm';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const Studies: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getStudies();
      setStudies(data);
    } catch (error) {
      toast.error('Error al cargar los estudios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudy = async (studyData: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>) => {
    try {
      setFormLoading(true);
      const newStudy = await apiService.createStudy(studyData);
      setStudies(prev => [newStudy, ...prev]);
      setShowForm(false);
      toast.success('Estudio creado exitosamente');
    } catch (error) {
      toast.error('Error al crear el estudio');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStudy = async (studyData: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>) => {
    if (!editingStudy) return;

    try {
      setFormLoading(true);
      const updatedStudy = await apiService.updateStudy(editingStudy.id, studyData);
      setStudies(prev => prev.map(s => s.id === editingStudy.id ? updatedStudy : s));
      setEditingStudy(null);
      setShowForm(false);
      toast.success('Estudio actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el estudio');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStudy = async (study: Study) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este estudio?')) {
      return;
    }

    try {
      await apiService.deleteStudy(study.id);
      setStudies(prev => prev.filter(s => s.id !== study.id));
      toast.success('Estudio eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el estudio');
    }
  };

  const handleExportStudy = async (study: Study) => {
    try {
      const blob = await apiService.exportToExcel(study.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estudio_${study.modelo}_${study.familia}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Archivo exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar el archivo');
    }
  };

  const filteredStudies = studies.filter(study =>
    study.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.familia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.linea.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (showForm) {
    return (
      <Card title={editingStudy ? 'Editar Estudio' : 'Crear Nuevo Estudio'}>
        <StudyForm
          initialData={editingStudy || undefined}
          onSubmit={editingStudy ? handleUpdateStudy : handleCreateStudy}
          onCancel={() => {
            setShowForm(false);
            setEditingStudy(null);
          }}
          loading={formLoading}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudios</h1>
          <p className="text-gray-600">Gestiona tus estudios de microparos industriales</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Estudio
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar estudios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredStudies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm ? 'No se encontraron estudios' : 'No hay estudios disponibles'}
          </div>
          {!searchTerm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear tu primer estudio
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map(study => (
            <StudyCard
              key={study.id}
              study={study}
              onView={() => navigate(`/study/${study.id}`)}
              onEdit={() => {
                setEditingStudy(study);
                setShowForm(true);
              }}
              onDelete={() => handleDeleteStudy(study)}
              onExport={() => handleExportStudy(study)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Studies;
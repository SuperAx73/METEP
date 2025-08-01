import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Study, Record } from '../types';
import { getStudy, addRecord, deleteRecord, exportStudy, updateStudy, getAuthHeader } from '../services/api';
import { ArrowLeft, Download, Trash2, Settings, Edit, Save, X } from 'lucide-react';
import Stopwatch from '../components/Stopwatch/Stopwatch';
import RecordsTable from '../components/Study/RecordsTable';
import StudyForm from '../components/Study/StudyForm';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import { getCurrentDateForBackend, getCurrentTimeForUI } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const StudyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'capture' | 'data'>('capture');
  const [recordForm, setRecordForm] = useState({
    categoriaCausa: '',
    comentario: '',
    maquina: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [microparoStartTime, setMicroparoStartTime] = useState<string | null>(null);
  const [taktimeCrossedTime, setTaktimeCrossedTime] = useState<string | null>(null);
  // Eliminar defaultCategories y toda lógica relacionada
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newModalMaquina, setNewModalMaquina] = useState('');
  const [addingModalMaquina, setAddingModalMaquina] = useState(false);
  const [newModalCategoria, setNewModalCategoria] = useState('');
  const [addingModalCategoria, setAddingModalCategoria] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudy();
    }
  }, [id]);

  // Update categories when study data changes
  useEffect(() => {
    if (study?.categories) {
      setCategories([...new Set(study.categories)]);
    } else {
      setCategories([]);
    }
  }, [study?.categories]);

  const fetchStudy = async () => {
    try {
      setLoading(true);
      const data = await getStudy(id!);
      setStudy(data);
    } catch (error) {
      toast.error('Error al cargar el estudio');
      navigate('/studies');
    } finally {
      setLoading(false);
    }
  };

  const handleTaktimeReached = (hora: string) => {
    setTaktimeCrossedTime(hora);
  };

  const handleRecordTime = async (time: number) => {
    if (!study) return;

    const isMicroparo = time > (study.taktime + study.tolerancia);
    
    // Si es un microparo, usar la hora en la que se cruzó el taktime
    if (isMicroparo) {
      setCurrentTime(time);
      setMicroparoStartTime(taktimeCrossedTime || getCurrentTimeForUI());
      setShowRecordForm(true);
      return;
    }

    // Si no es microparo, guardar directamente sin información adicional
    try {
      const now = new Date();
      const recordData = {
        tiempoCiclo: time,
        desviacion: time - study.taktime,
        esMicroparo: false,
        fecha: getCurrentDateForBackend(),
        hora: getCurrentTimeForUI(),
        categoriaCausa: '',
        comentario: '',
        numeroMuestra: study.records.length + 1
      };

      const newRecord = await addRecord(study.id, recordData);
      
      // Update study state locally without refetching
      setStudy(prevStudy => {
        if (!prevStudy) return prevStudy;
        return {
          ...prevStudy,
          records: [...prevStudy.records, newRecord]
        };
      });
      
      toast.success('Registro agregado exitosamente');
    } catch (error) {
      toast.error('Error al agregar el registro');
    }
  };

  const handleClearRecords = async () => {
    if (!study) return;

    if (!window.confirm('¿Estás seguro de que quieres eliminar todos los registros?')) {
      return;
    }

    try {
      // Llamar al nuevo endpoint eficiente
      const headers = await getAuthHeader();
      const res = await fetch(`${API_BASE_URL}/studies/${study.id}/records`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Error al limpiar los registros');
      }
      // Limpiar el estado local
      setStudy(prevStudy => {
        if (!prevStudy) return prevStudy;
        return {
          ...prevStudy,
          records: []
        };
      });
      toast.success('Registros eliminados exitosamente');
    } catch (error: any) {
      toast.error('Error al eliminar los registros: ' + (error.message || error));
    }
  };

  const handleExport = async () => {
    if (!study) return;

    try {
      const blob = await exportStudy(study.id);
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

  const handleUpdateStudy = async (studyData: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>) => {
    if (!study) return;

    try {
      setEditLoading(true);
      const updatedStudy = await updateStudy(study.id, studyData);
      
      // Update study state locally without refetching
      setStudy(prevStudy => {
        if (!prevStudy) return prevStudy;
        return {
          ...updatedStudy,
          records: prevStudy.records // Keep existing records
        };
      });
      
      setIsEditing(false);
      toast.success('Estudio actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el estudio');
    } finally {
      setEditLoading(false);
    }
  };

  const handleSaveMicroparo = async () => {
    if (!study || !currentTime) return;

    try {
      const now = new Date();
      const desviacion = currentTime - study.taktime;
      // Calcular la hora de inicio del microparo restando la desviación a la hora de fin
      const horaFin = now;
      const horaInicioDate = new Date(horaFin.getTime() - desviacion * 1000);
      const horaInicioMicroparo = horaInicioDate.toLocaleTimeString();
      const recordData = {
        tiempoCiclo: currentTime,
        desviacion,
        esMicroparo: true,
        fecha: getCurrentDateForBackend(),
        hora: getCurrentTimeForUI(),
        horaInicioMicroparo,
        categoriaCausa: recordForm.categoriaCausa,
        comentario: recordForm.comentario,
        maquina: recordForm.maquina,
        numeroMuestra: study.records.length + 1
      };

      const newRecord = await addRecord(study.id, recordData);
      
      // Update study state locally without refetching
      setStudy(prevStudy => {
        if (!prevStudy) return prevStudy;
        return {
          ...prevStudy,
          records: [...prevStudy.records, newRecord]
        };
      });
      
      // Clear form and hide
      setRecordForm({ categoriaCausa: '', comentario: '', maquina: '' });
      setShowRecordForm(false);
      setCurrentTime(null);
      setMicroparoStartTime(null);
      setTaktimeCrossedTime(null);
      
      toast.success('Microparo registrado exitosamente');
    } catch (error) {
      toast.error('Error al registrar el microparo');
    }
  };

  const handleCancelMicroparo = () => {
    setShowRecordForm(false);
    setCurrentTime(null);
    setRecordForm({ categoriaCausa: '', comentario: '', maquina: '' });
    setMicroparoStartTime(null);
    setTaktimeCrossedTime(null);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim().toLowerCase())) {
      setCategories(prev => [...prev, newCategory.trim().toLowerCase()]);
      setNewCategory('');
      setShowAddCategory(false);
      toast.success('Categoría agregada exitosamente');
    } else if (categories.includes(newCategory.trim().toLowerCase())) {
      toast.error('Esta categoría ya existe');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(prev => prev.filter(cat => cat !== categoryToRemove));
    toast.success('Categoría eliminada exitosamente');
  };

  // Handler para agregar máquina desde el modal
  const handleAddModalMaquina = async () => {
    if (!study || !newModalMaquina.trim()) return;
    if (study.maquinas.includes(newModalMaquina.trim().toLowerCase())) {
      toast.error('La máquina ya existe');
      return;
    }
    setAddingModalMaquina(true);
    try {
      const nuevasMaquinas = [...study.maquinas, newModalMaquina.trim().toLowerCase()];
      const updatedStudy = await updateStudy(study.id, { maquinas: nuevasMaquinas });
      setStudy(prev => prev ? { ...prev, maquinas: nuevasMaquinas } : prev);
      setRecordForm(prev => ({ ...prev, maquina: newModalMaquina.trim().toLowerCase() }));
      toast.success('Máquina agregada');
      setNewModalMaquina('');
    } catch (error) {
      toast.error('Error al agregar la máquina');
    } finally {
      setAddingModalMaquina(false);
    }
  };
  // Handler para agregar categoría desde el modal
  const handleAddModalCategoria = async () => {
    if (!study || !newModalCategoria.trim()) return;
    if (categories.includes(newModalCategoria.trim().toLowerCase())) {
      toast.error('El modo de falla ya existe');
      return;
    }
    setAddingModalCategoria(true);
    try {
      const nuevasCategorias = [...categories, newModalCategoria.trim().toLowerCase()];
      const updatedStudy = await updateStudy(study.id, { categories: nuevasCategorias });
      setCategories(nuevasCategorias);
      setRecordForm(prev => ({ ...prev, categoriaCausa: newModalCategoria.trim().toLowerCase() }));
      toast.success('Modo de falla agregado');
      setNewModalCategoria('');
    } catch (error) {
      toast.error('Error al agregar el modo de falla');
    } finally {
      setAddingModalCategoria(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Estudio no encontrado</div>
        <Button onClick={() => navigate('/studies')}>
          Volver a Estudios
        </Button>
      </div>
    );
  }

  const analytics = {
    totalRecords: study.records.length,
    totalMicroparos: study.records.filter(r => r.esMicroparo).length,
    tiempoTotalPerdido: study.records.filter(r => r.esMicroparo).reduce((sum, r) => sum + r.desviacion, 0),
    eficiencia: study.records.length > 0 ? 
      (study.taktime * study.records.length) / study.records.reduce((sum, r) => sum + r.tiempoCiclo, 0) * 100 : 0
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Estudio
              </h1>
              <p className="text-gray-600">Modifica los datos del estudio</p>
            </div>
          </div>
        </div>

        <Card title="Editar Datos del Estudio">
          <StudyForm
            initialData={study}
            onSubmit={handleUpdateStudy}
            onCancel={() => setIsEditing(false)}
            loading={editLoading}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Título y línea */}
      <div className="text-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {study.modelo} - {study.familia}
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm">Línea: {study.linea}</p>
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-between gap-2 sm:gap-2 w-full">
        <Button
          variant="outline"
          onClick={() => navigate('/studies')}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="w-full"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          onClick={handleExport}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button
          variant="danger"
          onClick={handleClearRecords}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <div className="text-center">
            <div className="text-xl sm:text-3xl font-bold text-blue-600">{analytics.totalRecords}</div>
            <div className="text-xs sm:text-sm text-gray-500">Registros Totales</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-xl sm:text-3xl font-bold text-red-600">{analytics.totalMicroparos}</div>
            <div className="text-xs sm:text-sm text-gray-500">Microparos</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-xl sm:text-3xl font-bold text-orange-600">{analytics.tiempoTotalPerdido.toFixed(1)}s</div>
            <div className="text-xs sm:text-sm text-gray-500">Tiempo Perdido</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-xl sm:text-3xl font-bold text-green-600">{analytics.eficiencia.toFixed(1)}%</div>
            <div className="text-xs sm:text-sm text-gray-500">Eficiencia</div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-col sm:flex-row space-x-0 sm:space-x-8">
          <button
            onClick={() => setActiveTab('capture')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'capture'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Captura de Tiempos
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Datos del Estudio
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'capture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Stopwatch
                onRecordTime={handleRecordTime}
                taktime={study.taktime}
                onTaktimeReached={handleTaktimeReached}
              />
            </div>
            
            <Card title="Información del Estudio">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Taktime:</span> {study.taktime}s
                  </div>
                  <div>
                    <span className="font-medium">Tolerancia:</span> {study.tolerancia}s
                  </div>
                  <div>
                    <span className="font-medium">Umbral Microparo:</span> {study.taktime + study.tolerancia}s
                  </div>
                  <div>
                    <span className="font-medium">Siguiente Muestra:</span> #{study.records.length + 1}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">Estado Normal</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Las piezas dentro del rango se guardan automáticamente
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          <RecordsTable records={study.records} />
        </div>
      )}

      {activeTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Información del Estudio">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Responsable</label>
                <p className="text-sm text-gray-900">{study.responsable}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                <p className="text-sm text-gray-900">{study.supervisor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Línea</label>
                <p className="text-sm text-gray-900">{study.linea}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Modelo</label>
                <p className="text-sm text-gray-900">{study.modelo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Familia</label>
                <p className="text-sm text-gray-900">{study.familia}</p>
              </div>
            </div>
          </Card>
          
          <Card title="Parámetros de Producción">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Piezas por Hora</label>
                <p className="text-sm text-gray-900">{study.piezasPorHora}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Taktime (segundos)</label>
                <p className="text-sm text-gray-900">{study.taktime}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tolerancia (segundos)</label>
                <p className="text-sm text-gray-900">{study.tolerancia}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                <p className="text-sm text-gray-900">{new Date(study.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                <p className="text-sm text-gray-900">{new Date(study.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <Card title="Categorías de Causa" className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Categorías disponibles para clasificar las causas de microparos
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                >
                  {showAddCategory ? 'Cancelar' : 'Agregar Categoría'}
                </Button>
              </div>

              {showAddCategory && (
                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                  <Input
                    placeholder="Nueva categoría..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                  >
                    Agregar
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categories.map((category) => {
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {category}
                      </span>
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal para registrar microparo */}
      <Modal
        isOpen={showRecordForm}
        onClose={handleCancelMicroparo}
        title="Registrar Microparo"
        className="border-red-200 bg-red-50"
      >
        <div className="space-y-4">
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-800">Microparo Detectado</span>
            </div>
            <p className="text-sm text-red-700 mt-2">
              Tiempo: {currentTime?.toFixed(1)}s (Umbral: {study?.taktime + study?.tolerancia}s)
            </p>
          </div>

          {/* Máquina primero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máquina *
            </label>
            <div className="flex gap-2">
              <select
                value={recordForm.maquina}
                onChange={(e) => setRecordForm(prev => ({ ...prev, maquina: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Selecciona una máquina</option>
                {study.maquinas && study.maquinas.length > 0 ? (
                  study.maquinas.map((maquina: string) => (
                    <option key={maquina} value={maquina}>{maquina}</option>
                  ))
                ) : (
                  <option value="" disabled>No hay máquinas registradas</option>
                )}
              </select>
              <button
                type="button"
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center"
                onClick={handleAddModalMaquina}
                disabled={addingModalMaquina || !newModalMaquina.trim()}
                title="Agregar nueva máquina"
              >
                +
              </button>
            </div>
            <input
              type="text"
              className="mt-2 w-full px-3 py-1 border border-gray-300 rounded-md text-xs"
              placeholder="Nueva máquina..."
              value={newModalMaquina}
              onChange={e => setNewModalMaquina(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddModalMaquina(); }}
              disabled={addingModalMaquina}
            />
          </div>

          {/* Modo de falla después */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modo de Falla *
            </label>
            <div className="flex gap-2">
              <select
                value={recordForm.categoriaCausa}
                onChange={(e) => setRecordForm(prev => ({ ...prev, categoriaCausa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Selecciona un modo de falla</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                type="button"
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center"
                onClick={handleAddModalCategoria}
                disabled={addingModalCategoria || !newModalCategoria.trim()}
                title="Agregar nuevo modo de falla"
              >
                +
              </button>
            </div>
            <input
              type="text"
              className="mt-2 w-full px-3 py-1 border border-gray-300 rounded-md text-xs"
              placeholder="Nuevo modo de falla..."
              value={newModalCategoria}
              onChange={e => setNewModalCategoria(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddModalCategoria(); }}
              disabled={addingModalCategoria}
            />
          </div>

          {/* Comentario al final */}
          <Input
            label="Comentario"
            value={recordForm.comentario}
            onChange={(e) => setRecordForm(prev => ({ ...prev, comentario: e.target.value }))}
            placeholder="Describe la causa del microparo..."
          />

          <div className="flex space-x-3">
            <Button
              onClick={handleSaveMicroparo}
              disabled={!recordForm.categoriaCausa || !recordForm.maquina}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Guardar Microparo
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelMicroparo}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudyDetail;
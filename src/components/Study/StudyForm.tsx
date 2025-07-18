import React, { useState } from 'react';
import { Study } from '../../types';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface StudyFormProps {
  initialData?: Partial<Study>;
  onSubmit: (data: Omit<Study, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'records'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const StudyForm: React.FC<StudyFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    responsable: initialData?.responsable || '',
    supervisor: initialData?.supervisor || '',
    linea: initialData?.linea || '',
    modelo: initialData?.modelo || '',
    familia: initialData?.familia || '',
    piezasPorHora: initialData?.piezasPorHora || 60,
    taktime: initialData?.taktime || 60,
    tolerancia: initialData?.tolerancia || 5
  });

  const defaultCategories = [
    'conveyor',
    'falla de maquina',
    'falta de alimentacion',
    'flujo lento',
    'linea llena'
  ];

  const [categories, setCategories] = useState<string[]>(() => {
    if (initialData?.categories) {
      // Clean existing categories first (remove duplicates)
      const cleanedExistingCategories = [...new Set(initialData.categories)];
      // Combine default categories with existing ones, ensuring no duplicates
      const combined = [...defaultCategories, ...cleanedExistingCategories];
      return [...new Set(combined)]; // Remove duplicates
    }
    return defaultCategories;
  });
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      categories: categories
    };
    console.log('Sending study data:', dataToSubmit);
    onSubmit(dataToSubmit);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim().toLowerCase())) {
      setCategories(prev => [...prev, newCategory.trim().toLowerCase()]);
      setNewCategory('');
      setShowAddCategory(false);
    } else if (categories.includes(newCategory.trim().toLowerCase())) {
      alert('Esta categoría ya existe');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    if (defaultCategories.includes(categoryToRemove)) {
      alert('No puedes eliminar las categorías predeterminadas');
      return;
    }
    setCategories(prev => prev.filter(cat => cat !== categoryToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Responsable del Estudio"
          name="responsable"
          value={formData.responsable}
          onChange={handleChange}
          required
          className="w-full"
        />
        
        <Input
          label="Supervisor"
          name="supervisor"
          value={formData.supervisor}
          onChange={handleChange}
          required
          className="w-full"
        />
        
        <Input
          label="Línea"
          name="linea"
          value={formData.linea}
          onChange={handleChange}
          required
          className="w-full"
        />
        
        <Input
          label="Modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          required
          className="w-full"
        />
        
        <Input
          label="Familia"
          name="familia"
          value={formData.familia}
          onChange={handleChange}
          required
          className="w-full"
        />
        
        <Input
          label="Piezas por Hora"
          name="piezasPorHora"
          type="number"
          value={formData.piezasPorHora}
          onChange={handleChange}
          required
          min="1"
          className="w-full"
        />
        
        <Input
          label="Taktime (segundos)"
          name="taktime"
          type="number"
          step="0.1"
          value={formData.taktime}
          onChange={handleChange}
          required
          min="0.1"
          className="w-full"
        />
        
        <Input
          label="Tolerancia (segundos)"
          name="tolerancia"
          type="number"
          step="0.01"
          value={formData.tolerancia}
          onChange={handleChange}
          required
          min="0.01"
          className="w-full"
        />
      </div>

      {/* Categorías de Causa */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <label className="block text-sm font-medium text-gray-700">
            Categorías de Causa
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="w-full sm:w-auto"
          >
            {showAddCategory ? 'Cancelar' : 'Agregar Categoría'}
          </Button>
        </div>

        {showAddCategory && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="Nueva categoría..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
              className="w-full sm:w-auto"
            >
              Agregar
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categories.map((category) => {
            const isDefault = defaultCategories.includes(category);
            return (
              <div
                key={category}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isDefault ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className={`text-sm font-medium ${
                  isDefault ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {category}
                  {isDefault && (
                    <span className="ml-2 text-xs text-blue-500">(predeterminada)</span>
                  )}
                </span>
                {!isDefault && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="w-full sm:w-auto"
        >
          {initialData ? 'Actualizar' : 'Crear'} Estudio
        </Button>
      </div>
    </form>
  );
};

export default StudyForm;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Responsable del Estudio"
          name="responsable"
          value={formData.responsable}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Supervisor"
          name="supervisor"
          value={formData.supervisor}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Línea"
          name="linea"
          value={formData.linea}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Familia"
          name="familia"
          value={formData.familia}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Piezas por Hora"
          name="piezasPorHora"
          type="number"
          value={formData.piezasPorHora}
          onChange={handleChange}
          required
          min="1"
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
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {initialData ? 'Actualizar' : 'Crear'} Estudio
        </Button>
      </div>
    </form>
  );
};

export default StudyForm;
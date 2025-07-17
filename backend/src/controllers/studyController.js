import { Study } from '../models/Study.js';
import { ExcelService } from '../services/excelService.js';
import Logger from '../utils/logger.js';

export const studyController = {
  async createStudy(req, res) {
    try {
      const studyData = {
        ...req.body,
        userId: req.user.uid
      };

      const study = new Study(studyData);
      await study.save();

      Logger.info(`Study created: ${study.id} by user: ${req.user.uid}`);
      res.status(201).json(study);
    } catch (error) {
      Logger.error('Error creating study:', error);
      res.status(500).json({ error: 'Error al crear el estudio' });
    }
  },

  async getStudies(req, res) {
    try {
      const studies = await Study.findByUserId(req.user.uid);
      res.json(studies);
    } catch (error) {
      Logger.error('Error fetching studies:', error);
      res.status(500).json({ error: 'Error al obtener los estudios' });
    }
  },

  async getStudy(req, res) {
    try {
      const study = await Study.findById(req.params.id);
      if (!study) {
        return res.status(404).json({ error: 'Estudio no encontrado' });
      }

      if (study.userId !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      res.json(study);
    } catch (error) {
      Logger.error('Error fetching study:', error);
      res.status(500).json({ error: 'Error al obtener el estudio' });
    }
  },

  async updateStudy(req, res) {
    try {
      const study = await Study.findById(req.params.id);
      if (!study) {
        return res.status(404).json({ error: 'Estudio no encontrado' });
      }

      if (study.userId !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      Object.assign(study, req.body);
      await study.save();

      Logger.info(`Study updated: ${study.id}`);
      res.json(study);
    } catch (error) {
      Logger.error('Error updating study:', error);
      res.status(500).json({ error: 'Error al actualizar el estudio' });
    }
  },

  async deleteStudy(req, res) {
    try {
      const study = await Study.findById(req.params.id);
      if (!study) {
        return res.status(404).json({ error: 'Estudio no encontrado' });
      }

      if (study.userId !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      await db.collection('studies').doc(req.params.id).delete();
      
      Logger.info(`Study deleted: ${req.params.id}`);
      res.json({ message: 'Estudio eliminado exitosamente' });
    } catch (error) {
      Logger.error('Error deleting study:', error);
      res.status(500).json({ error: 'Error al eliminar el estudio' });
    }
  },

  async addRecord(req, res) {
    try {
      const study = await Study.findById(req.params.id);
      if (!study) {
        return res.status(404).json({ error: 'Estudio no encontrado' });
      }

      if (study.userId !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      const recordData = {
        ...req.body,
        numeroMuestra: study.records.length + 1
      };

      // Calcular si es microparo
      const esMicroparo = recordData.tiempoCiclo > (study.taktime + study.tolerancia);
      recordData.esMicroparo = esMicroparo;
      recordData.desviacion = recordData.tiempoCiclo - study.taktime;

      const record = await study.addRecord(recordData);
      
      Logger.info(`Record added to study: ${study.id}`);
      res.status(201).json(record);
    } catch (error) {
      Logger.error('Error adding record:', error);
      res.status(500).json({ error: 'Error al agregar el registro' });
    }
  },

  async clearRecords(req, res) {
    try {
      const study = await Study.findById(req.params.id);
      if (!study) {
        return res.status(404).json({ error: 'Estudio no encontrado' });
      }

      if (study.userId !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      await study.clearRecords();
      
      Logger.info(`Records cleared for study: ${study.id}`);
      res.json({ message: 'Registros eliminados exitosamente' });
    } catch (error) {
      Logger.error('Error clearing records:', error);
      res.status(500).json({ error: 'Error al limpiar los registros' });
    }
  },

  async exportToExcel(req, res) {
    try {
      const study = await Study.findById(req.params.id);
      if (!study) {
        return res.status(404).json({ error: 'Estudio no encontrado' });
      }

      if (study.userId !== req.user.uid) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      const workbook = await ExcelService.generateStudyReport(study);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="estudio_${study.id}.xlsx"`);
      
      await workbook.xlsx.write(res);
      res.end();
      
      Logger.info(`Excel export completed for study: ${study.id}`);
    } catch (error) {
      Logger.error('Error exporting to Excel:', error);
      res.status(500).json({ error: 'Error al exportar a Excel' });
    }
  }
};
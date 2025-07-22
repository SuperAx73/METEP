import ExcelJS from 'exceljs';
import Logger from '../utils/logger.js';

export class ExcelService {
  static async generateStudyReport(study) {
    try {
      const workbook = new ExcelJS.Workbook();
      const analytics = study.getAnalytics();

      // Hoja 1: Resumen del Estudio
      const resumenSheet = workbook.addWorksheet('Resumen del Estudio');
      resumenSheet.addRow(['RESUMEN DEL ESTUDIO']);
      resumenSheet.addRow(['Responsable:', study.responsable]);
      resumenSheet.addRow(['Supervisor:', study.supervisor]);
      resumenSheet.addRow(['Línea:', study.linea]);
      resumenSheet.addRow(['Modelo:', study.modelo]);
      resumenSheet.addRow(['Familia:', study.familia]);
      resumenSheet.addRow(['Piezas por Hora:', study.piezasPorHora]);
      resumenSheet.addRow(['Taktime (seg):', study.taktime]);
      resumenSheet.addRow(['Tolerancia (seg):', study.tolerancia]);
      resumenSheet.addRow(['']);
      resumenSheet.addRow(['RESULTADOS']);
      resumenSheet.addRow(['Eficiencia (%):', analytics.eficiencia]);
      resumenSheet.addRow(['Piezas Medidas:', analytics.totalRecords]);
      resumenSheet.addRow(['Microparos Detectados:', analytics.totalMicroparos]);
      resumenSheet.addRow(['Tiempo Total Perdido (seg):', analytics.tiempoTotalPerdido]);
      resumenSheet.addRow(['Porcentaje Microparos (%):', analytics.porcentajeMicroparos]);

      // Hoja 2: Todos los Registros
      const todosSheet = workbook.addWorksheet('Todos los Registros');
      todosSheet.addRow(['N° Muestra', 'Es Microparo', 'Tiempo Ciclo', 'Desviación', 'Fecha', 'Hora Inicio Microparo', 'Hora', 'Máquina', 'Modo de Falla', 'Comentario']);
      
      study.records.forEach(record => {
        todosSheet.addRow([
          record.numeroMuestra,
          record.esMicroparo ? 'Sí' : 'No',
          record.tiempoCiclo,
          record.desviacion,
          record.fecha,
          record.horaInicioMicroparo || '',
          record.hora,
          record.maquina || '',
          record.categoriaCausa || '',
          record.comentario || ''
        ]);
      });

      // Hoja 3: Solo Microparos
      const microparosSheet = workbook.addWorksheet('Solo Microparos');
      microparosSheet.addRow(['N° Muestra', 'Tiempo Ciclo', 'Desviación', 'Fecha', 'Hora Inicio Microparo', 'Hora', 'Máquina', 'Modo de Falla', 'Comentario']);
      
      study.records.filter(r => r.esMicroparo).forEach(record => {
        microparosSheet.addRow([
          record.numeroMuestra,
          record.tiempoCiclo,
          record.desviacion,
          record.fecha,
          record.horaInicioMicroparo || '',
          record.hora,
          record.maquina || '',
          record.categoriaCausa || '',
          record.comentario || ''
        ]);
      });

      // Hoja 4: Pareto de Primer Nivel (por máquina)
      const paretoMaquinaSheet = workbook.addWorksheet('Pareto de Primer Nivel');
      const paretoMaquinaData = {};
      microparos.forEach(record => {
        const maquina = record.maquina || 'Sin Máquina';
        if (!paretoMaquinaData[maquina]) {
          paretoMaquinaData[maquina] = {
            maquina,
            frecuencia: 0,
            tiempoTotal: 0
          };
        }
        paretoMaquinaData[maquina].frecuencia++;
        paretoMaquinaData[maquina].tiempoTotal += record.desviacion;
      });
      const paretoMaquinaArray = Object.values(paretoMaquinaData).sort((a, b) => b.tiempoTotal - a.tiempoTotal);
      paretoMaquinaSheet.addRow(['Máquina', 'Frecuencia', 'Tiempo Total (seg)', 'Porcentaje', 'Porcentaje Acumulado']);
      const totalTiempoMaquina = paretoMaquinaArray.reduce((sum, item) => sum + item.tiempoTotal, 0);
      let acumuladoMaquina = 0;
      let porcentajeAcumuladoMaquina = 0;
      paretoMaquinaArray.sort((a, b) => {
        const porcentajeA = totalTiempoMaquina > 0 ? (a.tiempoTotal / totalTiempoMaquina) : 0;
        const porcentajeB = totalTiempoMaquina > 0 ? (b.tiempoTotal / totalTiempoMaquina) : 0;
        return porcentajeB - porcentajeA;
      });
      paretoMaquinaArray.forEach(item => {
        acumuladoMaquina += item.tiempoTotal;
        let porcentaje = totalTiempoMaquina > 0 ? (item.tiempoTotal / totalTiempoMaquina) : 0;
        if (porcentaje > 1) porcentaje = 1;
        porcentajeAcumuladoMaquina += porcentaje;
        if (porcentajeAcumuladoMaquina > 1) porcentajeAcumuladoMaquina = 1;
        paretoMaquinaSheet.addRow([
          item.maquina,
          item.frecuencia,
          item.tiempoTotal,
          porcentaje,
          porcentajeAcumuladoMaquina
        ]);
      });
      paretoMaquinaSheet.getColumn(4).numFmt = '0.00%';
      paretoMaquinaSheet.getColumn(5).numFmt = '0.00%';

      // Hoja 5: Pareto Segundo Nivel (por categoría, por máquina)
      const paretoSheet = workbook.addWorksheet('Pareto Segundo Nivel');
      const maquinasUnicas = [...new Set(microparos.map(r => r.maquina || 'Sin Máquina'))];
      maquinasUnicas.forEach(maquina => {
        paretoSheet.addRow([maquina]);
        const microparosMaquina = microparos.filter(r => (r.maquina || 'Sin Máquina') === maquina);
        const paretoData = {};
        microparosMaquina.forEach(record => {
          const categoria = record.categoriaCausa || 'Sin Categoría';
          if (!paretoData[categoria]) {
            paretoData[categoria] = {
              categoria,
              frecuencia: 0,
              tiempoTotal: 0
            };
          }
          paretoData[categoria].frecuencia++;
          paretoData[categoria].tiempoTotal += record.desviacion;
        });
        const paretoArray = Object.values(paretoData).sort((a, b) => b.tiempoTotal - a.tiempoTotal);
        paretoSheet.addRow(['Modo de Falla', 'Frecuencia', 'Tiempo Total (seg)', 'Porcentaje', 'Porcentaje Acumulado']);
        const totalTiempo = paretoArray.reduce((sum, item) => sum + item.tiempoTotal, 0);
        let acumulado = 0;
        let porcentajeAcumulado = 0;
        paretoArray.forEach(item => {
          acumulado += item.tiempoTotal;
          let porcentaje = totalTiempo > 0 ? (item.tiempoTotal / totalTiempo) : 0;
          if (porcentaje > 1) porcentaje = 1;
          porcentajeAcumulado += porcentaje;
          if (porcentajeAcumulado > 1) porcentajeAcumulado = 1;
          paretoSheet.addRow([
            item.categoria,
            item.frecuencia,
            item.tiempoTotal,
            porcentaje,
            porcentajeAcumulado
          ]);
        });
        paretoSheet.addRow([]); // Espacio entre máquinas
      });
      // Formato de porcentaje para las columnas de porcentaje en la hoja de Pareto Segundo Nivel
      paretoSheet.getColumn(4).numFmt = '0.00%';
      paretoSheet.getColumn(5).numFmt = '0.00%';

      // Styling
      [resumenSheet, todosSheet, microparosSheet, paretoMaquinaSheet, paretoSheet].forEach(sheet => {
        sheet.getRow(1).font = { bold: true };
        sheet.columns.forEach(column => {
          column.width = 15;
        });
      });

      Logger.info(`Excel report generated for study: ${study.id}`);
      return workbook;
    } catch (error) {
      Logger.error('Error generating Excel report:', error);
      throw new Error('Error al generar el reporte de Excel');
    }
  }
}
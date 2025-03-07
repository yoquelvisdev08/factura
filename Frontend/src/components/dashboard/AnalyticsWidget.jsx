import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import useDocumentStore from '../../store/documentStore';

const AnalyticsWidget = () => {
  const [tab, setTab] = useState(0);
  const { documents } = useDocumentStore();
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Calcular datos para los gráficos
  const getChartData = () => {
    // Documentos por tipo
    const byType = [
      { 
        name: 'Facturas', 
        value: documents.filter(doc => doc.type === 'invoice').length,
        color: theme.palette.primary.main
      },
      { 
        name: 'Contratos', 
        value: documents.filter(doc => doc.type === 'contract').length,
        color: theme.palette.secondary.main
      },
      { 
        name: 'Legales', 
        value: documents.filter(doc => doc.type === 'legal').length,
        color: theme.palette.info.main
      },
    ];

    // Documentos por estado
    const byStatus = [
      { 
        name: 'Borradores', 
        value: documents.filter(doc => doc.status === 'draft').length,
        color: theme.palette.info.light
      },
      { 
        name: 'Pendientes', 
        value: documents.filter(doc => doc.status === 'pending').length,
        color: theme.palette.warning.main
      },
      { 
        name: 'Completados', 
        value: documents.filter(doc => doc.status === 'completed').length,
        color: theme.palette.success.main
      },
      { 
        name: 'Cancelados', 
        value: documents.filter(doc => doc.status === 'cancelled').length,
        color: theme.palette.error.main
      },
    ];

    // Documentos por mes (últimos 6 meses)
    const byMonth = Array(6).fill().map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleString('es-ES', { month: 'short' });
      const year = date.getFullYear();
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      return {
        name: `${month} ${year}`,
        Facturas: documents.filter(doc => 
          doc.type === 'invoice' && 
          new Date(doc.created_at) >= monthStart && 
          new Date(doc.created_at) <= monthEnd
        ).length,
        Contratos: documents.filter(doc => 
          doc.type === 'contract' && 
          new Date(doc.created_at) >= monthStart && 
          new Date(doc.created_at) <= monthEnd
        ).length,
        Legales: documents.filter(doc => 
          doc.type === 'legal' && 
          new Date(doc.created_at) >= monthStart && 
          new Date(doc.created_at) <= monthEnd
        ).length,
      };
    });

    return { byType, byStatus, byMonth };
  };

  const chartData = getChartData();

  return (
    <Paper elevation={0} sx={{ 
      p: 3, 
      height: '100%',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
    }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Analítica de Documentos
      </Typography>
      
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Por Tipo" />
        <Tab label="Por Estado" />
        <Tab label="Por Mes" />
      </Tabs>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ height: 250, mt: 2 }}>
        {tab === 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.byType.filter(item => item.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Cantidad']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {tab === 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.byStatus.filter(item => item.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Cantidad']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {tab === 2 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.byMonth} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Facturas" fill={theme.palette.primary.main} />
              <Bar dataKey="Contratos" fill={theme.palette.secondary.main} />
              <Bar dataKey="Legales" fill={theme.palette.info.main} />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {documents.length === 0 && (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography color="text.secondary">
              No hay suficientes datos para mostrar estadísticas
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AnalyticsWidget; 
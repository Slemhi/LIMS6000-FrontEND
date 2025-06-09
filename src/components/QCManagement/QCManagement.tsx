import React, { useState } from 'react';
import { TrendingUp, BarChart3, AlertTriangle, CheckCircle, Target, Calendar } from 'lucide-react';
import { QCChart, QCDataPoint } from '../../types';

const QCManagement: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<string>('THC-CCV');
  
  // Mock QC data
  const qcCharts: QCChart[] = [
    {
      analyte: 'THC',
      qcType: 'CCV',
      controlLimits: {
        mean: 98.5,
        upperControl: 115,
        lowerControl: 85,
        upperWarning: 110,
        lowerWarning: 90,
        upperAction: 120,
        lowerAction: 80
      },
      data: [
        { date: '2024-01-15', value: 97.2, batchId: 'AB001', status: 'Pass' },
        { date: '2024-01-16', value: 99.1, batchId: 'AB002', status: 'Pass' },
        { date: '2024-01-17', value: 96.8, batchId: 'AB003', status: 'Pass' },
        { date: '2024-01-18', value: 101.2, batchId: 'AB004', status: 'Pass' },
        { date: '2024-01-19', value: 95.5, batchId: 'AB005', status: 'Pass' },
        { date: '2024-01-20', value: 112.3, batchId: 'AB006', status: 'Warning' },
        { date: '2024-01-21', value: 98.9, batchId: 'AB007', status: 'Pass' },
        { date: '2024-01-22', value: 100.5, batchId: 'AB008', status: 'Pass' },
        { date: '2024-01-23', value: 97.7, batchId: 'AB009', status: 'Pass' },
        { date: '2024-01-24', value: 99.3, batchId: 'AB010', status: 'Pass' }
      ]
    }
  ];

  const currentChart = qcCharts.find(chart => `${chart.analyte}-${chart.qcType}` === selectedChart) || qcCharts[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pass':
        return 'text-green-600';
      case 'Warning':
        return 'text-yellow-600';
      case 'Fail':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Fail':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-slate-400" />;
    }
  };

  const calculateStatistics = (data: QCDataPoint[]) => {
    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      mean: mean.toFixed(2),
      stdDev: stdDev.toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      count: values.length
    };
  };

  const stats = calculateStatistics(currentChart.data);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">QC Management</h2>
        <p className="text-slate-600">Monitor quality control trends and performance</p>
      </div>

      {/* QC Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total QC Samples</p>
              <p className="text-2xl font-bold text-slate-900">156</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pass Rate</p>
              <p className="text-2xl font-bold text-green-600">94.2%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">8</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Failures</p>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* QC Chart Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">QC Control Charts</h3>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="THC-CCV">THC - CCV</option>
            <option value="CBD-CCV">CBD - CCV</option>
            <option value="THC-MRL">THC - MRL</option>
            <option value="Blank-THC">Blank - THC</option>
          </select>
        </div>

        {/* Chart Area */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-slate-900">
              {currentChart.analyte} - {currentChart.qcType} Control Chart
            </h4>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Action Limits</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Warning Limits</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Control Limits</span>
              </div>
            </div>
          </div>

          {/* Simplified Chart Visualization */}
          <div className="relative h-64 bg-white rounded border">
            <div className="absolute inset-0 p-4">
              {/* Chart lines */}
              <div className="relative h-full">
                {/* Action limits */}
                <div className="absolute w-full border-t-2 border-red-500 border-dashed" style={{ top: '10%' }}>
                  <span className="text-xs text-red-600 ml-2">Upper Action ({currentChart.controlLimits.upperAction})</span>
                </div>
                <div className="absolute w-full border-t-2 border-red-500 border-dashed" style={{ top: '90%' }}>
                  <span className="text-xs text-red-600 ml-2">Lower Action ({currentChart.controlLimits.lowerAction})</span>
                </div>
                
                {/* Warning limits */}
                <div className="absolute w-full border-t border-yellow-500 border-dashed" style={{ top: '20%' }}>
                  <span className="text-xs text-yellow-600 ml-2">Upper Warning ({currentChart.controlLimits.upperWarning})</span>
                </div>
                <div className="absolute w-full border-t border-yellow-500 border-dashed" style={{ top: '80%' }}>
                  <span className="text-xs text-yellow-600 ml-2">Lower Warning ({currentChart.controlLimits.lowerWarning})</span>
                </div>
                
                {/* Control limits */}
                <div className="absolute w-full border-t border-green-500" style={{ top: '30%' }}>
                  <span className="text-xs text-green-600 ml-2">Upper Control ({currentChart.controlLimits.upperControl})</span>
                </div>
                <div className="absolute w-full border-t border-green-500" style={{ top: '70%' }}>
                  <span className="text-xs text-green-600 ml-2">Lower Control ({currentChart.controlLimits.lowerControl})</span>
                </div>
                
                {/* Mean line */}
                <div className="absolute w-full border-t-2 border-blue-600" style={{ top: '50%' }}>
                  <span className="text-xs text-blue-600 ml-2 font-medium">Mean ({currentChart.controlLimits.mean})</span>
                </div>

                {/* Data points */}
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                  {currentChart.data.map((point, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          point.status === 'Pass' ? 'bg-green-500' :
                          point.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{
                          marginBottom: `${((point.value - currentChart.controlLimits.lowerAction) / 
                            (currentChart.controlLimits.upperAction - currentChart.controlLimits.lowerAction)) * 100}%`
                        }}
                        title={`${point.date}: ${point.value}% (${point.status})`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-slate-600">Mean</p>
            <p className="text-lg font-semibold text-slate-900">{stats.mean}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600">Std Dev</p>
            <p className="text-lg font-semibold text-slate-900">{stats.stdDev}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600">Min</p>
            <p className="text-lg font-semibold text-slate-900">{stats.min}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600">Max</p>
            <p className="text-lg font-semibold text-slate-900">{stats.max}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600">Count</p>
            <p className="text-lg font-semibold text-slate-900">{stats.count}</p>
          </div>
        </div>

        {/* Recent QC Data */}
        <div>
          <h4 className="text-md font-medium text-slate-900 mb-3">Recent QC Results</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Date</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Batch ID</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Value</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Status</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Deviation</th>
                </tr>
              </thead>
              <tbody>
                {currentChart.data.slice(-10).reverse().map((point, index) => {
                  const deviation = ((point.value - currentChart.controlLimits.mean) / currentChart.controlLimits.mean * 100);
                  return (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-2 px-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{point.date}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm font-mono">{point.batchId}</td>
                      <td className="py-2 px-3 text-sm font-medium">{point.value}%</td>
                      <td className="py-2 px-3 text-sm">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(point.status)}
                          <span className={getStatusColor(point.status)}>{point.status}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <span className={deviation > 0 ? 'text-red-600' : 'text-green-600'}>
                          {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QCManagement;
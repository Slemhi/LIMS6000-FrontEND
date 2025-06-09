import React, { useState } from 'react';
import { Beaker, Upload, Download, FileText, CheckCircle, AlertTriangle, Clock, Play, Search, Filter } from 'lucide-react';
import { mockAnalyticalBatches, mockSamples } from '../../data/mockData';
import { AnalyticalBatch, SampleResult } from '../../types';

const Analysis: React.FC = () => {
  const [batches] = useState<AnalyticalBatch[]>(mockAnalyticalBatches);
  const [selectedBatch, setSelectedBatch] = useState<AnalyticalBatch | null>(null);
  const [showDataUpload, setShowDataUpload] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsTab, setResultsTab] = useState<'qc' | 'samples'>('qc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.analyst.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.instrument.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Data Entry':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'QC Review':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const generateBatchSequence = (batch: AnalyticalBatch) => {
    const sequence = [
      `# Batch Sequence for ${batch.id}`,
      `# Generated: ${new Date().toISOString()}`,
      `# Analyst: ${batch.analyst}`,
      `# Instrument: ${batch.instrument}`,
      ``,
      `# Calibration Standards`,
      `STD_0.1_${batch.id}`,
      `STD_1.0_${batch.id}`,
      `STD_10.0_${batch.id}`,
      `STD_50.0_${batch.id}`,
      `STD_100.0_${batch.id}`,
      ``,
      `# QC Samples`,
      ...batch.qcSamples.map(qc => `${qc.type}_${qc.analyte}_${batch.id}`),
      ``,
      `# Sample Injections`,
      ...batch.prepBatches.flatMap(pbId => {
        const samples = mockSamples.filter(s => s.prepBatchId === pbId);
        return samples.map(sample => `${sample.id}_${batch.id}`);
      }),
      ``,
      `# End of Sequence`
    ].join('\n');

    navigator.clipboard.writeText(sequence);
    alert('Batch sequence copied to clipboard!');
  };

  const handleDataFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('Processing data files:', Array.from(files).map(f => f.name));
      // Simulate file processing
      setTimeout(() => {
        alert(`Successfully processed ${files.length} data file(s)`);
        setShowDataUpload(false);
      }, 2000);
    }
  };

  const getBatchSamples = (batch: AnalyticalBatch) => {
    return mockSamples.filter(sample => 
      batch.prepBatches.some(pbId => sample.prepBatchId === pbId)
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analysis Module</h2>
        <p className="text-slate-600">Manage analytical batches and instrument data</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search batches by ID, analyst, or instrument..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Data Entry">Data Entry</option>
              <option value="QC Review">QC Review</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytical Batches */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Analytical Batches</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Batch ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Assay</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Analyst</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Instrument</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Prep Batches</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.slice(0, itemsPerPage).map((batch) => (
                <tr key={batch.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-sm">{batch.id}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {batch.assayType}
                    </span>
                  </td>
                  <td className="py-3 px-4">{batch.analyst}</td>
                  <td className="py-3 px-4 text-slate-600">{batch.instrument}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {batch.prepBatches.map(pb => (
                        <span key={pb} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {pb}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(batch.status)}
                      <span className="text-sm font-medium">{batch.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setShowResults(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Results
                      </button>
                      {batch.status === 'In Progress' && (
                        <button
                          onClick={() => generateBatchSequence(batch)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1"
                        >
                          <Play className="h-3 w-3" />
                          <span>Generate Sequence</span>
                        </button>
                      )}
                      {batch.status === 'Data Entry' && (
                        <button
                          onClick={() => setShowDataUpload(true)}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1"
                        >
                          <Upload className="h-3 w-3" />
                          <span>Upload Data</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Batch {selectedBatch.id} Results</h3>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setSelectedBatch(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setResultsTab('qc')}
                  className={`py-4 text-sm font-medium border-b-2 ${
                    resultsTab === 'qc'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  QC Results
                </button>
                <button
                  onClick={() => setResultsTab('samples')}
                  className={`py-4 text-sm font-medium border-b-2 ${
                    resultsTab === 'samples'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sample Results
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Batch Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Assay Type</label>
                  <p className="text-slate-900">{selectedBatch.assayType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Analyst</label>
                  <p className="text-slate-900">{selectedBatch.analyst}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Instrument</label>
                  <p className="text-slate-900">{selectedBatch.instrument}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedBatch.status)}
                    <span>{selectedBatch.status}</span>
                  </div>
                </div>
              </div>

              {/* QC Tab */}
              {resultsTab === 'qc' && (
                <div className="space-y-6">
                  {/* Calibration Data */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Calibration Data</h4>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">CCV Result</label>
                          <p className="text-lg font-semibold text-green-600">{selectedBatch.calibrationData.ccv}%</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Blank Average</label>
                          <p className="text-lg font-semibold">
                            {(selectedBatch.calibrationData.blanks.reduce((a, b) => a + b, 0) / selectedBatch.calibrationData.blanks.length).toFixed(3)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">R² Value</label>
                          <p className="text-lg font-semibold text-blue-600">
                            {selectedBatch.calibrationData.curves[0]?.rSquared || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QC Samples */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">QC Samples</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">QC ID</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Type</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Analyte</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Expected</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Actual</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">% Recovery</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBatch.qcSamples.map((qc) => {
                            const recovery = qc.expectedValue && qc.actualValue 
                              ? ((qc.actualValue / qc.expectedValue) * 100).toFixed(1)
                              : 'N/A';
                            
                            return (
                              <tr key={qc.id} className="border-b border-slate-100">
                                <td className="py-2 px-3 text-sm font-mono">{qc.id}</td>
                                <td className="py-2 px-3 text-sm">{qc.type}</td>
                                <td className="py-2 px-3 text-sm">{qc.analyte}</td>
                                <td className="py-2 px-3 text-sm">{qc.expectedValue || 'N/A'}</td>
                                <td className="py-2 px-3 text-sm">{qc.actualValue || 'N/A'}</td>
                                <td className="py-2 px-3 text-sm">{recovery}%</td>
                                <td className="py-2 px-3 text-sm">
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    qc.result === 'Pass' ? 'bg-green-100 text-green-800' :
                                    qc.result === 'Fail' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {qc.result || 'Pending'}
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
              )}

              {/* Samples Tab */}
              {resultsTab === 'samples' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Sample Results</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Sample ID</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Sample Name</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Client</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Analyte</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Result</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Unit</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getBatchSamples(selectedBatch).map((sample) => (
                            <tr key={sample.id} className="border-b border-slate-100">
                              <td className="py-2 px-3 text-sm font-mono">{sample.id}</td>
                              <td className="py-2 px-3 text-sm">{sample.sampleName}</td>
                              <td className="py-2 px-3 text-sm">{sample.clientName}</td>
                              <td className="py-2 px-3 text-sm">THC</td>
                              <td className="py-2 px-3 text-sm font-medium">
                                {(Math.random() * 25 + 5).toFixed(2)}
                              </td>
                              <td className="py-2 px-3 text-sm">%</td>
                              <td className="py-2 px-3 text-sm">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Pass
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                {selectedBatch.status === 'QC Review' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Approve Batch
                  </button>
                )}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Export Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Upload Modal */}
      {showDataUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">Upload Data Files</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">Upload Instrument Data Files</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Supported formats: .txt, .csv, .xlsx, .raw, .d (Agilent), .wiff (Sciex)
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".txt,.csv,.xlsx,.raw,.d,.wiff"
                    onChange={handleDataFileUpload}
                  />
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Choose Files
                  </span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDataUpload(false)}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
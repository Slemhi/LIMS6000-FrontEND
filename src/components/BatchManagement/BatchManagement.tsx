import React, { useState } from 'react';
import { Plus, Users, BarChart3, Clock, CheckCircle, AlertCircle, Search, Filter, Eye, Edit, X } from 'lucide-react';
import { mockSamples, mockPrepBatches, mockAnalyticalBatches, mockInventory } from '../../data/mockData';
import { PrepBatch, AnalyticalBatch } from '../../types';

const BatchManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('unbatched');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTest, setFilterTest] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSamples, setSelectedSamples] = useState<string[]>([]);
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [showPrepBatchDetails, setShowPrepBatchDetails] = useState(false);
  const [selectedPrepBatch, setSelectedPrepBatch] = useState<PrepBatch | null>(null);
  const [batchType, setBatchType] = useState<'prep' | 'analytical'>('prep');
  const [prepBatches, setPrepBatches] = useState<PrepBatch[]>(mockPrepBatches);
  const [analyticalBatches, setAnalyticalBatches] = useState<AnalyticalBatch[]>(mockAnalyticalBatches);
  const [newBatchAssayType, setNewBatchAssayType] = useState('POT');
  const [newBatchAnalyst, setNewBatchAnalyst] = useState('Jane Smith');

  // Equipment and Reagent options (in real app, these would come from inventory/equipment management)
  const equipmentOptions = [
    { id: 'HPLC-01', name: 'HPLC Agilent 1260' },
    { id: 'SCALE-01', name: 'Analytical Balance Mettler Toledo' },
    { id: 'CENTRIFUGE-01', name: 'Centrifuge Eppendorf 5424' },
    { id: 'VORTEX-01', name: 'Vortex Mixer Scientific Industries' },
    { id: 'SONICATOR-01', name: 'Ultrasonic Bath Branson' },
    { id: 'HOTPLATE-01', name: 'Hot Plate Stirrer IKA' },
    { id: 'GC-MS-01', name: 'GC-MS Agilent 7890B' },
    { id: 'BT-DISP', name: 'Bottle Top Dispenser' }
  ];

  const reagentOptions = mockInventory.filter(item => 
    item.category === 'Chemical' || item.category === 'Reagent'
  );

  const unbatchedSamples = mockSamples.filter(s => s.status === 'Received');

  const filteredSamples = unbatchedSamples.filter(sample => {
    const matchesSearch = sample.sampleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTest === 'all' || sample.requiredTests.includes(filterTest);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSamples.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSamples = filteredSamples.slice(startIndex, startIndex + itemsPerPage);

  const TabButton = ({ id, label, count }: { id: string; label: string; count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Ready for Analysis':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Complete':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleSampleSelect = (sampleId: string) => {
    setSelectedSamples(prev => 
      prev.includes(sampleId) 
        ? prev.filter(id => id !== sampleId)
        : [...prev, sampleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSamples.length === paginatedSamples.length) {
      setSelectedSamples([]);
    } else {
      setSelectedSamples(paginatedSamples.map(s => s.id));
    }
  };

  const createBatchForTest = (testType: string) => {
    const testSamples = unbatchedSamples.filter(s => s.requiredTests.includes(testType));
    setSelectedSamples(testSamples.map(s => s.id));
    setNewBatchAssayType(testType);
    
    // Set appropriate analyst based on test type
    if (testType === 'RSA' || testType === 'SOL') {
      setNewBatchAnalyst('Nadia Sherman');
    } else {
      setNewBatchAnalyst('Jane Smith');
    }
    
    setShowCreateBatchModal(true);
  };

  const handleCreateBatch = () => {
    if (selectedSamples.length === 0) {
      alert('Please select samples to create a batch');
      return;
    }

    if (batchType === 'prep') {
      // Create new prep batch
      const newBatchId = `PB${String(prepBatches.length + 1).padStart(3, '0')}`;
      const newPrepBatch: PrepBatch = {
        id: newBatchId,
        samples: selectedSamples,
        assayType: newBatchAssayType,
        status: 'In Progress',
        analyst: newBatchAnalyst,
        createdDate: new Date().toISOString().split('T')[0],
        metadata: {
          reagents: [],
          equipment: [],
          notes: `Batch created for ${newBatchAssayType} analysis with ${selectedSamples.length} samples`
        }
      };

      setPrepBatches(prev => [...prev, newPrepBatch]);

      // Update sample statuses in the mock data
      selectedSamples.forEach(sampleId => {
        const sampleIndex = mockSamples.findIndex(s => s.id === sampleId);
        if (sampleIndex !== -1) {
          mockSamples[sampleIndex].status = 'Batched';
          mockSamples[sampleIndex].prepBatchId = newBatchId;
        }
      });

      alert(`Successfully created prep batch ${newBatchId} with ${selectedSamples.length} samples for ${newBatchAssayType} analysis`);
    } else {
      // Create new analytical batch
      const newBatchId = `AB${String(analyticalBatches.length + 1).padStart(3, '0')}`;
      const newAnalyticalBatch: AnalyticalBatch = {
        id: newBatchId,
        prepBatches: [], // This would be populated with existing prep batch IDs
        assayType: newBatchAssayType,
        status: 'In Progress',
        analyst: 'Dr. Michael Johnson',
        instrument: newBatchAssayType === 'RSA' || newBatchAssayType === 'SOL' ? 'GC-MS-Agilent-7890B' : 'HPLC-Agilent-1260',
        calibrationData: {
          curves: [],
          blanks: [],
          ccv: 0,
          createdDate: new Date().toISOString().split('T')[0]
        },
        qcSamples: [],
        results: [],
        createdDate: new Date().toISOString().split('T')[0]
      };

      setAnalyticalBatches(prev => [...prev, newAnalyticalBatch]);

      // Update sample statuses
      selectedSamples.forEach(sampleId => {
        const sampleIndex = mockSamples.findIndex(s => s.id === sampleId);
        if (sampleIndex !== -1) {
          mockSamples[sampleIndex].status = 'In Analysis';
          mockSamples[sampleIndex].analyticalBatchId = newBatchId;
        }
      });

      alert(`Successfully created analytical batch ${newBatchId} with ${selectedSamples.length} samples for ${newBatchAssayType} analysis`);
    }

    setSelectedSamples([]);
    setShowCreateBatchModal(false);
  };

  const getSamplesInBatch = (batchId: string) => {
    return mockSamples.filter(sample => sample.prepBatchId === batchId);
  };

  const handlePrepBatchClick = (batch: PrepBatch) => {
    setSelectedPrepBatch(batch);
    setShowPrepBatchDetails(true);
  };

  const updatePrepBatch = (updatedBatch: PrepBatch) => {
    setPrepBatches(prev => prev.map(batch => 
      batch.id === updatedBatch.id ? updatedBatch : batch
    ));
    setSelectedPrepBatch(updatedBatch);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Batch Management</h2>
          <p className="text-slate-600">Organize samples into prep and analytical batches</p>
        </div>
        <button 
          onClick={() => setShowCreateBatchModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Batch</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <TabButton id="unbatched" label="Unbatched Samples" count={unbatchedSamples.length} />
        <TabButton id="prep" label="Prep Batches" count={prepBatches.length} />
        <TabButton id="analytical" label="Analytical Batches" count={analyticalBatches.length} />
      </div>

      {/* Content based on active tab */}
      {activeTab === 'unbatched' && (
        <div className="space-y-6">
          {/* Test Type Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Batch Creation by Test Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {['POT', 'PES', 'HMT', 'SOL', 'RSA', 'NUT', 'MIC'].map((test) => {
                const sampleCount = unbatchedSamples.filter(s => s.requiredTests.includes(test)).length;
                return (
                  <div key={test} className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">{sampleCount}</div>
                    <div className="text-sm text-slate-600 mb-2">{test} Samples</div>
                    <button 
                      onClick={() => createBatchForTest(test)}
                      disabled={sampleCount === 0}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      Create Batch
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search samples by name, client, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <select
                  value={filterTest}
                  onChange={(e) => setFilterTest(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Tests</option>
                  <option value="POT">Potency</option>
                  <option value="PES">Pesticides</option>
                  <option value="HMT">Heavy Metals</option>
                  <option value="SOL">Solvents</option>
                  <option value="RSA">RSA</option>
                  <option value="NUT">Nutrients</option>
                  <option value="MIC">Microbials</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>

            {/* Batch Actions */}
            {selectedSamples.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedSamples.length} sample{selectedSamples.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setBatchType('prep');
                        setShowCreateBatchModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Create Prep Batch
                    </button>
                    <button
                      onClick={() => {
                        setBatchType('analytical');
                        setShowCreateBatchModal(true);
                      }}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      Create Analytical Batch
                    </button>
                    <button
                      onClick={() => setSelectedSamples([])}
                      className="text-slate-600 hover:text-slate-800 px-3 py-1 rounded text-sm"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary and Pagination */}
            <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
              <span>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSamples.length)} of {filteredSamples.length} samples
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Unbatched Samples Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Unbatched Samples</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300"
                        checked={selectedSamples.length === paginatedSamples.length && paginatedSamples.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Sample ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Received</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Tests</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSamples.map((sample) => (
                    <tr key={sample.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300"
                          checked={selectedSamples.includes(sample.id)}
                          onChange={() => handleSampleSelect(sample.id)}
                        />
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{sample.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{sample.sampleName}</td>
                      <td className="py-3 px-4 text-slate-600">{sample.clientName}</td>
                      <td className="py-3 px-4 text-slate-600">{sample.receivedDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {sample.requiredTests.map((test) => (
                            <span key={test} className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              test === 'RSA' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {test}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => {
                            setSelectedSamples([sample.id]);
                            // Auto-detect the primary test type for the batch
                            const primaryTest = sample.requiredTests[0];
                            setNewBatchAssayType(primaryTest);
                            if (primaryTest === 'RSA' || primaryTest === 'SOL') {
                              setNewBatchAnalyst('Nadia Sherman');
                            } else {
                              setNewBatchAnalyst('Jane Smith');
                            }
                            setShowCreateBatchModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Add to Batch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prep' && (
        <div className="space-y-6">
          {/* Search and Filter for Prep Batches */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search prep batches by ID, analyst, or assay type..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <select className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Status</option>
                  <option>In Progress</option>
                  <option>Ready for Analysis</option>
                  <option>Complete</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Show:</span>
                <select className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prep Batches Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Prep Batches</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Batch ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Assay Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Analyst</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Sample Count</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Created Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prepBatches.map((batch) => {
                    const batchSamples = getSamplesInBatch(batch.id);
                    return (
                      <tr key={batch.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handlePrepBatchClick(batch)}
                            className="font-mono text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {batch.id}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            batch.assayType === 'RSA' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {batch.assayType}
                          </span>
                        </td>
                        <td className="py-3 px-4">{batch.analyst}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{batchSamples.length}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{batch.createdDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(batch.status)}
                            <span className={`text-sm font-medium ${
                              batch.status === 'Ready for Analysis' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {batch.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePrepBatchClick(batch)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handlePrepBatchClick(batch)}
                              className="text-slate-600 hover:text-slate-800 p-1"
                              title="Edit Batch"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
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

      {activeTab === 'analytical' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticalBatches.map((batch) => (
              <div key={batch.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{batch.id}</h3>
                    <p className="text-sm text-slate-600">{batch.assayType} • {batch.prepBatches.length} prep batches</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(batch.status)}
                    <span className={`text-sm font-medium ${
                      batch.status === 'Approved' ? 'text-green-600' : 
                      batch.status === 'QC Review' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {batch.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Analyst:</span>
                    <span className="font-medium">{batch.analyst}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Instrument:</span>
                    <span className="font-medium">{batch.instrument}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">CCV Result:</span>
                    <span className="font-medium text-green-600">{batch.calibrationData.ccv}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">QC Samples:</span>
                    <span className="font-medium">{batch.qcSamples.length}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded text-sm hover:bg-slate-200">
                      View Results
                    </button>
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                      Edit Batch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prep Batch Details Modal */}
      {showPrepBatchDetails && selectedPrepBatch && (
        <PrepBatchDetailsModal
          batch={selectedPrepBatch}
          samples={getSamplesInBatch(selectedPrepBatch.id)}
          equipmentOptions={equipmentOptions}
          reagentOptions={reagentOptions}
          onClose={() => {
            setShowPrepBatchDetails(false);
            setSelectedPrepBatch(null);
          }}
          onUpdate={updatePrepBatch}
        />
      )}

      {/* Create Batch Modal */}
      {showCreateBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">
                Create {batchType === 'prep' ? 'Prep' : 'Analytical'} Batch
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>{selectedSamples.length} samples</strong> selected for this batch
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Batch Type</label>
                  <select 
                    value={batchType}
                    onChange={(e) => setBatchType(e.target.value as 'prep' | 'analytical')}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="prep">Prep Batch</option>
                    <option value="analytical">Analytical Batch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assay Type</label>
                  <select 
                    value={newBatchAssayType}
                    onChange={(e) => setNewBatchAssayType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="POT">POT - Potency</option>
                    <option value="PES">PES - Pesticides</option>
                    <option value="HMT">HMT - Heavy Metals</option>
                    <option value="SOL">SOL - Solvents</option>
                    <option value="RSA">RSA - Residual Solvents Analysis</option>
                    <option value="NUT">NUT - Nutrients</option>
                    <option value="MIC">MIC - Microbials</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Analyst</label>
                  <select 
                    value={newBatchAnalyst}
                    onChange={(e) => setNewBatchAnalyst(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Dr. Michael Johnson">Dr. Michael Johnson</option>
                    <option value="Robert Brown">Robert Brown</option>
                    <option value="Lisa Garcia">Lisa Garcia</option>
                    <option value="Nadia Sherman">Nadia Sherman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Rush</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={3}></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateBatchModal(false);
                  setSelectedSamples([]);
                }}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateBatch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Prep Batch Details Modal Component
const PrepBatchDetailsModal: React.FC<{
  batch: PrepBatch;
  samples: any[];
  equipmentOptions: any[];
  reagentOptions: any[];
  onClose: () => void;
  onUpdate: (batch: PrepBatch) => void;
}> = ({ batch, samples, equipmentOptions, reagentOptions, onClose, onUpdate }) => {
  const [editedBatch, setEditedBatch] = useState<PrepBatch>({ ...batch });
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(batch.metadata.equipment || []);
  const [selectedReagents, setSelectedReagents] = useState<any[]>(batch.metadata.reagents || []);

  // Check if this is an RSA (Residual Solvents) batch
  const isRSABatch = batch.assayType === 'RSA' || batch.assayType === 'SOL' || batch.id.includes('RSA');

  const handleEquipmentChange = (equipmentId: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const addReagent = () => {
    setSelectedReagents(prev => [...prev, {
      reagentId: '',
      lotNumber: '',
      expirationDate: '',
      volumeUsed: 0
    }]);
  };

  const updateReagent = (index: number, field: string, value: any) => {
    setSelectedReagents(prev => prev.map((reagent, i) => 
      i === index ? { ...reagent, [field]: value } : reagent
    ));
  };

  const removeReagent = (index: number) => {
    setSelectedReagents(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedBatch = {
      ...editedBatch,
      metadata: {
        ...editedBatch.metadata,
        equipment: selectedEquipment,
        reagents: selectedReagents.filter(r => r.reagentId) // Only include reagents with IDs
      }
    };
    onUpdate(updatedBatch);
  };

  const handleStatusChange = (newStatus: string) => {
    setEditedBatch(prev => ({ ...prev, status: newStatus as any }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">
              {isRSABatch ? 'RSA Prep Batch' : 'Prep Batch'} {batch.id} Details
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Equipment and Reagent Controls at Top */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment Selection */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Equipment Selection</h4>
              <div className="space-y-2">
                {equipmentOptions.map(equipment => (
                  <div key={equipment.id} className="flex items-center space-x-2">
                    <select className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm">
                      <option value="">{equipment.name}</option>
                      <option value={equipment.id}>{equipment.id}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Reagent Selection */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-slate-900">Reagent Selection</h4>
                <button
                  onClick={addReagent}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Add Reagent
                </button>
              </div>
              <div className="space-y-2">
                {selectedReagents.map((reagent, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      value={reagent.reagentId}
                      onChange={(e) => updateReagent(index, 'reagentId', e.target.value)}
                      className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select Reagent</option>
                      {reagentOptions.map(option => (
                        <option key={option.id} value={option.nctlId}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeReagent(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Batch Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 rounded-lg p-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Batch ID</label>
              <p className="text-slate-900 font-mono">{batch.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Analyst</label>
              <select
                value={editedBatch.analyst}
                onChange={(e) => setEditedBatch(prev => ({ ...prev, analyst: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              >
                <option>Jane Smith</option>
                <option>Dr. Michael Johnson</option>
                <option>Robert Brown</option>
                <option>Lisa Garcia</option>
                <option>Nadia Sherman</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={editedBatch.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              >
                <option value="In Progress">In Progress</option>
                <option value="Ready for Analysis">Ready for Analysis</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sample Count</label>
              <p className="text-slate-900 font-semibold">{samples.length}</p>
            </div>
          </div>

          {/* RSA Sample Data Table or Regular Sample Grid */}
          {isRSABatch ? (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3">RSA Sample Data</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 py-2 px-3 text-left font-medium text-slate-700">Sample ID</th>
                      <th className="border border-slate-300 py-2 px-3 text-left font-medium text-slate-700">Sample Type</th>
                      <th className="border border-slate-300 py-2 px-3 text-left font-medium text-slate-700">Weight (g)</th>
                      <th className="border border-slate-300 py-2 px-3 text-left font-medium text-slate-700">EV (mL)</th>
                      <th className="border border-slate-300 py-2 px-3 text-left font-medium text-slate-700">DF</th>
                      <th className="border border-slate-300 py-2 px-3 text-left font-medium text-slate-700">Ext Sol'n</th>
                      <th className="border border-slate-300 py-2 px-3 text-left font-medium text-slate-700">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map((sample, index) => (
                      <tr key={sample.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="border border-slate-300 py-2 px-3 font-mono text-sm">{sample.id}</td>
                        <td className="border border-slate-300 py-2 px-3 text-sm">{sample.sampleType}</td>
                        <td className="border border-slate-300 py-2 px-3 text-sm">
                          <input 
                            type="number" 
                            step="0.001"
                            defaultValue={(Math.random() * 0.5 + 0.05).toFixed(3)}
                            className="w-20 border border-slate-200 rounded px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 py-2 px-3 text-sm">
                          <input 
                            type="number" 
                            step="0.1"
                            defaultValue="2.5"
                            className="w-16 border border-slate-200 rounded px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 py-2 px-3 text-sm">
                          <input 
                            type="number" 
                            defaultValue="1"
                            className="w-12 border border-slate-200 rounded px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 py-2 px-3 text-sm">
                          <select className="w-20 border border-slate-200 rounded px-2 py-1 text-sm">
                            <option>ISES</option>
                            <option>ISWS</option>
                            <option>NA</option>
                          </select>
                        </td>
                        <td className="border border-slate-300 py-2 px-3 text-sm">
                          <input 
                            type="text" 
                            placeholder="Comments..."
                            className="w-32 border border-slate-200 rounded px-2 py-1 text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Regular Sample Grid for non-RSA batches */
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Samples in Batch</h4>
              <div className="bg-slate-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {samples.map(sample => (
                    <div key={sample.id} className="bg-white rounded p-2 text-sm">
                      <div className="font-mono text-blue-600">{sample.id}</div>
                      <div className="text-slate-600 truncate">{sample.sampleName}</div>
                      <div className="text-xs text-slate-500">{sample.clientName}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={editedBatch.metadata.notes || ''}
              onChange={(e) => setEditedBatch(prev => ({
                ...prev,
                metadata: { ...prev.metadata, notes: e.target.value }
              }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              rows={3}
              placeholder="Add any notes about this prep batch..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
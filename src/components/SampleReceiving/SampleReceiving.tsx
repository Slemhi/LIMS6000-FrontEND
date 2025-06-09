import React, { useState } from 'react';
import { Upload, Plus, FileSpreadsheet, Package, Search, Filter, Eye, Users } from 'lucide-react';
import { mockSamples } from '../../data/mockData';
import { Sample } from '../../types';

const SampleReceiving: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>(mockSamples);
  const [showNewSampleForm, setShowNewSampleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Sample>('receivedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.sampleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sample.metrcId && sample.metrcId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || sample.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedSamples = [...filteredSamples].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const totalPages = Math.ceil(sortedSamples.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSamples = sortedSamples.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Sample) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'metrc' | 'confident') => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Processing ${type} manifest file:`, file.name);
      
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Here you would implement actual file parsing for METRC/Confident Cannabis manifests
          console.log('File content loaded, processing...');
          
          // Simulate adding new samples from manifest
          const newSamples: Sample[] = [];
          const sampleCount = Math.floor(Math.random() * 10) + 5; // 5-15 samples
          
          for (let i = 0; i < sampleCount; i++) {
            const newSample: Sample = {
              id: `S${String(samples.length + newSamples.length + 1).padStart(3, '0')}`,
              metrcId: type === 'metrc' ? `1A4FF010000022000001${String(Date.now() + i).slice(-4)}` : undefined,
              sampleName: `${type === 'metrc' ? 'METRC' : 'CC'} Sample ${i + 1}`,
              clientName: type === 'metrc' ? 'METRC Client' : 'Confident Cannabis Client',
              receivedDate: new Date().toISOString().split('T')[0],
              sampleType: ['Flower', 'Concentrate', 'Edible'][Math.floor(Math.random() * 3)] as any,
              category: ['Adult Use', 'Medical'][Math.floor(Math.random() * 2)] as any,
              requiredTests: ['POT', 'PES', 'HMT'].slice(0, Math.floor(Math.random() * 3) + 1),
              status: 'Received',
              weight: Math.round((Math.random() * 5 + 1) * 10) / 10
            };
            newSamples.push(newSample);
          }
          
          setSamples(prev => [...prev, ...newSamples]);
          alert(`Successfully imported ${newSamples.length} samples from ${type.toUpperCase()} manifest`);
        } catch (error) {
          console.error('Error processing file:', error);
          alert('Error processing manifest file. Please check the format.');
        }
      };
      
      if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        alert('Please upload a valid Excel (.xlsx, .xls) or CSV file');
      }
    }
    
    // Reset the input
    event.target.value = '';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Received': 'bg-blue-100 text-blue-800',
      'Batched': 'bg-yellow-100 text-yellow-800',
      'In Prep': 'bg-purple-100 text-purple-800',
      'Ready for Analysis': 'bg-orange-100 text-orange-800',
      'In Analysis': 'bg-indigo-100 text-indigo-800',
      'Complete': 'bg-green-100 text-green-800',
      'Reported': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const SortButton = ({ field, children }: { field: keyof Sample; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:text-slate-900"
    >
      <span>{children}</span>
      {sortField === field && (
        <span className="text-blue-600">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Import Manifests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">METRC Manifest</h4>
            <p className="text-sm text-slate-600 mb-4">Upload METRC manifest files (.xlsx, .xls, .csv)</p>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleFileUpload(e, 'metrc')}
              />
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </span>
            </label>
          </div>
          
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <FileSpreadsheet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">Confident Cannabis</h4>
            <p className="text-sm text-slate-600 mb-4">Upload Confident Cannabis manifests (.xlsx, .xls, .csv)</p>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleFileUpload(e, 'confident')}
              />
              <span className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Choose File
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Sample Management</h3>
          <button
            onClick={() => setShowNewSampleForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Sample</span>
          </button>
        </div>

        {/* Search, Filter, and Pagination Controls */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search samples by name, client, ID, or METRC ID..."
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
                <option value="Received">Received</option>
                <option value="Batched">Batched</option>
                <option value="In Prep">In Prep</option>
                <option value="In Analysis">In Analysis</option>
                <option value="Complete">Complete</option>
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
          
          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedSamples.length)} of {sortedSamples.length} samples
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

        {/* Samples Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  <SortButton field="id">Sample ID</SortButton>
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  <SortButton field="sampleName">Name</SortButton>
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  <SortButton field="clientName">Client</SortButton>
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  <SortButton field="sampleType">Type</SortButton>
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  <SortButton field="receivedDate">Received</SortButton>
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Tests</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  <SortButton field="status">Status</SortButton>
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSamples.map((sample) => (
                <tr key={sample.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-sm">{sample.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{sample.sampleName}</div>
                      {sample.metrcId && (
                        <div className="text-xs text-slate-500">METRC: {sample.metrcId}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-900">{sample.clientName}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {sample.sampleType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{sample.receivedDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {sample.requiredTests.map((test) => (
                        <span key={test} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {test}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                      {sample.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedSamples.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No samples found matching your criteria</p>
          </div>
        )}
      </div>

      {/* New Sample Form Modal */}
      {showNewSampleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">Add New Sample</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sample Name</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sample Type</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                    <option>Flower</option>
                    <option>Concentrate</option>
                    <option>Edible</option>
                    <option>Pre-Roll</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                    <option>Adult Use</option>
                    <option>Medical</option>
                    <option>Research</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Weight (g)</label>
                  <input type="number" step="0.1" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Potency (%)</label>
                  <input type="number" step="0.1" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Required Tests</label>
                <div className="grid grid-cols-3 gap-2">
                  {['POT', 'PES', 'HMT', 'SOL', 'NUT', 'MIC'].map((test) => (
                    <label key={test} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className="text-sm">{test}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={3}></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewSampleForm(false)}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Sample
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleReceiving;
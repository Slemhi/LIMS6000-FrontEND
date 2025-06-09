import React, { useState } from 'react';
import { FileCheck, Download, Eye, Calendar, Filter, Search, FileText, Printer } from 'lucide-react';
import { mockSamples } from '../../data/mockData';
import { CoA, Sample } from '../../types';

const Reports: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [showCoAPreview, setShowCoAPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const completedSamples = mockSamples.filter(s => s.status === 'Complete' || s.status === 'Reported');
  
  const filteredSamples = completedSamples.filter(sample => {
    const matchesSearch = sample.sampleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sample.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const generateCoA = (sample: Sample): CoA => {
    return {
      id: `COA-${sample.id}`,
      sampleId: sample.id,
      clientInfo: {
        name: sample.clientName,
        address: '123 Cannabis St, Green Valley, CA 95420',
        contactPerson: 'John Doe',
        email: 'john@greenvalley.com',
        phone: '(555) 123-4567'
      },
      results: sample.requiredTests.map(test => ({
        analyte: test === 'POT' ? 'Total THC' : test === 'PES' ? 'Pesticides' : test,
        result: Math.random() * 25 + 5,
        unit: test === 'POT' ? '%' : 'mg/kg',
        limit: test === 'POT' ? 30 : 0.1,
        status: 'Pass',
        method: `SOP-${test}-001`,
        uncertainty: 2.5
      })),
      qcData: {
        methodBlank: true,
        matrixSpike: true,
        duplicateAnalysis: true,
        referenceStandard: true,
        ccvResult: 98.5,
        batchQuality: 'Pass'
      },
      generatedDate: new Date().toISOString().split('T')[0],
      signedBy: 'Dr. Sarah Wilson',
      labInfo: {
        name: 'North Coast Testing Lab',
        address: '123 Laboratory Ave, Science City, SC 12345',
        phone: '(555) 123-4567',
        email: 'info@nctl.com',
        website: 'www.nctl.com',
        scientificDirector: 'Dr. Sarah Wilson',
        certifications: ['ISO/IEC 17025:2017', 'DEA License #123456']
      }
    };
  };

  const downloadCoA = (sample: Sample) => {
    const coa = generateCoA(sample);
    // In a real implementation, this would generate a PDF
    console.log('Generating CoA PDF for:', coa);
    alert(`CoA for ${sample.sampleName} would be downloaded as PDF`);
  };

  const previewCoA = (sample: Sample) => {
    setSelectedSample(sample);
    setShowCoAPreview(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports & Certificate of Analysis</h2>
        <p className="text-slate-600">Generate and manage certificates of analysis for completed samples</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center space-x-4">
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Complete">Complete</option>
              <option value="Reported">Reported</option>
            </select>
          </div>
        </div>
      </div>

      {/* Completed Samples Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Completed Samples</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Sample ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Sample Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Tests</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Completed Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-sm">{sample.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{sample.sampleName}</td>
                  <td className="py-3 px-4 text-slate-600">{sample.clientName}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {sample.requiredTests.map((test) => (
                        <span key={test} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {test}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{sample.receivedDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sample.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {sample.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => previewCoA(sample)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Preview CoA"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadCoA(sample)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Download CoA"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800 p-1"
                        title="Print CoA"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CoA Preview Modal */}
      {showCoAPreview && selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Certificate of Analysis Preview</h3>
                <button
                  onClick={() => setShowCoAPreview(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* CoA Content */}
            <div className="p-8 bg-white">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">North Coast Testing Lab</h1>
                  <p className="text-slate-600">123 Laboratory Ave, Science City, SC 12345</p>
                  <p className="text-slate-600">(555) 123-4567 | info@nctl.com</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-blue-600">Certificate of Analysis</h2>
                  <p className="text-slate-600">COA-{selectedSample.id}</p>
                  <p className="text-slate-600">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Sample Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Sample Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Sample ID:</span> {selectedSample.id}</div>
                    <div><span className="font-medium">Sample Name:</span> {selectedSample.sampleName}</div>
                    <div><span className="font-medium">Sample Type:</span> {selectedSample.sampleType}</div>
                    <div><span className="font-medium">Category:</span> {selectedSample.category}</div>
                    <div><span className="font-medium">Received Date:</span> {selectedSample.receivedDate}</div>
                    {selectedSample.metrcId && (
                      <div><span className="font-medium">METRC ID:</span> {selectedSample.metrcId}</div>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Client Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Client:</span> {selectedSample.clientName}</div>
                    <div><span className="font-medium">Address:</span> 123 Cannabis St, Green Valley, CA 95420</div>
                    <div><span className="font-medium">Contact:</span> John Doe</div>
                    <div><span className="font-medium">Email:</span> john@greenvalley.com</div>
                    <div><span className="font-medium">Phone:</span> (555) 123-4567</div>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Test Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 py-2 px-4 text-left font-medium">Analyte</th>
                        <th className="border border-slate-300 py-2 px-4 text-left font-medium">Result</th>
                        <th className="border border-slate-300 py-2 px-4 text-left font-medium">Unit</th>
                        <th className="border border-slate-300 py-2 px-4 text-left font-medium">Limit</th>
                        <th className="border border-slate-300 py-2 px-4 text-left font-medium">Status</th>
                        <th className="border border-slate-300 py-2 px-4 text-left font-medium">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateCoA(selectedSample).results.map((result, index) => (
                        <tr key={index}>
                          <td className="border border-slate-300 py-2 px-4">{result.analyte}</td>
                          <td className="border border-slate-300 py-2 px-4 font-medium">{result.result.toFixed(2)}</td>
                          <td className="border border-slate-300 py-2 px-4">{result.unit}</td>
                          <td className="border border-slate-300 py-2 px-4">{result.limit}</td>
                          <td className="border border-slate-300 py-2 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              result.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="border border-slate-300 py-2 px-4 text-sm">{result.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QC Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quality Control</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Method Blank</p>
                    <p className="text-xs text-green-600">Pass</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Matrix Spike</p>
                    <p className="text-xs text-green-600">Pass</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Duplicate Analysis</p>
                    <p className="text-xs text-green-600">Pass</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Reference Standard</p>
                    <p className="text-xs text-green-600">Pass</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-300 pt-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-slate-600">
                      This certificate applies only to the sample(s) tested. Results are not valid if the certificate has been altered.
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      ISO/IEC 17025:2017 Accredited | DEA License #123456
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="border-t border-slate-400 pt-2 mt-8">
                      <p className="text-sm font-medium">Dr. Sarah Wilson</p>
                      <p className="text-xs text-slate-600">Scientific Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => downloadCoA(selectedSample)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
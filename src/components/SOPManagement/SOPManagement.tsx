import React, { useState } from 'react';
import { FileText, Plus, Calendar, CheckCircle, Clock, AlertTriangle, Edit, Eye, History } from 'lucide-react';
import { SOP, SOPRevision } from '../../types';

const SOPManagement: React.FC = () => {
  const [sops, setSops] = useState<SOP[]>([
    {
      id: 'SOP-POT-001',
      title: 'Cannabinoid Potency Analysis by HPLC',
      version: '2.1',
      assayType: 'POT',
      effectiveDate: '2024-01-01',
      isActive: true,
      author: 'Dr. Michael Johnson',
      approvedBy: 'Dr. Sarah Wilson',
      approvalDate: '2023-12-15',
      content: {
        analytes: [],
        qcRequirements: [],
        procedures: [],
        metadata: [],
        batchSizeRequirements: {
          min: 5,
          max: 20,
          optimal: 15
        }
      },
      revisionHistory: [
        {
          id: 'REV-001',
          version: '2.0',
          effectiveDate: '2023-06-01',
          changes: ['Updated analyte list', 'Revised QC limits'],
          author: 'Dr. Michael Johnson',
          approvedBy: 'Dr. Sarah Wilson',
          approvalDate: '2023-05-15',
          status: 'Superseded'
        },
        {
          id: 'REV-002',
          version: '2.1',
          effectiveDate: '2024-01-01',
          changes: ['Added new equipment calibration requirements', 'Updated sample preparation volumes'],
          author: 'Dr. Michael Johnson',
          approvedBy: 'Dr. Sarah Wilson',
          approvalDate: '2023-12-15',
          status: 'Active'
        }
      ]
    },
    {
      id: 'SOP-POT-002',
      title: 'Cannabinoid Potency Analysis - Updated Analytes',
      version: '3.0',
      assayType: 'POT',
      effectiveDate: '2024-10-10',
      isActive: false,
      author: 'Dr. Michael Johnson',
      content: {
        analytes: [],
        qcRequirements: [],
        procedures: [],
        metadata: [],
        batchSizeRequirements: {
          min: 8,
          max: 25,
          optimal: 20
        }
      },
      revisionHistory: [
        {
          id: 'REV-003',
          version: '3.0',
          effectiveDate: '2024-10-10',
          changes: ['Added CBGA, THCV, CBDV analytes', 'Updated QC limits for new analytes', 'Increased batch size capacity'],
          author: 'Dr. Michael Johnson',
          status: 'Pending'
        }
      ]
    }
  ]);

  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [showNewSOPForm, setShowNewSOPForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Superseded':
        return 'bg-gray-100 text-gray-800';
      case 'Draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Superseded':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      case 'Draft':
        return <Edit className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCurrentRevision = (sop: SOP): SOPRevision | undefined => {
    return sop.revisionHistory.find(rev => rev.status === 'Active') || sop.revisionHistory[sop.revisionHistory.length - 1];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">SOP Management</h2>
          <p className="text-slate-600">Manage Standard Operating Procedures and track revisions</p>
        </div>
        <button
          onClick={() => setShowNewSOPForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create SOP</span>
        </button>
      </div>

      {/* SOP Impact Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">SOP-Based System with Revision Tracking</h3>
            <p className="text-sm text-blue-700 mt-1">
              Changes to SOPs automatically affect samples based on their effective dates. 
              All revisions are tracked with full change history and approval workflow.
              Batch size requirements are enforced per SOP specifications.
            </p>
          </div>
        </div>
      </div>

      {/* SOPs List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Standard Operating Procedures</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">SOP ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Title</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Version</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Assay</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Effective Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Batch Size</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sops.map((sop) => {
                const currentRevision = getCurrentRevision(sop);
                const status = sop.isActive ? 'Active' : currentRevision?.status || 'Draft';
                
                return (
                  <tr key={sop.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-sm">{sop.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{sop.title}</div>
                        <div className="text-xs text-slate-500">
                          {sop.revisionHistory.length} revision{sop.revisionHistory.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{sop.version}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sop.assayType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{sop.effectiveDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          {sop.content.batchSizeRequirements.min}-{sop.content.batchSizeRequirements.max}
                        </div>
                        <div className="text-slate-500">
                          Optimal: {sop.content.batchSizeRequirements.optimal}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedSOP(sop)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View SOP"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSOP(sop);
                            setShowRevisionHistory(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="Revision History"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button
                          className="text-slate-600 hover:text-slate-800 p-1"
                          title="Edit SOP"
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

      {/* Upcoming SOP Changes */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming SOP Changes</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">SOP-POT-002 Becomes Effective October 10, 2024</h4>
              <p className="text-sm text-yellow-700 mt-1">
                The updated Cannabinoid Potency SOP will include 3 new analytes (CBGA, THCV, CBDV), 
                revised QC limits, and increased batch size capacity (8-25 samples, optimal 20).
                This will affect all Potency samples received on or after October 10, 2024.
              </p>
              <div className="mt-3 flex items-center space-x-4">
                <span className="text-xs font-medium text-yellow-800">
                  Estimated Impact: 15-20 samples per day
                </span>
                <span className="text-xs font-medium text-yellow-800">
                  New Batch Size: 8-25 samples (was 5-20)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOP Details Modal */}
      {selectedSOP && !showRevisionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">{selectedSOP.title}</h3>
                <button
                  onClick={() => setSelectedSOP(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* SOP Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">SOP ID</label>
                  <p className="text-slate-900 font-mono">{selectedSOP.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Version</label>
                  <p className="text-slate-900">{selectedSOP.version}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Assay Type</label>
                  <p className="text-slate-900">{selectedSOP.assayType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Effective Date</label>
                  <p className="text-slate-900">{selectedSOP.effectiveDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Author</label>
                  <p className="text-slate-900">{selectedSOP.author}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Approved By</label>
                  <p className="text-slate-900">{selectedSOP.approvedBy || 'Pending'}</p>
                </div>
              </div>

              {/* Batch Size Requirements */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Batch Size Requirements</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Minimum</label>
                      <p className="text-2xl font-bold text-slate-900">{selectedSOP.content.batchSizeRequirements.min}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Optimal</label>
                      <p className="text-2xl font-bold text-blue-600">{selectedSOP.content.batchSizeRequirements.optimal}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Maximum</label>
                      <p className="text-2xl font-bold text-slate-900">{selectedSOP.content.batchSizeRequirements.max}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Revision */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Current Revision</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  {(() => {
                    const currentRev = getCurrentRevision(selectedSOP);
                    return currentRev ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(currentRev.status)}
                          <span className="font-medium">Version {currentRev.version}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(currentRev.status)}`}>
                            {currentRev.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600">
                          Effective: {currentRev.effectiveDate}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Changes:</p>
                          <ul className="text-sm text-slate-600 list-disc list-inside">
                            {currentRev.changes.map((change, index) => (
                              <li key={index}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600">No revision information available</p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision History Modal */}
      {showRevisionHistory && selectedSOP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  Revision History - {selectedSOP.title}
                </h3>
                <button
                  onClick={() => {
                    setShowRevisionHistory(false);
                    setSelectedSOP(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {selectedSOP.revisionHistory.map((revision, index) => (
                  <div key={revision.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(revision.status)}
                        <h4 className="text-lg font-semibold text-slate-900">Version {revision.version}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(revision.status)}`}>
                          {revision.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        Effective: {revision.effectiveDate}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-slate-700">Author:</span>
                        <span className="text-sm text-slate-900 ml-2">{revision.author}</span>
                      </div>
                      {revision.approvedBy && (
                        <div>
                          <span className="text-sm font-medium text-slate-700">Approved By:</span>
                          <span className="text-sm text-slate-900 ml-2">{revision.approvedBy}</span>
                        </div>
                      )}
                      {revision.approvalDate && (
                        <div>
                          <span className="text-sm font-medium text-slate-700">Approval Date:</span>
                          <span className="text-sm text-slate-900 ml-2">{revision.approvalDate}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Changes:</p>
                      <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                        {revision.changes.map((change, changeIndex) => (
                          <li key={changeIndex}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New SOP Form Modal */}
      {showNewSOPForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">Create New SOP</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SOP ID</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="SOP-XXX-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Version</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="1.0" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assay Type</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                    <option>POT</option>
                    <option>PES</option>
                    <option>HMT</option>
                    <option>SOL</option>
                    <option>NUT</option>
                    <option>MIC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Effective Date</label>
                  <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Batch Size Requirements</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Minimum</label>
                    <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="5" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Optimal</label>
                    <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="15" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Maximum</label>
                    <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="20" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Changes/Description</label>
                <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={4} placeholder="Describe the changes or purpose of this SOP..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewSOPForm(false)}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create SOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOPManagement;
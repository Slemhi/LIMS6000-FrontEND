import React, { useState } from 'react';
import { Settings, Users, FlaskRound as Flask, FileText, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { mockAssays, mockUsers } from '../../data/mockData';
import { Assay, User } from '../../types';

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assays');
  const [assays, setAssays] = useState<Assay[]>(mockAssays);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAssayModal, setShowAssayModal] = useState(false);
  const [editingAssay, setEditingAssay] = useState<Assay | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  const handleViewAssay = (assay: Assay) => {
    setEditingAssay(assay);
    setViewMode('view');
    setShowAssayModal(true);
  };

  const handleEditAssay = (assay: Assay) => {
    setEditingAssay(assay);
    setViewMode('edit');
    setShowAssayModal(true);
  };

  const handleCreateAssay = () => {
    setEditingAssay(null);
    setViewMode('edit');
    setShowAssayModal(true);
  };

  const handleDeleteAssay = (assayId: string) => {
    if (confirm('Are you sure you want to delete this assay? This action cannot be undone.')) {
      setAssays(prev => prev.filter(a => a.id !== assayId));
    }
  };

  const handleSaveAssay = (assayData: any) => {
    if (editingAssay) {
      // Update existing assay
      setAssays(prev => prev.map(a => a.id === editingAssay.id ? { ...a, ...assayData } : a));
    } else {
      // Create new assay
      const newAssay: Assay = {
        id: assayData.code,
        name: assayData.name,
        code: assayData.code.toUpperCase(),
        description: assayData.description,
        isActive: assayData.isActive,
        createdDate: new Date().toISOString().split('T')[0],
        analytes: assayData.analytes || [],
        qcTypes: assayData.qcTypes || [],
        version: assayData.version || '1.0',
        revisionHistory: []
      };
      setAssays(prev => [...prev, newAssay]);
    }
    setShowAssayModal(false);
    setEditingAssay(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Administration</h2>
        <p className="text-slate-600">Manage assays, users, and system settings</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-4">
        <TabButton id="assays" label="Assay Management" icon={Flask} />
        <TabButton id="users" label="User Management" icon={Users} />
        <TabButton id="settings" label="System Settings" icon={Settings} />
      </div>

      {/* Assay Management */}
      {activeTab === 'assays' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Assay Configuration</h3>
            <button 
              onClick={handleCreateAssay}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Assay</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assays.map((assay) => (
              <div key={assay.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{assay.name}</h4>
                    <p className="text-sm text-slate-600">{assay.code} • {assay.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewAssay(assay)}
                      className="p-2 text-slate-600 hover:text-blue-600"
                      title="View Assay"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditAssay(assay)}
                      className="p-2 text-slate-600 hover:text-blue-600"
                      title="Edit Assay"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAssay(assay.id)}
                      className="p-2 text-slate-600 hover:text-red-600"
                      title="Delete Assay"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Analytes:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {assay.analytes.map((analyte) => (
                        <span key={analyte.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {analyte.name} ({analyte.unit})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700">QC Types:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {assay.qcTypes.map((qc) => (
                        <span key={qc.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {qc.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Status:</span>
                    <span className={`font-medium ${assay.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {assay.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Username</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Roles</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{user.username}</td>
                      <td className="py-3 px-4 text-slate-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {role.assayType !== 'ALL' ? `${role.assayType}-` : ''}{role.role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">System Configuration</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Laboratory Information */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Laboratory Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lab Name</label>
                  <input 
                    type="text" 
                    value="North Coast Testing Lab" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2" 
                    rows={3}
                    defaultValue="123 Laboratory Ave, Science City, SC 12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input 
                    type="tel" 
                    value="(555) 123-4567" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Scientific Director</label>
                  <input 
                    type="text" 
                    value="Dr. Sarah Wilson" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* System Preferences */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">System Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Auto-batch similar samples</label>
                    <p className="text-xs text-slate-500">Automatically group samples with same test requirements</p>
                  </div>
                  <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email notifications</label>
                    <p className="text-xs text-slate-500">Send email alerts for batch completions</p>
                  </div>
                  <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Require QC approval</label>
                    <p className="text-xs text-slate-500">All batches must pass QC review before reporting</p>
                  </div>
                  <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default pagination</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                    <option>25 items per page</option>
                    <option>50 items per page</option>
                    <option>100 items per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Assay Modal */}
      {showAssayModal && (
        <AssayModal
          assay={editingAssay}
          viewMode={viewMode}
          onSave={handleSaveAssay}
          onClose={() => {
            setShowAssayModal(false);
            setEditingAssay(null);
          }}
        />
      )}
    </div>
  );
};

// Assay Modal Component
const AssayModal: React.FC<{
  assay: Assay | null;
  viewMode: 'view' | 'edit';
  onSave: (data: any) => void;
  onClose: () => void;
}> = ({ assay, viewMode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: assay?.name || '',
    code: assay?.code || '',
    description: assay?.description || '',
    version: assay?.version || '1.0',
    isActive: assay?.isActive ?? true,
    analytes: assay?.analytes || [],
    qcTypes: assay?.qcTypes || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const addAnalyte = () => {
    setFormData(prev => ({
      ...prev,
      analytes: [...prev.analytes, {
        id: '',
        name: '',
        unit: '',
        reportingLimit: 0,
        actionLimit: 0,
        warningLimit: 0,
        effectiveDate: new Date().toISOString().split('T')[0]
      }]
    }));
  };

  const removeAnalyte = (index: number) => {
    setFormData(prev => ({
      ...prev,
      analytes: prev.analytes.filter((_, i) => i !== index)
    }));
  };

  const updateAnalyte = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      analytes: prev.analytes.map((analyte, i) => 
        i === index ? { ...analyte, [field]: value } : analyte
      )
    }));
  };

  const addQCType = () => {
    setFormData(prev => ({
      ...prev,
      qcTypes: [...prev.qcTypes, {
        id: '',
        name: '',
        description: '',
        frequency: 1,
        limits: { lower: 80, upper: 120 }
      }]
    }));
  };

  const removeQCType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qcTypes: prev.qcTypes.filter((_, i) => i !== index)
    }));
  };

  const updateQCType = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      qcTypes: prev.qcTypes.map((qc, i) => 
        i === index ? { ...qc, [field]: value } : qc
      )
    }));
  };

  const updateQCLimits = (index: number, limitType: 'lower' | 'upper', value: number) => {
    setFormData(prev => ({
      ...prev,
      qcTypes: prev.qcTypes.map((qc, i) => 
        i === index ? { 
          ...qc, 
          limits: { ...qc.limits, [limitType]: value }
        } : qc
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">
              {viewMode === 'edit' ? (assay ? 'Edit Assay' : 'Create New Assay') : 'View Assay'}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assay Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                disabled={viewMode === 'view'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assay Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                disabled={viewMode === 'view'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Version</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                disabled={viewMode === 'view'}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-slate-300"
                disabled={viewMode === 'view'}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                Active Assay
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              rows={3}
              disabled={viewMode === 'view'}
            />
          </div>

          {/* Analytes Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-900">Analytes</h4>
              {viewMode === 'edit' && (
                <button
                  type="button"
                  onClick={addAnalyte}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Add Analyte
                </button>
              )}
            </div>

            <div className="space-y-4">
              {formData.analytes.map((analyte, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ID</label>
                      <input
                        type="text"
                        value={analyte.id}
                        onChange={(e) => updateAnalyte(index, 'id', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={analyte.name}
                        onChange={(e) => updateAnalyte(index, 'name', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={analyte.unit}
                        onChange={(e) => updateAnalyte(index, 'unit', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Reporting Limit</label>
                      <input
                        type="number"
                        step="0.001"
                        value={analyte.reportingLimit}
                        onChange={(e) => updateAnalyte(index, 'reportingLimit', parseFloat(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Action Limit</label>
                      <input
                        type="number"
                        step="0.001"
                        value={analyte.actionLimit || ''}
                        onChange={(e) => updateAnalyte(index, 'actionLimit', parseFloat(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Warning Limit</label>
                      <input
                        type="number"
                        step="0.001"
                        value={analyte.warningLimit || ''}
                        onChange={(e) => updateAnalyte(index, 'warningLimit', parseFloat(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                  </div>
                  {viewMode === 'edit' && (
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAnalyte(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Analyte
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* QC Types Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-900">QC Types</h4>
              {viewMode === 'edit' && (
                <button
                  type="button"
                  onClick={addQCType}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Add QC Type
                </button>
              )}
            </div>

            <div className="space-y-4">
              {formData.qcTypes.map((qc, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ID</label>
                      <input
                        type="text"
                        value={qc.id}
                        onChange={(e) => updateQCType(index, 'id', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={qc.name}
                        onChange={(e) => updateQCType(index, 'name', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={qc.description}
                        onChange={(e) => updateQCType(index, 'description', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                      <input
                        type="number"
                        value={qc.frequency}
                        onChange={(e) => updateQCType(index, 'frequency', parseInt(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        disabled={viewMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Recovery Limits</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Lower</label>
                          <input
                            type="number"
                            value={qc.limits.lower}
                            onChange={(e) => updateQCLimits(index, 'lower', parseFloat(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            disabled={viewMode === 'view'}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Upper</label>
                          <input
                            type="number"
                            value={qc.limits.upper}
                            onChange={(e) => updateQCLimits(index, 'upper', parseFloat(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            disabled={viewMode === 'view'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {viewMode === 'edit' && (
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeQCType(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove QC Type
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              {viewMode === 'edit' ? 'Cancel' : 'Close'}
            </button>
            {viewMode === 'edit' && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {assay ? 'Update Assay' : 'Create Assay'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Administration;
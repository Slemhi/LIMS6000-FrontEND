import React, { useState } from 'react';
import { Settings, Users, FlaskRound as Flask, FileText, Plus, Edit, Trash2, Clock, CheckCircle, X } from 'lucide-react';
import { mockAssays, mockUsers } from '../../data/mockData';
import { Assay, User } from '../../types';

interface PendingUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [assays, setAssays] = useState<Assay[]>(mockAssays);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    {
      id: 'PU001',
      username: 'newuser1',
      email: 'newuser@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '(555) 123-4567',
      department: 'Sample Preparation',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    }
  ]);

  const TabButton = ({ id, label, icon: Icon, count }: { id: string; label: string; icon: any; count?: number }) => (
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
      {count !== undefined && count > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );

  const handleApproveUser = (pendingUserId: string) => {
    const pendingUser = pendingUsers.find(u => u.id === pendingUserId);
    if (!pendingUser) return;

    // Create new user from pending user
    const newUser: User = {
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      username: pendingUser.username,
      email: pendingUser.email,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      roles: [
        { assayType: 'POT', role: 'Prep' } // Default role
      ],
      isActive: true
    };

    // Add to users list
    setUsers(prev => [...prev, newUser]);

    // Update pending user status
    setPendingUsers(prev => prev.map(u => 
      u.id === pendingUserId 
        ? { ...u, status: 'Approved' as const }
        : u
    ));

    alert(`User ${pendingUser.firstName} ${pendingUser.lastName} has been approved and added to the system.`);
  };

  const handleRejectUser = (pendingUserId: string) => {
    const pendingUser = pendingUsers.find(u => u.id === pendingUserId);
    if (!pendingUser) return;

    // Update pending user status
    setPendingUsers(prev => prev.map(u => 
      u.id === pendingUserId 
        ? { ...u, status: 'Rejected' as const }
        : u
    ));

    alert(`User ${pendingUser.firstName} ${pendingUser.lastName} has been rejected.`);
  };

  const pendingCount = pendingUsers.filter(u => u.status === 'Pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Administration</h2>
        <p className="text-slate-600">Manage assays, users, and system settings</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-4">
        <TabButton id="pending" label="Pending Accounts" icon={Clock} count={pendingCount} />
        <TabButton id="assays" label="Assay Management" icon={Flask} />
        <TabButton id="users" label="User Management" icon={Users} />
        <TabButton id="settings" label="System Settings" icon={Settings} />
      </div>

      {/* Pending Account Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Pending Account Requests</h3>
            {pendingCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-yellow-800">
                  {pendingCount} request{pendingCount !== 1 ? 's' : ''} awaiting approval
                </span>
              </div>
            )}
          </div>

          {pendingUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
              <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">No Pending Requests</h4>
              <p className="text-slate-600">All account requests have been processed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((pendingUser) => (
                <div key={pendingUser.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {pendingUser.firstName} {pendingUser.lastName}
                          </h4>
                          <p className="text-sm text-slate-600">@{pendingUser.username}</p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          pendingUser.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          pendingUser.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pendingUser.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-slate-700">Email:</span>
                          <span className="text-slate-900 ml-2">{pendingUser.email}</span>
                        </div>
                        {pendingUser.phone && (
                          <div>
                            <span className="font-medium text-slate-700">Phone:</span>
                            <span className="text-slate-900 ml-2">{pendingUser.phone}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-slate-700">Department:</span>
                          <span className="text-slate-900 ml-2">{pendingUser.department}</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Request Date:</span>
                          <span className="text-slate-900 ml-2">{pendingUser.requestDate}</span>
                        </div>
                      </div>
                    </div>

                    {pendingUser.status === 'Pending' && (
                      <div className="flex space-x-3 ml-6">
                        <button
                          onClick={() => handleApproveUser(pendingUser.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectUser(pendingUser.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {pendingUser.status !== 'Pending' && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600">
                        {pendingUser.status === 'Approved' 
                          ? 'This user has been approved and added to the system.'
                          : 'This user request has been rejected.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assay Management */}
      {activeTab === 'assays' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Assay Configuration</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
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
                    <button className="p-2 text-slate-600 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-red-600">
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
    </div>
  );
};

export default Administration;
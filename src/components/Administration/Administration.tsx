import React, { useState } from 'react';
import { Settings, Users, FlaskRound as Flask, FileText, Plus, Edit, Trash2, Shield, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { mockAssays, mockUsers, mockRoleDefinitions, mockPermissions } from '../../data/mockData';
import { Assay, User, RoleDefinition, Permission } from '../../types';

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assays');
  const [assays, setAssays] = useState<Assay[]>(mockAssays);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roleDefinitions, setRoleDefinitions] = useState<RoleDefinition[]>(mockRoleDefinitions);
  const [permissions] = useState<Permission[]>(mockPermissions);
  
  // User management state
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userModalMode, setUserModalMode] = useState<'view' | 'edit' | 'approve'>('view');
  
  // Role management state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [roleModalMode, setRoleModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [newRole, setNewRole] = useState<Partial<RoleDefinition>>({
    name: '',
    description: '',
    permissions: [],
    isSystemRole: false,
    assayType: ''
  });

  // Load pending and approved users from localStorage
  React.useEffect(() => {
    try {
      const pending = JSON.parse(localStorage.getItem('nctl_pending_users') || '[]');
      const approved = JSON.parse(localStorage.getItem('nctl_approved_users') || '[]');
      setPendingUsers(pending);
      setApprovedUsers(approved);
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
    }
  }, []);

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

  // User management functions
  const approveUser = (pendingUser: any) => {
    try {
      // Get registration data with password
      const registrations = JSON.parse(localStorage.getItem('nctl_pending_registrations') || '[]');
      const registrationData = registrations.find((r: any) => r.username === pendingUser.username);
      
      if (!registrationData) {
        alert('Registration data not found. Cannot approve user.');
        return;
      }

      const newApprovedUser = {
        id: `AU${String(approvedUsers.length + 1).padStart(3, '0')}`,
        username: pendingUser.username,
        password: registrationData.password, // Get password from registration data
        email: pendingUser.email,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        phone: pendingUser.phone,
        department: pendingUser.department,
        roles: [
          { assayType: 'POT', role: 'Prep' } // Default role
        ],
        isActive: true,
        lastLogin: '',
        createdDate: pendingUser.requestDate,
        approvedDate: new Date().toISOString().split('T')[0]
      };

      // Add to approved users
      const updatedApproved = [...approvedUsers, newApprovedUser];
      setApprovedUsers(updatedApproved);
      localStorage.setItem('nctl_approved_users', JSON.stringify(updatedApproved));

      // Remove from pending users
      const updatedPending = pendingUsers.filter(u => u.id !== pendingUser.id);
      setPendingUsers(updatedPending);
      localStorage.setItem('nctl_pending_users', JSON.stringify(updatedPending));

      console.log('User approved:', newApprovedUser);
      alert(`User ${pendingUser.username} has been approved and can now log in.`);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user. Please try again.');
    }
  };

  const deleteUser = (user: any, type: 'pending' | 'approved') => {
    if (!confirm(`Are you sure you want to delete user ${user.username}?`)) {
      return;
    }

    try {
      if (type === 'pending') {
        const updated = pendingUsers.filter(u => u.id !== user.id);
        setPendingUsers(updated);
        localStorage.setItem('nctl_pending_users', JSON.stringify(updated));
      } else {
        const updated = approvedUsers.filter(u => u.id !== user.id);
        setApprovedUsers(updated);
        localStorage.setItem('nctl_approved_users', JSON.stringify(updated));
      }
      
      alert(`User ${user.username} has been deleted.`);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const editUser = (user: any) => {
    setSelectedUser(user);
    setUserModalMode('edit');
    setShowUserModal(true);
  };

  const updateUserRoles = (userId: string, newRoles: any[]) => {
    try {
      // Update in approved users
      const updatedApproved = approvedUsers.map(user => 
        user.id === userId ? { ...user, roles: newRoles } : user
      );
      setApprovedUsers(updatedApproved);
      localStorage.setItem('nctl_approved_users', JSON.stringify(updatedApproved));
      
      // Also update in mock users if exists
      const updatedMockUsers = users.map(user => 
        user.id === userId ? { ...user, roles: newRoles } : user
      );
      setUsers(updatedMockUsers);
      
      alert('User roles updated successfully!');
    } catch (error) {
      console.error('Error updating user roles:', error);
      alert('Error updating user roles. Please try again.');
    }
  };

  // Role management functions
  const createRole = () => {
    if (!newRole.name || !newRole.description) {
      alert('Please fill in all required fields');
      return;
    }

    const roleId = newRole.name.toLowerCase().replace(/\s+/g, '-');
    const role: RoleDefinition = {
      id: roleId,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions || [],
      isSystemRole: false,
      createdDate: new Date().toISOString().split('T')[0],
      assayType: newRole.assayType || undefined
    };

    setRoleDefinitions(prev => [...prev, role]);
    setNewRole({
      name: '',
      description: '',
      permissions: [],
      isSystemRole: false,
      assayType: ''
    });
    setShowRoleModal(false);
    alert('Role created successfully!');
  };

  const updateRole = (updatedRole: RoleDefinition) => {
    setRoleDefinitions(prev => prev.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    ));
    setShowRoleModal(false);
    alert('Role updated successfully!');
  };

  const deleteRole = (roleId: string) => {
    const role = roleDefinitions.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      alert('Cannot delete system roles');
      return;
    }

    if (!confirm('Are you sure you want to delete this role?')) {
      return;
    }

    setRoleDefinitions(prev => prev.filter(role => role.id !== roleId));
    alert('Role deleted successfully!');
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const togglePermission = (permissionId: string, rolePermissions: Permission[]) => {
    const hasPermission = rolePermissions.some(p => p.id === permissionId);
    const permission = permissions.find(p => p.id === permissionId);
    
    if (!permission) return rolePermissions;

    if (hasPermission) {
      return rolePermissions.filter(p => p.id !== permissionId);
    } else {
      return [...rolePermissions, permission];
    }
  };

  // Combine all users for display
  const allUsers = [
    ...users.map(u => ({ ...u, source: 'system', status: 'Active' })),
    ...approvedUsers.map(u => ({ ...u, source: 'approved', status: 'Active' })),
    ...pendingUsers.map(u => ({ ...u, source: 'pending', status: 'Pending' }))
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Administration</h2>
        <p className="text-slate-600">Manage assays, users, roles, and system settings</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-4">
        <TabButton id="assays" label="Assay Management" icon={Flask} />
        <TabButton id="users" label="User Management" icon={Users} />
        <TabButton id="roles" label="Role Management" icon={Shield} />
        <TabButton id="settings" label="System Settings" icon={Settings} />
      </div>

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
                      {assay.analytes.slice(0, 3).map((analyte) => (
                        <span key={analyte.id} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {analyte.name} ({analyte.unit})
                        </span>
                      ))}
                      {assay.analytes.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                          +{assay.analytes.length - 3} more
                        </span>
                      )}
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
            {pendingUsers.length > 0 && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingUsers.length} pending approval{pendingUsers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* All Users Table */}
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
                  {allUsers.map((user) => (
                    <tr key={`${user.source}-${user.id}`} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.department && (
                            <div className="text-xs text-slate-500">{user.department}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{user.username}</td>
                      <td className="py-3 px-4 text-slate-600">{user.email}</td>
                      <td className="py-3 px-4">
                        {user.status === 'Pending' ? (
                          <span className="text-sm text-slate-500">Roles assigned after approval</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((role: any, index: number) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {role.assayType !== 'ALL' ? `${role.assayType}-` : ''}{role.role}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {user.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => approveUser(user)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => deleteUser(user, 'pending')}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => editUser(user)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {user.source !== 'system' && (
                                <button
                                  onClick={() => deleteUser(user, 'approved')}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
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

      {/* Role Management */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Role Management</h3>
            <button
              onClick={() => {
                setRoleModalMode('create');
                setSelectedRole(null);
                setShowRoleModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roleDefinitions.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-slate-900">{role.name}</h4>
                    {role.isSystemRole ? (
                      <Lock className="h-4 w-4 text-slate-400" title="System Role" />
                    ) : (
                      <Unlock className="h-4 w-4 text-green-500" title="Custom Role" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setRoleModalMode('view');
                        setShowRoleModal(true);
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600"
                      title="View Role"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {!role.isSystemRole && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setRoleModalMode('edit');
                            setShowRoleModal(true);
                          }}
                          className="p-2 text-slate-600 hover:text-blue-600"
                          title="Edit Role"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="p-2 text-slate-600 hover:text-red-600"
                          title="Delete Role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-slate-600">{role.description}</p>
                  
                  {role.assayType && (
                    <div>
                      <span className="text-sm font-medium text-slate-700">Assay Type:</span>
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {role.assayType}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium text-slate-700">Permissions:</span>
                    <div className="mt-1 text-sm text-slate-600">
                      {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''} assigned
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Type:</span>
                    <span className={`font-medium ${role.isSystemRole ? 'text-orange-600' : 'text-green-600'}`}>
                      {role.isSystemRole ? 'System Role' : 'Custom Role'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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

      {/* User Edit Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  Edit User: {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={selectedUser.firstName}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={selectedUser.lastName}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={selectedUser.username}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Role Assignment</h4>
                <div className="space-y-4">
                  {roleDefinitions.map((role) => {
                    const hasRole = selectedUser.roles?.some((userRole: any) => 
                      userRole.assayType === role.assayType && userRole.role === role.name.split(' - ')[1]
                    );

                    return (
                      <div key={role.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-900">{role.name}</div>
                          <div className="text-sm text-slate-600">{role.description}</div>
                          {role.assayType && (
                            <div className="text-xs text-blue-600">Assay: {role.assayType}</div>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={hasRole}
                          onChange={(e) => {
                            const newRoles = [...(selectedUser.roles || [])];
                            
                            if (e.target.checked) {
                              // Add role
                              if (role.assayType) {
                                const roleName = role.name.split(' - ')[1];
                                newRoles.push({
                                  assayType: role.assayType,
                                  role: roleName
                                });
                              } else {
                                newRoles.push({
                                  assayType: 'ALL',
                                  role: role.name
                                });
                              }
                            } else {
                              // Remove role
                              const roleIndex = newRoles.findIndex((userRole: any) => 
                                userRole.assayType === role.assayType && userRole.role === role.name.split(' - ')[1]
                              );
                              if (roleIndex > -1) {
                                newRoles.splice(roleIndex, 1);
                              }
                            }
                            
                            setSelectedUser({ ...selectedUser, roles: newRoles });
                          }}
                          className="rounded border-slate-300"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateUserRoles(selectedUser.id, selectedUser.roles);
                  setShowUserModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {roleModalMode === 'create' ? 'Create New Role' : 
                   roleModalMode === 'edit' ? `Edit Role: ${selectedRole?.name}` : 
                   `View Role: ${selectedRole?.name}`}
                </h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {roleModalMode === 'create' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role Name *</label>
                      <input
                        type="text"
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="e.g., Custom Analyst"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Assay Type (Optional)</label>
                      <select
                        value={newRole.assayType}
                        onChange={(e) => setNewRole({ ...newRole, assayType: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="">All Assays</option>
                        <option value="POT">POT - Potency</option>
                        <option value="PES">PES - Pesticides</option>
                        <option value="HMT">HMT - Heavy Metals</option>
                        <option value="SOL">SOL - Solvents</option>
                        <option value="RSA">RSA - Residual Solvents</option>
                        <option value="NUT">NUT - Nutrients</option>
                        <option value="MIC">MIC - Microbials</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="Describe the role and its responsibilities..."
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Permissions</h4>
                    <div className="space-y-6">
                      {['Sample Management', 'Batch Management', 'Analysis', 'QC', 'Administration', 'Reporting'].map((category) => (
                        <div key={category} className="border border-slate-200 rounded-lg p-4">
                          <h5 className="font-medium text-slate-900 mb-3">{category}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {getPermissionsByCategory(category).map((permission) => (
                              <label key={permission.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={newRole.permissions?.some(p => p.id === permission.id) || false}
                                  onChange={(e) => {
                                    const updatedPermissions = e.target.checked
                                      ? [...(newRole.permissions || []), permission]
                                      : (newRole.permissions || []).filter(p => p.id !== permission.id);
                                    setNewRole({ ...newRole, permissions: updatedPermissions });
                                  }}
                                  className="rounded border-slate-300"
                                />
                                <div>
                                  <div className="text-sm font-medium text-slate-900">{permission.name}</div>
                                  <div className="text-xs text-slate-500">{permission.description}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // View/Edit existing role
                selectedRole && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
                        <input
                          type="text"
                          value={selectedRole.name}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2"
                          readOnly={roleModalMode === 'view' || selectedRole.isSystemRole}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Assay Type</label>
                        <input
                          type="text"
                          value={selectedRole.assayType || 'All Assays'}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea
                        value={selectedRole.description}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        rows={3}
                        readOnly={roleModalMode === 'view' || selectedRole.isSystemRole}
                      />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">
                        Permissions ({selectedRole.permissions.length})
                      </h4>
                      <div className="space-y-6">
                        {['Sample Management', 'Batch Management', 'Analysis', 'QC', 'Administration', 'Reporting'].map((category) => {
                          const categoryPermissions = getPermissionsByCategory(category);
                          const hasAnyPermission = categoryPermissions.some(p => 
                            selectedRole.permissions.some(rp => rp.id === p.id)
                          );

                          if (!hasAnyPermission && roleModalMode === 'view') return null;

                          return (
                            <div key={category} className="border border-slate-200 rounded-lg p-4">
                              <h5 className="font-medium text-slate-900 mb-3">{category}</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {categoryPermissions.map((permission) => {
                                  const hasPermission = selectedRole.permissions.some(p => p.id === permission.id);
                                  
                                  if (!hasPermission && roleModalMode === 'view') return null;

                                  return (
                                    <label key={permission.id} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={hasPermission}
                                        disabled={roleModalMode === 'view' || selectedRole.isSystemRole}
                                        className="rounded border-slate-300"
                                      />
                                      <div>
                                        <div className="text-sm font-medium text-slate-900">{permission.name}</div>
                                        <div className="text-xs text-slate-500">{permission.description}</div>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {selectedRole.isSystemRole && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-5 w-5 text-orange-600" />
                          <div>
                            <h5 className="font-medium text-orange-900">System Role</h5>
                            <p className="text-sm text-orange-700">
                              This is a system-generated role and cannot be modified. It was automatically created based on assay configurations.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                {roleModalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {roleModalMode === 'create' && (
                <button
                  onClick={createRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Role
                </button>
              )}
              {roleModalMode === 'edit' && selectedRole && !selectedRole.isSystemRole && (
                <button
                  onClick={() => updateRole(selectedRole)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
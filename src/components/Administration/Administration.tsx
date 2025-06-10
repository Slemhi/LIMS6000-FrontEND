import React, { useState, useEffect } from 'react';
import { Settings, Users, FlaskRound as Flask, FileText, Plus, Edit, Trash2, Clock, CheckCircle, X, AlertTriangle } from 'lucide-react';
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
  password?: string; // Store password for approved users
}

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [assays, setAssays] = useState<Assay[]>(mockAssays);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Debug function to show all localStorage data
  const debugAllData = () => {
    console.log('=== COMPLETE DEBUG INFO ===');
    console.log('Pending users:', JSON.parse(localStorage.getItem('nctl_pending_users') || '[]'));
    console.log('Approved users:', JSON.parse(localStorage.getItem('nctl_approved_users') || '[]'));
    console.log('Registration data:', JSON.parse(localStorage.getItem('nctl_pending_registrations') || '[]'));
    console.log('Current users state:', users);
    console.log('Mock users:', mockUsers);
    console.log('===========================');
  };

  // Load pending users and approved users from localStorage on component mount
  useEffect(() => {
    const loadPendingUsers = () => {
      try {
        const stored = localStorage.getItem('nctl_pending_users');
        if (stored) {
          const parsedUsers = JSON.parse(stored);
          console.log('Loaded pending users:', parsedUsers);
          setPendingUsers(parsedUsers);
        }
      } catch (error) {
        console.error('Error loading pending users:', error);
      }
    };

    const loadApprovedUsers = () => {
      try {
        const approvedUsers = getApprovedUsers();
        console.log('Loading approved users from localStorage:', approvedUsers);
        
        // Convert approved users to User format and merge with mock users
        const convertedApprovedUsers: User[] = approvedUsers.map((approvedUser: any, index: number) => {
          console.log(`Converting approved user ${index}:`, approvedUser);
          
          return {
            id: approvedUser.id || `AU${String(index + 1).padStart(3, '0')}`, // Ensure ID exists
            username: approvedUser.username,
            email: approvedUser.email,
            firstName: approvedUser.firstName,
            lastName: approvedUser.lastName,
            roles: approvedUser.roles || [{ assayType: 'POT', role: 'Prep' }],
            isActive: approvedUser.isActive !== undefined ? approvedUser.isActive : true
          };
        });

        console.log('Converted approved users:', convertedApprovedUsers);

        // Start with mock users
        const allUsers = [...mockUsers];
        
        // Add approved users, avoiding duplicates by username
        convertedApprovedUsers.forEach(approvedUser => {
          const existingUser = allUsers.find(user => user.username === approvedUser.username);
          if (!existingUser) {
            console.log(`Adding approved user to list: ${approvedUser.username}`);
            allUsers.push(approvedUser);
          } else {
            console.log(`User ${approvedUser.username} already exists in list, skipping`);
          }
        });

        console.log('Final merged users list:', allUsers);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error loading approved users:', error);
      }
    };

    loadPendingUsers();
    loadApprovedUsers();

    // Set up an interval to check for new pending users and approved users
    const interval = setInterval(() => {
      loadPendingUsers();
      loadApprovedUsers();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
          {count}
        </span>
      )}
    </button>
  );

  const updatePendingUsersInStorage = (updatedUsers: PendingUser[]) => {
    localStorage.setItem('nctl_pending_users', JSON.stringify(updatedUsers));
    setPendingUsers(updatedUsers);
  };

  const getApprovedUsers = () => {
    try {
      const stored = localStorage.getItem('nctl_approved_users');
      const result = stored ? JSON.parse(stored) : [];
      console.log('Retrieved approved users from localStorage:', result);
      return result;
    } catch (error) {
      console.error('Error retrieving approved users:', error);
      return [];
    }
  };

  const saveApprovedUser = (user: any) => {
    try {
      const approvedUsers = getApprovedUsers();
      
      // Check if user already exists in approved users
      const existingIndex = approvedUsers.findIndex((u: any) => u.username === user.username);
      
      if (existingIndex >= 0) {
        // Update existing user
        approvedUsers[existingIndex] = user;
        console.log('Updated existing approved user:', user);
      } else {
        // Add new user
        approvedUsers.push(user);
        console.log('Added new approved user:', user);
      }
      
      localStorage.setItem('nctl_approved_users', JSON.stringify(approvedUsers));
      console.log('All approved users after save:', approvedUsers);
    } catch (error) {
      console.error('Error saving approved user:', error);
    }
  };

  const removeApprovedUser = (username: string) => {
    try {
      const approvedUsers = getApprovedUsers();
      const filteredUsers = approvedUsers.filter((user: any) => user.username !== username);
      localStorage.setItem('nctl_approved_users', JSON.stringify(filteredUsers));
      console.log('Removed approved user:', username);
      console.log('Remaining approved users:', filteredUsers);
    } catch (error) {
      console.error('Error removing approved user:', error);
    }
  };

  const handleApproveUser = (pendingUserId: string) => {
    const pendingUser = pendingUsers.find(u => u.id === pendingUserId);
    if (!pendingUser) return;

    console.log('Approving user:', pendingUser);

    // Get the original registration data to retrieve the password
    const originalRegistration = JSON.parse(localStorage.getItem('nctl_pending_registrations') || '[]')
      .find((reg: any) => reg.username === pendingUser.username);

    console.log('Found registration data:', originalRegistration);

    // Create new user ID that doesn't conflict with existing users
    const existingIds = users.map(u => {
      const idNum = parseInt(u.id.replace(/[A-Z]/g, ''));
      return isNaN(idNum) ? 0 : idNum;
    });
    const newIdNumber = Math.max(...existingIds, 0) + 1;
    const newUserId = `U${String(newIdNumber).padStart(3, '0')}`;

    console.log('Generated new user ID:', newUserId);

    // Create new user from pending user
    const newUser: User = {
      id: newUserId,
      username: pendingUser.username,
      email: pendingUser.email,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      roles: [
        { assayType: 'POT', role: 'Prep' } // Default role
      ],
      isActive: true
    };

    console.log('Created new user object:', newUser);

    // Create approved user with login credentials
    const approvedUserWithCredentials = {
      ...newUser,
      password: originalRegistration?.password || 'defaultPassword123', // Use original password or default
      lastLogin: new Date().toISOString(),
      createdDate: new Date().toISOString().split('T')[0]
    };

    console.log('Created approved user with credentials:', approvedUserWithCredentials);

    // Save to approved users for login system FIRST
    saveApprovedUser(approvedUserWithCredentials);

    // Add to users list immediately
    setUsers(prev => {
      const updated = [...prev];
      // Check if user already exists to avoid duplicates
      const existingUserIndex = updated.findIndex(u => u.username === newUser.username);
      if (existingUserIndex >= 0) {
        // Update existing user
        updated[existingUserIndex] = newUser;
        console.log('Updated existing user in list');
      } else {
        // Add new user
        updated.push(newUser);
        console.log('Added new user to list');
      }
      console.log('Updated users list:', updated);
      return updated;
    });

    // Update pending user status
    const updatedPendingUsers = pendingUsers.map(u => 
      u.id === pendingUserId 
        ? { ...u, status: 'Approved' as const }
        : u
    );
    
    updatePendingUsersInStorage(updatedPendingUsers);

    alert(`User ${pendingUser.firstName} ${pendingUser.lastName} has been approved and added to the system. They can now log in with their credentials.`);
  };

  const handleRejectUser = (pendingUserId: string) => {
    const pendingUser = pendingUsers.find(u => u.id === pendingUserId);
    if (!pendingUser) return;

    // Update pending user status
    const updatedPendingUsers = pendingUsers.map(u => 
      u.id === pendingUserId 
        ? { ...u, status: 'Rejected' as const }
        : u
    );
    
    updatePendingUsersInStorage(updatedPendingUsers);

    alert(`User ${pendingUser.firstName} ${pendingUser.lastName} has been rejected.`);
  };

  const handleDeleteUser = (user: User) => {
    // Prevent deleting the admin user
    if (user.username === 'admin') {
      alert('Cannot delete the admin user account.');
      return;
    }

    setUserToDelete(user);
    setShowDeleteConfirm(user.id);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;

    console.log('Deleting user:', userToDelete);

    // Remove from users list
    setUsers(prev => {
      const filtered = prev.filter(u => u.id !== userToDelete.id);
      console.log('Users after deletion:', filtered);
      return filtered;
    });

    // Remove from approved users in localStorage
    removeApprovedUser(userToDelete.username);

    // Also remove from pending users if they exist there
    const updatedPendingUsers = pendingUsers.filter(u => u.username !== userToDelete.username);
    updatePendingUsersInStorage(updatedPendingUsers);

    // Remove registration data
    try {
      const registrations = JSON.parse(localStorage.getItem('nctl_pending_registrations') || '[]');
      const filteredRegistrations = registrations.filter((reg: any) => reg.username !== userToDelete.username);
      localStorage.setItem('nctl_pending_registrations', JSON.stringify(filteredRegistrations));
      console.log('Removed registration data for:', userToDelete.username);
    } catch (error) {
      console.error('Error removing registration data:', error);
    }

    alert(`User ${userToDelete.firstName} ${userToDelete.lastName} has been permanently deleted from the system.`);
    
    setShowDeleteConfirm(null);
    setUserToDelete(null);
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(null);
    setUserToDelete(null);
  };

  const pendingCount = pendingUsers.filter(u => u.status === 'Pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Administration</h2>
        <p className="text-slate-600">Manage assays, users, and system settings</p>
        
        {/* Debug Button */}
        <button
          onClick={debugAllData}
          className="mt-2 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
        >
          🐛 Debug: Show All Data
        </button>
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
                          ? 'This user has been approved and added to the system. They can now log in with their credentials.'
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
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Total Users: <span className="font-medium text-slate-900">{users.length}</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
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
                          <div className="text-xs text-slate-500">ID: {user.id}</div>
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
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className={`p-1 ${
                              user.username === 'admin' 
                                ? 'text-slate-300 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-800'
                            }`}
                            disabled={user.username === 'admin'}
                            title={user.username === 'admin' ? 'Cannot delete admin user' : 'Delete user'}
                          >
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 rounded-full p-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Delete User Account</h3>
              </div>
              
              <p className="text-slate-600 mb-6">
                Are you sure you want to permanently delete the account for{' '}
                <strong>{userToDelete.firstName} {userToDelete.lastName}</strong> (@{userToDelete.username})?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-900">This action cannot be undone</h4>
                    <p className="text-sm text-red-700 mt-1">
                      This will permanently delete:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
                      <li>User account and profile</li>
                      <li>Login credentials</li>
                      <li>All associated permissions</li>
                      <li>Registration history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={cancelDeleteUser}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
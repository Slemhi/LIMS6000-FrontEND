import React, { useState } from 'react';
import { Bell, User, Search, Calendar, Settings, LogOut, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Array<{
    assayType: string;
    role: string;
  }>;
  isActive: boolean;
  lastLogin: string;
  createdDate: string;
}

interface HeaderProps {
  activeTab: string;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, currentUser, onLogout }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTab, setProfileTab] = useState('profile');

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      receiving: 'Sample Receiving',
      batching: 'Batch Management',
      analysis: 'Analysis',
      qc: 'QC Management',
      inventory: 'Inventory Management',
      reports: 'Reports & CoA',
      sop: 'SOP Management',
      admin: 'Administration'
    };
    return titles[activeTab] || 'NCTL LIMS';
  };

  const handleSignOut = () => {
    setShowProfileModal(false);
    onLogout();
  };

  const ProfileTabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setProfileTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        profileTab === id
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  if (!currentUser) return null;

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{getPageTitle()}</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(), 'EEEE, MMMM do, yyyy')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search samples, batches..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 text-slate-600 hover:text-slate-900 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-slate-500">Laboratory Analyst</p>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <User className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">My Profile</h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex space-x-2 px-6">
                <ProfileTabButton id="profile" label="Profile" icon={User} />
                <ProfileTabButton id="roles" label="Roles & Permissions" icon={Shield} />
                <ProfileTabButton id="settings" label="Settings" icon={Settings} />
              </div>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {profileTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </h4>
                      <p className="text-slate-600">{currentUser.email}</p>
                      <p className="text-sm text-slate-500">Laboratory Analyst</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={currentUser.firstName}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={currentUser.lastName}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={currentUser.username}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={currentUser.email}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                      <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                        <option>Sample Preparation</option>
                        <option>Analytical Chemistry</option>
                        <option>Quality Control</option>
                        <option>Administration</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-slate-900 mb-3">Account Information</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">User ID:</span>
                        <span className="text-slate-900 ml-2">{currentUser.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Account Status:</span>
                        <span className="text-green-600 ml-2 font-medium">Active</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Last Login:</span>
                        <span className="text-slate-900 ml-2">{new Date(currentUser.lastLogin).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Member Since:</span>
                        <span className="text-slate-900 ml-2">{currentUser.createdDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Roles Tab */}
              {profileTab === 'roles' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Current Roles & Permissions</h4>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {currentUser.roles.map((role, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div>
                              <div className="font-medium text-slate-900">
                                {role.assayType !== 'ALL' ? `${role.assayType} - ` : ''}{role.role}
                              </div>
                              <div className="text-sm text-slate-600">
                                {role.assayType === 'POT' && 'Potency Analysis Sample Preparation'}
                                {role.assayType === 'PES' && 'Pesticide Analysis Sample Preparation'}
                                {role.assayType === 'ALL' && 'All Assay Types'}
                              </div>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold text-slate-900 mb-3">Permissions Summary</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h6 className="font-medium text-green-900 mb-2">Allowed Actions</h6>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Create and edit prep batches for POT and PES</li>
                          <li>• View sample information</li>
                          <li>• Update batch metadata and notes</li>
                          <li>• Access inventory for reagents and equipment</li>
                          <li>• View QC data and results</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h6 className="font-medium text-red-900 mb-2">Restricted Actions</h6>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Cannot approve analytical batches</li>
                          <li>• Cannot modify user accounts</li>
                          <li>• Cannot edit SOPs or assay configurations</li>
                          <li>• Cannot access administration settings</li>
                          <li>• Cannot generate final reports</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {profileTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Account Settings</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">Email Notifications</h5>
                          <p className="text-sm text-slate-600">Receive email alerts for batch completions and QC failures</p>
                        </div>
                        <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">Desktop Notifications</h5>
                          <p className="text-sm text-slate-600">Show browser notifications for urgent alerts</p>
                        </div>
                        <input type="checkbox" className="rounded border-slate-300" />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-900">Auto-save Draft Changes</h5>
                          <p className="text-sm text-slate-600">Automatically save form changes every 30 seconds</p>
                        </div>
                        <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Display Preferences</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Items Per Page</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                          <option>25</option>
                          <option>50</option>
                          <option>100</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Time Format</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                          <option>12-hour (AM/PM)</option>
                          <option>24-hour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                          <option>Light</option>
                          <option>Dark</option>
                          <option>Auto</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Security</h4>
                    
                    <div className="space-y-4">
                      <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Change Password
                      </button>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="font-medium text-yellow-900 mb-2">Two-Factor Authentication</h5>
                        <p className="text-sm text-yellow-700 mb-3">
                          Add an extra layer of security to your account
                        </p>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-slate-200 flex justify-between">
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                {profileTab === 'profile' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Changes
                  </button>
                )}
                {profileTab === 'settings' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Preferences
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
import React, { useState } from 'react';
import { FlaskConical, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'Sample Preparation'
  });
  
  const [resetForm, setResetForm] = useState({
    email: ''
  });

  // Mock users for demonstration
  const mockUsers = [
    {
      id: 'U002',
      username: 'jsmith',
      password: 'password123',
      email: 'jane.smith@nctl.com',
      firstName: 'Jane',
      lastName: 'Smith',
      roles: [
        { assayType: 'POT', role: 'Prep' },
        { assayType: 'PES', role: 'Prep' }
      ],
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdDate: '2023-06-15'
    },
    {
      id: 'U001',
      username: 'admin',
      password: 'admin123',
      email: 'admin@nctl.com',
      firstName: 'Admin',
      lastName: 'User',
      roles: [
        { assayType: 'ALL', role: 'Admin' }
      ],
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdDate: '2023-01-01'
    }
  ];

  // Get pending users from localStorage or initialize empty array
  const getPendingUsers = () => {
    try {
      const stored = localStorage.getItem('nctl_pending_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const setPendingUsers = (users: any[]) => {
    localStorage.setItem('nctl_pending_users', JSON.stringify(users));
  };

  // Get approved users from localStorage
  const getApprovedUsers = () => {
    try {
      const stored = localStorage.getItem('nctl_approved_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save registration data separately for password retrieval
  const saveRegistrationData = (registrationData: any) => {
    try {
      const registrations = JSON.parse(localStorage.getItem('nctl_pending_registrations') || '[]');
      registrations.push(registrationData);
      localStorage.setItem('nctl_pending_registrations', JSON.stringify(registrations));
    } catch (error) {
      console.error('Error saving registration data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check mock users first
      let user = mockUsers.find(u => 
        u.username === loginForm.username && u.password === loginForm.password
      );

      // If not found in mock users, check approved users
      if (!user) {
        const approvedUsers = getApprovedUsers();
        user = approvedUsers.find((u: any) => 
          u.username === loginForm.username && u.password === loginForm.password
        );
      }

      if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        onLogin(user);
      } else {
        alert('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Check if username already exists in mock users
    const existingUser = mockUsers.find(u => u.username === registerForm.username);
    if (existingUser) {
      alert('Username already exists');
      return;
    }

    // Check if username already exists in approved users
    const approvedUsers = getApprovedUsers();
    const existingApprovedUser = approvedUsers.find((u: any) => u.username === registerForm.username);
    if (existingApprovedUser) {
      alert('Username already exists');
      return;
    }

    // Check if username already exists in pending users
    const pendingUsers = getPendingUsers();
    const existingPendingUser = pendingUsers.find((u: any) => u.username === registerForm.username);
    if (existingPendingUser) {
      alert('Username already exists in pending requests');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const pendingUsers = getPendingUsers();
      
      const newPendingUser = {
        id: `PU${String(pendingUsers.length + 1).padStart(3, '0')}`,
        username: registerForm.username,
        email: registerForm.email,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        phone: registerForm.phone,
        department: registerForm.department,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };

      // Save registration data with password for later retrieval
      const registrationData = {
        username: registerForm.username,
        password: registerForm.password,
        email: registerForm.email,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        phone: registerForm.phone,
        department: registerForm.department,
        registrationDate: new Date().toISOString()
      };

      pendingUsers.push(newPendingUser);
      setPendingUsers(pendingUsers);
      saveRegistrationData(registrationData);

      alert('Account request submitted successfully! Your account is pending administrator approval. You will be notified once approved.');
      setActiveTab('login');
      setRegisterForm({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        department: 'Sample Preparation'
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === resetForm.email);
      const approvedUsers = getApprovedUsers();
      const approvedUser = approvedUsers.find((u: any) => u.email === resetForm.email);
      
      if (user || approvedUser) {
        alert(`Password reset instructions have been sent to ${resetForm.email}`);
        setActiveTab('login');
        setResetForm({ email: '' });
      } else {
        alert('No account found with that email address');
      }
      setIsLoading(false);
    }, 1000);
  };

  const TabButton = ({ id, label }: { id: 'login' | 'register' | 'reset'; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FlaskConical className="h-10 w-10 text-blue-400" />
            <h1 className="text-2xl font-bold">NCTL LIMS</h1>
          </div>
          <p className="text-slate-300">North Coast Testing Lab</p>
          <p className="text-slate-400 text-sm mt-2">Laboratory Information Management System</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-2 p-6 pb-0">
          <TabButton id="login" label="Sign In" />
          <TabButton id="register" label="Create Account" />
          <TabButton id="reset" label="Reset Password" />
        </div>

        {/* Forms */}
        <div className="p-6">
          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <div className="relative">
                  <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div><strong>Admin:</strong> admin / admin123</div>
                  <div><strong>Analyst:</strong> jsmith / password123</div>
                </div>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                <div className="relative">
                  <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <select
                  value={registerForm.department}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Sample Preparation</option>
                  <option>Analytical Chemistry</option>
                  <option>Quality Control</option>
                  <option>Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-700">
                  New accounts require administrator approval before access is granted.
                </p>
              </div>
            </form>
          )}

          {/* Reset Password Form */}
          {activeTab === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Reset Your Password</h3>
                <p className="text-sm text-slate-600">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
              </button>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs text-slate-600">
                  Remember your password? <button 
                    type="button" 
                    onClick={() => setActiveTab('login')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 text-center">
          <p className="text-xs text-slate-500">
            © 2024 North Coast Testing Lab. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
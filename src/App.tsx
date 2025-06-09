import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import SampleReceiving from './components/SampleReceiving/SampleReceiving';
import BatchManagement from './components/BatchManagement/BatchManagement';
import Analysis from './components/Analysis/Analysis';
import QCManagement from './components/QCManagement/QCManagement';
import Administration from './components/Administration/Administration';
import SOPManagement from './components/SOPManagement/SOPManagement';
import Inventory from './components/Inventory/Inventory';
import Reports from './components/Reports/Reports';
import LoginScreen from './components/Auth/LoginScreen';

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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('nctl_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('nctl_user');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Save user session to localStorage
    localStorage.setItem('nctl_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    // Clear user session from localStorage
    localStorage.removeItem('nctl_user');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'receiving':
        return <SampleReceiving />;
      case 'batching':
        return <BatchManagement currentUser={currentUser} />;
      case 'analysis':
        return <Analysis />;
      case 'qc':
        return <QCManagement />;
      case 'inventory':
        return <Inventory />;
      case 'reports':
        return <Reports />;
      case 'sop':
        return <SOPManagement />;
      case 'admin':
        return <Administration />;
      default:
        return <Dashboard />;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activeTab={activeTab} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'receiving':
        return <SampleReceiving />;
      case 'batching':
        return <BatchManagement />;
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

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
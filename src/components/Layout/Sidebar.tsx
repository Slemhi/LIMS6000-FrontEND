import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Package, 
  BarChart3, 
  FileText, 
  Settings, 
  Beaker,
  ClipboardList,
  TrendingUp,
  ShoppingCart,
  Users,
  FileCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'receiving', label: 'Sample Receiving', icon: Package },
    { id: 'batching', label: 'Batch Management', icon: FlaskConical },
    { id: 'analysis', label: 'Analysis', icon: Beaker },
    { id: 'qc', label: 'QC Management', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: ShoppingCart },
    { id: 'reports', label: 'Reports & CoA', icon: FileCheck },
    { id: 'sop', label: 'SOP Management', icon: FileText },
    { id: 'admin', label: 'Administration', icon: Settings }
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <FlaskConical className="h-8 w-8 text-blue-400" />
          <h1 className="text-xl font-bold">NCTL LIMS</h1>
        </div>
        <p className="text-slate-400 text-sm">North Coast Testing Lab</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 pt-8 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          <p>Version 1.0.0</p>
          <p>© 2024 NCTL</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
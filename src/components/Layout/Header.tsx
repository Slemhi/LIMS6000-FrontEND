import React from 'react';
import { Bell, User, Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
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

  return (
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
              <p className="text-sm font-medium text-slate-900">Dr. Sarah Wilson</p>
              <p className="text-xs text-slate-500">Laboratory Director</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
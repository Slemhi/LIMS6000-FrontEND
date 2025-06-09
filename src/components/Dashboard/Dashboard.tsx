import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { mockSamples, mockPrepBatches, mockAnalyticalBatches } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const totalSamples = mockSamples.length;
  const pendingSamples = mockSamples.filter(s => s.status === 'Received').length;
  const activeBatches = mockPrepBatches.length + mockAnalyticalBatches.length;
  const completedSamples = mockSamples.filter(s => s.status === 'Complete').length;

  const recentActivity = [
    { id: 1, action: 'Sample S003 completed analysis', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Prep Batch PB001 ready for analysis', time: '4 hours ago', type: 'info' },
    { id: 3, action: 'QC failure in Batch AB002', time: '6 hours ago', type: 'warning' },
    { id: 4, action: 'New manifest uploaded from Green Valley', time: '1 day ago', type: 'info' }
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Samples"
          value={totalSamples}
          icon={Package}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="Pending Samples"
          value={pendingSamples}
          icon={Clock}
          color="bg-yellow-500"
          trend={-5}
        />
        <StatCard
          title="Active Batches"
          value={activeBatches}
          icon={BarChart3}
          color="bg-purple-500"
          trend={8}
        />
        <StatCard
          title="Completed Today"
          value={completedSamples}
          icon={CheckCircle}
          color="bg-green-500"
          trend={15}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sample Status Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sample Status Distribution</h3>
          <div className="space-y-4">
            {['Received', 'Batched', 'In Prep', 'In Analysis', 'Complete'].map((status) => {
              const count = mockSamples.filter(s => s.status === status).length;
              const percentage = (count / totalSamples) * 100;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{status}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-1 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100' :
                  activity.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : activity.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Test Performance This Week</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['Potency', 'Pesticides', 'Heavy Metals', 'Solvents', 'Nutrients'].map((test) => (
            <div key={test} className="text-center">
              <div className="bg-slate-100 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-slate-900">
                  {Math.floor(Math.random() * 50) + 10}
                </div>
                <div className="text-sm text-slate-600">Samples</div>
              </div>
              <div className="text-sm font-medium text-slate-700">{test}</div>
              <div className="text-xs text-green-600">
                {Math.floor(Math.random() * 10) + 90}% Pass Rate
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
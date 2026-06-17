import React from 'react';
import { Users, CalendarDays, UserCheck, UserPlus, Inbox } from 'lucide-react';
import { Nurse } from '../types';

interface DashboardHomeProps {
  nurses?: Nurse[];
  setCurrentPage: (page: string) => void;
  onAddClick: () => void;
}

export default function DashboardHome({ nurses = [], setCurrentPage, onAddClick }: DashboardHomeProps) {
  // Calculations
  const totalNurses = nurses.length;

  const nursesThisMonth = nurses.filter(nurse => {
    if (!nurse.createdAt) return false;
    const date = new Date(nurse.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const latestNurse = nurses.length > 0 
    ? [...nurses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome & Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Welcome to your Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Here is a quick overview of your medical staffing directory.</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Nurses */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-gray-300">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Nurses</p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{totalNurses}</h3>
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Added This Month */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-gray-300">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Added This Month</p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{nursesThisMonth}</h3>
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-500 rounded-xl">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Latest Added Nurse */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-gray-300">
          <div className="space-y-2 max-w-[70%]">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Latest Nurse</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {latestNurse ? latestNurse.name : 'None'}
            </h3>
            {latestNurse && (
              <p className="text-xs text-sky-600 font-medium">DHA: {latestNurse.dhaNumber}</p>
            )}
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-500 rounded-xl flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
        {totalNurses === 0 ? (
          /* Empty State Illustration */
          <div className="max-w-md mx-auto space-y-5 animate-pulse-subtle">
            <div className="inline-flex p-4 rounded-full bg-gray-50 border border-gray-200/60 text-gray-400 shadow-inner">
              <Inbox className="w-12 h-12 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">No Nurses Registered Yet</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                Your database is empty. Add profiles to store credentials, verify certifications, and review documents.
              </p>
            </div>
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-100 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Add Your First Nurse
            </button>
          </div>
        ) : (
          /* Visual summary and welcome note when there is data */
          <div className="max-w-xl mx-auto space-y-6">
            <div className="inline-flex p-4 rounded-full bg-sky-50 border border-sky-100 text-sky-500">
              <Users className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Database Active</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                You have <span className="font-semibold text-sky-600">{totalNurses} registered nurse{totalNurses === 1 ? '' : 's'}</span> in your directory. Navigate to the Nurses list to view documents, modify details, or remove records.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setCurrentPage('nurses')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 transition-all active:scale-[0.98]"
              >
                View Staff List
              </button>
              <button
                onClick={onAddClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-100 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" />
                Add More Nurses
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

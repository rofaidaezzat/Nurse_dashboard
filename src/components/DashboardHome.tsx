import React from 'react';
import { Users, CalendarDays, UserCheck, UserPlus, Inbox, Stethoscope } from 'lucide-react';
import { Nurse, StaffRole } from '../types';

interface DashboardHomeProps {
  nurses?: Nurse[];
  setCurrentPage: (page: string) => void;
  onAddClick: (role?: StaffRole) => void;
}

export default function DashboardHome({ nurses = [], setCurrentPage, onAddClick }: DashboardHomeProps) {
  // Calculations
  const totalStaff = nurses.length;

  const staffThisMonth = nurses.filter(nurse => {
    if (!nurse.createdAt) return false;
    const date = new Date(nurse.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const latestStaff = nurses.length > 0 
    ? [...nurses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  const registeredNursesCount = nurses.filter(n => n.role === 'registered_nurse').length;
  const assistantNursesCount = nurses.filter(n => n.role === 'assistant_nurse').length;
  const doctorsCount = nurses.filter(n => n.role === 'general_dr').length;

  const getRoleLabel = (role: StaffRole) => {
    switch (role) {
      case 'registered_nurse': return 'Registered Nurse';
      case 'assistant_nurse': return 'Assistant Nurse';
      case 'general_dr': return 'General Dr';
      default: return 'Staff';
    }
  };

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case 'registered_nurse': return 'text-sky-600 bg-sky-50 border-sky-100';
      case 'assistant_nurse': return 'text-teal-600 bg-teal-50 border-teal-100';
      case 'general_dr': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome & Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Welcome to your Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Here is a quick overview of your medical staffing directory.</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Staff */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-gray-300">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Staff</p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{totalStaff}</h3>
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Added This Month */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-gray-300">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Added This Month</p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{staffThisMonth}</h3>
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-500 rounded-xl">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Latest Added Staff */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-gray-300">
          <div className="space-y-2 max-w-[70%] text-left">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Latest Registration</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {latestStaff ? latestStaff.name : 'None'}
            </h3>
            {latestStaff && (
              <p className="text-xs text-sky-600 font-medium">
                {getRoleLabel(latestStaff.role)} {latestStaff.dhaNumber ? `• DHA: ${latestStaff.dhaNumber}` : ''}
              </p>
            )}
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-500 rounded-xl flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Staff Breakdown Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 text-left">Staff Distribution</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Registered Nurse breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between h-44 text-left transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-600 border border-sky-100">
                  Registered Nurse
                </span>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{registeredNursesCount}</h3>
              </div>
              <div className="p-3 bg-sky-50 text-sky-500 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('registered_nurse')}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 mt-2 self-start flex items-center gap-1"
            >
              Open Registered Nurse Directory &rarr;
            </button>
          </div>

          {/* Assistant Nurse breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between h-44 text-left transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-50 text-teal-600 border border-teal-100">
                  Assistant Nurse
                </span>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{assistantNursesCount}</h3>
              </div>
              <div className="p-3 bg-teal-50 text-teal-500 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('assistant_nurse')}
              className="text-xs font-semibold text-teal-500 hover:text-teal-600 mt-2 self-start flex items-center gap-1"
            >
              Open Assistant Nurse Directory &rarr;
            </button>
          </div>

          {/* General Dr breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between h-44 text-left transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  General Dr
                </span>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{doctorsCount}</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('general_dr')}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 mt-2 self-start flex items-center gap-1"
            >
              Open Doctors Directory &rarr;
            </button>
          </div>

        </div>
      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
        {totalStaff === 0 ? (
          /* Empty State Illustration */
          <div className="max-w-md mx-auto space-y-5 animate-pulse-subtle">
            <div className="inline-flex p-4 rounded-full bg-gray-50 border border-gray-200/60 text-gray-400 shadow-inner">
              <Inbox className="w-12 h-12 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-800">No Staff Registered Yet</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                Your database is empty. Add profiles to store credentials, verify certifications, and review documents.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => onAddClick('registered_nurse')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Registered Nurse
              </button>
              <button
                onClick={() => onAddClick('assistant_nurse')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-500 hover:bg-teal-600 transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Assistant Nurse
              </button>
              <button
                onClick={() => onAddClick('general_dr')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add General Dr
              </button>
            </div>
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
                You have <span className="font-semibold text-sky-600">{totalStaff} registered staff member{totalStaff === 1 ? '' : 's'}</span> in your directory. Navigate to their respective lists in the sidebar to view documents, modify details, or remove records.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => onAddClick('registered_nurse')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Registered Nurse
              </button>
              <button
                onClick={() => onAddClick('assistant_nurse')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-500 hover:bg-teal-600 transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Assistant Nurse
              </button>
              <button
                onClick={() => onAddClick('general_dr')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add General Dr
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

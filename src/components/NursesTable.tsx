import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Search, Plus } from 'lucide-react';
import { Nurse, StaffRole } from '../types';

interface NursesTableProps {
  nurses?: Nurse[];
  role: StaffRole;
  onView: (nurse: Nurse) => void;
  onEdit: (nurse: Nurse) => void;
  onDelete: (nurse: Nurse) => void;
  setCurrentPage: (page: string) => void;
  onAddClick: () => void;
}

export default function NursesTable({ 
  nurses = [], 
  role,
  onView, 
  onEdit, 
  onDelete, 
  setCurrentPage, 
  onAddClick 
}: NursesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering based on role and search term
  const filteredNurses = nurses
    .filter(nurse => nurse.role === role)
    .filter(nurse => {
      const term = searchTerm.toLowerCase();
      return nurse.name.toLowerCase().includes(term);
    });

  // Role details
  const getRoleHeaderDetails = () => {
    switch (role) {
      case 'registered_nurse':
        return {
          title: 'Registered Nurses Directory',
          description: 'Manage, update, and search registered nurse records.',
          buttonLabel: 'Add Registered Nurse',
        };
      case 'assistant_nurse':
        return {
          title: 'Assistant Nurses Directory',
          description: 'Manage, update, and search assistant nurse records.',
          buttonLabel: 'Add Assistant Nurse',
        };
      case 'general_dr':
        return {
          title: 'General Doctors Directory',
          description: 'Manage, update, and search doctor records.',
          buttonLabel: 'Add General Dr',
        };
      default:
        return {
          title: 'Staff Directory',
          description: 'Manage, update, and search staff records.',
          buttonLabel: 'Add Staff',
        };
    }
  };

  const { title, description, buttonLabel } = getRoleHeaderDetails();
  const isAssistant = role === 'assistant_nurse';

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header and Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>

        <button
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-100 hover:shadow-lg transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {buttonLabel}
        </button>
      </div>

      {/* Table Container Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Search Bar Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="block w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm placeholder-gray-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Directory Listing Table */}
        <div className="overflow-x-auto scrollbar-thin">
          {filteredNurses.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-2">
              <p className="font-bold text-gray-700">No staff members match your criteria</p>
              <p className="text-sm">Try modifying your search term or add a new record.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-150">
                  <th className="py-3 px-6 w-[8%] text-center font-bold">#</th>
                  <th className="py-3 px-4 w-[10%] font-bold">Photo</th>
                  <th className="py-3 px-4 w-[28%] font-bold">Full Name</th>
                  <th className="py-3 px-4 w-[15%] font-bold">Age</th>
                  <th className="py-3 px-4 w-[24%] font-bold">Copy ID</th>
                  <th className="py-3 px-6 w-[15%] text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredNurses.map((staff, index) => (
                  <tr key={staff.id} className="hover:bg-sky-50/20 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-gray-400 text-center">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      {staff.profileImageBase64 ? (
                        <img
                          src={staff.profileImageBase64}
                          alt={staff.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                          {staff.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{staff.name}</td>
                    <td className="py-3.5 px-4 text-gray-600">{staff.age} yrs</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500 text-xs">
                      {staff.copyId || <span className="text-gray-300 font-sans">—</span>}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* View Action Button */}
                        <button
                          onClick={() => onView(staff)}
                          className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                          title="View Profile Details"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>

                        {/* Edit Action Button */}
                        <button
                          onClick={() => onEdit(staff)}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>

                        {/* Delete Action Button */}
                        <button
                          onClick={() => onDelete(staff)}
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Statistics */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
          <span>Showing {filteredNurses.length} of {nurses.filter(n => n.role === role).length} records</span>
        </div>

      </div>

    </div>
  );
}

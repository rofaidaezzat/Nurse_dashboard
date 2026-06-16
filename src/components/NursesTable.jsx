import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Search, Plus } from 'lucide-react';

export default function NursesTable({ nurses = [], onView, onEdit, onDelete, setCurrentPage, onAddClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering
  const filteredNurses = nurses.filter(nurse => {
    const term = searchTerm.toLowerCase();
    return (
      nurse.name.toLowerCase().includes(term) ||
      nurse.dhaNumber.toLowerCase().includes(term) ||
      nurse.nationalId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Header and Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Nurses Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage, update, and search nurse records.</p>
        </div>

        <button
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-100 hover:shadow-lg transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Nurse
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
              placeholder="Search by name, DHA number, or National ID..."
              className="block w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm placeholder-gray-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Directory Listing Table */}
        <div className="overflow-x-auto scrollbar-thin">
          {filteredNurses.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-2">
              <p className="font-bold text-gray-700">No nurses match your criteria</p>
              <p className="text-sm">Try modifying your search term or add a new nurse.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-150">
                  <th className="py-3 px-5 w-16 text-center">#</th>
                  <th className="py-3 px-4 w-20">Photo</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">DHA No.</th>
                  <th className="py-3 px-4 w-24">Age</th>
                  <th className="py-3 px-4">National ID</th>
                  <th className="py-3 px-4 w-36 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredNurses.map((nurse, index) => (
                  <tr key={nurse.id} className="hover:bg-sky-50/20 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-gray-400 text-center">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      {nurse.profileImageBase64 ? (
                        <img
                          src={nurse.profileImageBase64}
                          alt={nurse.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                          {nurse.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">{nurse.name}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-sky-700 font-semibold">{nurse.dhaNumber}</td>
                    <td className="py-3.5 px-4 text-gray-600">{nurse.age} yrs</td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono text-xs">{nurse.nationalId}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* View Action Button */}
                        <button
                          onClick={() => onView(nurse)}
                          className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                          title="View Nurse Profile"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>

                        {/* Edit Action Button */}
                        <button
                          onClick={() => onEdit(nurse)}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                          title="Edit Nurse"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>

                        {/* Delete Action Button */}
                        <button
                          onClick={() => onDelete(nurse)}
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Nurse"
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
          <span>Showing {filteredNurses.length} of {nurses.length} records</span>
        </div>

      </div>

    </div>
  );
}

import React, { useEffect } from 'react';
import { X, FileText, User, Calendar, ShieldCheck, CreditCard, AlertTriangle } from 'lucide-react';
import NurseForm from './NurseForm';

/**
 * Base accessible wrapper for modal sheets.
 * Centers the content, overlays a backdrop, and hooks window key listeners.
 */
function ModalWrapper({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Card */}
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-150 max-w-lg w-full max-h-[85vh] flex flex-col relative overflow-hidden z-10 transition-all duration-300 transform scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto scrollbar-thin flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * 1. VIEW NURSE MODAL
 */
export function ViewModal({ isOpen, onClose, nurse }) {
  if (!nurse) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Nurse Profile Details">
      <div className="space-y-6">
        {/* Avatar & Hero */}
        <div className="flex flex-col items-center text-center space-y-3">
          {nurse.profileImageBase64 ? (
            <img 
              src={nurse.profileImageBase64} 
              alt={nurse.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-sky-100 shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-3xl">
              {nurse.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{nurse.name}</h2>
            <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-xs font-semibold text-sky-600 border border-sky-100 mt-1">
              Registered Staff
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 grid grid-cols-2 gap-4">
          
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              DHA License
            </span>
            <p className="text-sm font-semibold text-gray-800 font-mono">{nurse.dhaNumber}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-500" />
              Age
            </span>
            <p className="text-sm font-semibold text-gray-800">{nurse.age} years old</p>
          </div>

          <div className="space-y-1 col-span-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-sky-500" />
              National ID
            </span>
            <p className="text-sm font-semibold text-gray-800 font-mono">{nurse.nationalId}</p>
          </div>

        </div>

        {/* Certifications Block */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">Uploaded Certifications</h4>
          <div className="space-y-2">
            
            {/* DHA Cert */}
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-150 rounded-xl">
              <div className="p-2 bg-sky-50 text-sky-500 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold text-gray-800">DHA Certification</p>
                <p className="text-[10px] text-gray-400 truncate">{nurse.dhaCertName}</p>
              </div>
            </div>

            {/* PLS Cert */}
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-150 rounded-xl">
              <div className="p-2 bg-sky-50 text-sky-500 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold text-gray-800">PLS Certification</p>
                <p className="text-[10px] text-gray-400 truncate">{nurse.plsCertName}</p>
              </div>
            </div>

            {/* Other Cert */}
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-150 rounded-xl">
              <div className="p-2 bg-sky-50 text-sky-500 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold text-gray-800">Other Certification</p>
                <p className="text-[10px] text-gray-400 truncate">{nurse.otherCertName || 'Not Provided'}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </ModalWrapper>
  );
}

/**
 * 2. EDIT NURSE MODAL
 */
export function EditModal({ isOpen, onClose, nurse, onSave }) {
  if (!nurse) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit Nurse Profile">
      <NurseForm 
        initialData={nurse} 
        onSave={onSave} 
        onCancel={onClose} 
        submitButtonLabel="Save Changes" 
      />
    </ModalWrapper>
  );
}

/**
 * 3. DELETE CONFIRMATION MODAL
 */
export function DeleteModal({ isOpen, onClose, nurse, onDeleteConfirm }) {
  if (!nurse) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Confirm Profile Deletion">
      <div className="space-y-5 text-center">
        
        {/* Warning Icon */}
        <div className="inline-flex p-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-full">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">Are you sure you want to delete {nurse.name}?</h3>
          <p className="text-sm text-gray-500 leading-relaxed px-4">
            This action will permanently erase the nurse's credentials, files, and profile details from the system directory. This action cannot be reversed.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={onDeleteConfirm}
            className="flex-grow py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-100 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            Delete Profile
          </button>
          
          <button
            onClick={onClose}
            className="flex-grow py-3 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-semibold bg-white hover:bg-gray-50 rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>

      </div>
    </ModalWrapper>
  );
}

/**
 * 4. ADD NURSE MODAL
 */
export function AddModal({ isOpen, onClose, onSave }) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add New Nurse Profile">
      <NurseForm 
        onSave={onSave} 
        onCancel={onClose} 
        submitButtonLabel="Add Nurse" 
      />
    </ModalWrapper>
  );
}

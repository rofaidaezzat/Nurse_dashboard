import React, { useEffect } from 'react';
import { X, FileText, Calendar, ShieldCheck, CreditCard, AlertTriangle, FileUp } from 'lucide-react';
import NurseForm from './NurseForm';
import { Nurse, StaffRole } from '../types';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

/**
 * Base accessible wrapper for modal sheets.
 * Centers the content, overlays a backdrop, and hooks window key listeners.
 */
function ModalWrapper({ isOpen, onClose, title, children, maxWidthClass = "max-w-lg" }: ModalWrapperProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
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
        className={`bg-white rounded-2xl shadow-2xl border border-gray-150 ${maxWidthClass} w-full max-h-[85vh] flex flex-col relative overflow-hidden z-10 transition-all duration-300 transform scale-100 opacity-100`}
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

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  nurse: Nurse | null;
}

/**
 * 1. VIEW NURSE MODAL
 */
export function ViewModal({ isOpen, onClose, nurse }: ViewModalProps) {
  if (!nurse) return null;

  const isAssistant = nurse.role === 'assistant_nurse';

  const getRoleLabel = (role: StaffRole) => {
    switch (role) {
      case 'registered_nurse': return 'Registered Nurse';
      case 'assistant_nurse': return 'Assistant Nurse';
      case 'general_dr': return 'General Dr';
      default: return 'Staff Member';
    }
  };

  const getRoleBadgeStyle = (role: StaffRole) => {
    switch (role) {
      case 'registered_nurse': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'assistant_nurse': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'general_dr': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  // Helper to render document item row
  const renderDocItem = (label: string, fileName?: string) => {
    return (
      <div className="flex items-center gap-3 p-3 bg-white border border-gray-150 rounded-xl">
        <div className="p-2 bg-sky-50 text-sky-500 rounded-lg">
          <FileText className="w-4 h-4" />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-xs font-semibold text-gray-800">{label}</p>
          <p className="text-[10px] text-gray-400 truncate">{fileName || 'Not Uploaded'}</p>
        </div>
      </div>
    );
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Staff Profile Details" maxWidthClass="max-w-lg md:max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        {/* Left Column: Avatar & Name */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 col-span-1 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
          <div className="w-full max-w-[200px] md:max-w-none">
            {nurse.profileImageBase64 ? (
              <img 
                src={nurse.profileImageBase64} 
                alt={nurse.name} 
                className="w-full aspect-square object-cover rounded-2xl border-2 border-sky-100 shadow-sm"
              />
            ) : (
              <div className="w-full aspect-square rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-5xl shadow-sm">
                {nurse.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="space-y-1.5 w-full">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{nurse.name}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(nurse.role)}`}>
              {getRoleLabel(nurse.role)}
            </span>
          </div>
        </div>

        {/* Right Column: Info Grid & Certifications */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Info Grid */}
          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-150 grid grid-cols-2 gap-4">
            {/* Age */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                Age
              </span>
              <p className="text-sm font-semibold text-gray-800">{nurse.age} years old</p>
            </div>

            {/* Copy ID (Registered Nurse & General Dr only) */}
            {!isAssistant && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-sky-500" />
                  Copy ID
                </span>
                <p className="text-sm font-semibold text-gray-800 font-mono">{nurse.copyId || 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Certifications Block */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">Required Documents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Copy of Passport */}
              {renderDocItem('Copy of Passport', nurse.passportCertName)}

              {/* Copy of Emirates ID */}
              {renderDocItem('Copy of Emirates ID', nurse.emiratesIdCertName || nurse.dhaCertName)}

              {/* BLS Cert (legacy fallback to plsCertName) */}
              {renderDocItem('BLS Certificate', nurse.blsCertName || nurse.plsCertName)}

              {/* Vaccination Records */}
              {renderDocItem('Vaccination Record', nurse.vaccinationCertName)}

              {/* Conditional: ACLS & Infection Control */}
              {!isAssistant && (
                <>
                  {/* ACLS Cert (legacy fallback to otherCertName) */}
                  {renderDocItem('ACLS Certificate', nurse.aclsCertName || nurse.otherCertName)}
                  
                  {/* Infection Control Cert */}
                  {renderDocItem('Infection Control Cert', nurse.infectionControlCertName)}
                </>
              )}

            </div>
          </div>

          {/* Close Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-sm transition-all active:scale-[0.98] shadow-md shadow-sky-100 hover:shadow-lg"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </ModalWrapper>
  );
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  nurse: Nurse | null;
  onSave: (updatedNurse: Omit<Nurse, 'id' | 'createdAt'>) => void;
}

/**
 * 2. EDIT NURSE MODAL
 */
export function EditModal({ isOpen, onClose, nurse, onSave }: EditModalProps) {
  if (!nurse) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit Profile Details" maxWidthClass="max-w-lg md:max-w-2xl lg:max-w-3xl">
      <NurseForm 
        initialData={nurse} 
        role={nurse.role}
        onSave={onSave} 
        onCancel={onClose} 
        submitButtonLabel="Save Changes" 
      />
    </ModalWrapper>
  );
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  nurse: Nurse | null;
  onDeleteConfirm: () => void;
}

/**
 * 3. DELETE CONFIRMATION MODAL
 */
export function DeleteModal({ isOpen, onClose, nurse, onDeleteConfirm }: DeleteModalProps) {
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
            This action will permanently erase the staff member's credentials, files, and profile details from the system directory. This action cannot be reversed.
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

interface AddModalProps {
  isOpen: boolean;
  role: StaffRole;
  onClose: () => void;
  onSave: (newNurse: Omit<Nurse, 'id' | 'createdAt'>) => void;
}

/**
 * 4. ADD NURSE MODAL
 */
export function AddModal({ isOpen, role, onClose, onSave }: AddModalProps) {
  const getModalTitle = (activeRole: StaffRole) => {
    switch (activeRole) {
      case 'registered_nurse': return 'Add New Registered Nurse Profile';
      case 'assistant_nurse': return 'Add New Assistant Nurse Profile';
      case 'general_dr': return 'Add New General Dr Profile';
      default: return 'Add New Staff Profile';
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={getModalTitle(role)} maxWidthClass="max-w-lg md:max-w-2xl lg:max-w-3xl">
      <NurseForm 
        role={role}
        onSave={onSave} 
        onCancel={onClose} 
        submitButtonLabel={`Add ${role === 'general_dr' ? 'Doctor' : role === 'assistant_nurse' ? 'Assistant Nurse' : 'Registered Nurse'}`} 
      />
    </ModalWrapper>
  );
}

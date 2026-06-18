import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import NursesTable from './components/NursesTable';
import ToastContainer from './components/Toast';
import { ViewModal, EditModal, DeleteModal, AddModal } from './components/Modals';
import { User, Nurse, Toast, StaffRole, NurseSaveData } from './types';
import { getCookie, eraseCookie } from './utils/cookieUtils';
import {
  getMeAPI,
  getAllStaffAPI,
  createStaffAPI,
  updateStaffAPI,
  deleteStaffAPI,
  mapBackendToFrontend,
} from './services/apiService';
import nurseAvatar1 from './assets/nurse_avatar_1.png';
import nurseAvatar2 from './assets/nurse_avatar_2.png';
import nurseAvatar3 from './assets/nurse_avatar_3.png';
import nurseAvatar4 from './assets/nurse_avatar_4.png';


const DEFAULT_NURSES: Nurse[] = [
  // ─── Registered Nurses (5) ───────────────────────────────
  {
    id: 'rn-001',
    role: 'registered_nurse',
    name: 'Sarah Jenkins',
    age: 29,
    copyId: '784-1995-5123456-1',
    profileImageBase64: nurseAvatar1,
    profileImageName: 'sarah_jenkins.png',
    aclsCertName: 'ACLS_Sarah_Jenkins.pdf',
    blsCertName: 'BLS_Sarah_Jenkins.pdf',
    vaccinationCertName: 'Vaccination_Sarah_Jenkins.pdf',
    infectionControlCertName: 'InfectionControl_Sarah_Jenkins.pdf',
    passportCertName: 'Passport_Sarah_Jenkins.pdf',
    emiratesIdCertName: 'EmiratesID_Sarah_Jenkins.pdf',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rn-002',
    role: 'registered_nurse',
    name: 'Fatima Al-Hashimi',
    age: 33,
    copyId: '784-1991-7654321-2',
    profileImageBase64: nurseAvatar3,
    profileImageName: 'fatima_alhashimi.png',
    aclsCertName: 'ACLS_Fatima_AlHashimi.pdf',
    blsCertName: 'BLS_Fatima_AlHashimi.pdf',
    vaccinationCertName: 'Vaccination_Fatima_AlHashimi.pdf',
    infectionControlCertName: 'InfectionControl_Fatima_AlHashimi.pdf',
    passportCertName: 'Passport_Fatima_AlHashimi.pdf',
    emiratesIdCertName: 'EmiratesID_Fatima_AlHashimi.pdf',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rn-003',
    role: 'registered_nurse',
    name: 'Michael Chen',
    age: 34,
    copyId: '784-1990-0987654-3',
    profileImageBase64: nurseAvatar2,
    profileImageName: 'michael_chen.png',
    aclsCertName: 'ACLS_Michael_Chen.pdf',
    blsCertName: 'BLS_Michael_Chen.pdf',
    vaccinationCertName: 'Vaccination_Michael_Chen.pdf',
    infectionControlCertName: 'InfectionControl_Michael_Chen.pdf',
    passportCertName: 'Passport_Michael_Chen.pdf',
    emiratesIdCertName: 'EmiratesID_Michael_Chen.pdf',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rn-004',
    role: 'registered_nurse',
    name: 'Noura Al-Suwaidi',
    age: 26,
    copyId: '784-1998-3456789-4',
    profileImageBase64: nurseAvatar4,
    profileImageName: 'noura_alsuwaidi.png',
    aclsCertName: 'ACLS_Noura_AlSuwaidi.pdf',
    blsCertName: 'BLS_Noura_AlSuwaidi.pdf',
    vaccinationCertName: 'Vaccination_Noura_AlSuwaidi.pdf',
    infectionControlCertName: 'InfectionControl_Noura_AlSuwaidi.pdf',
    passportCertName: 'Passport_Noura_AlSuwaidi.pdf',
    emiratesIdCertName: 'EmiratesID_Noura_AlSuwaidi.pdf',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rn-005',
    role: 'registered_nurse',
    name: 'Priya Sharma',
    age: 30,
    copyId: '784-1994-8765432-5',
    profileImageBase64: nurseAvatar1,
    profileImageName: 'priya_sharma.png',
    aclsCertName: 'ACLS_Priya_Sharma.pdf',
    blsCertName: 'BLS_Priya_Sharma.pdf',
    vaccinationCertName: 'Vaccination_Priya_Sharma.pdf',
    infectionControlCertName: 'InfectionControl_Priya_Sharma.pdf',
    passportCertName: 'Passport_Priya_Sharma.pdf',
    emiratesIdCertName: 'EmiratesID_Priya_Sharma.pdf',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ─── General Doctors (5) ─────────────────────────────────
  {
    id: 'dr-001',
    role: 'general_dr',
    name: 'Dr. Amina Al-Mansoori',
    age: 41,
    copyId: '784-1983-0123456-6',
    profileImageBase64: nurseAvatar3,
    profileImageName: 'amina_almansoori.png',
    aclsCertName: 'ACLS_Amina_AlMansoori.pdf',
    blsCertName: 'BLS_Amina_AlMansoori.pdf',
    vaccinationCertName: 'Vaccination_Amina_AlMansoori.pdf',
    infectionControlCertName: 'InfectionControl_Amina_AlMansoori.pdf',
    passportCertName: 'Passport_Amina_AlMansoori.pdf',
    emiratesIdCertName: 'EmiratesID_Amina_AlMansoori.pdf',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dr-002',
    role: 'general_dr',
    name: 'Dr. Khaled Bin Rashid',
    age: 45,
    copyId: '784-1979-6543210-7',
    profileImageBase64: nurseAvatar2,
    profileImageName: 'khaled_binrashid.png',
    aclsCertName: 'ACLS_Khaled_BinRashid.pdf',
    blsCertName: 'BLS_Khaled_BinRashid.pdf',
    vaccinationCertName: 'Vaccination_Khaled_BinRashid.pdf',
    infectionControlCertName: 'InfectionControl_Khaled_BinRashid.pdf',
    passportCertName: 'Passport_Khaled_BinRashid.pdf',
    emiratesIdCertName: 'EmiratesID_Khaled_BinRashid.pdf',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dr-003',
    role: 'general_dr',
    name: 'Dr. Maria Santos',
    age: 38,
    copyId: '784-1986-1122334-8',
    profileImageBase64: nurseAvatar1,
    profileImageName: 'maria_santos.png',
    aclsCertName: 'ACLS_Maria_Santos.pdf',
    blsCertName: 'BLS_Maria_Santos.pdf',
    vaccinationCertName: 'Vaccination_Maria_Santos.pdf',
    infectionControlCertName: 'InfectionControl_Maria_Santos.pdf',
    passportCertName: 'Passport_Maria_Santos.pdf',
    emiratesIdCertName: 'EmiratesID_Maria_Santos.pdf',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dr-004',
    role: 'general_dr',
    name: 'Dr. Omar Al-Falasi',
    age: 50,
    copyId: '784-1974-5566778-9',
    profileImageBase64: nurseAvatar4,
    profileImageName: 'omar_alfalasi.png',
    aclsCertName: 'ACLS_Omar_AlFalasi.pdf',
    blsCertName: 'BLS_Omar_AlFalasi.pdf',
    vaccinationCertName: 'Vaccination_Omar_AlFalasi.pdf',
    infectionControlCertName: 'InfectionControl_Omar_AlFalasi.pdf',
    passportCertName: 'Passport_Omar_AlFalasi.pdf',
    emiratesIdCertName: 'EmiratesID_Omar_AlFalasi.pdf',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'dr-005',
    role: 'general_dr',
    name: 'Dr. Hessa Al-Ketbi',
    age: 36,
    copyId: '784-1988-9988776-10',
    profileImageBase64: nurseAvatar3,
    profileImageName: 'hessa_alketbi.png',
    aclsCertName: 'ACLS_Hessa_AlKetbi.pdf',
    blsCertName: 'BLS_Hessa_AlKetbi.pdf',
    vaccinationCertName: 'Vaccination_Hessa_AlKetbi.pdf',
    infectionControlCertName: 'InfectionControl_Hessa_AlKetbi.pdf',
    passportCertName: 'Passport_Hessa_AlKetbi.pdf',
    emiratesIdCertName: 'EmiratesID_Hessa_AlKetbi.pdf',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ─── Assistant Nurses (5) ────────────────────────────────
  {
    id: 'an-001',
    role: 'assistant_nurse',
    name: 'Linh Nguyen',
    age: 27,
    copyId: '784-1999-1122334-0',
    profileImageBase64: nurseAvatar4,
    profileImageName: 'linh_nguyen.png',
    blsCertName: 'BLS_Linh_Nguyen.pdf',
    vaccinationCertName: 'Vaccination_Linh_Nguyen.pdf',
    passportCertName: 'Passport_Linh_Nguyen.pdf',
    emiratesIdCertName: 'EmiratesID_Linh_Nguyen.pdf',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'an-002',
    role: 'assistant_nurse',
    name: 'Reem Al-Dhaheri',
    age: 23,
    copyId: '784-2003-9988776-0',
    profileImageBase64: nurseAvatar1,
    profileImageName: 'reem_aldhaheri.png',
    blsCertName: 'BLS_Reem_AlDhaheri.pdf',
    vaccinationCertName: 'Vaccination_Reem_AlDhaheri.pdf',
    passportCertName: 'Passport_Reem_AlDhaheri.pdf',
    emiratesIdCertName: 'EmiratesID_Reem_AlDhaheri.pdf',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'an-003',
    role: 'assistant_nurse',
    name: 'Joy Martinez',
    age: 25,
    copyId: '784-2001-5544332-0',
    profileImageBase64: nurseAvatar3,
    profileImageName: 'joy_martinez.png',
    blsCertName: 'BLS_Joy_Martinez.pdf',
    vaccinationCertName: 'Vaccination_Joy_Martinez.pdf',
    passportCertName: 'Passport_Joy_Martinez.pdf',
    emiratesIdCertName: 'EmiratesID_Joy_Martinez.pdf',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'an-004',
    role: 'assistant_nurse',
    name: 'Mariam Al-Kaabi',
    age: 22,
    copyId: '784-2004-1234567-0',
    profileImageBase64: nurseAvatar2,
    profileImageName: 'mariam_alkaabi.png',
    blsCertName: 'BLS_Mariam_AlKaabi.pdf',
    vaccinationCertName: 'Vaccination_Mariam_AlKaabi.pdf',
    passportCertName: 'Passport_Mariam_AlKaabi.pdf',
    emiratesIdCertName: 'EmiratesID_Mariam_AlKaabi.pdf',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'an-005',
    role: 'assistant_nurse',
    name: 'Aisha Yusuf',
    age: 24,
    copyId: '784-2002-7788990-0',
    profileImageBase64: nurseAvatar4,
    profileImageName: 'aisha_yusuf.png',
    blsCertName: 'BLS_Aisha_Yusuf.pdf',
    vaccinationCertName: 'Vaccination_Aisha_Yusuf.pdf',
    passportCertName: 'Passport_Aisha_Yusuf.pdf',
    emiratesIdCertName: 'EmiratesID_Aisha_Yusuf.pdf',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to generate UUIDs safely in any browser environment
const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return 'nurse-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function App() {
  // Global States
  const [auth, setAuth] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(!!getCookie('auth_token'));
  const [page, setPage] = useState('dashboard');
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modals focus targets
  const [viewingNurse, setViewingNurse] = useState<Nurse | null>(null);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [deletingNurse, setDeletingNurse] = useState<Nurse | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addRole, setAddRole] = useState<StaffRole>('registered_nurse');

  // Fetch staff list from backend API
  const fetchStaff = async () => {
    try {
      const staffList = await getAllStaffAPI();
      const mapped = staffList.map(mapBackendToFrontend);
      setNurses(mapped);
    } catch (err: any) {
      addToast('Error fetching staff list', 'error', err.message);
    }
  };

  // Verify auth session on load
  useEffect(() => {
    const verifySession = async () => {
      const token = getCookie('auth_token');
      if (token) {
        try {
          const res = await getMeAPI();
          if (res.success && res.data) {
            setAuth({
              email: res.data.email,
              name: res.data.name,
            });
          } else {
            eraseCookie('auth_token');
            setAuth(null);
          }
        } catch (err) {
          console.error('Session verification failed:', err);
          eraseCookie('auth_token');
          setAuth(null);
        }
      }
      setIsAuthLoading(false);
    };

    verifySession();
  }, []);

  // Fetch staff list when authenticated
  useEffect(() => {
    if (auth) {
      fetchStaff();
    } else {
      setNurses([]);
    }
  }, [auth]);

  // Toast controls
  const addToast = (
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'success', 
    description = ''
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Auth Operations
  const handleLogin = (userData: User) => {
    setAuth(userData);
    addToast('Welcome back!', 'success', `Signed in as ${userData.email}`);
  };

  const handleLogout = () => {
    eraseCookie('auth_token');
    setAuth(null);
    setPage('dashboard');
    addToast('Signed out successfully', 'info');
  };

  const getRoleLabel = (role: StaffRole) => {
    switch (role) {
      case 'registered_nurse': return 'Registered Nurse';
      case 'assistant_nurse': return 'Assistant Nurse';
      case 'general_dr': return 'General Dr';
      default: return 'Staff Member';
    }
  };

  // CRUD Operations
  const handleAddNurse = async (newNurseData: NurseSaveData) => {
    try {
      const formData = new FormData();
      formData.append('name', newNurseData.name);
      formData.append('age', String(newNurseData.age));
      formData.append('role', newNurseData.role);
      formData.append('idNumber', newNurseData.copyId);

      if (newNurseData.profileImageFile) {
        formData.append('profileImage', newNurseData.profileImageFile);
      }
      if (newNurseData.passportCertFile) {
        formData.append('copyPassport', newNurseData.passportCertFile);
      }
      if (newNurseData.emiratesIdCertFile) {
        formData.append('emiratesId', newNurseData.emiratesIdCertFile);
      }
      if (newNurseData.blsCertFile) {
        formData.append('blsCertificate', newNurseData.blsCertFile);
      }
      if (newNurseData.vaccinationCertFile) {
        formData.append('vaccination', newNurseData.vaccinationCertFile);
      }
      if (newNurseData.aclsCertFile) {
        formData.append('aclsCertificate', newNurseData.aclsCertFile);
      }
      if (newNurseData.infectionControlCertFile) {
        formData.append('infectionControlCertificate', newNurseData.infectionControlCertFile);
      }

      await createStaffAPI(formData);
      setIsAddModalOpen(false); // Close the modal
      setPage(newNurseData.role); // Redirect to directory of the added role
      addToast('Profile saved!', 'success', `${newNurseData.name} has been added to the database.`);
      
      // Refresh staff list
      await fetchStaff();
    } catch (err: any) {
      addToast('Failed to save profile', 'error', err.message);
    }
  };

  const handleEditNurse = async (updatedNurseData: NurseSaveData) => {
    if (!editingNurse) return;
    try {
      const formData = new FormData();
      formData.append('name', updatedNurseData.name);
      formData.append('age', String(updatedNurseData.age));
      formData.append('role', updatedNurseData.role);
      formData.append('idNumber', updatedNurseData.copyId);

      if (updatedNurseData.profileImageFile) {
        formData.append('profileImage', updatedNurseData.profileImageFile);
      }
      if (updatedNurseData.passportCertFile) {
        formData.append('copyPassport', updatedNurseData.passportCertFile);
      }
      if (updatedNurseData.emiratesIdCertFile) {
        formData.append('emiratesId', updatedNurseData.emiratesIdCertFile);
      }
      if (updatedNurseData.blsCertFile) {
        formData.append('blsCertificate', updatedNurseData.blsCertFile);
      }
      if (updatedNurseData.vaccinationCertFile) {
        formData.append('vaccination', updatedNurseData.vaccinationCertFile);
      }
      if (updatedNurseData.aclsCertFile) {
        formData.append('aclsCertificate', updatedNurseData.aclsCertFile);
      }
      if (updatedNurseData.infectionControlCertFile) {
        formData.append('infectionControlCertificate', updatedNurseData.infectionControlCertFile);
      }

      await updateStaffAPI(editingNurse.id, formData);
      setEditingNurse(null); // Close modal
      addToast('Profile saved!', 'success', `Profile details for ${updatedNurseData.name} updated.`);
      
      // Refresh staff list
      await fetchStaff();
    } catch (err: any) {
      addToast('Failed to update profile', 'error', err.message);
    }
  };

  const handleDeleteNurse = async () => {
    if (!deletingNurse) return;
    try {
      await deleteStaffAPI(deletingNurse.id);
      addToast('Profile deleted!', 'success', `${deletingNurse.name} has been removed from the database.`);
      setDeletingNurse(null); // Close modal
      
      // Refresh staff list
      await fetchStaff();
    } catch (err: any) {
      addToast('Failed to delete profile', 'error', err.message);
    }
  };

  // Render loading screen while validating cookie token session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-semibold text-gray-500">Checking credentials...</span>
        </div>
      </div>
    );
  }

  // Render auth state if unauthenticated
  if (!auth) {
    return (
      <>
        <Login onLoginSuccess={handleLogin} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // Render layout if authenticated
  return (
    <>
      <DashboardLayout
        user={auth}
        currentPage={page}
        setCurrentPage={setPage}
        onLogout={handleLogout}
      >
        {page === 'dashboard' && (
          <DashboardHome 
            nurses={nurses} 
            setCurrentPage={setPage} 
            onAddClick={(role) => {
              setAddRole(role || 'registered_nurse');
              setIsAddModalOpen(true);
            }}
          />
        )}

        {(page === 'registered_nurse' || page === 'assistant_nurse' || page === 'general_dr') && (
          <NursesTable
            nurses={nurses}
            role={page as StaffRole}
            onView={setViewingNurse}
            onEdit={setEditingNurse}
            onDelete={setDeletingNurse}
            setCurrentPage={setPage}
            onAddClick={() => {
              setAddRole(page as StaffRole);
              setIsAddModalOpen(true);
            }}
          />
        )}
      </DashboardLayout>

      {/* Render Modals */}
      <AddModal
        isOpen={isAddModalOpen}
        role={addRole}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNurse}
      />

      <ViewModal
        isOpen={viewingNurse !== null}
        onClose={() => setViewingNurse(null)}
        nurse={viewingNurse}
      />

      <EditModal
        isOpen={editingNurse !== null}
        onClose={() => setEditingNurse(null)}
        nurse={editingNurse}
        onSave={handleEditNurse}
      />

      <DeleteModal
        isOpen={deletingNurse !== null}
        onClose={() => setDeletingNurse(null)}
        nurse={deletingNurse}
        onDeleteConfirm={handleDeleteNurse}
      />

      {/* Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

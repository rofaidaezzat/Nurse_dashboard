import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import NursesTable from './components/NursesTable';
import ToastContainer from './components/Toast';
import { ViewModal, EditModal, DeleteModal, AddModal } from './components/Modals';
import nurseAvatar1 from './assets/nurse_avatar_1.png';
import nurseAvatar2 from './assets/nurse_avatar_2.png';
import nurseAvatar3 from './assets/nurse_avatar_3.png';
import nurseAvatar4 from './assets/nurse_avatar_4.png';

const DEFAULT_NURSES = [
  {
    id: 'nurse-default-1',
    name: 'Sarah Jenkins',
    dhaNumber: 'DHA-84729104',
    age: 29,
    nationalId: '784199512345678',
    profileImageBase64: nurseAvatar1,
    profileImageName: 'sarah_jenkins_headshot.png',
    dhaCertName: 'DHA_License_Sarah_Jenkins.pdf',
    plsCertName: 'PLS_Cert_Sarah_Jenkins.pdf',
    otherCertName: 'ACLS_Specialist_Certificate.pdf',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'nurse-default-2',
    name: 'Michael Chen',
    dhaNumber: 'DHA-93018247',
    age: 34,
    nationalId: '784199098765432',
    profileImageBase64: nurseAvatar2,
    profileImageName: 'michael_chen_headshot.png',
    dhaCertName: 'DHA_License_Michael_Chen.pdf',
    plsCertName: 'PLS_Cert_Michael_Chen.pdf',
    otherCertName: '',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'nurse-default-3',
    name: 'Amina Al-Mansoori',
    dhaNumber: 'DHA-72918340',
    age: 31,
    nationalId: '784200012345678',
    profileImageBase64: nurseAvatar3,
    profileImageName: 'amina_al_mansoori_headshot.png',
    dhaCertName: 'DHA_License_Amina_Al_Mansoori.pdf',
    plsCertName: 'PLS_Cert_Amina_Al_Mansoori.pdf',
    otherCertName: 'Pediatric_Advanced_Life_Support.pdf',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'nurse-default-4',
    name: 'Linh Nguyen',
    dhaNumber: 'DHA-61029483',
    age: 27,
    nationalId: '784199855443322',
    profileImageBase64: nurseAvatar4,
    profileImageName: 'linh_nguyen_headshot.png',
    dhaCertName: 'DHA_License_Linh_Nguyen.pdf',
    plsCertName: 'PLS_Cert_Linh_Nguyen.pdf',
    otherCertName: '',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
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
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('nurse_dashboard_auth');
    return stored ? JSON.parse(stored) : null;
  });

  const [page, setPage] = useState('dashboard');
  
  const [nurses, setNurses] = useState(() => {
    const stored = localStorage.getItem('nurse_dashboard_nurses_v2');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
    return DEFAULT_NURSES;
  });

  const [toasts, setToasts] = useState([]);
  
  // Modals focus targets
  const [viewingNurse, setViewingNurse] = useState(null);
  const [editingNurse, setEditingNurse] = useState(null);
  const [deletingNurse, setDeletingNurse] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync nurses database with LocalStorage
  useEffect(() => {
    localStorage.setItem('nurse_dashboard_nurses_v2', JSON.stringify(nurses));
  }, [nurses]);

  // Toast controls
  const addToast = (message, type = 'success', description = '') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, description }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Auth Operations
  const handleLogin = (userData) => {
    localStorage.setItem('nurse_dashboard_auth', JSON.stringify(userData));
    setAuth(userData);
    addToast('Welcome back!', 'success', `Signed in as ${userData.email}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('nurse_dashboard_auth');
    setAuth(null);
    setPage('dashboard');
    addToast('Signed out successfully', 'info');
  };

  // CRUD Operations
  const handleAddNurse = (newNurseData) => {
    const newNurse = {
      id: generateUUID(),
      ...newNurseData,
      createdAt: new Date().toISOString()
    };
    
    setNurses((prev) => [newNurse, ...prev]);
    setIsAddModalOpen(false); // Close the modal
    setPage('nurses'); // Redirect to listing directory
    addToast('Nurse saved!', 'success', `${newNurseData.name} has been added to the registry.`);
  };

  const handleEditNurse = (updatedNurseData) => {
    setNurses((prev) => prev.map(n => n.id === editingNurse.id ? { ...n, ...updatedNurseData } : n));
    setEditingNurse(null); // Close modal
    addToast('Nurse saved!', 'success', `Profile details for ${updatedNurseData.name} updated.`);
  };

  const handleDeleteNurse = () => {
    if (!deletingNurse) return;
    
    setNurses((prev) => prev.filter(n => n.id !== deletingNurse.id));
    addToast('Nurse deleted!', 'success', `${deletingNurse.name} has been removed from the registry.`);
    setDeletingNurse(null); // Close modal
  };

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
            onAddClick={() => setIsAddModalOpen(true)}
          />
        )}

        {page === 'nurses' && (
          <NursesTable
            nurses={nurses}
            onView={setViewingNurse}
            onEdit={setEditingNurse}
            onDelete={setDeletingNurse}
            setCurrentPage={setPage}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        )}
      </DashboardLayout>

      {/* Render Modals */}
      <AddModal
        isOpen={isAddModalOpen}
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

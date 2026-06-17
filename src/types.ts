export type StaffRole = 'assistant_nurse' | 'registered_nurse' | 'general_dr';

export interface Nurse {
  id: string;
  role: StaffRole;
  name: string;
  age: number;
  profileImageBase64: string;
  profileImageName: string;
  createdAt: string;
  dhaNumber?: string;
  nationalId?: string;
  copyId?: string;
  
  // Custom document fields based on roles
  aclsCertName?: string;
  blsCertName?: string;
  vaccinationCertName?: string;
  infectionControlCertName?: string;
  passportCertName?: string;
  emiratesIdCertName?: string;
  
  // Backward compatibility with legacy fields
  dhaCertName?: string;
  plsCertName?: string;
  otherCertName?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  description?: string;
}

export interface User {
  email: string;
  name: string;
}

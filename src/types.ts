export interface Nurse {
  id: string;
  name: string;
  dhaNumber: string;
  age: number;
  nationalId: string;
  profileImageBase64: string;
  profileImageName: string;
  dhaCertName: string;
  plsCertName: string;
  otherCertName: string;
  createdAt: string;
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

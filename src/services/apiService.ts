import { API_BASE_URL } from '../config';
import { getCookie } from '../utils/cookieUtils';
import { Nurse, StaffRole } from '../types';

export interface BackendFile {
  url?: string;
  publicId?: string;
}

export interface BackendStaff {
  _id: string;
  name: string;
  age: number;
  role: 'registered_nurse' | 'general_dr' | 'assistant_nurse';
  idNumber: string;
  profileImage?: BackendFile;
  aclsCertificate?: BackendFile;
  blsCertificate?: BackendFile;
  vaccination?: BackendFile;
  infectionControlCertificate?: BackendFile;
  copyId?: BackendFile;
  copyPassport?: BackendFile;
  passportPhoto?: BackendFile;
  emiratesId?: BackendFile;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps backend staff document objects back to the frontend's Nurse model
 */
export const mapBackendToFrontend = (staff: BackendStaff): Nurse => {
  return {
    id: staff._id,
    role: staff.role as StaffRole,
    name: staff.name,
    age: staff.age,
    copyId: staff.idNumber, // Maps backend idNumber string field to frontend copyId
    
    // We map the URLs directly so they can be rendered in image components and download links
    profileImageBase64: staff.profileImage?.url || '',
    profileImageName: staff.profileImage?.publicId || '',
    
    aclsCertName: staff.aclsCertificate?.url || '',
    blsCertName: staff.blsCertificate?.url || '',
    vaccinationCertName: staff.vaccination?.url || '',
    infectionControlCertName: staff.infectionControlCertificate?.url || '',
    passportCertName: staff.copyPassport?.url || '',
    emiratesIdCertName: staff.emiratesId?.url || '',
    
    createdAt: staff.createdAt,
  };
};

/**
 * Generate Authorization Headers with JWT from cookies
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = getCookie('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handle API responses and throw informative errors
 */
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }
  return data;
};

/**
 * API Calls
 */

export const loginAPI = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const getMeAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
};

export const getAllStaffAPI = async (role?: StaffRole): Promise<BackendStaff[]> => {
  // Pass limit=1000 to fetch all records in this layout
  let url = `${API_BASE_URL}/api/v1/staff?limit=1000`;
  if (role) {
    url += `&role=${role}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });
  const res = await handleResponse(response);
  return res.data;
};

export const createStaffAPI = async (formData: FormData): Promise<BackendStaff> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/staff`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      // Note: Do NOT set Content-Type header when sending FormData; 
      // the browser will automatically set it along with the multipart boundary
    },
    body: formData,
  });
  const res = await handleResponse(response);
  return res.data;
};

export const updateStaffAPI = async (id: string, formData: FormData): Promise<BackendStaff> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/staff/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });
  const res = await handleResponse(response);
  return res.data;
};

export const deleteStaffAPI = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/staff/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });
  await handleResponse(response);
};

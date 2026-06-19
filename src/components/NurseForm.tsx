import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, RotateCcw, Save } from 'lucide-react';
import { Nurse, StaffRole, NurseSaveData } from '../types';

interface NurseFormProps {
  initialData?: Nurse | null;
  role?: StaffRole;
  onSave: (record: NurseSaveData) => void;
  onCancel?: (() => void) | null;
  submitButtonLabel?: string;
}

interface FormErrors {
  name?: string | null;
  age?: string | null;
  copyId?: string | null;
  profileImage?: string | null;
  aclsCert?: string | null;
  blsCert?: string | null;
  vaccinationCert?: string | null;
  infectionControlCert?: string | null;
  passportCert?: string | null;
  emiratesIdCert?: string | null;
}

export default function NurseForm({ 
  initialData = null, 
  role,
  onSave, 
  onCancel = null, 
  submitButtonLabel = "Save Record" 
}: NurseFormProps) {
  // Determine active role based on prop or initial data
  const activeRole = role || initialData?.role || 'registered_nurse';

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [copyId, setCopyId] = useState('');
  
  // File states
  const [profileImageBase64, setProfileImageBase64] = useState('');
  const [profileImageName, setProfileImageName] = useState('');
  
  const [aclsCertName, setAclsCertName] = useState('');
  const [blsCertName, setBlsCertName] = useState('');
  const [vaccinationCertName, setVaccinationCertName] = useState('');
  const [infectionControlCertName, setInfectionControlCertName] = useState('');
  const [passportCertName, setPassportCertName] = useState('');
  const [emiratesIdCertName, setEmiratesIdCertName] = useState('');

  // Raw file objects for upload
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [aclsCertFile, setAclsCertFile] = useState<File | null>(null);
  const [blsCertFile, setBlsCertFile] = useState<File | null>(null);
  const [vaccinationCertFile, setVaccinationCertFile] = useState<File | null>(null);
  const [infectionControlCertFile, setInfectionControlCertFile] = useState<File | null>(null);
  const [passportCertFile, setPassportCertFile] = useState<File | null>(null);
  const [emiratesIdCertFile, setEmiratesIdCertFile] = useState<File | null>(null);
  
  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // File input refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const aclsInputRef = useRef<HTMLInputElement>(null);
  const blsInputRef = useRef<HTMLInputElement>(null);
  const vaccinationInputRef = useRef<HTMLInputElement>(null);
  const infectionControlInputRef = useRef<HTMLInputElement>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);
  const emiratesIdInputRef = useRef<HTMLInputElement>(null);

  // Load initial data for editing mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAge(String(initialData.age) || '');
      setCopyId(initialData.copyId || '');
      setProfileImageBase64(initialData.profileImageBase64 || '');
      setProfileImageName(initialData.profileImageName || 'Current Profile Photo');
      
      // Load certs with legacy fallbacks for default data
      setAclsCertName(initialData.aclsCertName || initialData.otherCertName || '');
      setBlsCertName(initialData.blsCertName || initialData.plsCertName || '');
      setVaccinationCertName(initialData.vaccinationCertName || '');
      setInfectionControlCertName(initialData.infectionControlCertName || '');
      setPassportCertName(initialData.passportCertName || '');
      setEmiratesIdCertName(initialData.emiratesIdCertName || initialData.dhaCertName || '');
    }
  }, [initialData]);

  // Read profile image to base64
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Please upload an image file (PNG, JPG, etc.)' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageBase64(reader.result as string);
        setProfileImageName(file.name);
        setProfileImageFile(file);
        setErrors(prev => ({ ...prev, profileImage: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFileName: (name: string) => void, 
    fieldKey: keyof FormErrors
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setErrors(prev => ({ ...prev, [fieldKey]: null }));
      
      // Keep track of the raw file
      if (fieldKey === 'passportCert') setPassportCertFile(file);
      else if (fieldKey === 'emiratesIdCert') setEmiratesIdCertFile(file);
      else if (fieldKey === 'blsCert') setBlsCertFile(file);
      else if (fieldKey === 'vaccinationCert') setVaccinationCertFile(file);
      else if (fieldKey === 'aclsCert') setAclsCertFile(file);
      else if (fieldKey === 'infectionControlCert') setInfectionControlCertFile(file);
    }
  };

  const handleReset = () => {
    if (initialData) {
      setName(initialData.name || '');
      setAge(String(initialData.age) || '');
      setCopyId(initialData.copyId || '');
      setProfileImageBase64(initialData.profileImageBase64 || '');
      setProfileImageName(initialData.profileImageName || 'Current Profile Photo');
      
      setAclsCertName(initialData.aclsCertName || initialData.otherCertName || '');
      setBlsCertName(initialData.blsCertName || initialData.plsCertName || '');
      setVaccinationCertName(initialData.vaccinationCertName || '');
      setInfectionControlCertName(initialData.infectionControlCertName || '');
      setPassportCertName(initialData.passportCertName || '');
      setEmiratesIdCertName(initialData.emiratesIdCertName || initialData.dhaCertName || '');
    } else {
      setName('');
      setAge('');
      setCopyId('');
      setProfileImageBase64('');
      setProfileImageName('');
      setAclsCertName('');
      setBlsCertName('');
      setVaccinationCertName('');
      setInfectionControlCertName('');
      setPassportCertName('');
      setEmiratesIdCertName('');
    }

    // Reset raw file objects
    setProfileImageFile(null);
    setAclsCertFile(null);
    setBlsCertFile(null);
    setVaccinationCertFile(null);
    setInfectionControlCertFile(null);
    setPassportCertFile(null);
    setEmiratesIdCertFile(null);
    
    // Clear actual input file values
    if (profileInputRef.current) profileInputRef.current.value = '';
    if (aclsInputRef.current) aclsInputRef.current.value = '';
    if (blsInputRef.current) blsInputRef.current.value = '';
    if (vaccinationInputRef.current) vaccinationInputRef.current.value = '';
    if (infectionControlInputRef.current) infectionControlInputRef.current.value = '';
    if (passportInputRef.current) passportInputRef.current.value = '';
    if (emiratesIdInputRef.current) emiratesIdInputRef.current.value = '';
    
    setErrors({});
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    else if (name.trim().length < 3) newErrors.name = 'Full name must be at least 3 characters';

    if (!age) newErrors.age = 'Age is required';
    else {
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 80) {
        newErrors.age = 'Age must be a positive number between 18 and 80';
      }
    }

    if (!profileImageBase64) newErrors.profileImage = 'Profile image is required';
    
    // Role-specific validation
    const isAssistant = activeRole === 'assistant_nurse';

    if (!copyId.trim()) newErrors.copyId = 'Copy ID is required';

    // All PDF documents are optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const isAssistant = activeRole === 'assistant_nurse';

    const record: NurseSaveData = {
      role: activeRole,
      name: name.trim(),
      age: parseInt(age, 10),
      copyId: copyId.trim(),
      
      // Raw files
      profileImageFile,
      aclsCertFile: isAssistant ? null : aclsCertFile,
      blsCertFile,
      vaccinationCertFile,
      infectionControlCertFile: isAssistant ? null : infectionControlCertFile,
      passportCertFile,
      emiratesIdCertFile,
      
      // Existing metadata (or base64/URLs)
      profileImageBase64,
      profileImageName,
      aclsCertName: isAssistant ? '' : aclsCertName,
      blsCertName,
      vaccinationCertName,
      infectionControlCertName: isAssistant ? '' : infectionControlCertName,
      passportCertName,
      emiratesIdCertName,
    };

    onSave(record);
  };

  const isAssistant = activeRole === 'assistant_nurse';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: null }));
            }}
            placeholder="e.g. Jane Doe"
            className={`block w-full px-4 py-2.5 rounded-xl border ${
              errors.name ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500 focus:border-sky-500'
            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm`}
          />
          {errors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>}
        </div>

        {/* Age */}
        <div className="space-y-1">
          <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
            Age <span className="text-rose-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            min="18"
            max="80"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              if (errors.age) setErrors(prev => ({ ...prev, age: null }));
            }}
            placeholder="e.g. 28"
            className={`block w-full px-4 py-2.5 rounded-xl border ${
              errors.age ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500 focus:border-sky-500'
            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm`}
          />
          {errors.age && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.age}</p>}
        </div>

        {/* Copy ID (All roles now) */}
        <div className="space-y-1">
          <label htmlFor="copyId" className="block text-sm font-semibold text-gray-700">
            Copy ID <span className="text-rose-500">*</span>
          </label>
          <input
            id="copyId"
            type="text"
            value={copyId}
            onChange={(e) => {
              setCopyId(e.target.value);
              if (errors.copyId) setErrors(prev => ({ ...prev, copyId: null }));
            }}
            placeholder="e.g. 784-1990-1234567-1"
            className={`block w-full px-4 py-2.5 rounded-xl border ${
              errors.copyId ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500 focus:border-sky-500'
            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm`}
          />
          {errors.copyId && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.copyId}</p>}
        </div>

      </div>

      {/* File Upload Section */}
      <div className="space-y-6 pt-2">
        <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Profile Picture & Required Documents</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Profile Photo <span className="text-rose-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-1">(white background required)</span>
            </label>
            
            <div className="flex gap-4 items-center">
              {profileImageBase64 ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-sky-500 bg-gray-50 flex-shrink-0">
                  <img
                    src={profileImageBase64}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImageBase64('');
                      setProfileImageName('');
                      setProfileImageFile(null);
                      if (profileInputRef.current) profileInputRef.current.value = '';
                    }}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50/50 flex-shrink-0">
                  <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                </div>
              )}

              <div className="flex-grow">
                <label className="relative flex flex-col items-center justify-center px-4 py-4 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                    <span className="text-xs font-semibold text-sky-600">Click to upload image</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG up to 2MB</span>
                  </div>
                  <input
                    type="file"
                    ref={profileInputRef}
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {errors.profileImage && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.profileImage}</p>}
            {profileImageName && !errors.profileImage && (
              <p className="text-[11px] text-gray-500 font-mono truncate">{profileImageName}</p>
            )}
          </div>

          {/* Copy of Passport */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Copy of Passport
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                  <span className="text-xs font-semibold text-sky-600">Select Passport File</span>
                </div>
                <input
                  type="file"
                  ref={passportInputRef}
                  onChange={(e) => handleFileChange(e, setPassportCertName, 'passportCert')}
                  className="hidden"
                />
              </label>

              {passportCertName && (
                <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate font-medium">{passportCertName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPassportCertName('');
                      setPassportCertFile(null);
                      if (passportInputRef.current) passportInputRef.current.value = '';
                    }}
                    className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {errors.passportCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.passportCert}</p>}
          </div>

          {/* Copy of Emirates ID */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Copy of Emirates ID
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                  <span className="text-xs font-semibold text-sky-600">Select Emirates ID File</span>
                </div>
                <input
                  type="file"
                  ref={emiratesIdInputRef}
                  onChange={(e) => handleFileChange(e, setEmiratesIdCertName, 'emiratesIdCert')}
                  className="hidden"
                />
              </label>

              {emiratesIdCertName && (
                <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate font-medium">{emiratesIdCertName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmiratesIdCertName('');
                      setEmiratesIdCertFile(null);
                      if (emiratesIdInputRef.current) emiratesIdInputRef.current.value = '';
                    }}
                    className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {errors.emiratesIdCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.emiratesIdCert}</p>}
          </div>

          {/* BLS Certificate */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              BLS Certificate
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                  <span className="text-xs font-semibold text-sky-600">Select BLS File</span>
                </div>
                <input
                  type="file"
                  ref={blsInputRef}
                  onChange={(e) => handleFileChange(e, setBlsCertName, 'blsCert')}
                  className="hidden"
                />
              </label>

              {blsCertName && (
                <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate font-medium">{blsCertName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBlsCertName('');
                      setBlsCertFile(null);
                      if (blsInputRef.current) blsInputRef.current.value = '';
                    }}
                    className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {errors.blsCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.blsCert}</p>}
          </div>

          {/* Vaccination Records */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {isAssistant ? 'Vaccination Records' : 'Vaccination Certificate'}
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                  <span className="text-xs font-semibold text-sky-600">Select Vaccination File</span>
                </div>
                <input
                  type="file"
                  ref={vaccinationInputRef}
                  onChange={(e) => handleFileChange(e, setVaccinationCertName, 'vaccinationCert')}
                  className="hidden"
                />
              </label>

              {vaccinationCertName && (
                <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate font-medium">{vaccinationCertName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVaccinationCertName('');
                      setVaccinationCertFile(null);
                      if (vaccinationInputRef.current) vaccinationInputRef.current.value = '';
                    }}
                    className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {errors.vaccinationCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.vaccinationCert}</p>}
          </div>

          {/* Role-Specific Files (ACLS, Infection Control) */}
          {!isAssistant && (
            <>
              {/* ACLS Certificate */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  ACLS Certificate
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                      <span className="text-xs font-semibold text-sky-600">Select ACLS File</span>
                    </div>
                    <input
                      type="file"
                      ref={aclsInputRef}
                      onChange={(e) => handleFileChange(e, setAclsCertName, 'aclsCert')}
                      className="hidden"
                    />
                  </label>

                  {aclsCertName && (
                    <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                        <span className="truncate font-medium">{aclsCertName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAclsCertName('');
                          setAclsCertFile(null);
                          if (aclsInputRef.current) aclsInputRef.current.value = '';
                        }}
                        className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.aclsCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.aclsCert}</p>}
              </div>

              {/* Infection Control Certificate */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Infection Control Certificate
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                      <span className="text-xs font-semibold text-sky-600">Select Infection Control File</span>
                    </div>
                    <input
                      type="file"
                      ref={infectionControlInputRef}
                      onChange={(e) => handleFileChange(e, setInfectionControlCertName, 'infectionControlCert')}
                      className="hidden"
                    />
                  </label>

                  {infectionControlCertName && (
                    <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                        <span className="truncate font-medium">{infectionControlCertName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setInfectionControlCertName('');
                          setInfectionControlCertFile(null);
                          if (infectionControlInputRef.current) infectionControlInputRef.current.value = '';
                        }}
                        className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.infectionControlCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.infectionControlCert}</p>}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-150">
        <button
          type="submit"
          className="flex-grow flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-100 active:scale-[0.98] transition-all"
        >
          <Save className="w-4 h-4" />
          {submitButtonLabel}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-3 border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
      </div>

    </form>
  );
}

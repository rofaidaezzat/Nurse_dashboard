import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, RotateCcw, Save } from 'lucide-react';

export default function NurseForm({ initialData = null, onSave, onCancel = null, submitButtonLabel = "Save Nurse" }) {
  const [name, setName] = useState('');
  const [dhaNumber, setDhaNumber] = useState('');
  const [age, setAge] = useState('');
  const [nationalId, setNationalId] = useState('');
  
  // File states
  const [profileImageBase64, setProfileImageBase64] = useState('');
  const [profileImageName, setProfileImageName] = useState('');
  const [dhaCertName, setDhaCertName] = useState('');
  const [plsCertName, setPlsCertName] = useState('');
  const [otherCertName, setOtherCertName] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState({});

  // File input refs for clearing
  const profileInputRef = useRef(null);
  const dhaInputRef = useRef(null);
  const plsInputRef = useRef(null);
  const otherInputRef = useRef(null);

  // Load initial data for editing mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDhaNumber(initialData.dhaNumber || '');
      setAge(initialData.age || '');
      setNationalId(initialData.nationalId || '');
      setProfileImageBase64(initialData.profileImageBase64 || '');
      setProfileImageName(initialData.profileImageName || 'Current Profile Photo');
      setDhaCertName(initialData.dhaCertName || '');
      setPlsCertName(initialData.plsCertName || '');
      setOtherCertName(initialData.otherCertName || '');
    }
  }, [initialData]);

  // Read profile image to base64
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Please upload an image file (PNG, JPG, etc.)' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageBase64(reader.result);
        setProfileImageName(file.name);
        setErrors(prev => ({ ...prev, profileImage: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e, setFileName, fieldKey) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setErrors(prev => ({ ...prev, [fieldKey]: null }));
    }
  };

  const handleReset = () => {
    if (initialData) {
      // Revert to initialData if editing
      setName(initialData.name || '');
      setDhaNumber(initialData.dhaNumber || '');
      setAge(initialData.age || '');
      setNationalId(initialData.nationalId || '');
      setProfileImageBase64(initialData.profileImageBase64 || '');
      setProfileImageName(initialData.profileImageName || 'Current Profile Photo');
      setDhaCertName(initialData.dhaCertName || '');
      setPlsCertName(initialData.plsCertName || '');
      setOtherCertName(initialData.otherCertName || '');
    } else {
      // Clear all fields if adding
      setName('');
      dhaNumber && setDhaNumber('');
      setDhaNumber('');
      setAge('');
      setNationalId('');
      setProfileImageBase64('');
      setProfileImageName('');
      setDhaCertName('');
      setPlsCertName('');
      setOtherCertName('');
    }
    
    // Clear actual inputs
    if (profileInputRef.current) profileInputRef.current.value = '';
    if (dhaInputRef.current) dhaInputRef.current.value = '';
    if (plsInputRef.current) plsInputRef.current.value = '';
    if (otherInputRef.current) otherInputRef.current.value = '';
    
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    else if (name.trim().length < 3) newErrors.name = 'Full name must be at least 3 characters';

    if (!dhaNumber.trim()) newErrors.dhaNumber = 'DHA License number is required';
    else if (!/^[A-Za-z0-9-/]+$/.test(dhaNumber)) newErrors.dhaNumber = 'Invalid license format';

    if (!age) newErrors.age = 'Age is required';
    else {
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 80) {
        newErrors.age = 'Age must be a positive number between 18 and 80';
      }
    }

    if (!nationalId.trim()) newErrors.nationalId = 'National ID is required';
    else if (!/^\d+$/.test(nationalId)) newErrors.nationalId = 'National ID must be numeric digits only';
    else if (nationalId.length < 5) newErrors.nationalId = 'National ID is too short';

    if (!profileImageBase64) newErrors.profileImage = 'Profile image is required';
    
    if (!dhaCertName) newErrors.dhaCert = 'DHA Certification is required';
    if (!plsCertName) newErrors.plsCert = 'PLS Certification is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const record = {
      name: name.trim(),
      dhaNumber: dhaNumber.trim().toUpperCase(),
      age: parseInt(age, 10),
      nationalId: nationalId.trim(),
      profileImageBase64,
      profileImageName,
      dhaCertName,
      plsCertName,
      otherCertName: otherCertName || '',
    };

    onSave(record);
  };

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

        {/* DHA License Number */}
        <div className="space-y-1">
          <label htmlFor="dhaNumber" className="block text-sm font-semibold text-gray-700">
            DHA License Number <span className="text-rose-500">*</span>
          </label>
          <input
            id="dhaNumber"
            type="text"
            value={dhaNumber}
            onChange={(e) => {
              setDhaNumber(e.target.value);
              if (errors.dhaNumber) setErrors(prev => ({ ...prev, dhaNumber: null }));
            }}
            placeholder="e.g. DHA-12345678"
            className={`block w-full px-4 py-2.5 rounded-xl border ${
              errors.dhaNumber ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500 focus:border-sky-500'
            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm`}
          />
          {errors.dhaNumber && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.dhaNumber}</p>}
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

        {/* National ID */}
        <div className="space-y-1">
          <label htmlFor="nationalId" className="block text-sm font-semibold text-gray-700">
            National ID <span className="text-rose-500">*</span>
          </label>
          <input
            id="nationalId"
            type="text"
            value={nationalId}
            onChange={(e) => {
              setNationalId(e.target.value);
              if (errors.nationalId) setErrors(prev => ({ ...prev, nationalId: null }));
            }}
            placeholder="e.g. 784199512345678"
            className={`block w-full px-4 py-2.5 rounded-xl border ${
              errors.nationalId ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500 focus:border-sky-500'
            } text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-sm`}
          />
          {errors.nationalId && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.nationalId}</p>}
        </div>

      </div>

      {/* File Upload Section */}
      <div className="space-y-6 pt-2">
        <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Profile Picture & Certifications</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Profile Photo <span className="text-rose-500">*</span>
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

          {/* DHA Certification */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              DHA Certification <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                  <span className="text-xs font-semibold text-sky-600">Select DHA File</span>
                </div>
                <input
                  type="file"
                  ref={dhaInputRef}
                  onChange={(e) => handleFileChange(e, setDhaCertName, 'dhaCert')}
                  className="hidden"
                />
              </label>

              {dhaCertName && (
                <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate font-medium">{dhaCertName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDhaCertName('');
                      if (dhaInputRef.current) dhaInputRef.current.value = '';
                    }}
                    className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {errors.dhaCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.dhaCert}</p>}
          </div>

          {/* PLS Certification */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              PLS Certification <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                  <span className="text-xs font-semibold text-sky-600">Select PLS File</span>
                </div>
                <input
                  type="file"
                  ref={plsInputRef}
                  onChange={(e) => handleFileChange(e, setPlsCertName, 'plsCert')}
                  className="hidden"
                />
              </label>

              {plsCertName && (
                <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate font-medium">{plsCertName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPlsCertName('');
                      if (plsInputRef.current) plsInputRef.current.value = '';
                    }}
                    className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {errors.plsCert && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.plsCert}</p>}
          </div>

          {/* Additional Certification */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Other Certification <span className="text-xs text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-grow relative flex items-center justify-center px-4 py-7 rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors group">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors mb-1" />
                  <span className="text-xs font-semibold text-sky-600">Select Other File</span>
                </div>
                <input
                  type="file"
                  ref={otherInputRef}
                  onChange={(e) => handleFileChange(e, setOtherCertName, 'otherCert')}
                  className="hidden"
                />
              </label>

              {otherCertName && (
                <div className="w-1/2 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between text-xs text-sky-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="truncate font-medium">{otherCertName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtherCertName('');
                      if (otherInputRef.current) otherInputRef.current.value = '';
                    }}
                    className="p-0.5 hover:bg-sky-100 rounded-lg text-sky-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

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

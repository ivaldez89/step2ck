'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserRole = 'premed' | 'medical-student' | 'resident' | 'fellow' | 'attending' | 'institution';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'premed',
    title: 'Pre-Med Student',
    description: 'Undergraduate preparing for medical school',
    icon: '📚',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'medical-student',
    title: 'Medical Student',
    description: 'MS1, MS2, MS3, or MS4',
    icon: '🩺',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'resident',
    title: 'Resident',
    description: 'In residency training',
    icon: '👨‍⚕️',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'fellow',
    title: 'Fellow',
    description: 'In fellowship training',
    icon: '🎓',
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 'attending',
    title: 'Attending / Faculty',
    description: 'Practicing physician or educator',
    icon: '👩‍🏫',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'institution',
    title: 'Institution',
    description: 'School administrator or wellness coordinator',
    icon: '🏛️',
    color: 'from-slate-600 to-slate-700',
  },
];

export default function RegisterPage() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    // Medical student specific
    currentYear: '',
    // Resident/Fellow specific
    specialty: '',
    pgyYear: '',
    // Institution specific
    jobTitle: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleBack = () => {
    setStep('role');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Map role to currentYear format for profile storage
      let currentYear: string | undefined;
      switch (selectedRole) {
        case 'premed':
          currentYear = 'Pre-Med';
          break;
        case 'medical-student':
          currentYear = formData.currentYear || 'MS1';
          break;
        case 'resident':
          currentYear = 'Resident';
          break;
        case 'fellow':
          currentYear = 'Fellow';
          break;
        case 'attending':
          currentYear = 'Attending';
          break;
        case 'institution':
          currentYear = 'Other';
          break;
      }

      // Create profile object
      const profile = {
        id: crypto.randomUUID(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        school: formData.institution,
        currentYear,
        role: selectedRole,
        // Additional fields based on role
        ...(selectedRole === 'resident' || selectedRole === 'fellow' ? {
          interestedSpecialties: formData.specialty ? [formData.specialty] : [],
          pgyYear: formData.pgyYear,
        } : {}),
        ...(selectedRole === 'institution' ? {
          jobTitle: formData.jobTitle,
        } : {}),
        profileVisibility: 'connections' as const,
        showStudyStats: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem('tribewellmd_user_profile', JSON.stringify(profile));

      // Set auth cookie
      document.cookie = 'tribewellmd-auth=authenticated; path=/; max-age=604800'; // 7 days

      // Redirect to profile page to complete setup
      router.push('/profile');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const selectedRoleData = roleOptions.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-2xl mb-4">
            <span className="text-4xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join TribeWellMD</h1>
          <p className="text-white/80">
            {step === 'role' ? 'Select your role to get started' : 'Tell us about yourself'}
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 'role' ? (
            /* Role Selection */
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">I am a...</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`
                      relative p-4 rounded-xl border-2 text-left transition-all duration-200
                      hover:border-teal-500 hover:shadow-lg hover:scale-[1.02]
                      ${selectedRole === role.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{role.title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6">
                <p className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Details Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to role selection
              </button>

              {/* Selected Role Badge */}
              {selectedRoleData && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedRoleData.color} text-white text-sm font-medium`}>
                  <span>{selectedRoleData.icon}</span>
                  <span>{selectedRoleData.title}</span>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  placeholder="john.doe@school.edu"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">Use your .edu email for automatic school verification</p>
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-slate-700 mb-2">
                  {selectedRole === 'institution' ? 'Institution Name' : 'School / Program'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="institution"
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  placeholder={selectedRole === 'institution' ? 'University of Example' : 'Example Medical School'}
                  required
                />
              </div>

              {/* Role-specific fields */}
              {selectedRole === 'medical-student' && (
                <div>
                  <label htmlFor="currentYear" className="block text-sm font-medium text-slate-700 mb-2">
                    Current Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="currentYear"
                    value={formData.currentYear}
                    onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    required
                  >
                    <option value="">Select your year...</option>
                    <option value="MS1">MS1 (First Year)</option>
                    <option value="MS2">MS2 (Second Year)</option>
                    <option value="MS3">MS3 (Third Year)</option>
                    <option value="MS4">MS4 (Fourth Year)</option>
                  </select>
                </div>
              )}

              {(selectedRole === 'resident' || selectedRole === 'fellow') && (
                <>
                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-slate-700 mb-2">
                      Specialty <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="specialty"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                      required
                    >
                      <option value="">Select specialty...</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                      <option value="Family Medicine">Family Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="OB/GYN">OB/GYN</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Anesthesiology">Anesthesiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pgyYear" className="block text-sm font-medium text-slate-700 mb-2">
                      PGY Year
                    </label>
                    <select
                      id="pgyYear"
                      value={formData.pgyYear}
                      onChange={(e) => setFormData({ ...formData, pgyYear: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    >
                      <option value="">Select PGY year...</option>
                      <option value="PGY-1">PGY-1</option>
                      <option value="PGY-2">PGY-2</option>
                      <option value="PGY-3">PGY-3</option>
                      <option value="PGY-4">PGY-4</option>
                      <option value="PGY-5">PGY-5</option>
                      <option value="PGY-6+">PGY-6+</option>
                    </select>
                  </div>
                </>
              )}

              {selectedRole === 'institution' && (
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    placeholder="Dean of Student Wellness"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-slate-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-teal-600 hover:text-teal-700">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-teal-600 hover:text-teal-700">Privacy Policy</Link>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-white/60">
          Built with care for medical students
        </p>
      </div>
    </div>
  );
}

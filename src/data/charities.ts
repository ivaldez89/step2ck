// Partner charities for TribeWellMD
// All partners are 501(c)(3) verified organizations

export interface Charity {
  id: string;
  name: string;
  shortName: string;
  description: string;
  mission: string;
  focus: string;
  icon: string;
  website: string;
  ein: string; // IRS Employer Identification Number for 501(c)(3) verification
  verified: boolean;
  featured: boolean;
  impactMetrics: {
    label: string;
    value: string;
  }[];
  categories: ('physician-wellness' | 'mental-health' | 'healthcare-access' | 'medical-education' | 'global-health')[];
}

export const PARTNER_CHARITIES: Charity[] = [
  {
    id: 'dr-lorna-breen',
    name: 'Dr. Lorna Breen Heroes Foundation',
    shortName: 'Dr. Breen Foundation',
    description: 'Reducing burnout in healthcare and safeguarding the well-being of healthcare professionals',
    mission: 'To reduce burnout in the health professional workforce and safeguard their well-being and job satisfaction.',
    focus: 'Physician Wellness',
    icon: '💜',
    website: 'https://drlornabreen.org',
    ein: '85-3879498',
    verified: true,
    featured: true,
    impactMetrics: [
      { label: 'Healthcare workers supported', value: '50,000+' },
      { label: 'States with legislation', value: '20+' },
      { label: 'Training programs', value: '100+' }
    ],
    categories: ['physician-wellness', 'mental-health']
  },
  {
    id: 'nami',
    name: 'NAMI (National Alliance on Mental Illness)',
    shortName: 'NAMI',
    description: 'Building better lives for Americans affected by mental illness',
    mission: 'To provide advocacy, education, support and public awareness so that all individuals and families affected by mental illness can build better lives.',
    focus: 'Mental Health',
    icon: '💚',
    website: 'https://nami.org',
    ein: '43-1201653',
    verified: true,
    featured: true,
    impactMetrics: [
      { label: 'People helped annually', value: '500,000+' },
      { label: 'Local affiliates', value: '600+' },
      { label: 'Crisis hotline calls', value: '1M+' }
    ],
    categories: ['mental-health']
  },
  {
    id: 'remote-area-medical',
    name: 'Remote Area Medical',
    shortName: 'RAM',
    description: 'Providing free healthcare to underserved communities',
    mission: 'To prevent pain and alleviate suffering by providing free quality healthcare to those in need.',
    focus: 'Healthcare Access',
    icon: '🏥',
    website: 'https://ramusa.org',
    ein: '58-1808756',
    verified: true,
    featured: true,
    impactMetrics: [
      { label: 'Patients served', value: '1M+' },
      { label: 'Services provided', value: '$200M+' },
      { label: 'Annual clinics', value: '60+' }
    ],
    categories: ['healthcare-access']
  },
  {
    id: 'snma',
    name: 'Student National Medical Association',
    shortName: 'SNMA',
    description: 'Supporting underrepresented minority medical students',
    mission: 'To support current and future underrepresented minority medical students, address the needs of underserved communities, and increase the number of clinically excellent, culturally competent and socially conscious physicians.',
    focus: 'Medical Education',
    icon: '🎓',
    website: 'https://snma.org',
    ein: '52-1136586',
    verified: true,
    featured: false,
    impactMetrics: [
      { label: 'Student members', value: '10,000+' },
      { label: 'Medical school chapters', value: '140+' },
      { label: 'Pipeline programs', value: '50+' }
    ],
    categories: ['medical-education']
  },
  {
    id: 'partners-in-health',
    name: 'Partners In Health',
    shortName: 'PIH',
    description: 'Bringing modern medical care to the world\'s poorest communities',
    mission: 'To provide a preferential option for the poor in health care by working in partnership with impoverished communities.',
    focus: 'Global Health',
    icon: '🌍',
    website: 'https://pih.org',
    ein: '04-3567502',
    verified: true,
    featured: true,
    impactMetrics: [
      { label: 'Countries served', value: '12' },
      { label: 'Patients annually', value: '2.5M+' },
      { label: 'Community health workers', value: '12,000+' }
    ],
    categories: ['global-health', 'healthcare-access']
  }
];

// Get charity by ID
export const getCharityById = (id: string): Charity | undefined => {
  return PARTNER_CHARITIES.find(c => c.id === id);
};

// Get charities by category
export const getCharitiesByCategory = (category: Charity['categories'][number]): Charity[] => {
  return PARTNER_CHARITIES.filter(c => c.categories.includes(category));
};

// Get featured charities
export const getFeaturedCharities = (): Charity[] => {
  return PARTNER_CHARITIES.filter(c => c.featured);
};

// Charity categories with metadata
export const CHARITY_CATEGORIES = {
  'physician-wellness': {
    id: 'physician-wellness',
    title: 'Physician Wellness',
    description: 'Supporting the mental health and wellbeing of healthcare workers',
    icon: '💜',
    color: 'from-purple-500 to-indigo-500'
  },
  'mental-health': {
    id: 'mental-health',
    title: 'Mental Health',
    description: 'Improving mental health awareness, treatment, and support',
    icon: '💚',
    color: 'from-green-500 to-emerald-500'
  },
  'healthcare-access': {
    id: 'healthcare-access',
    title: 'Healthcare Access',
    description: 'Providing medical care to underserved communities',
    icon: '🏥',
    color: 'from-blue-500 to-cyan-500'
  },
  'medical-education': {
    id: 'medical-education',
    title: 'Medical Education',
    description: 'Supporting medical students and training programs',
    icon: '🎓',
    color: 'from-amber-500 to-orange-500'
  },
  'global-health': {
    id: 'global-health',
    title: 'Global Health',
    description: 'Addressing health challenges worldwide',
    icon: '🌍',
    color: 'from-teal-500 to-cyan-500'
  }
} as const;

export type CharityCategoryId = keyof typeof CHARITY_CATEGORIES;

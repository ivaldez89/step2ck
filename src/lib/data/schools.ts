// Medical Schools, DO Schools, and Undergraduate Institutions Database

export type SchoolType = 'md' | 'do' | 'undergrad' | 'caribbean' | 'international';

export interface School {
  id: string;
  name: string;
  shortName?: string;
  type: SchoolType;
  state?: string;
  country: string;
  emailDomains: string[]; // Valid email domains for this school
}

// US MD Medical Schools (LCME Accredited)
export const MD_SCHOOLS: School[] = [
  { id: 'harvard-med', name: 'Harvard Medical School', shortName: 'HMS', type: 'md', state: 'MA', country: 'USA', emailDomains: ['hms.harvard.edu', 'harvard.edu'] },
  { id: 'stanford-med', name: 'Stanford University School of Medicine', shortName: 'Stanford', type: 'md', state: 'CA', country: 'USA', emailDomains: ['stanford.edu'] },
  { id: 'johns-hopkins', name: 'Johns Hopkins University School of Medicine', shortName: 'Hopkins', type: 'md', state: 'MD', country: 'USA', emailDomains: ['jhmi.edu', 'jhu.edu'] },
  { id: 'ucsf', name: 'University of California, San Francisco School of Medicine', shortName: 'UCSF', type: 'md', state: 'CA', country: 'USA', emailDomains: ['ucsf.edu'] },
  { id: 'ucla', name: 'David Geffen School of Medicine at UCLA', shortName: 'UCLA', type: 'md', state: 'CA', country: 'USA', emailDomains: ['mednet.ucla.edu', 'ucla.edu'] },
  { id: 'usc-keck', name: 'Keck School of Medicine of USC', shortName: 'USC Keck', type: 'md', state: 'CA', country: 'USA', emailDomains: ['usc.edu'] },
  { id: 'ucsd', name: 'UC San Diego School of Medicine', shortName: 'UCSD', type: 'md', state: 'CA', country: 'USA', emailDomains: ['ucsd.edu'] },
  { id: 'uci', name: 'UC Irvine School of Medicine', shortName: 'UCI', type: 'md', state: 'CA', country: 'USA', emailDomains: ['uci.edu'] },
  { id: 'ucdavis', name: 'UC Davis School of Medicine', shortName: 'UC Davis', type: 'md', state: 'CA', country: 'USA', emailDomains: ['ucdavis.edu'] },
  { id: 'ucr', name: 'UC Riverside School of Medicine', shortName: 'UCR', type: 'md', state: 'CA', country: 'USA', emailDomains: ['ucr.edu'] },
  { id: 'penn-med', name: 'Perelman School of Medicine at UPenn', shortName: 'Penn', type: 'md', state: 'PA', country: 'USA', emailDomains: ['upenn.edu', 'pennmedicine.upenn.edu'] },
  { id: 'columbia', name: 'Columbia University Vagelos College of Physicians and Surgeons', shortName: 'Columbia', type: 'md', state: 'NY', country: 'USA', emailDomains: ['columbia.edu', 'cumc.columbia.edu'] },
  { id: 'nyu-grossman', name: 'NYU Grossman School of Medicine', shortName: 'NYU', type: 'md', state: 'NY', country: 'USA', emailDomains: ['nyulangone.org', 'nyu.edu'] },
  { id: 'cornell-weill', name: 'Weill Cornell Medicine', shortName: 'Weill Cornell', type: 'md', state: 'NY', country: 'USA', emailDomains: ['med.cornell.edu', 'cornell.edu'] },
  { id: 'mount-sinai', name: 'Icahn School of Medicine at Mount Sinai', shortName: 'Mount Sinai', type: 'md', state: 'NY', country: 'USA', emailDomains: ['mssm.edu', 'mountsinai.org'] },
  { id: 'yale', name: 'Yale School of Medicine', shortName: 'Yale', type: 'md', state: 'CT', country: 'USA', emailDomains: ['yale.edu'] },
  { id: 'duke', name: 'Duke University School of Medicine', shortName: 'Duke', type: 'md', state: 'NC', country: 'USA', emailDomains: ['duke.edu'] },
  { id: 'unc', name: 'University of North Carolina School of Medicine', shortName: 'UNC', type: 'md', state: 'NC', country: 'USA', emailDomains: ['med.unc.edu', 'unc.edu'] },
  { id: 'vanderbilt', name: 'Vanderbilt University School of Medicine', shortName: 'Vanderbilt', type: 'md', state: 'TN', country: 'USA', emailDomains: ['vumc.org', 'vanderbilt.edu'] },
  { id: 'emory', name: 'Emory University School of Medicine', shortName: 'Emory', type: 'md', state: 'GA', country: 'USA', emailDomains: ['emory.edu'] },
  { id: 'uchicago', name: 'University of Chicago Pritzker School of Medicine', shortName: 'UChicago', type: 'md', state: 'IL', country: 'USA', emailDomains: ['uchicago.edu'] },
  { id: 'northwestern', name: 'Northwestern University Feinberg School of Medicine', shortName: 'Northwestern', type: 'md', state: 'IL', country: 'USA', emailDomains: ['northwestern.edu'] },
  { id: 'michigan', name: 'University of Michigan Medical School', shortName: 'Michigan', type: 'md', state: 'MI', country: 'USA', emailDomains: ['umich.edu', 'med.umich.edu'] },
  { id: 'washu', name: 'Washington University School of Medicine in St. Louis', shortName: 'WashU', type: 'md', state: 'MO', country: 'USA', emailDomains: ['wustl.edu'] },
  { id: 'mayo', name: 'Mayo Clinic Alix School of Medicine', shortName: 'Mayo', type: 'md', state: 'MN', country: 'USA', emailDomains: ['mayo.edu'] },
  { id: 'pittsburgh', name: 'University of Pittsburgh School of Medicine', shortName: 'Pitt', type: 'md', state: 'PA', country: 'USA', emailDomains: ['pitt.edu'] },
  { id: 'baylor', name: 'Baylor College of Medicine', shortName: 'Baylor', type: 'md', state: 'TX', country: 'USA', emailDomains: ['bcm.edu'] },
  { id: 'ut-southwestern', name: 'UT Southwestern Medical School', shortName: 'UTSW', type: 'md', state: 'TX', country: 'USA', emailDomains: ['utsouthwestern.edu'] },
  { id: 'ut-houston', name: 'McGovern Medical School at UTHealth Houston', shortName: 'UTHealth', type: 'md', state: 'TX', country: 'USA', emailDomains: ['uth.tmc.edu'] },
  { id: 'uva', name: 'University of Virginia School of Medicine', shortName: 'UVA', type: 'md', state: 'VA', country: 'USA', emailDomains: ['virginia.edu', 'hscmail.mcc.virginia.edu'] },
  { id: 'uw-madison', name: 'University of Wisconsin School of Medicine and Public Health', shortName: 'UW-Madison', type: 'md', state: 'WI', country: 'USA', emailDomains: ['wisc.edu'] },
  { id: 'oregon', name: 'Oregon Health & Science University School of Medicine', shortName: 'OHSU', type: 'md', state: 'OR', country: 'USA', emailDomains: ['ohsu.edu'] },
  { id: 'colorado', name: 'University of Colorado School of Medicine', shortName: 'CU', type: 'md', state: 'CO', country: 'USA', emailDomains: ['cuanschutz.edu', 'ucdenver.edu'] },
  { id: 'arizona-phoenix', name: 'University of Arizona College of Medicine - Phoenix', shortName: 'Arizona Phoenix', type: 'md', state: 'AZ', country: 'USA', emailDomains: ['arizona.edu'] },
  { id: 'arizona-tucson', name: 'University of Arizona College of Medicine - Tucson', shortName: 'Arizona Tucson', type: 'md', state: 'AZ', country: 'USA', emailDomains: ['arizona.edu'] },
  { id: 'ufl', name: 'University of Florida College of Medicine', shortName: 'UF', type: 'md', state: 'FL', country: 'USA', emailDomains: ['ufl.edu'] },
  { id: 'usf', name: 'USF Health Morsani College of Medicine', shortName: 'USF', type: 'md', state: 'FL', country: 'USA', emailDomains: ['usf.edu', 'health.usf.edu'] },
  { id: 'miami', name: 'University of Miami Miller School of Medicine', shortName: 'Miami', type: 'md', state: 'FL', country: 'USA', emailDomains: ['miami.edu', 'med.miami.edu'] },
  { id: 'loma-linda', name: 'Loma Linda University School of Medicine', shortName: 'LLU', type: 'md', state: 'CA', country: 'USA', emailDomains: ['llu.edu'] },
];

// DO Schools (COCA Accredited)
export const DO_SCHOOLS: School[] = [
  { id: 'touro-ca', name: 'Touro University California College of Osteopathic Medicine', shortName: 'Touro CA', type: 'do', state: 'CA', country: 'USA', emailDomains: ['tu.edu', 'touro.edu'] },
  { id: 'western-u', name: 'Western University of Health Sciences COMP', shortName: 'WesternU', type: 'do', state: 'CA', country: 'USA', emailDomains: ['westernu.edu'] },
  { id: 'at-still-kirksville', name: 'A.T. Still University - Kirksville', shortName: 'ATSU Kirksville', type: 'do', state: 'MO', country: 'USA', emailDomains: ['atsu.edu'] },
  { id: 'at-still-mesa', name: 'A.T. Still University - Mesa', shortName: 'ATSU Mesa', type: 'do', state: 'AZ', country: 'USA', emailDomains: ['atsu.edu'] },
  { id: 'pcom', name: 'Philadelphia College of Osteopathic Medicine', shortName: 'PCOM', type: 'do', state: 'PA', country: 'USA', emailDomains: ['pcom.edu'] },
  { id: 'pcom-ga', name: 'PCOM Georgia', shortName: 'PCOM GA', type: 'do', state: 'GA', country: 'USA', emailDomains: ['pcom.edu'] },
  { id: 'rowan', name: 'Rowan-Virtua School of Osteopathic Medicine', shortName: 'Rowan', type: 'do', state: 'NJ', country: 'USA', emailDomains: ['rowan.edu'] },
  { id: 'msu-com', name: 'Michigan State University College of Osteopathic Medicine', shortName: 'MSU-COM', type: 'do', state: 'MI', country: 'USA', emailDomains: ['msu.edu'] },
  { id: 'ohio-heritage', name: 'Ohio University Heritage College of Osteopathic Medicine', shortName: 'OU-HCOM', type: 'do', state: 'OH', country: 'USA', emailDomains: ['ohio.edu'] },
  { id: 'nova', name: 'Nova Southeastern University Dr. Kiran C. Patel College of Osteopathic Medicine', shortName: 'NSU-KPCOM', type: 'do', state: 'FL', country: 'USA', emailDomains: ['nova.edu'] },
  { id: 'tcom', name: 'Texas College of Osteopathic Medicine', shortName: 'TCOM', type: 'do', state: 'TX', country: 'USA', emailDomains: ['unthsc.edu'] },
  { id: 'kcumb', name: 'Kansas City University College of Osteopathic Medicine', shortName: 'KCU', type: 'do', state: 'MO', country: 'USA', emailDomains: ['kansascity.edu'] },
  { id: 'dmu', name: 'Des Moines University College of Osteopathic Medicine', shortName: 'DMU', type: 'do', state: 'IA', country: 'USA', emailDomains: ['dmu.edu'] },
  { id: 'midwestern-az', name: 'Midwestern University Arizona College of Osteopathic Medicine', shortName: 'MWU-AZCOM', type: 'do', state: 'AZ', country: 'USA', emailDomains: ['midwestern.edu'] },
  { id: 'midwestern-il', name: 'Midwestern University Chicago College of Osteopathic Medicine', shortName: 'MWU-CCOM', type: 'do', state: 'IL', country: 'USA', emailDomains: ['midwestern.edu'] },
  { id: 'lecom', name: 'Lake Erie College of Osteopathic Medicine', shortName: 'LECOM', type: 'do', state: 'PA', country: 'USA', emailDomains: ['lecom.edu'] },
  { id: 'nyitcom', name: 'New York Institute of Technology College of Osteopathic Medicine', shortName: 'NYITCOM', type: 'do', state: 'NY', country: 'USA', emailDomains: ['nyit.edu'] },
  { id: 'campbell', name: 'Campbell University Jerry M. Wallace School of Osteopathic Medicine', shortName: 'Campbell', type: 'do', state: 'NC', country: 'USA', emailDomains: ['campbell.edu'] },
  { id: 'vcom', name: 'Edward Via College of Osteopathic Medicine', shortName: 'VCOM', type: 'do', state: 'VA', country: 'USA', emailDomains: ['vcom.edu'] },
  { id: 'wvsom', name: 'West Virginia School of Osteopathic Medicine', shortName: 'WVSOM', type: 'do', state: 'WV', country: 'USA', emailDomains: ['osteo.wvsom.edu'] },
];

// Caribbean Medical Schools
export const CARIBBEAN_SCHOOLS: School[] = [
  { id: 'sgu', name: "St. George's University School of Medicine", shortName: 'SGU', type: 'caribbean', country: 'Grenada', emailDomains: ['sgu.edu'] },
  { id: 'ross', name: 'Ross University School of Medicine', shortName: 'Ross', type: 'caribbean', country: 'Barbados', emailDomains: ['rossu.edu'] },
  { id: 'auc', name: 'American University of the Caribbean School of Medicine', shortName: 'AUC', type: 'caribbean', country: 'Sint Maarten', emailDomains: ['aucmed.edu'] },
  { id: 'saba', name: 'Saba University School of Medicine', shortName: 'Saba', type: 'caribbean', country: 'Saba', emailDomains: ['saba.edu'] },
];

// Sample Undergraduate Schools (Top Programs)
export const UNDERGRAD_SCHOOLS: School[] = [
  { id: 'harvard', name: 'Harvard University', shortName: 'Harvard', type: 'undergrad', state: 'MA', country: 'USA', emailDomains: ['college.harvard.edu', 'harvard.edu'] },
  { id: 'stanford-undergrad', name: 'Stanford University', shortName: 'Stanford', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['stanford.edu'] },
  { id: 'mit', name: 'Massachusetts Institute of Technology', shortName: 'MIT', type: 'undergrad', state: 'MA', country: 'USA', emailDomains: ['mit.edu'] },
  { id: 'yale-undergrad', name: 'Yale University', shortName: 'Yale', type: 'undergrad', state: 'CT', country: 'USA', emailDomains: ['yale.edu'] },
  { id: 'princeton', name: 'Princeton University', shortName: 'Princeton', type: 'undergrad', state: 'NJ', country: 'USA', emailDomains: ['princeton.edu'] },
  { id: 'columbia-undergrad', name: 'Columbia University', shortName: 'Columbia', type: 'undergrad', state: 'NY', country: 'USA', emailDomains: ['columbia.edu'] },
  { id: 'uchicago-undergrad', name: 'University of Chicago', shortName: 'UChicago', type: 'undergrad', state: 'IL', country: 'USA', emailDomains: ['uchicago.edu'] },
  { id: 'duke-undergrad', name: 'Duke University', shortName: 'Duke', type: 'undergrad', state: 'NC', country: 'USA', emailDomains: ['duke.edu'] },
  { id: 'northwestern-undergrad', name: 'Northwestern University', shortName: 'Northwestern', type: 'undergrad', state: 'IL', country: 'USA', emailDomains: ['northwestern.edu', 'u.northwestern.edu'] },
  { id: 'berkeley', name: 'UC Berkeley', shortName: 'Cal', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['berkeley.edu'] },
  { id: 'ucla-undergrad', name: 'UCLA', shortName: 'UCLA', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['ucla.edu', 'g.ucla.edu'] },
  { id: 'ucsd-undergrad', name: 'UC San Diego', shortName: 'UCSD', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['ucsd.edu'] },
  { id: 'uci-undergrad', name: 'UC Irvine', shortName: 'UCI', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['uci.edu'] },
  { id: 'ucdavis-undergrad', name: 'UC Davis', shortName: 'UC Davis', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['ucdavis.edu'] },
  { id: 'ucsb', name: 'UC Santa Barbara', shortName: 'UCSB', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['ucsb.edu'] },
  { id: 'ucsc', name: 'UC Santa Cruz', shortName: 'UCSC', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['ucsc.edu'] },
  { id: 'ucr-undergrad', name: 'UC Riverside', shortName: 'UCR', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['ucr.edu'] },
  { id: 'cal-poly-slo', name: 'Cal Poly San Luis Obispo', shortName: 'Cal Poly', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['calpoly.edu'] },
  { id: 'sdsu', name: 'San Diego State University', shortName: 'SDSU', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['sdsu.edu'] },
  { id: 'sjsu', name: 'San Jose State University', shortName: 'SJSU', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['sjsu.edu'] },
  { id: 'upenn-undergrad', name: 'University of Pennsylvania', shortName: 'Penn', type: 'undergrad', state: 'PA', country: 'USA', emailDomains: ['upenn.edu'] },
  { id: 'jhu-undergrad', name: 'Johns Hopkins University', shortName: 'Hopkins', type: 'undergrad', state: 'MD', country: 'USA', emailDomains: ['jhu.edu'] },
  { id: 'rice', name: 'Rice University', shortName: 'Rice', type: 'undergrad', state: 'TX', country: 'USA', emailDomains: ['rice.edu'] },
  { id: 'vanderbilt-undergrad', name: 'Vanderbilt University', shortName: 'Vanderbilt', type: 'undergrad', state: 'TN', country: 'USA', emailDomains: ['vanderbilt.edu'] },
  { id: 'notre-dame', name: 'University of Notre Dame', shortName: 'Notre Dame', type: 'undergrad', state: 'IN', country: 'USA', emailDomains: ['nd.edu'] },
  { id: 'georgetown', name: 'Georgetown University', shortName: 'Georgetown', type: 'undergrad', state: 'DC', country: 'USA', emailDomains: ['georgetown.edu'] },
  { id: 'emory-undergrad', name: 'Emory University', shortName: 'Emory', type: 'undergrad', state: 'GA', country: 'USA', emailDomains: ['emory.edu'] },
  { id: 'michigan-undergrad', name: 'University of Michigan', shortName: 'Michigan', type: 'undergrad', state: 'MI', country: 'USA', emailDomains: ['umich.edu'] },
  { id: 'uva-undergrad', name: 'University of Virginia', shortName: 'UVA', type: 'undergrad', state: 'VA', country: 'USA', emailDomains: ['virginia.edu'] },
  { id: 'unc-undergrad', name: 'UNC Chapel Hill', shortName: 'UNC', type: 'undergrad', state: 'NC', country: 'USA', emailDomains: ['unc.edu'] },
  { id: 'ut-austin', name: 'University of Texas at Austin', shortName: 'UT Austin', type: 'undergrad', state: 'TX', country: 'USA', emailDomains: ['utexas.edu'] },
  { id: 'ufl-undergrad', name: 'University of Florida', shortName: 'UF', type: 'undergrad', state: 'FL', country: 'USA', emailDomains: ['ufl.edu'] },
  { id: 'usc-undergrad', name: 'University of Southern California', shortName: 'USC', type: 'undergrad', state: 'CA', country: 'USA', emailDomains: ['usc.edu'] },
  { id: 'boston-u', name: 'Boston University', shortName: 'BU', type: 'undergrad', state: 'MA', country: 'USA', emailDomains: ['bu.edu'] },
  { id: 'nyu-undergrad', name: 'New York University', shortName: 'NYU', type: 'undergrad', state: 'NY', country: 'USA', emailDomains: ['nyu.edu'] },
];

// Combined schools list
export const ALL_SCHOOLS: School[] = [
  ...MD_SCHOOLS,
  ...DO_SCHOOLS,
  ...CARIBBEAN_SCHOOLS,
  ...UNDERGRAD_SCHOOLS,
];

// Get schools by type
export function getSchoolsByType(type: SchoolType): School[] {
  return ALL_SCHOOLS.filter(school => school.type === type);
}

// Search schools by name
export function searchSchools(query: string): School[] {
  const lowerQuery = query.toLowerCase();
  return ALL_SCHOOLS.filter(school =>
    school.name.toLowerCase().includes(lowerQuery) ||
    (school.shortName && school.shortName.toLowerCase().includes(lowerQuery))
  ).slice(0, 20); // Limit results
}

// Find school by email domain
export function findSchoolByEmailDomain(email: string): School | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;

  return ALL_SCHOOLS.find(school =>
    school.emailDomains.some(d => domain === d || domain.endsWith('.' + d))
  ) || null;
}

// Validate if email is from a known school
export function isSchoolEmail(email: string): boolean {
  return findSchoolByEmailDomain(email) !== null;
}

// Check if email ends with .edu
export function isEduEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain?.endsWith('.edu') || false;
}

// Validate email for registration
export interface EmailValidationResult {
  isValid: boolean;
  isEdu: boolean;
  school: School | null;
  message: string;
}

export function validateSchoolEmail(email: string): EmailValidationResult {
  if (!email || !email.includes('@')) {
    return {
      isValid: false,
      isEdu: false,
      school: null,
      message: 'Please enter a valid email address',
    };
  }

  const isEdu = isEduEmail(email);
  const school = findSchoolByEmailDomain(email);

  if (school) {
    return {
      isValid: true,
      isEdu,
      school,
      message: `Verified! You're from ${school.name}`,
    };
  }

  if (isEdu) {
    return {
      isValid: true,
      isEdu: true,
      school: null,
      message: 'Valid .edu email. Please select your school manually.',
    };
  }

  return {
    isValid: false,
    isEdu: false,
    school: null,
    message: 'Please use your school email address (.edu) to register',
  };
}

// Get type label for display
export function getSchoolTypeLabel(type: SchoolType): string {
  switch (type) {
    case 'md': return 'MD Medical School';
    case 'do': return 'DO Medical School';
    case 'undergrad': return 'Undergraduate';
    case 'caribbean': return 'Caribbean Medical School';
    case 'international': return 'International';
    default: return type;
  }
}

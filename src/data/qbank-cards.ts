// QBank-Linked Clinical Vignette Cards
// Cards linked to UWorld/AMBOSS question IDs for targeted review

export interface ClinicalCard {
  id: string;
  category: string;
  subcategory: string;
  topic: string;
  type: 'Clinical Vignette' | 'Concept' | 'Mechanism';
  question: string;
  answer: string;
  clinicalPearl: string;
  tags: string[];
  // QBank linkages
  uworldId?: string;
  uworldComlexId?: string;
  ambossId?: string;
}

// Sample cards in the concise style from the screenshot
export const CLINICAL_CARDS: ClinicalCard[] = [
  // CARDIOLOGY
  {
    id: 'cardio-001',
    category: 'Internal Medicine',
    subcategory: 'Cardiology',
    topic: 'Acute Coronary Syndrome',
    type: 'Clinical Vignette',
    question: 'A 58-year-old man with diabetes and hypertension presents with crushing substernal chest pain radiating to his left arm for 2 hours. ECG shows ST elevations in leads V1-V4. What is the most appropriate next step?',
    answer: 'Emergent percutaneous coronary intervention (PCI).',
    clinicalPearl: 'Door-to-balloon time should be <90 minutes for STEMI. If PCI is not available within 120 minutes, fibrinolysis is the alternative. Always give aspirin, heparin, and P2Y12 inhibitor.',
    tags: ['#STEMI', '#PCI', '#ACS'],
    uworldId: '4523',
    ambossId: 'xK78mP'
  },
  {
    id: 'cardio-002',
    category: 'Internal Medicine',
    subcategory: 'Cardiology',
    topic: 'Heart Failure',
    type: 'Clinical Vignette',
    question: 'A 65-year-old woman with a history of MI presents with dyspnea on exertion, orthopnea, and bilateral leg edema. Echo shows EF of 30%. She is on lisinopril and metoprolol. What medication should be added to reduce mortality?',
    answer: 'Spironolactone (or eplerenone).',
    clinicalPearl: 'The "four pillars" of HFrEF therapy that reduce mortality: ACEi/ARB/ARNI, beta-blocker, MRA (spironolactone/eplerenone), and SGLT2 inhibitor. Add each one sequentially.',
    tags: ['#HFrEF', '#heartfailure', '#MRA'],
    uworldId: '5127',
    uworldComlexId: '102345',
    ambossId: 'pQ92nL'
  },
  {
    id: 'cardio-003',
    category: 'Internal Medicine',
    subcategory: 'Cardiology',
    topic: 'Atrial Fibrillation',
    type: 'Clinical Vignette',
    question: 'A 72-year-old man with HTN and diabetes presents with irregularly irregular pulse. ECG confirms afib. CHA2DS2-VASc score is 4. What is the most appropriate anticoagulation?',
    answer: 'Direct oral anticoagulant (DOAC) such as apixaban or rivaroxaban.',
    clinicalPearl: 'DOACs are preferred over warfarin for nonvalvular afib due to fewer drug interactions, no INR monitoring, and lower intracranial bleeding risk. Warfarin is still indicated for mechanical heart valves and moderate-severe mitral stenosis.',
    tags: ['#afib', '#anticoagulation', '#DOAC'],
    uworldId: '3892',
    ambossId: 'mN45kR'
  },
  {
    id: 'cardio-004',
    category: 'Internal Medicine',
    subcategory: 'Cardiology',
    topic: 'Hypertension',
    type: 'Clinical Vignette',
    question: 'A 55-year-old African American man with newly diagnosed HTN (BP 158/96) has no other comorbidities. What is the most appropriate initial antihypertensive therapy?',
    answer: 'Thiazide diuretic or calcium channel blocker.',
    clinicalPearl: 'In African American patients without heart failure or CKD, thiazides or CCBs are first-line due to better efficacy. ACE inhibitors are less effective as monotherapy in this population but should be added if BP remains uncontrolled.',
    tags: ['#hypertension', '#antihypertensive', '#JNC8'],
    uworldId: '2891',
    uworldComlexId: '98234'
  },

  // FAMILY MEDICINE
  {
    id: 'fm-001',
    category: 'Family Medicine',
    subcategory: 'Preventive Medicine',
    topic: 'Health Maintenance',
    type: 'Clinical Vignette',
    question: 'A 45-year-old obese man who smokes 1 pack/day presents for routine health maintenance. He has hypertension and hyperlipidemia. What single intervention provides the greatest reduction in all-cause mortality?',
    answer: 'Smoking cessation counseling with FDA-approved pharmacotherapy.',
    clinicalPearl: 'While controlling BP and lipids is important, smoking cessation provides the largest mortality benefit. Assess readiness to quit and offer both counseling and pharmacotherapy (varenicline, bupropion, or NRT).',
    tags: ['#smokingcessation', '#preventivemedicine', '#cardiovascularrisk'],
    uworldId: '1823',
    ambossId: 'hT67wQ'
  },
  {
    id: 'fm-002',
    category: 'Family Medicine',
    subcategory: 'Preventive Medicine',
    topic: 'Cancer Screening',
    type: 'Clinical Vignette',
    question: 'A 52-year-old woman with no family history asks about breast cancer screening. Her last mammogram was 2 years ago and was normal. What do you recommend?',
    answer: 'Continue screening mammography every 1-2 years.',
    clinicalPearl: 'USPSTF recommends biennial mammography for women 50-74 years. For women 40-49, it is an individual decision based on risk factors and patient values. Annual screening may be considered for high-risk patients.',
    tags: ['#breastcancer', '#screening', '#mammography'],
    uworldId: '2156',
    uworldComlexId: '95678'
  },
  {
    id: 'fm-003',
    category: 'Family Medicine',
    subcategory: 'Diabetes',
    topic: 'Type 2 Diabetes Management',
    type: 'Clinical Vignette',
    question: 'A 58-year-old man with T2DM and heart failure (EF 35%) has HbA1c of 8.2% on metformin alone. What medication should be added?',
    answer: 'SGLT2 inhibitor (empagliflozin or dapagliflozin).',
    clinicalPearl: 'SGLT2 inhibitors reduce cardiovascular death and heart failure hospitalizations in patients with HFrEF, independent of diabetes status. They also provide renal protection. Add regardless of glycemic control in HF patients.',
    tags: ['#T2DM', '#SGLT2i', '#heartfailure'],
    uworldId: '4892',
    ambossId: 'sK23pN'
  },
  {
    id: 'fm-004',
    category: 'Family Medicine',
    subcategory: 'Musculoskeletal',
    topic: 'Low Back Pain',
    type: 'Clinical Vignette',
    question: 'A 35-year-old man presents with 3 weeks of low back pain after lifting furniture. No red flags on history. Neurologic exam is normal. What is the most appropriate initial management?',
    answer: 'NSAIDs and continuation of normal activities.',
    clinicalPearl: 'For acute nonspecific low back pain without red flags, imaging is not indicated. First-line treatment is NSAIDs and encouraging activity. Bed rest worsens outcomes. Consider physical therapy if no improvement in 4-6 weeks.',
    tags: ['#lowbackpain', '#MSK', '#conservative'],
    uworldId: '3421',
    uworldComlexId: '101234'
  },
  {
    id: 'fm-005',
    category: 'Family Medicine',
    subcategory: 'Pediatrics',
    topic: 'Well Child Care',
    type: 'Clinical Vignette',
    question: 'An 18-month-old child has not spoken any words yet. Parents are concerned. Physical exam and hearing screen are normal. What is the most appropriate next step?',
    answer: 'Refer for early intervention/speech-language evaluation.',
    clinicalPearl: 'Children should have 1-3 words by 12 months and at least 20 words by 18 months. Absence of words by 16-18 months warrants referral for developmental evaluation. Early intervention improves outcomes significantly.',
    tags: ['#developmental', '#speech', '#pediatrics'],
    uworldId: '2789',
    ambossId: 'wR56mK'
  },

  // More Cardiology
  {
    id: 'cardio-005',
    category: 'Internal Medicine',
    subcategory: 'Cardiology',
    topic: 'Valvular Disease',
    type: 'Clinical Vignette',
    question: 'A 70-year-old man presents with exertional syncope and a harsh crescendo-decrescendo systolic murmur at the right upper sternal border. Echo shows aortic valve area of 0.8 cm². What is the definitive treatment?',
    answer: 'Aortic valve replacement (surgical or transcatheter).',
    clinicalPearl: 'Severe symptomatic aortic stenosis has >50% 2-year mortality without valve replacement. Classic triad: syncope, angina, heart failure. TAVR is preferred for high surgical risk patients; SAVR for low-risk younger patients.',
    tags: ['#aorticstenosis', '#valvular', '#TAVR'],
    uworldId: '4911',
    uworldComlexId: '101689',
    ambossId: 'z5ar5O'
  },
  {
    id: 'cardio-006',
    category: 'Internal Medicine',
    subcategory: 'Cardiology',
    topic: 'Arrhythmia',
    type: 'Clinical Vignette',
    question: 'A 28-year-old man is found unresponsive at the gym. AED analysis shows ventricular fibrillation. After successful defibrillation and ROSC, ECG shows short PR interval and delta waves. What is the underlying diagnosis?',
    answer: 'Wolff-Parkinson-White (WPW) syndrome.',
    clinicalPearl: 'WPW is caused by an accessory pathway (Bundle of Kent) that pre-excites the ventricle. Avoid AV nodal blocking agents (adenosine, CCB, beta-blockers, digoxin) in afib with WPW as they may accelerate conduction down the accessory pathway causing VF.',
    tags: ['#WPW', '#arrhythmia', '#SCD'],
    uworldId: '3156',
    ambossId: 'kL89nP'
  }
];

// Function to get cards by QBank code
export function getCardsByCode(code: string): ClinicalCard[] {
  const normalizedCode = code.trim().toUpperCase();
  return CLINICAL_CARDS.filter(card =>
    card.uworldId?.toUpperCase() === normalizedCode ||
    card.uworldComlexId?.toUpperCase() === normalizedCode ||
    card.ambossId?.toUpperCase() === normalizedCode
  );
}

// Function to get cards by category
export function getCardsByCategory(category: string): ClinicalCard[] {
  return CLINICAL_CARDS.filter(card =>
    card.category.toLowerCase() === category.toLowerCase()
  );
}

// Function to get cards by subcategory
export function getCardsBySubcategory(subcategory: string): ClinicalCard[] {
  return CLINICAL_CARDS.filter(card =>
    card.subcategory.toLowerCase() === subcategory.toLowerCase()
  );
}

// Get all unique categories
export function getCategories(): string[] {
  return Array.from(new Set(CLINICAL_CARDS.map(card => card.category)));
}

// Get all unique subcategories for a category
export function getSubcategories(category: string): string[] {
  return Array.from(new Set(
    CLINICAL_CARDS
      .filter(card => card.category === category)
      .map(card => card.subcategory)
  ));
}

// Search cards by multiple codes (comma or space separated)
export function searchByMultipleCodes(input: string): ClinicalCard[] {
  const codes = input.split(/[,\s]+/).filter(c => c.length > 0);
  const results: ClinicalCard[] = [];

  codes.forEach(code => {
    const matches = getCardsByCode(code);
    matches.forEach(card => {
      if (!results.find(r => r.id === card.id)) {
        results.push(card);
      }
    });
  });

  return results;
}

// Get stats
export function getQBankStats() {
  const uworldCount = CLINICAL_CARDS.filter(c => c.uworldId).length;
  const comlexCount = CLINICAL_CARDS.filter(c => c.uworldComlexId).length;
  const ambossCount = CLINICAL_CARDS.filter(c => c.ambossId).length;

  return {
    totalCards: CLINICAL_CARDS.length,
    uworldLinked: uworldCount,
    comlexLinked: comlexCount,
    ambossLinked: ambossCount,
    categories: getCategories().length
  };
}

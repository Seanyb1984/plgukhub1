// PLG UK Hub - Treatment Journey Type Definitions
// 4-Phase Stepper with POM Gates for CQC Compliance

import type { Brand } from '@/lib/forms/types';

// ============================================
// PHASE DEFINITIONS
// ============================================

export type PhaseId = 0 | 1 | 2 | 3 | 4;

export const PHASE_NAMES: Record<PhaseId, string> = {
  0: 'Identification',
  1: 'POM Triage',
  2: 'Legal Consent',
  3: 'Clinical Record',
  4: 'Close-out',
};

export const PHASE_DESCRIPTIONS: Record<PhaseId, string> = {
  0: 'Search for existing clients or add a new enquiry',
  1: 'Prescription-Only Medicine triage and prescriber verification',
  2: 'CQC safety screening, consent declaration, and digital signature',
  3: 'Treatment details, batch/lot tracking, and before photos',
  4: 'After photos, aftercare instructions, and follow-up scheduling',
};

export interface PhaseConfig {
  id: PhaseId;
  name: string;
  description: string;
  isRequired: boolean;
  isConditional: boolean; // true if phase can be skipped
  requiredForBrands: Brand[] | 'ALL';
}

export const PHASE_CONFIGS: PhaseConfig[] = [
  {
    id: 0,
    name: 'Identification',
    description: 'Search for existing clients or add a new enquiry',
    isRequired: true,
    isConditional: false,
    requiredForBrands: 'ALL',
  },
  {
    id: 1,
    name: 'POM Triage',
    description: 'Prescriber verification and face-to-face consultation check',
    isRequired: true,
    isConditional: true, // Only required for Menhancements
    requiredForBrands: ['MENHANCEMENTS'],
  },
  {
    id: 2,
    name: 'Legal Consent',
    description: 'CQC safety screening with stop-logic and digital signature',
    isRequired: true,
    isConditional: false,
    requiredForBrands: 'ALL',
  },
  {
    id: 3,
    name: 'Clinical Record',
    description: 'Procedure details, batch tracking, and before photos',
    isRequired: true,
    isConditional: false,
    requiredForBrands: 'ALL',
  },
  {
    id: 4,
    name: 'Close-out',
    description: 'After photos and aftercare email trigger',
    isRequired: true,
    isConditional: false,
    requiredForBrands: 'ALL',
  },
];

// ============================================
// SAFETY SCREENING (Stop-Logic)
// ============================================

export interface SafetyQuestion {
  id: string;
  question: string;
  type: 'yesNo' | 'text' | 'select';
  triggerValue: string | boolean; // Value that triggers the stop
  stopType: 'hard' | 'soft'; // hard = cannot proceed, soft = warning only
  stopMessage: string;
  appliesToBrands: Brand[] | 'ALL';
}

export const SAFETY_SCREENING_QUESTIONS: SafetyQuestion[] = [
  {
    id: 'blood_disorder',
    question: 'Does the client have a blood clotting disorder (e.g., haemophilia, von Willebrand disease)?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'hard',
    stopMessage: 'HARD STOP: Client has a blood clotting disorder. Treatment CANNOT proceed. Refer to GP.',
    appliesToBrands: 'ALL',
  },
  {
    id: 'anticoagulant_medication',
    question: 'Is the client currently taking anticoagulant medication (e.g., Warfarin, Heparin)?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'hard',
    stopMessage: 'HARD STOP: Client is on anticoagulant medication. Treatment CANNOT proceed without GP clearance letter.',
    appliesToBrands: 'ALL',
  },
  {
    id: 'pregnancy',
    question: 'Is the client pregnant or breastfeeding?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'hard',
    stopMessage: 'HARD STOP: Client is pregnant or breastfeeding. Treatment CANNOT proceed.',
    appliesToBrands: ['MENHANCEMENTS'],
  },
  {
    id: 'allergy_local_anaesthetic',
    question: 'Does the client have a known allergy to local anaesthetic (e.g., lidocaine)?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'hard',
    stopMessage: 'HARD STOP: Anaesthetic allergy. Treatment CANNOT proceed without alternative protocol from prescriber.',
    appliesToBrands: ['MENHANCEMENTS'],
  },
  {
    id: 'active_infection',
    question: 'Does the client have an active skin infection or cold sore in the treatment area?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'hard',
    stopMessage: 'HARD STOP: Active infection in treatment area. Reschedule after resolution.',
    appliesToBrands: 'ALL',
  },
  {
    id: 'autoimmune',
    question: 'Does the client have an autoimmune condition (e.g., Lupus, Rheumatoid Arthritis)?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'soft',
    stopMessage: 'WARNING: Autoimmune condition present. Proceed with caution. Document prescriber approval.',
    appliesToBrands: ['MENHANCEMENTS'],
  },
  {
    id: 'previous_adverse_reaction',
    question: 'Has the client had a previous adverse reaction to dermal fillers or botulinum toxin?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'soft',
    stopMessage: 'WARNING: Previous adverse reaction. Prescriber must review history and approve.',
    appliesToBrands: ['MENHANCEMENTS'],
  },
  {
    id: 'skin_sensitivity',
    question: 'Does the client have known skin sensitivities or allergies to wax products?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'soft',
    stopMessage: 'WARNING: Skin sensitivity. Perform patch test before proceeding.',
    appliesToBrands: ['WAX_FOR_MEN', 'WAX_FOR_WOMEN'],
  },
  {
    id: 'retinoid_use',
    question: 'Is the client currently using Retinoids (e.g., Tretinoin, Accutane/Isotretinoin)?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'soft',
    stopMessage: 'WARNING: Active retinoid use may increase skin sensitivity. Assess suitability.',
    appliesToBrands: 'ALL',
  },
  {
    id: 'recent_surgery',
    question: 'Has the client had facial surgery in the last 6 months?',
    type: 'yesNo',
    triggerValue: true,
    stopType: 'hard',
    stopMessage: 'HARD STOP: Recent facial surgery. Require surgical clearance letter before treatment.',
    appliesToBrands: ['MENHANCEMENTS'],
  },
];

// ============================================
// POM GATE (Prescription-Only Medicine)
// ============================================

export interface POMGateConfig {
  prescriberRequired: boolean;
  gmcNumberRequired: boolean;
  faceToFaceRequired: boolean;
  faceToFaceMaxDaysAgo: number; // Max days since face-to-face consultation
  defaultPrescriber: {
    name: string;
    gmcNumber: string;
    prescriberType: string;
  };
}

// Dr. Phil's POM gate configuration
export const POM_GATE_CONFIG: POMGateConfig = {
  prescriberRequired: true,
  gmcNumberRequired: true,
  faceToFaceRequired: true,
  faceToFaceMaxDaysAgo: 365, // Face-to-face must be within 12 months
  defaultPrescriber: {
    name: 'Dr. Phil',
    gmcNumber: '', // Must be entered/verified at runtime
    prescriberType: 'Doctor',
  },
};

// ============================================
// JOURNEY DATA SHAPE (per-phase)
// ============================================

export interface Phase0Data {
  clientId: string | null;
  isNewClient: boolean;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface Phase1Data {
  isPomTreatment: boolean;
  prescriberId: string;
  prescriberName: string;
  gmcNumber: string;
  faceToFaceDate: string;
  pomNotes?: string;
}

export interface Phase2Data {
  screeningResponses: Record<string, boolean | string>;
  hardStopTriggered: boolean;
  softWarnings: string[];
  consentDeclaration: string;
  signatureData: string; // Base64
  signedByName: string;
}

export interface Phase3Data {
  treatmentType: string;
  treatmentArea: string[];
  productUsed: string;
  batchNumber: string;
  lotNumber?: string;
  expiryDate?: string;
  dosage?: string;
  injectionSites?: InjectionPoint[];
  clinicalNotes?: string;
  beforePhotos: string[]; // Base64 or file refs
}

export interface Phase4Data {
  afterPhotos: string[]; // Base64 or file refs
  aftercareProvided: boolean;
  aftercareTemplateId?: string;
  sendAftercareEmail: boolean;
  followUpDate?: string;
  followUpNotes?: string;
}

// ============================================
// FACIAL MAPPING
// ============================================

export interface InjectionPoint {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  product?: string;
  units?: string;
  depth?: string;
  notes?: string;
}

export interface FacialMappingData {
  imageId: string;
  points: InjectionPoint[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TREATMENT TYPES
// ============================================

export interface TreatmentTypeDefinition {
  id: string;
  name: string;
  brand: Brand | Brand[];
  category: string;
  requiresPOM: boolean;
  commonAreas: string[];
  defaultProducts: string[];
}

export const TREATMENT_TYPES: TreatmentTypeDefinition[] = [
  // Menhancements treatments (POM)
  {
    id: 'botox',
    name: 'Botulinum Toxin (Botox)',
    brand: 'MENHANCEMENTS',
    category: 'Injectable',
    requiresPOM: true,
    commonAreas: ['Forehead Lines', 'Frown Lines (Glabella)', "Crow's Feet", 'Bunny Lines', 'Chin Dimpling', 'Jawline Slimming'],
    defaultProducts: ['Allergan Botox', 'Azzalure', 'Bocouture'],
  },
  {
    id: 'dermal_filler',
    name: 'Dermal Filler',
    brand: 'MENHANCEMENTS',
    category: 'Injectable',
    requiresPOM: true,
    commonAreas: ['Nasolabial Folds', 'Marionette Lines', 'Cheeks', 'Jawline', 'Chin', 'Lips', 'Under-eye (Tear Trough)', 'Temples'],
    defaultProducts: ['Juvederm Voluma', 'Juvederm Volbella', 'Restylane', 'Belotero'],
  },
  {
    id: 'prp',
    name: 'PRP (Platelet Rich Plasma)',
    brand: 'MENHANCEMENTS',
    category: 'Regenerative',
    requiresPOM: true,
    commonAreas: ['Full Face', 'Scalp (Hair Loss)', 'Under-eye', 'Neck'],
    defaultProducts: ['Autologous PRP'],
  },
  {
    id: 'skin_booster',
    name: 'Skin Booster / Profhilo',
    brand: 'MENHANCEMENTS',
    category: 'Injectable',
    requiresPOM: true,
    commonAreas: ['Full Face', 'Neck', 'Hands', 'Décolletage'],
    defaultProducts: ['Profhilo', 'Skinboosters by Restylane', 'Juvederm Volite'],
  },
  {
    id: 'chemical_peel',
    name: 'Chemical Peel',
    brand: 'MENHANCEMENTS',
    category: 'Skin Treatment',
    requiresPOM: false,
    commonAreas: ['Full Face', 'Neck', 'Hands'],
    defaultProducts: ['Glycolic Acid', 'Salicylic Acid', 'TCA Peel'],
  },
  // Waxing treatments (non-POM)
  {
    id: 'wax_full_body',
    name: 'Full Body Wax',
    brand: ['WAX_FOR_MEN', 'WAX_FOR_WOMEN'],
    category: 'Waxing',
    requiresPOM: false,
    commonAreas: ['Full Body'],
    defaultProducts: ['Strip Wax', 'Hot Wax'],
  },
  {
    id: 'wax_facial',
    name: 'Facial Wax',
    brand: ['WAX_FOR_MEN', 'WAX_FOR_WOMEN'],
    category: 'Waxing',
    requiresPOM: false,
    commonAreas: ['Upper Lip', 'Chin', 'Eyebrows', 'Sideburns', 'Full Face'],
    defaultProducts: ['Hot Wax', 'Strip Wax'],
  },
  {
    id: 'wax_legs',
    name: 'Leg Wax',
    brand: ['WAX_FOR_MEN', 'WAX_FOR_WOMEN'],
    category: 'Waxing',
    requiresPOM: false,
    commonAreas: ['Full Leg', 'Half Leg (Upper)', 'Half Leg (Lower)'],
    defaultProducts: ['Strip Wax', 'Hot Wax'],
  },
  {
    id: 'wax_intimate',
    name: 'Intimate Wax',
    brand: ['WAX_FOR_MEN', 'WAX_FOR_WOMEN'],
    category: 'Waxing',
    requiresPOM: false,
    commonAreas: ['Brazilian', 'Hollywood', 'Bikini Line'],
    defaultProducts: ['Hot Wax'],
  },
  {
    id: 'wax_arms',
    name: 'Arm Wax',
    brand: ['WAX_FOR_MEN', 'WAX_FOR_WOMEN'],
    category: 'Waxing',
    requiresPOM: false,
    commonAreas: ['Full Arm', 'Half Arm', 'Underarm'],
    defaultProducts: ['Strip Wax', 'Hot Wax'],
  },
  {
    id: 'wax_back_chest',
    name: 'Back & Chest Wax',
    brand: 'WAX_FOR_MEN',
    category: 'Waxing',
    requiresPOM: false,
    commonAreas: ['Full Back', 'Upper Back', 'Lower Back', 'Full Chest', 'Stomach'],
    defaultProducts: ['Strip Wax', 'Hot Wax'],
  },
];

export function getTreatmentTypesForBrand(brand: Brand): TreatmentTypeDefinition[] {
  return TREATMENT_TYPES.filter((t) => {
    if (Array.isArray(t.brand)) return t.brand.includes(brand);
    return t.brand === brand;
  });
}

export function isPOMRequired(treatmentTypeId: string): boolean {
  const treatment = TREATMENT_TYPES.find((t) => t.id === treatmentTypeId);
  return treatment?.requiresPOM ?? false;
}

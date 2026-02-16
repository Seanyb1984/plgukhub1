import { FormDefinition } from '../types';
import { GovernanceLog } from './governance-log';
import { treatmentJourney } from './treatment-journey';

// ============================================
// CUSTOMER SERVICE FORMS
// ============================================

const complaintForm: FormDefinition = {
  id: 'plg_complaint_form',
  title: 'Customer Complaint Form',
  version: '1.0',
  requiresSignature: false,
  fields: [
    { id: 'customer_details', label: 'Your Details', type: 'section' },
    { id: 'customer_name', type: 'text', label: 'Full Name', required: true },
    { id: 'customer_email', type: 'text', label: 'Email Address', required: true },
    { id: 'complaint_description', type: 'text', label: 'Description', required: true },
  ],
};

const complaintInvestigation: FormDefinition = {
  id: 'plg_complaint_investigation',
  title: 'Complaint Investigation Record',
  version: '1.0',
  requiresSignature: true,
  fields: [
    { id: 'ref_sec', label: 'Complaint Reference', type: 'section' },
    { id: 'complaint_id', type: 'text', label: 'Complaint Ref #', required: true },
    { id: 'investigator_name', type: 'text', label: 'Investigator', required: true },
    { id: 'findings', type: 'text', label: 'Investigation Findings', required: true },
    { id: 'signature', type: 'signature', label: 'Investigating Manager', required: true }
  ],
};

// ============================================
// INCIDENT/SAFETY FORMS
// ============================================

const incidentNearMiss: FormDefinition = {
  id: 'plg_incident_near_miss',
  title: 'Incident / Near Miss Report',
  version: '1.0',
  requiresSignature: true,
  fields: [
    { id: 'inc_info', label: 'Incident Information', type: 'section' },
    { id: 'incident_type', type: 'select', label: 'Type', options: ['Incident', 'Near Miss', 'RIDDOR'], required: true },
    { id: 'description', type: 'text', label: 'What happened?', required: true },
    { id: 'signature', type: 'signature', label: 'Reporter Signature', required: true }
  ],
};

const safeguardingConcern: FormDefinition = {
  id: 'plg_safeguarding_concern',
  title: 'Safeguarding Concern Report',
  version: '1.0',
  requiresSignature: true,
  fields: [
    { id: 'risk_sec', label: 'Person at Risk', type: 'section' },
    { id: 'person_name', type: 'text', label: 'Name', required: true },
    { id: 'concern_description', type: 'text', label: 'Details of Concern', required: true },
    { id: 'signature', type: 'signature', label: 'Reporter Signature', required: true }
  ],
};

const fireSafetyCheck: FormDefinition = {
  id: 'plg_fire_safety_weekly',
  title: 'Fire Safety Weekly Check',
  version: '1.0',
  requiresSignature: true,
  fields: [
    { id: 'fire_sec', label: 'Weekly Check', type: 'section' },
    { id: 'exits_clear', type: 'radio', label: 'Fire exits clear?', options: ['Yes', 'No'], required: true },
    { id: 'signature', type: 'signature', label: 'Fire Warden Signature', required: true }
  ],
};

// ============================================
// EXPORT ALL PLG UK FORMS
// ============================================

export const plgUkForms: FormDefinition[] = [
  treatmentJourney,           // Now correctly imported and defined
  complaintForm,
  complaintInvestigation,
  incidentNearMiss,
  safeguardingConcern,
  fireSafetyCheck,
  GovernanceLog,
];

import { FormDefinition } from '../types';

// ============================================
// PLG UK FORM DEFINITIONS
// Governance, Operations, IT, HR, Finance
// ============================================

// ============================================
// CUSTOMER SERVICE FORMS
// ============================================

const complaintForm: FormDefinition = {
  id: 'plg_complaint_form',
  name: 'Customer Complaint Form',
  description: 'Submit a formal complaint about services received',
  version: '1.0',
  brand: 'ALL',
  category: 'Customer Service',
  requiresSignature: false,
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 2555, // 7 years
  sections: [
    {
      id: 'customer_details',
      title: 'Your Details',
      fields: [
        {
          id: 'customer_name',
          type: 'text',
          label: 'Full Name',
          validation: { required: true, minLength: 2 },
          width: 'half',
        },
        {
          id: 'customer_email',
          type: 'email',
          label: 'Email Address',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'customer_phone',
          type: 'phone',
          label: 'Phone Number',
          validation: { required: false },
          width: 'half',
        },
        {
          id: 'preferred_contact',
          type: 'radio',
          label: 'Preferred Contact Method',
          options: [
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
          ],
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'complaint_details',
      title: 'Complaint Details',
      fields: [
        {
          id: 'service_date',
          type: 'date',
          label: 'Date of Service',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'location_visited',
          type: 'text',
          label: 'Location Visited',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'complaint_type',
          type: 'select',
          label: 'Type of Complaint',
          options: [
            { value: 'service_quality', label: 'Service Quality' },
            { value: 'staff_conduct', label: 'Staff Conduct' },
            { value: 'hygiene', label: 'Hygiene/Cleanliness' },
            { value: 'wait_time', label: 'Excessive Wait Time' },
            { value: 'pricing', label: 'Pricing/Billing Issue' },
            { value: 'booking', label: 'Booking/Scheduling Issue' },
            { value: 'results', label: 'Treatment Results' },
            { value: 'facilities', label: 'Facilities' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'complaint_description',
          type: 'textarea',
          label: 'Please describe your complaint in detail',
          helpText: 'Include as much detail as possible about what happened',
          validation: { required: true, minLength: 50 },
        },
        {
          id: 'resolution_sought',
          type: 'textarea',
          label: 'What resolution would you like to see?',
          helpText: 'Let us know how we can put things right',
          validation: { required: true },
        },
        {
          id: 'previous_contact',
          type: 'yesNo',
          label: 'Have you already contacted us about this issue?',
          validation: { required: true },
        },
        {
          id: 'previous_contact_details',
          type: 'textarea',
          label: 'Please provide details of previous contact',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'previous_contact', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
  ],
};

const complaintInvestigation: FormDefinition = {
  id: 'plg_complaint_investigation',
  name: 'Complaint Investigation Record',
  description: 'Internal form to document complaint investigation and resolution',
  version: '1.0',
  brand: 'ALL',
  category: 'Customer Service',
  requiresSignature: true,
  signatureLabel: 'Investigating Manager',
  signatureDeclaration: 'I confirm this investigation has been conducted thoroughly and fairly.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 2555,
  sections: [
    {
      id: 'complaint_reference',
      title: 'Complaint Reference',
      fields: [
        {
          id: 'complaint_id',
          type: 'text',
          label: 'Complaint Reference Number',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'date_received',
          type: 'date',
          label: 'Date Complaint Received',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'investigator_name',
          type: 'text',
          label: 'Investigator Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'investigation_date',
          type: 'date',
          label: 'Investigation Start Date',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'investigation_details',
      title: 'Investigation Details',
      fields: [
        {
          id: 'staff_involved',
          type: 'textarea',
          label: 'Staff Members Involved',
          helpText: 'List all staff members related to the complaint',
          validation: { required: true },
        },
        {
          id: 'evidence_reviewed',
          type: 'textarea',
          label: 'Evidence Reviewed',
          helpText: 'List all evidence reviewed (CCTV, records, emails, etc.)',
          validation: { required: true },
        },
        {
          id: 'statements_taken',
          type: 'yesNo',
          label: 'Were staff statements taken?',
          validation: { required: true },
        },
        {
          id: 'findings',
          type: 'textarea',
          label: 'Investigation Findings',
          validation: { required: true, minLength: 100 },
        },
        {
          id: 'complaint_upheld',
          type: 'select',
          label: 'Complaint Outcome',
          options: [
            { value: 'upheld', label: 'Upheld' },
            { value: 'partially_upheld', label: 'Partially Upheld' },
            { value: 'not_upheld', label: 'Not Upheld' },
            { value: 'inconclusive', label: 'Inconclusive - Further Investigation Needed' },
          ],
          validation: { required: true },
        },
        {
          id: 'root_cause',
          type: 'textarea',
          label: 'Root Cause Analysis',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'actions',
      title: 'Actions and Resolution',
      fields: [
        {
          id: 'immediate_actions',
          type: 'textarea',
          label: 'Immediate Actions Taken',
          validation: { required: true },
        },
        {
          id: 'customer_remedy',
          type: 'checkboxGroup',
          label: 'Customer Remedy',
          options: [
            { value: 'apology', label: 'Formal Apology' },
            { value: 'refund', label: 'Full/Partial Refund' },
            { value: 'complimentary', label: 'Complimentary Service' },
            { value: 'discount', label: 'Discount Voucher' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'process_improvements',
          type: 'textarea',
          label: 'Recommended Process Improvements',
        },
        {
          id: 'staff_training',
          type: 'yesNo',
          label: 'Is additional staff training required?',
          validation: { required: true },
        },
        {
          id: 'disciplinary_action',
          type: 'yesNo',
          label: 'Is disciplinary action recommended?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'disciplinary_action',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'Requires HR escalation for disciplinary consideration',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'customer_response_date',
          type: 'date',
          label: 'Date Customer Notified of Outcome',
          validation: { required: true },
        },
      ],
    },
  ],
};

// ============================================
// INCIDENT/SAFETY FORMS
// ============================================

const incidentNearMiss: FormDefinition = {
  id: 'plg_incident_near_miss',
  name: 'Incident / Near Miss Report',
  description: 'Report any incident or near miss that occurred',
  version: '1.0',
  brand: 'ALL',
  category: 'Health & Safety',
  requiresSignature: true,
  signatureLabel: 'Reporter',
  signatureDeclaration: 'I confirm this report is accurate to the best of my knowledge.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650, // 10 years
  sections: [
    {
      id: 'incident_info',
      title: 'Incident Information',
      fields: [
        {
          id: 'incident_type',
          type: 'select',
          label: 'Type of Report',
          options: [
            { value: 'incident', label: 'Incident' },
            { value: 'near_miss', label: 'Near Miss' },
            { value: 'dangerous_occurrence', label: 'Dangerous Occurrence (RIDDOR)' },
          ],
          validation: { required: true },
          stopConditions: [
            {
              field: 'incident_type',
              operator: 'equals',
              value: 'dangerous_occurrence',
              action: 'escalate',
              message: 'RIDDOR reportable - requires immediate senior management notification',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'incident_date',
          type: 'date',
          label: 'Date of Incident',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'incident_time',
          type: 'time',
          label: 'Time of Incident',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'location',
          type: 'text',
          label: 'Exact Location',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'persons_involved',
      title: 'Persons Involved',
      fields: [
        {
          id: 'person_type',
          type: 'checkboxGroup',
          label: 'Who was involved?',
          options: [
            { value: 'staff', label: 'Staff Member' },
            { value: 'client', label: 'Client/Customer' },
            { value: 'visitor', label: 'Visitor' },
            { value: 'contractor', label: 'Contractor' },
          ],
          validation: { required: true },
        },
        {
          id: 'persons_details',
          type: 'textarea',
          label: 'Names and Details of Persons Involved',
          validation: { required: true },
        },
        {
          id: 'witnesses',
          type: 'textarea',
          label: 'Witness Names and Contact Details',
        },
      ],
    },
    {
      id: 'incident_details',
      title: 'Incident Details',
      fields: [
        {
          id: 'description',
          type: 'textarea',
          label: 'Describe what happened',
          helpText: 'Include events leading up to the incident and any contributing factors',
          validation: { required: true, minLength: 50 },
        },
        {
          id: 'injury_occurred',
          type: 'yesNo',
          label: 'Did any injury occur?',
          validation: { required: true },
        },
        {
          id: 'injury_details',
          type: 'textarea',
          label: 'Describe the injury',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'injury_occurred', operator: 'equals', value: true }],
            logicType: 'and',
          },
          stopConditions: [
            {
              field: 'injury_occurred',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'Injury reported - ensure first aid records are complete',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'first_aid',
          type: 'yesNo',
          label: 'Was first aid administered?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'injury_occurred', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'hospital_visit',
          type: 'yesNo',
          label: 'Was hospital treatment required?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'injury_occurred', operator: 'equals', value: true }],
            logicType: 'and',
          },
          stopConditions: [
            {
              field: 'hospital_visit',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'Hospital treatment required - may be RIDDOR reportable',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'damage_occurred',
          type: 'yesNo',
          label: 'Was there any property damage?',
          validation: { required: true },
        },
        {
          id: 'damage_details',
          type: 'textarea',
          label: 'Describe the damage',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'damage_occurred', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'immediate_actions',
      title: 'Immediate Actions',
      fields: [
        {
          id: 'actions_taken',
          type: 'textarea',
          label: 'What immediate actions were taken?',
          validation: { required: true },
        },
        {
          id: 'area_secured',
          type: 'yesNo',
          label: 'Was the area made safe?',
          validation: { required: true },
        },
        {
          id: 'further_actions',
          type: 'textarea',
          label: 'What further actions are recommended?',
        },
      ],
    },
  ],
};

const safeguardingConcern: FormDefinition = {
  id: 'plg_safeguarding_concern',
  name: 'Safeguarding Concern Report',
  description: 'Report a safeguarding concern about a vulnerable person',
  version: '1.0',
  brand: 'ALL',
  category: 'Health & Safety',
  requiresSignature: true,
  signatureLabel: 'Reporter',
  signatureDeclaration: 'I confirm I have reported this concern in good faith.',
  allowDraft: false, // Safeguarding should be submitted immediately
  allowResume: false,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 9125, // 25 years
  sections: [
    {
      id: 'reporter_details',
      title: 'Reporter Details',
      fields: [
        {
          id: 'reporter_name',
          type: 'text',
          label: 'Your Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'reporter_role',
          type: 'text',
          label: 'Your Role',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'report_date',
          type: 'datetime',
          label: 'Date and Time of Report',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'person_at_risk',
      title: 'Person at Risk',
      fields: [
        {
          id: 'person_name',
          type: 'text',
          label: 'Name of Person at Risk',
          validation: { required: true },
        },
        {
          id: 'person_dob',
          type: 'date',
          label: 'Date of Birth (if known)',
          width: 'half',
        },
        {
          id: 'person_address',
          type: 'textarea',
          label: 'Address (if known)',
        },
        {
          id: 'person_relationship',
          type: 'text',
          label: 'Your Relationship to This Person',
          helpText: 'e.g., Client, seen at clinic',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'concern_details',
      title: 'Details of Concern',
      fields: [
        {
          id: 'concern_type',
          type: 'checkboxGroup',
          label: 'Type of Concern',
          options: [
            { value: 'physical_abuse', label: 'Physical Abuse' },
            { value: 'emotional_abuse', label: 'Emotional/Psychological Abuse' },
            { value: 'sexual_abuse', label: 'Sexual Abuse' },
            { value: 'neglect', label: 'Neglect' },
            { value: 'financial_abuse', label: 'Financial Abuse' },
            { value: 'self_neglect', label: 'Self-Neglect' },
            { value: 'domestic_abuse', label: 'Domestic Abuse' },
            { value: 'modern_slavery', label: 'Modern Slavery/Trafficking' },
            { value: 'radicalisation', label: 'Radicalisation/Extremism' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'immediate_danger',
          type: 'yesNo',
          label: 'Is this person in immediate danger?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'immediate_danger',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'IMMEDIATE ACTION REQUIRED: Contact emergency services (999) and designated safeguarding lead NOW',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'concern_description',
          type: 'textarea',
          label: 'Describe your concerns',
          helpText: 'Include what you saw, heard, or were told. Use the persons own words where possible.',
          validation: { required: true, minLength: 100 },
        },
        {
          id: 'incident_date',
          type: 'date',
          label: 'When did you become aware of this concern?',
          validation: { required: true },
        },
        {
          id: 'previous_concerns',
          type: 'yesNo',
          label: 'Have you had previous concerns about this person?',
          validation: { required: true },
        },
        {
          id: 'previous_concerns_details',
          type: 'textarea',
          label: 'Details of previous concerns',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'previous_concerns', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'actions_taken',
      title: 'Actions Taken',
      fields: [
        {
          id: 'spoken_to_person',
          type: 'yesNo',
          label: 'Have you spoken to the person at risk about your concerns?',
          validation: { required: true },
        },
        {
          id: 'person_response',
          type: 'textarea',
          label: 'What was their response?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'spoken_to_person', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'who_informed',
          type: 'checkboxGroup',
          label: 'Who else has been informed?',
          options: [
            { value: 'manager', label: 'Line Manager' },
            { value: 'safeguarding_lead', label: 'Safeguarding Lead' },
            { value: 'police', label: 'Police' },
            { value: 'social_services', label: 'Social Services' },
            { value: 'other', label: 'Other' },
          ],
        },
      ],
    },
  ],
};

// ============================================
// FINANCE FORMS
// ============================================

const refundRequest: FormDefinition = {
  id: 'plg_refund_request',
  name: 'Refund Request',
  description: 'Request a refund for services',
  version: '1.0',
  brand: 'ALL',
  category: 'Finance',
  requiresSignature: false,
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 2555,
  sections: [
    {
      id: 'customer_info',
      title: 'Customer Information',
      fields: [
        {
          id: 'customer_name',
          type: 'text',
          label: 'Customer Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'customer_email',
          type: 'email',
          label: 'Email Address',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'customer_phone',
          type: 'phone',
          label: 'Phone Number',
          width: 'half',
        },
      ],
    },
    {
      id: 'transaction_details',
      title: 'Transaction Details',
      fields: [
        {
          id: 'transaction_date',
          type: 'date',
          label: 'Date of Original Transaction',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'transaction_amount',
          type: 'number',
          label: 'Original Amount Paid',
          validation: { required: true, min: 0 },
          width: 'half',
        },
        {
          id: 'payment_method',
          type: 'select',
          label: 'Original Payment Method',
          options: [
            { value: 'card', label: 'Card Payment' },
            { value: 'cash', label: 'Cash' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
            { value: 'voucher', label: 'Voucher/Gift Card' },
          ],
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'service_received',
          type: 'text',
          label: 'Service/Treatment Received',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'refund_details',
      title: 'Refund Details',
      fields: [
        {
          id: 'refund_type',
          type: 'radio',
          label: 'Type of Refund Requested',
          options: [
            { value: 'full', label: 'Full Refund' },
            { value: 'partial', label: 'Partial Refund' },
          ],
          validation: { required: true },
        },
        {
          id: 'partial_amount',
          type: 'number',
          label: 'Partial Refund Amount Requested',
          validation: { required: true, min: 0 },
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'refund_type', operator: 'equals', value: 'partial' }],
            logicType: 'and',
          },
        },
        {
          id: 'refund_reason',
          type: 'select',
          label: 'Reason for Refund',
          options: [
            { value: 'service_not_provided', label: 'Service Not Provided' },
            { value: 'service_unsatisfactory', label: 'Service Quality Unsatisfactory' },
            { value: 'medical_reason', label: 'Medical Reason / Unable to Proceed' },
            { value: 'cancelled_advance', label: 'Cancellation (Within Policy)' },
            { value: 'double_charge', label: 'Double Charged' },
            { value: 'wrong_amount', label: 'Incorrect Amount Charged' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'reason_details',
          type: 'textarea',
          label: 'Please provide more details',
          validation: { required: true, minLength: 20 },
        },
      ],
    },
  ],
};

const refundApproval: FormDefinition = {
  id: 'plg_refund_approval',
  name: 'Refund Approval',
  description: 'Internal form to approve or decline refund requests',
  version: '1.0',
  brand: 'ALL',
  category: 'Finance',
  requiresSignature: true,
  signatureLabel: 'Approver',
  signatureDeclaration: 'I authorise this refund in accordance with company policy.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 2555,
  sections: [
    {
      id: 'request_reference',
      title: 'Request Reference',
      fields: [
        {
          id: 'refund_request_id',
          type: 'text',
          label: 'Refund Request Reference',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'customer_name',
          type: 'text',
          label: 'Customer Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'original_amount',
          type: 'number',
          label: 'Original Transaction Amount',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'requested_amount',
          type: 'number',
          label: 'Refund Amount Requested',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      fields: [
        {
          id: 'policy_check',
          type: 'yesNo',
          label: 'Is this refund within company policy?',
          validation: { required: true },
        },
        {
          id: 'evidence_reviewed',
          type: 'textarea',
          label: 'Evidence Reviewed',
          validation: { required: true },
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Review Notes',
        },
      ],
    },
    {
      id: 'decision',
      title: 'Decision',
      fields: [
        {
          id: 'decision',
          type: 'select',
          label: 'Decision',
          options: [
            { value: 'approved_full', label: 'Approved - Full Refund' },
            { value: 'approved_partial', label: 'Approved - Partial Refund' },
            { value: 'approved_voucher', label: 'Approved - Voucher/Credit Only' },
            { value: 'declined', label: 'Declined' },
            { value: 'escalate', label: 'Escalate to Senior Management' },
          ],
          validation: { required: true },
        },
        {
          id: 'approved_amount',
          type: 'number',
          label: 'Approved Refund Amount',
          conditionalLogic: {
            action: 'show',
            conditions: [
              { field: 'decision', operator: 'equals', value: 'approved_full' },
              { field: 'decision', operator: 'equals', value: 'approved_partial' },
            ],
            logicType: 'or',
          },
          validation: { required: true, min: 0 },
        },
        {
          id: 'decline_reason',
          type: 'textarea',
          label: 'Reason for Declining',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'decision', operator: 'equals', value: 'declined' }],
            logicType: 'and',
          },
          validation: { required: true },
        },
        {
          id: 'refund_method',
          type: 'select',
          label: 'Refund Method',
          options: [
            { value: 'original_method', label: 'Original Payment Method' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
            { value: 'voucher', label: 'Store Voucher' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [
              { field: 'decision', operator: 'equals', value: 'approved_full' },
              { field: 'decision', operator: 'equals', value: 'approved_partial' },
              { field: 'decision', operator: 'equals', value: 'approved_voucher' },
            ],
            logicType: 'or',
          },
        },
      ],
    },
  ],
};

const purchaseRequest: FormDefinition = {
  id: 'plg_purchase_request',
  name: 'Purchase Request',
  description: 'Request approval for business purchases',
  version: '1.0',
  brand: 'ALL',
  category: 'Finance',
  requiresSignature: true,
  signatureLabel: 'Requestor',
  signatureDeclaration: 'I confirm this purchase is required for legitimate business purposes.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 2555,
  sections: [
    {
      id: 'requestor_details',
      title: 'Requestor Details',
      fields: [
        {
          id: 'requestor_name',
          type: 'text',
          label: 'Your Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'department',
          type: 'text',
          label: 'Department/Location',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'request_date',
          type: 'date',
          label: 'Date of Request',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'required_by_date',
          type: 'date',
          label: 'Required By Date',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'purchase_details',
      title: 'Purchase Details',
      fields: [
        {
          id: 'item_description',
          type: 'textarea',
          label: 'Item(s) Description',
          helpText: 'Include quantity, specifications, and any relevant details',
          validation: { required: true },
        },
        {
          id: 'business_justification',
          type: 'textarea',
          label: 'Business Justification',
          helpText: 'Why is this purchase necessary?',
          validation: { required: true },
        },
        {
          id: 'estimated_cost',
          type: 'number',
          label: 'Estimated Cost (GBP)',
          validation: { required: true, min: 0 },
          width: 'half',
        },
        {
          id: 'budget_code',
          type: 'text',
          label: 'Budget Code (if known)',
          width: 'half',
        },
        {
          id: 'supplier_name',
          type: 'text',
          label: 'Preferred Supplier',
        },
        {
          id: 'quotes_obtained',
          type: 'yesNo',
          label: 'Have you obtained multiple quotes?',
          validation: { required: true },
        },
        {
          id: 'quotes_details',
          type: 'textarea',
          label: 'Quote Details',
          helpText: 'Provide details of quotes received',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'quotes_obtained', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
  ],
};

const expenseClaim: FormDefinition = {
  id: 'plg_expense_claim',
  name: 'Expense Claim',
  description: 'Claim reimbursement for business expenses',
  version: '1.0',
  brand: 'ALL',
  category: 'Finance',
  requiresSignature: true,
  signatureLabel: 'Claimant',
  signatureDeclaration: 'I confirm these expenses were incurred for legitimate business purposes and the amounts claimed are accurate.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 2555,
  sections: [
    {
      id: 'claimant_details',
      title: 'Claimant Details',
      fields: [
        {
          id: 'claimant_name',
          type: 'text',
          label: 'Your Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'department',
          type: 'text',
          label: 'Department',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'claim_date',
          type: 'date',
          label: 'Date of Claim',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'expense_details',
      title: 'Expense Details',
      fields: [
        {
          id: 'expense_date',
          type: 'date',
          label: 'Date Expense Incurred',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'expense_type',
          type: 'select',
          label: 'Expense Type',
          options: [
            { value: 'travel', label: 'Travel' },
            { value: 'accommodation', label: 'Accommodation' },
            { value: 'meals', label: 'Meals/Subsistence' },
            { value: 'parking', label: 'Parking' },
            { value: 'supplies', label: 'Office Supplies' },
            { value: 'training', label: 'Training/Course Fees' },
            { value: 'client_entertainment', label: 'Client Entertainment' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          validation: { required: true },
        },
        {
          id: 'amount',
          type: 'number',
          label: 'Amount Claimed (GBP)',
          validation: { required: true, min: 0 },
          width: 'half',
        },
        {
          id: 'receipt_attached',
          type: 'yesNo',
          label: 'Is a receipt attached?',
          validation: { required: true },
        },
        {
          id: 'receipt_file',
          type: 'file',
          label: 'Upload Receipt',
          acceptedFileTypes: ['image/*', 'application/pdf'],
          maxFileSize: 10485760, // 10MB
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'receipt_attached', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'bank_details',
      title: 'Payment Details',
      fields: [
        {
          id: 'payment_method',
          type: 'radio',
          label: 'Preferred Payment Method',
          options: [
            { value: 'payroll', label: 'Add to Next Payroll' },
            { value: 'bank_transfer', label: 'Direct Bank Transfer' },
          ],
          validation: { required: true },
        },
        {
          id: 'bank_account',
          type: 'text',
          label: 'Bank Account Number',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'payment_method', operator: 'equals', value: 'bank_transfer' }],
            logicType: 'and',
          },
          width: 'half',
        },
        {
          id: 'sort_code',
          type: 'text',
          label: 'Sort Code',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'payment_method', operator: 'equals', value: 'bank_transfer' }],
            logicType: 'and',
          },
          width: 'half',
        },
      ],
    },
  ],
};

// ============================================
// FEEDBACK & MARKETING FORMS
// ============================================

const feedbackForm: FormDefinition = {
  id: 'plg_feedback',
  name: 'Customer Feedback',
  description: 'Share your feedback about your experience',
  version: '1.0',
  brand: 'ALL',
  category: 'Customer Service',
  requiresSignature: false,
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: false,
  hasStopLogic: false,
  retentionDays: 1095, // 3 years
  sections: [
    {
      id: 'nps',
      title: 'How likely are you to recommend us?',
      fields: [
        {
          id: 'nps_score',
          type: 'nps',
          label: 'On a scale of 0-10, how likely are you to recommend us to a friend or colleague?',
          lowLabel: 'Not at all likely',
          highLabel: 'Extremely likely',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'service_feedback',
      title: 'Your Experience',
      fields: [
        {
          id: 'visit_date',
          type: 'date',
          label: 'Date of Visit',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'service_received',
          type: 'text',
          label: 'Service Received',
          width: 'half',
        },
        {
          id: 'staff_rating',
          type: 'rating',
          label: 'How would you rate our staff?',
          maxRating: 5,
          validation: { required: true },
        },
        {
          id: 'cleanliness_rating',
          type: 'rating',
          label: 'How would you rate our cleanliness?',
          maxRating: 5,
          validation: { required: true },
        },
        {
          id: 'value_rating',
          type: 'rating',
          label: 'How would you rate value for money?',
          maxRating: 5,
          validation: { required: true },
        },
        {
          id: 'comments',
          type: 'textarea',
          label: 'Any additional comments?',
          helpText: 'We appreciate all feedback to help us improve',
        },
        {
          id: 'can_contact',
          type: 'yesNo',
          label: 'May we contact you about your feedback?',
        },
      ],
    },
  ],
};

const marketingPreferences: FormDefinition = {
  id: 'plg_marketing_preferences',
  name: 'Marketing Preferences',
  description: 'Manage your communication preferences',
  version: '1.0',
  brand: 'ALL',
  category: 'Customer Service',
  requiresSignature: false,
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: false,
  hasStopLogic: false,
  retentionDays: 1095,
  sections: [
    {
      id: 'preferences',
      title: 'Communication Preferences',
      description: 'Choose how you would like to hear from us',
      fields: [
        {
          id: 'email_marketing',
          type: 'checkbox',
          label: 'I would like to receive marketing emails about offers and promotions',
        },
        {
          id: 'sms_marketing',
          type: 'checkbox',
          label: 'I would like to receive SMS messages about offers and promotions',
        },
        {
          id: 'phone_marketing',
          type: 'checkbox',
          label: 'I am happy to receive marketing calls',
        },
        {
          id: 'post_marketing',
          type: 'checkbox',
          label: 'I would like to receive postal marketing',
        },
        {
          id: 'frequency',
          type: 'select',
          label: 'How often would you like to hear from us?',
          options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'fortnightly', label: 'Every two weeks' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
          ],
        },
        {
          id: 'interests',
          type: 'checkboxGroup',
          label: 'What topics interest you?',
          options: [
            { value: 'new_services', label: 'New Services' },
            { value: 'special_offers', label: 'Special Offers' },
            { value: 'skincare_tips', label: 'Skincare Tips' },
            { value: 'events', label: 'Events' },
            { value: 'news', label: 'Company News' },
          ],
        },
      ],
    },
  ],
};

const imageConsent: FormDefinition = {
  id: 'plg_image_consent',
  name: 'Image Consent Form',
  description: 'Consent for use of photographs and images for marketing purposes',
  version: '1.0',
  brand: 'ALL',
  category: 'Customer Service',
  requiresSignature: true,
  signatureLabel: 'Client',
  signatureDeclaration: 'I consent to the use of my image as specified above.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650, // 10 years
  sections: [
    {
      id: 'consent_details',
      title: 'Image Consent',
      fields: [
        {
          id: 'intro_text',
          type: 'paragraph',
          label: '',
          content: 'We would like to use photographs or video footage of you and/or your results for marketing and promotional purposes. Please read carefully and indicate your consent below.',
        },
        {
          id: 'consent_purposes',
          type: 'checkboxGroup',
          label: 'I consent to my image being used for:',
          options: [
            { value: 'website', label: 'Company website' },
            { value: 'social_media', label: 'Social media (Instagram, Facebook, etc.)' },
            { value: 'print_materials', label: 'Print materials (brochures, leaflets)' },
            { value: 'advertising', label: 'Paid advertising' },
            { value: 'training', label: 'Internal training materials' },
            { value: 'before_after', label: 'Before and after galleries' },
          ],
          validation: { required: true },
        },
        {
          id: 'anonymity',
          type: 'radio',
          label: 'Would you like your images to be:',
          options: [
            { value: 'named', label: 'Used with my name/identifying information' },
            { value: 'anonymous', label: 'Used anonymously (no identifying information)' },
          ],
          validation: { required: true },
        },
        {
          id: 'duration',
          type: 'select',
          label: 'This consent is valid for:',
          options: [
            { value: '1_year', label: '1 year' },
            { value: '3_years', label: '3 years' },
            { value: '5_years', label: '5 years' },
            { value: 'indefinite', label: 'Indefinitely (until withdrawn)' },
          ],
          validation: { required: true },
        },
        {
          id: 'withdrawal_notice',
          type: 'paragraph',
          label: '',
          content: 'You may withdraw this consent at any time by contacting us in writing. Please note that any materials already in circulation may take time to be removed.',
        },
      ],
    },
  ],
};

// ============================================
// GDPR / SAR FORMS
// ============================================

const gdprSarRequest: FormDefinition = {
  id: 'plg_sar_request',
  name: 'Subject Access Request (SAR)',
  description: 'Internal form to process Subject Access Requests under GDPR',
  version: '1.0',
  brand: 'ALL',
  category: 'Governance',
  requiresSignature: true,
  signatureLabel: 'Data Protection Officer / Processor',
  signatureDeclaration: 'I confirm this SAR has been processed in accordance with GDPR requirements.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'request_details',
      title: 'Request Details',
      fields: [
        {
          id: 'request_received_date',
          type: 'date',
          label: 'Date Request Received',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'request_method',
          type: 'select',
          label: 'How was the request received?',
          options: [
            { value: 'email', label: 'Email' },
            { value: 'post', label: 'Post' },
            { value: 'verbal', label: 'Verbal (now confirmed in writing)' },
            { value: 'online_form', label: 'Online Form' },
          ],
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'deadline_date',
          type: 'date',
          label: 'Response Deadline (30 days from receipt)',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'requestor_info',
      title: 'Requestor Information',
      fields: [
        {
          id: 'requestor_name',
          type: 'text',
          label: 'Requestor Name',
          validation: { required: true },
        },
        {
          id: 'requestor_email',
          type: 'email',
          label: 'Email Address',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'requestor_phone',
          type: 'phone',
          label: 'Phone Number',
          width: 'half',
        },
        {
          id: 'identity_verified',
          type: 'yesNo',
          label: 'Has the requestors identity been verified?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'identity_verified',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'Identity must be verified before processing SAR',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'verification_method',
          type: 'text',
          label: 'Verification Method Used',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'identity_verified', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'processing',
      title: 'Processing',
      fields: [
        {
          id: 'data_located',
          type: 'checkboxGroup',
          label: 'Data located in:',
          options: [
            { value: 'crm', label: 'CRM System' },
            { value: 'booking', label: 'Booking System' },
            { value: 'forms', label: 'Digital Forms' },
            { value: 'email', label: 'Email Archives' },
            { value: 'paper', label: 'Paper Records' },
            { value: 'cctv', label: 'CCTV' },
            { value: 'other', label: 'Other Systems' },
          ],
        },
        {
          id: 'exemptions_applied',
          type: 'yesNo',
          label: 'Were any exemptions applied?',
          validation: { required: true },
        },
        {
          id: 'exemption_details',
          type: 'textarea',
          label: 'Exemption Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'exemptions_applied', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'third_party_data',
          type: 'yesNo',
          label: 'Does the data include third-party information?',
          validation: { required: true },
        },
        {
          id: 'third_party_handling',
          type: 'textarea',
          label: 'How was third-party data handled?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'third_party_data', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'completion',
      title: 'Completion',
      fields: [
        {
          id: 'response_date',
          type: 'date',
          label: 'Date Response Sent',
          validation: { required: true },
        },
        {
          id: 'delivery_method',
          type: 'select',
          label: 'Response Delivery Method',
          options: [
            { value: 'encrypted_email', label: 'Encrypted Email' },
            { value: 'secure_portal', label: 'Secure Portal Download' },
            { value: 'post', label: 'Recorded Delivery Post' },
            { value: 'collected', label: 'Collected in Person' },
          ],
          validation: { required: true },
        },
        {
          id: 'within_deadline',
          type: 'yesNo',
          label: 'Was the response within the 30-day deadline?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'within_deadline',
              operator: 'equals',
              value: false,
              action: 'flag',
              message: 'SAR response deadline missed - document reason',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Additional Notes',
        },
      ],
    },
  ],
};

// ============================================
// OPERATIONS FORMS
// ============================================

const dailyOpenChecklist: FormDefinition = {
  id: 'plg_daily_open_checklist',
  name: 'Daily Opening Checklist',
  description: 'Complete this checklist when opening the clinic',
  version: '1.0',
  brand: 'ALL',
  category: 'Operations',
  requiresSignature: true,
  signatureLabel: 'Staff Member',
  signatureDeclaration: 'I confirm all checks have been completed.',
  allowDraft: false,
  allowResume: false,
  requiresClient: false,
  generatePdf: false,
  hasStopLogic: true,
  retentionDays: 365,
  sections: [
    {
      id: 'opening_info',
      title: 'Opening Information',
      fields: [
        {
          id: 'date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'staff_name',
          type: 'text',
          label: 'Staff Member Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'arrival_time',
          type: 'time',
          label: 'Arrival Time',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'security_checks',
      title: 'Security Checks',
      fields: [
        {
          id: 'premises_secure',
          type: 'yesNo',
          label: 'Were premises secure on arrival?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'premises_secure',
              operator: 'equals',
              value: false,
              action: 'escalate',
              message: 'Security issue - premises not secure on arrival',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'alarm_status',
          type: 'select',
          label: 'Alarm Status',
          options: [
            { value: 'armed', label: 'Armed - deactivated as normal' },
            { value: 'not_armed', label: 'Not armed on arrival' },
            { value: 'triggered', label: 'Alarm had been triggered' },
            { value: 'no_alarm', label: 'No alarm system' },
          ],
          validation: { required: true },
        },
        {
          id: 'security_notes',
          type: 'textarea',
          label: 'Security Notes (if any issues)',
          conditionalLogic: {
            action: 'show',
            conditions: [
              { field: 'premises_secure', operator: 'equals', value: false },
              { field: 'alarm_status', operator: 'equals', value: 'triggered' },
            ],
            logicType: 'or',
          },
        },
      ],
    },
    {
      id: 'facility_checks',
      title: 'Facility Checks',
      fields: [
        {
          id: 'lights_working',
          type: 'yesNoNa',
          label: 'All lights working',
          validation: { required: true },
        },
        {
          id: 'heating_cooling',
          type: 'yesNoNa',
          label: 'Heating/cooling functioning',
          validation: { required: true },
        },
        {
          id: 'water_running',
          type: 'yesNoNa',
          label: 'Hot and cold water running',
          validation: { required: true },
        },
        {
          id: 'toilets_clean',
          type: 'yesNoNa',
          label: 'Toilets clean and stocked',
          validation: { required: true },
        },
        {
          id: 'waiting_area',
          type: 'yesNoNa',
          label: 'Waiting area clean and tidy',
          validation: { required: true },
        },
        {
          id: 'treatment_rooms',
          type: 'yesNoNa',
          label: 'Treatment rooms prepared',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'health_safety',
      title: 'Health & Safety',
      fields: [
        {
          id: 'fire_exits_clear',
          type: 'yesNo',
          label: 'Fire exits clear and accessible',
          validation: { required: true },
          stopConditions: [
            {
              field: 'fire_exits_clear',
              operator: 'equals',
              value: false,
              action: 'escalate',
              message: 'Fire safety issue - exits not clear',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'first_aid_kit',
          type: 'yesNo',
          label: 'First aid kit stocked and accessible',
          validation: { required: true },
        },
        {
          id: 'hazards_identified',
          type: 'yesNo',
          label: 'Any hazards identified?',
          validation: { required: true },
        },
        {
          id: 'hazard_details',
          type: 'textarea',
          label: 'Hazard Details and Action Taken',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'hazards_identified', operator: 'equals', value: true }],
            logicType: 'and',
          },
          validation: { required: true },
        },
      ],
    },
    {
      id: 'equipment',
      title: 'Equipment',
      fields: [
        {
          id: 'computers_working',
          type: 'yesNoNa',
          label: 'Computers and booking system working',
          validation: { required: true },
        },
        {
          id: 'card_machine',
          type: 'yesNoNa',
          label: 'Card payment machine working',
          validation: { required: true },
        },
        {
          id: 'phone_system',
          type: 'yesNoNa',
          label: 'Phone system working',
          validation: { required: true },
        },
        {
          id: 'equipment_issues',
          type: 'textarea',
          label: 'Equipment Issues to Report',
        },
      ],
    },
  ],
};

const dailyCloseChecklist: FormDefinition = {
  id: 'plg_daily_close_checklist',
  name: 'Daily Closing Checklist',
  description: 'Complete this checklist when closing the clinic',
  version: '1.0',
  brand: 'ALL',
  category: 'Operations',
  requiresSignature: true,
  signatureLabel: 'Staff Member',
  signatureDeclaration: 'I confirm all closing procedures have been completed.',
  allowDraft: false,
  allowResume: false,
  requiresClient: false,
  generatePdf: false,
  hasStopLogic: false,
  retentionDays: 365,
  sections: [
    {
      id: 'closing_info',
      title: 'Closing Information',
      fields: [
        {
          id: 'date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'staff_name',
          type: 'text',
          label: 'Staff Member Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'closing_time',
          type: 'time',
          label: 'Closing Time',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'client_checks',
      title: 'Client Checks',
      fields: [
        {
          id: 'all_clients_left',
          type: 'yesNo',
          label: 'All clients have left the building',
          validation: { required: true },
        },
        {
          id: 'lost_property',
          type: 'yesNo',
          label: 'Any lost property found?',
          validation: { required: true },
        },
        {
          id: 'lost_property_details',
          type: 'textarea',
          label: 'Lost Property Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'lost_property', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'security_closing',
      title: 'Security',
      fields: [
        {
          id: 'windows_locked',
          type: 'yesNo',
          label: 'All windows closed and locked',
          validation: { required: true },
        },
        {
          id: 'back_door_locked',
          type: 'yesNo',
          label: 'Back door/fire exits secured',
          validation: { required: true },
        },
        {
          id: 'cash_secured',
          type: 'yesNo',
          label: 'Cash secured in safe',
          validation: { required: true },
        },
        {
          id: 'sensitive_materials',
          type: 'yesNo',
          label: 'Sensitive materials secured',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'utilities',
      title: 'Utilities & Equipment',
      fields: [
        {
          id: 'equipment_off',
          type: 'yesNo',
          label: 'Non-essential equipment switched off',
          validation: { required: true },
        },
        {
          id: 'heating_adjusted',
          type: 'yesNo',
          label: 'Heating/cooling adjusted for overnight',
          validation: { required: true },
        },
        {
          id: 'lights_off',
          type: 'yesNo',
          label: 'All unnecessary lights switched off',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'cleaning',
      title: 'Cleaning & Preparation',
      fields: [
        {
          id: 'treatment_rooms_cleaned',
          type: 'yesNo',
          label: 'Treatment rooms cleaned and prepared',
          validation: { required: true },
        },
        {
          id: 'bins_emptied',
          type: 'yesNo',
          label: 'Bins emptied',
          validation: { required: true },
        },
        {
          id: 'clinical_waste',
          type: 'yesNo',
          label: 'Clinical waste disposed of correctly',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'final',
      title: 'Final Checks',
      fields: [
        {
          id: 'alarm_set',
          type: 'yesNo',
          label: 'Alarm system armed',
          validation: { required: true },
        },
        {
          id: 'front_door_locked',
          type: 'yesNo',
          label: 'Front door locked',
          validation: { required: true },
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Any notes for tomorrow',
        },
      ],
    },
  ],
};

const cleaningLog: FormDefinition = {
  id: 'plg_cleaning_log',
  name: 'Cleaning Log',
  description: 'Record cleaning activities',
  version: '1.0',
  brand: 'ALL',
  category: 'Operations',
  requiresSignature: true,
  signatureLabel: 'Cleaner',
  signatureDeclaration: 'I confirm these cleaning tasks have been completed.',
  allowDraft: false,
  allowResume: false,
  requiresClient: false,
  generatePdf: false,
  hasStopLogic: false,
  retentionDays: 365,
  sections: [
    {
      id: 'log_info',
      title: 'Log Information',
      fields: [
        {
          id: 'date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'time',
          type: 'time',
          label: 'Time',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'cleaner_name',
          type: 'text',
          label: 'Cleaner Name',
          validation: { required: true },
        },
        {
          id: 'cleaning_type',
          type: 'select',
          label: 'Type of Clean',
          options: [
            { value: 'routine', label: 'Routine Daily Clean' },
            { value: 'deep', label: 'Deep Clean' },
            { value: 'between_client', label: 'Between Client Clean' },
            { value: 'spillage', label: 'Spillage/Incident Clean' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'areas_cleaned',
      title: 'Areas Cleaned',
      fields: [
        {
          id: 'reception',
          type: 'yesNo',
          label: 'Reception Area',
        },
        {
          id: 'waiting_room',
          type: 'yesNo',
          label: 'Waiting Room',
        },
        {
          id: 'treatment_rooms',
          type: 'checkboxGroup',
          label: 'Treatment Rooms',
          options: [
            { value: 'room_1', label: 'Room 1' },
            { value: 'room_2', label: 'Room 2' },
            { value: 'room_3', label: 'Room 3' },
            { value: 'room_4', label: 'Room 4' },
            { value: 'room_5', label: 'Room 5' },
          ],
        },
        {
          id: 'toilets',
          type: 'yesNo',
          label: 'Toilets',
        },
        {
          id: 'staff_area',
          type: 'yesNo',
          label: 'Staff Area',
        },
        {
          id: 'kitchen',
          type: 'yesNo',
          label: 'Kitchen/Break Room',
        },
      ],
    },
    {
      id: 'tasks',
      title: 'Tasks Completed',
      fields: [
        {
          id: 'surfaces_wiped',
          type: 'yesNo',
          label: 'Surfaces wiped and disinfected',
        },
        {
          id: 'floors_cleaned',
          type: 'yesNo',
          label: 'Floors swept/mopped',
        },
        {
          id: 'bins_emptied',
          type: 'yesNo',
          label: 'Bins emptied',
        },
        {
          id: 'consumables_restocked',
          type: 'yesNo',
          label: 'Consumables restocked (soap, paper towels, etc.)',
        },
        {
          id: 'equipment_cleaned',
          type: 'yesNo',
          label: 'Equipment cleaned/sanitised',
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Notes or Issues',
        },
      ],
    },
  ],
};

const equipmentMaintenanceLog: FormDefinition = {
  id: 'plg_equipment_maintenance',
  name: 'Equipment Maintenance Log',
  description: 'Record equipment maintenance and servicing',
  version: '1.0',
  brand: 'ALL',
  category: 'Operations',
  requiresSignature: true,
  signatureLabel: 'Staff Member / Engineer',
  signatureDeclaration: 'I confirm this maintenance record is accurate.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'equipment_info',
      title: 'Equipment Information',
      fields: [
        {
          id: 'equipment_name',
          type: 'text',
          label: 'Equipment Name',
          validation: { required: true },
        },
        {
          id: 'serial_number',
          type: 'text',
          label: 'Serial Number / Asset ID',
          width: 'half',
        },
        {
          id: 'manufacturer',
          type: 'text',
          label: 'Manufacturer',
          width: 'half',
        },
        {
          id: 'location',
          type: 'text',
          label: 'Location',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'maintenance_details',
      title: 'Maintenance Details',
      fields: [
        {
          id: 'maintenance_date',
          type: 'date',
          label: 'Date of Maintenance',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'maintenance_type',
          type: 'select',
          label: 'Type of Maintenance',
          options: [
            { value: 'routine', label: 'Routine Service' },
            { value: 'repair', label: 'Repair' },
            { value: 'calibration', label: 'Calibration' },
            { value: 'pat', label: 'PAT Testing' },
            { value: 'safety_check', label: 'Safety Check' },
            { value: 'breakdown', label: 'Breakdown Repair' },
          ],
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'performed_by',
          type: 'text',
          label: 'Performed By',
          validation: { required: true },
        },
        {
          id: 'is_external',
          type: 'yesNo',
          label: 'External Engineer?',
          validation: { required: true },
        },
        {
          id: 'company_name',
          type: 'text',
          label: 'Company Name',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'is_external', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'work_description',
          type: 'textarea',
          label: 'Description of Work',
          validation: { required: true },
        },
        {
          id: 'parts_replaced',
          type: 'textarea',
          label: 'Parts Replaced (if any)',
        },
      ],
    },
    {
      id: 'outcome',
      title: 'Outcome',
      fields: [
        {
          id: 'equipment_status',
          type: 'select',
          label: 'Equipment Status After Maintenance',
          options: [
            { value: 'operational', label: 'Fully Operational' },
            { value: 'limited', label: 'Operational with Limitations' },
            { value: 'out_of_service', label: 'Out of Service - Requires Further Work' },
            { value: 'condemned', label: 'Beyond Repair - To Be Replaced' },
          ],
          validation: { required: true },
          stopConditions: [
            {
              field: 'equipment_status',
              operator: 'equals',
              value: 'condemned',
              action: 'escalate',
              message: 'Equipment condemned - requires replacement approval',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'next_service_date',
          type: 'date',
          label: 'Next Service Due',
        },
        {
          id: 'cost',
          type: 'number',
          label: 'Cost (GBP)',
          width: 'half',
        },
        {
          id: 'invoice_number',
          type: 'text',
          label: 'Invoice Number',
          width: 'half',
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Additional Notes',
        },
      ],
    },
  ],
};

const fireSafetyCheck: FormDefinition = {
  id: 'plg_fire_safety_weekly',
  name: 'Fire Safety Weekly Check',
  description: 'Weekly fire safety inspection',
  version: '1.0',
  brand: 'ALL',
  category: 'Health & Safety',
  requiresSignature: true,
  signatureLabel: 'Fire Warden / Staff Member',
  signatureDeclaration: 'I confirm this fire safety check has been completed.',
  allowDraft: false,
  allowResume: false,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'check_info',
      title: 'Check Information',
      fields: [
        {
          id: 'date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'checked_by',
          type: 'text',
          label: 'Checked By',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'fire_exits',
      title: 'Fire Exits',
      fields: [
        {
          id: 'exits_clear',
          type: 'yesNo',
          label: 'All fire exits clear and unobstructed',
          validation: { required: true },
          stopConditions: [
            {
              field: 'exits_clear',
              operator: 'equals',
              value: false,
              action: 'escalate',
              message: 'Fire exits blocked - immediate action required',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'exit_signs_visible',
          type: 'yesNo',
          label: 'Exit signs visible and illuminated',
          validation: { required: true },
        },
        {
          id: 'doors_operating',
          type: 'yesNo',
          label: 'Fire doors operating correctly',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'fire_equipment',
      title: 'Fire Fighting Equipment',
      fields: [
        {
          id: 'extinguishers_present',
          type: 'yesNo',
          label: 'Fire extinguishers present and accessible',
          validation: { required: true },
        },
        {
          id: 'extinguishers_inspected',
          type: 'yesNo',
          label: 'Extinguishers showing valid inspection tags',
          validation: { required: true },
        },
        {
          id: 'extinguisher_pressure',
          type: 'yesNo',
          label: 'Extinguisher pressure gauges in green zone',
          validation: { required: true },
        },
        {
          id: 'fire_blanket',
          type: 'yesNo',
          label: 'Fire blanket present and accessible',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'detection',
      title: 'Detection & Alarm',
      fields: [
        {
          id: 'smoke_detectors',
          type: 'yesNo',
          label: 'Smoke detectors present and indicator lights on',
          validation: { required: true },
        },
        {
          id: 'alarm_panel',
          type: 'yesNo',
          label: 'Fire alarm panel showing normal status',
          validation: { required: true },
          stopConditions: [
            {
              field: 'alarm_panel',
              operator: 'equals',
              value: false,
              action: 'escalate',
              message: 'Fire alarm panel fault - engineer required',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'call_points',
          type: 'yesNo',
          label: 'Manual call points unobstructed',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'documentation',
      title: 'Documentation & Signage',
      fields: [
        {
          id: 'evacuation_plan',
          type: 'yesNo',
          label: 'Evacuation plan displayed',
          validation: { required: true },
        },
        {
          id: 'assembly_point',
          type: 'yesNo',
          label: 'Assembly point sign visible',
          validation: { required: true },
        },
        {
          id: 'fire_action_notice',
          type: 'yesNo',
          label: 'Fire action notices displayed',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'issues',
      title: 'Issues & Actions',
      fields: [
        {
          id: 'issues_found',
          type: 'yesNo',
          label: 'Were any issues found?',
          validation: { required: true },
        },
        {
          id: 'issue_details',
          type: 'textarea',
          label: 'Issue Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'issues_found', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'action_taken',
          type: 'textarea',
          label: 'Action Taken / Required',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'issues_found', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
  ],
};

// ============================================
// HR FORMS
// ============================================

const newStarterOnboarding: FormDefinition = {
  id: 'plg_new_starter_onboarding',
  name: 'New Starter Onboarding',
  description: 'Onboarding checklist for new team members',
  version: '1.0',
  brand: 'ALL',
  category: 'HR',
  requiresSignature: true,
  signatureLabel: 'Manager',
  signatureDeclaration: 'I confirm this onboarding has been completed.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'employee_info',
      title: 'Employee Information',
      fields: [
        {
          id: 'employee_name',
          type: 'text',
          label: 'Employee Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'job_title',
          type: 'text',
          label: 'Job Title',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'start_date',
          type: 'date',
          label: 'Start Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'manager_name',
          type: 'text',
          label: 'Line Manager',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'day_one',
      title: 'Day One - Essentials',
      fields: [
        {
          id: 'welcome_tour',
          type: 'yesNo',
          label: 'Welcome and building tour completed',
        },
        {
          id: 'introduced_team',
          type: 'yesNo',
          label: 'Introduced to team members',
        },
        {
          id: 'workstation_setup',
          type: 'yesNo',
          label: 'Workstation set up',
        },
        {
          id: 'keys_access',
          type: 'yesNo',
          label: 'Keys/access cards issued',
        },
        {
          id: 'uniform',
          type: 'yesNo',
          label: 'Uniform provided (if applicable)',
        },
        {
          id: 'emergency_procedures',
          type: 'yesNo',
          label: 'Fire exits and emergency procedures explained',
        },
      ],
    },
    {
      id: 'week_one',
      title: 'Week One - Documentation',
      fields: [
        {
          id: 'right_to_work',
          type: 'yesNo',
          label: 'Right to work documents verified',
        },
        {
          id: 'contract_signed',
          type: 'yesNo',
          label: 'Employment contract signed',
        },
        {
          id: 'handbook_issued',
          type: 'yesNo',
          label: 'Employee handbook issued',
        },
        {
          id: 'payroll_setup',
          type: 'yesNo',
          label: 'Payroll details collected',
        },
        {
          id: 'pension_info',
          type: 'yesNo',
          label: 'Pension information provided',
        },
      ],
    },
    {
      id: 'training',
      title: 'Training',
      fields: [
        {
          id: 'health_safety',
          type: 'yesNo',
          label: 'Health & Safety induction',
        },
        {
          id: 'gdpr_training',
          type: 'yesNo',
          label: 'GDPR/Data Protection training',
        },
        {
          id: 'safeguarding',
          type: 'yesNo',
          label: 'Safeguarding awareness',
        },
        {
          id: 'fire_safety',
          type: 'yesNo',
          label: 'Fire safety training',
        },
        {
          id: 'role_specific',
          type: 'yesNo',
          label: 'Role-specific training scheduled',
        },
      ],
    },
    {
      id: 'systems',
      title: 'Systems Access',
      fields: [
        {
          id: 'email_setup',
          type: 'yesNo',
          label: 'Email account created',
        },
        {
          id: 'booking_system',
          type: 'yesNo',
          label: 'Booking system access',
        },
        {
          id: 'till_training',
          type: 'yesNo',
          label: 'Till/payment system training',
        },
        {
          id: 'rota_system',
          type: 'yesNo',
          label: 'Added to rota system',
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      fields: [
        {
          id: 'probation_dates',
          type: 'yesNo',
          label: 'Probation review dates set',
        },
        {
          id: 'objectives_set',
          type: 'yesNo',
          label: 'Initial objectives discussed',
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Additional Notes',
        },
      ],
    },
  ],
};

const trainingSignoff: FormDefinition = {
  id: 'plg_training_signoff',
  name: 'Training Completion Sign-off',
  description: 'Record completion of training',
  version: '1.0',
  brand: 'ALL',
  category: 'HR',
  requiresSignature: true,
  signatureLabel: 'Trainee',
  signatureDeclaration: 'I confirm I have completed and understood this training.',
  allowDraft: false,
  allowResume: false,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'trainee_info',
      title: 'Trainee Information',
      fields: [
        {
          id: 'trainee_name',
          type: 'text',
          label: 'Trainee Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'job_title',
          type: 'text',
          label: 'Job Title',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'training_details',
      title: 'Training Details',
      fields: [
        {
          id: 'training_title',
          type: 'text',
          label: 'Training Title',
          validation: { required: true },
        },
        {
          id: 'training_type',
          type: 'select',
          label: 'Training Type',
          options: [
            { value: 'mandatory', label: 'Mandatory/Compliance' },
            { value: 'role_specific', label: 'Role Specific' },
            { value: 'development', label: 'Professional Development' },
            { value: 'refresher', label: 'Refresher Training' },
            { value: 'product', label: 'Product Training' },
          ],
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'training_date',
          type: 'date',
          label: 'Training Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'duration',
          type: 'text',
          label: 'Duration',
          width: 'half',
        },
        {
          id: 'trainer',
          type: 'text',
          label: 'Trainer/Provider',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'delivery_method',
          type: 'select',
          label: 'Delivery Method',
          options: [
            { value: 'in_person', label: 'In Person' },
            { value: 'online', label: 'Online/E-Learning' },
            { value: 'webinar', label: 'Webinar' },
            { value: 'shadowing', label: 'Shadowing/On the Job' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'assessment',
      title: 'Assessment',
      fields: [
        {
          id: 'assessment_completed',
          type: 'yesNo',
          label: 'Was an assessment completed?',
          validation: { required: true },
        },
        {
          id: 'assessment_result',
          type: 'select',
          label: 'Assessment Result',
          options: [
            { value: 'pass', label: 'Pass' },
            { value: 'fail', label: 'Fail - Retake Required' },
            { value: 'na', label: 'Not Applicable' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'assessment_completed', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'certificate_issued',
          type: 'yesNo',
          label: 'Certificate issued?',
        },
        {
          id: 'certificate_expiry',
          type: 'date',
          label: 'Certificate Expiry Date',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'certificate_issued', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      fields: [
        {
          id: 'understood',
          type: 'checkbox',
          label: 'I confirm I have understood the training content',
          validation: { required: true },
        },
        {
          id: 'competent',
          type: 'checkbox',
          label: 'I feel competent to apply this training in my role',
          validation: { required: true },
        },
        {
          id: 'questions',
          type: 'textarea',
          label: 'Any questions or areas needing clarification?',
        },
      ],
    },
  ],
};

// ============================================
// IT FORMS
// ============================================

const accessRequest: FormDefinition = {
  id: 'plg_access_request',
  name: 'IT Access Request',
  description: 'Request access to IT systems',
  version: '1.0',
  brand: 'ALL',
  category: 'IT',
  requiresSignature: true,
  signatureLabel: 'Line Manager',
  signatureDeclaration: 'I authorise this access request.',
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 2555,
  sections: [
    {
      id: 'requestor_info',
      title: 'Requestor Information',
      fields: [
        {
          id: 'employee_name',
          type: 'text',
          label: 'Employee Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'job_title',
          type: 'text',
          label: 'Job Title',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'department',
          type: 'text',
          label: 'Department',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'start_date',
          type: 'date',
          label: 'Employment Start Date',
          width: 'half',
        },
      ],
    },
    {
      id: 'request_type',
      title: 'Request Type',
      fields: [
        {
          id: 'request_type',
          type: 'select',
          label: 'Type of Request',
          options: [
            { value: 'new_user', label: 'New User Setup' },
            { value: 'additional_access', label: 'Additional Access' },
            { value: 'modify_access', label: 'Modify Existing Access' },
            { value: 'remove_access', label: 'Remove Access' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'access_required',
      title: 'Access Required',
      fields: [
        {
          id: 'systems_required',
          type: 'checkboxGroup',
          label: 'Systems Access Required',
          options: [
            { value: 'email', label: 'Email (Microsoft 365)' },
            { value: 'booking_system', label: 'Booking System' },
            { value: 'pos', label: 'Point of Sale System' },
            { value: 'forms', label: 'Forms Platform' },
            { value: 'hr_system', label: 'HR System' },
            { value: 'finance', label: 'Finance System' },
            { value: 'stock', label: 'Stock Management' },
            { value: 'cctv', label: 'CCTV Access' },
          ],
        },
        {
          id: 'access_level',
          type: 'select',
          label: 'Access Level',
          options: [
            { value: 'read_only', label: 'Read Only' },
            { value: 'standard', label: 'Standard User' },
            { value: 'elevated', label: 'Elevated/Power User' },
            { value: 'admin', label: 'Administrator' },
          ],
          validation: { required: true },
        },
        {
          id: 'justification',
          type: 'textarea',
          label: 'Business Justification',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'manager_approval',
      title: 'Manager Approval',
      fields: [
        {
          id: 'manager_name',
          type: 'text',
          label: 'Approving Manager Name',
          validation: { required: true },
        },
        {
          id: 'approval_date',
          type: 'date',
          label: 'Approval Date',
          validation: { required: true },
        },
      ],
    },
  ],
};

const itIssueTicket: FormDefinition = {
  id: 'plg_it_issue',
  name: 'IT Issue Ticket',
  description: 'Report an IT issue or request support',
  version: '1.0',
  brand: 'ALL',
  category: 'IT',
  requiresSignature: false,
  allowDraft: true,
  allowResume: true,
  requiresClient: false,
  generatePdf: false,
  hasStopLogic: true,
  retentionDays: 1095,
  sections: [
    {
      id: 'reporter_info',
      title: 'Reporter Information',
      fields: [
        {
          id: 'reporter_name',
          type: 'text',
          label: 'Your Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'location',
          type: 'text',
          label: 'Location',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'contact_phone',
          type: 'phone',
          label: 'Contact Phone',
          width: 'half',
        },
        {
          id: 'contact_email',
          type: 'email',
          label: 'Contact Email',
          width: 'half',
        },
      ],
    },
    {
      id: 'issue_details',
      title: 'Issue Details',
      fields: [
        {
          id: 'urgency',
          type: 'select',
          label: 'Urgency',
          options: [
            { value: 'critical', label: 'Critical - Business Stopped' },
            { value: 'high', label: 'High - Significant Impact' },
            { value: 'medium', label: 'Medium - Some Impact' },
            { value: 'low', label: 'Low - Minor Inconvenience' },
          ],
          validation: { required: true },
          stopConditions: [
            {
              field: 'urgency',
              operator: 'equals',
              value: 'critical',
              action: 'escalate',
              message: 'Critical IT issue - requires immediate attention',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'category',
          type: 'select',
          label: 'Category',
          options: [
            { value: 'hardware', label: 'Hardware Issue' },
            { value: 'software', label: 'Software Issue' },
            { value: 'network', label: 'Network/Internet' },
            { value: 'email', label: 'Email' },
            { value: 'printer', label: 'Printer' },
            { value: 'booking_system', label: 'Booking System' },
            { value: 'payment', label: 'Payment System' },
            { value: 'phone', label: 'Phone System' },
            { value: 'security', label: 'Security Concern' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'affected_system',
          type: 'text',
          label: 'Affected System/Device',
          validation: { required: true },
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Describe the Issue',
          helpText: 'Include any error messages, what you were doing when the issue occurred',
          validation: { required: true, minLength: 20 },
        },
        {
          id: 'when_started',
          type: 'datetime',
          label: 'When did the issue start?',
        },
        {
          id: 'steps_tried',
          type: 'textarea',
          label: 'What have you already tried?',
        },
      ],
    },
    {
      id: 'security',
      title: 'Security',
      fields: [
        {
          id: 'security_concern',
          type: 'yesNo',
          label: 'Is this a potential security issue?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'security_concern',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'Security concern - requires immediate review',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'security_details',
          type: 'textarea',
          label: 'Security Concern Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'security_concern', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
  ],
};

// ============================================
// EXPORT ALL PLG UK FORMS
// ============================================

export const plgUkForms: FormDefinition[] = [
  // Customer Service
  complaintForm,
  complaintInvestigation,
  feedbackForm,
  marketingPreferences,
  imageConsent,

  // Health & Safety
  incidentNearMiss,
  safeguardingConcern,
  fireSafetyCheck,

  // Finance
  refundRequest,
  refundApproval,
  purchaseRequest,
  expenseClaim,

  // Governance
  gdprSarRequest,

  // Operations
  dailyOpenChecklist,
  dailyCloseChecklist,
  cleaningLog,
  equipmentMaintenanceLog,

  // HR
  newStarterOnboarding,
  trainingSignoff,

  // IT
  accessRequest,
  itIssueTicket,
];

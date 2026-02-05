import { FormDefinition } from '../types';

// ============================================
// WAX FOR WOMEN FORM DEFINITIONS
// Female Waxing Services
// ============================================

const clientIntake: FormDefinition = {
  id: 'wfw_client_intake',
  name: 'Client Intake Form',
  description: 'New client registration and intake',
  version: '1.0',
  brand: 'WAX_FOR_WOMEN',
  category: 'Client Records',
  requiresSignature: true,
  signatureLabel: 'Client',
  signatureDeclaration: 'I confirm the information provided is accurate and complete.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 2555,
  sections: [
    {
      id: 'personal_details',
      title: 'Personal Details',
      fields: [
        {
          id: 'first_name',
          type: 'text',
          label: 'First Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'last_name',
          type: 'text',
          label: 'Last Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'date_of_birth',
          type: 'date',
          label: 'Date of Birth',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'phone',
          type: 'phone',
          label: 'Mobile Phone',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'address',
      title: 'Address',
      fields: [
        {
          id: 'address_line_1',
          type: 'text',
          label: 'Address Line 1',
        },
        {
          id: 'city',
          type: 'text',
          label: 'City/Town',
          width: 'half',
        },
        {
          id: 'postcode',
          type: 'text',
          label: 'Postcode',
          width: 'half',
        },
      ],
    },
    {
      id: 'emergency_contact',
      title: 'Emergency Contact',
      fields: [
        {
          id: 'emergency_name',
          type: 'text',
          label: 'Emergency Contact Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'emergency_phone',
          type: 'phone',
          label: 'Emergency Contact Phone',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'waxing_history',
      title: 'Waxing Experience',
      fields: [
        {
          id: 'first_time_waxing',
          type: 'yesNo',
          label: 'Is this your first time having a wax treatment?',
          validation: { required: true },
        },
        {
          id: 'previous_wax_type',
          type: 'checkboxGroup',
          label: 'Which areas have you had waxed before?',
          options: [
            { value: 'eyebrows', label: 'Eyebrows' },
            { value: 'lip', label: 'Lip' },
            { value: 'chin', label: 'Chin' },
            { value: 'underarms', label: 'Underarms' },
            { value: 'arms', label: 'Arms' },
            { value: 'full_legs', label: 'Full Legs' },
            { value: 'half_legs', label: 'Half Legs' },
            { value: 'bikini', label: 'Bikini Line' },
            { value: 'intimate', label: 'Intimate/Brazilian/Hollywood' },
            { value: 'other', label: 'Other' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'first_time_waxing', operator: 'equals', value: false }],
            logicType: 'and',
          },
        },
        {
          id: 'previous_reactions',
          type: 'yesNo',
          label: 'Have you ever had a reaction to waxing?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'first_time_waxing', operator: 'equals', value: false }],
            logicType: 'and',
          },
        },
        {
          id: 'reaction_details',
          type: 'textarea',
          label: 'Please describe any previous reactions',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'previous_reactions', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'how_heard',
      title: 'How did you hear about us?',
      fields: [
        {
          id: 'referral_source',
          type: 'select',
          label: 'Referral Source',
          options: [
            { value: 'google', label: 'Google Search' },
            { value: 'social_media', label: 'Social Media' },
            { value: 'friend', label: 'Friend/Family' },
            { value: 'walking_by', label: 'Walked past' },
            { value: 'returning', label: 'Returning Client' },
            { value: 'other', label: 'Other' },
          ],
        },
      ],
    },
    {
      id: 'marketing',
      title: 'Stay in Touch',
      fields: [
        {
          id: 'marketing_consent',
          type: 'checkbox',
          label: 'I would like to receive special offers and updates via email',
        },
        {
          id: 'sms_consent',
          type: 'checkbox',
          label: 'I would like to receive appointment reminders via SMS',
        },
      ],
    },
  ],
};

const contraindications: FormDefinition = {
  id: 'wfw_contraindications',
  name: 'Waxing Contraindications',
  description: 'Pre-treatment contraindications check',
  version: '1.0',
  brand: 'WAX_FOR_WOMEN',
  category: 'Client Records',
  requiresSignature: true,
  signatureLabel: 'Client',
  signatureDeclaration: 'I confirm I have answered all questions honestly and understand that waxing may not proceed if contraindications are present.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 2555,
  sections: [
    {
      id: 'treatment_today',
      title: 'Today\'s Treatment',
      fields: [
        {
          id: 'treatment_areas',
          type: 'checkboxGroup',
          label: 'Areas to be waxed today',
          options: [
            { value: 'eyebrows', label: 'Eyebrows' },
            { value: 'lip', label: 'Upper Lip' },
            { value: 'chin', label: 'Chin' },
            { value: 'face', label: 'Full Face' },
            { value: 'underarms', label: 'Underarms' },
            { value: 'arms', label: 'Arms' },
            { value: 'full_legs', label: 'Full Legs' },
            { value: 'half_legs', label: 'Half Legs' },
            { value: 'bikini', label: 'Bikini Line' },
            { value: 'extended_bikini', label: 'Extended Bikini' },
            { value: 'brazilian', label: 'Brazilian' },
            { value: 'hollywood', label: 'Hollywood' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'pregnancy',
      title: 'Pregnancy',
      fields: [
        {
          id: 'pregnant',
          type: 'yesNo',
          label: 'Are you currently pregnant?',
          validation: { required: true },
        },
        {
          id: 'pregnancy_weeks',
          type: 'number',
          label: 'How many weeks pregnant are you?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'pregnant', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'pregnancy_note',
          type: 'paragraph',
          label: '',
          content: 'Waxing is generally safe during pregnancy, but your skin may be more sensitive. Please inform your therapist so they can adjust the treatment accordingly.',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'pregnant', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'skin_conditions',
      title: 'Skin Conditions',
      description: 'Do you have any of the following in or around the treatment area?',
      fields: [
        {
          id: 'sunburn',
          type: 'yesNo',
          label: 'Sunburn or recent sun exposure (last 48 hours)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'sunburn',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Cannot wax sunburned or recently sun-exposed skin. Please return when skin has recovered.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'cuts_abrasions',
          type: 'yesNo',
          label: 'Cuts, abrasions, or broken skin',
          validation: { required: true },
          stopConditions: [
            {
              field: 'cuts_abrasions',
              operator: 'equals',
              value: true,
              action: 'warn',
              message: 'Avoid waxing over cuts or broken skin. Treatment may need to be modified.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'skin_infection',
          type: 'yesNo',
          label: 'Active skin infection, rash, or skin condition',
          validation: { required: true },
          stopConditions: [
            {
              field: 'skin_infection',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Cannot wax over active skin infections or conditions. Please consult your GP if needed.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'warts_moles',
          type: 'yesNo',
          label: 'Raised moles, warts, or skin tags in treatment area',
          validation: { required: true },
          stopConditions: [
            {
              field: 'warts_moles',
              operator: 'equals',
              value: true,
              action: 'warn',
              message: 'These areas will need to be avoided during treatment.',
              riskLevel: 'LOW',
            },
          ],
        },
        {
          id: 'eczema_psoriasis',
          type: 'yesNo',
          label: 'Eczema, psoriasis, or dermatitis',
          validation: { required: true },
        },
        {
          id: 'varicose_veins',
          type: 'yesNo',
          label: 'Varicose veins (for leg waxing)',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'medications',
      title: 'Medications & Treatments',
      fields: [
        {
          id: 'retinoid',
          type: 'yesNo',
          label: 'Are you using Retinol, Retin-A, or similar products?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'retinoid',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Retinoid products thin the skin. Do not wax areas where these products are used.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'accutane',
          type: 'yesNo',
          label: 'Have you taken Accutane/Roaccutane in the last 6 months?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'accutane',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Cannot wax within 6 months of finishing Accutane treatment.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'antibiotics',
          type: 'yesNo',
          label: 'Are you currently taking antibiotics?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'antibiotics',
              operator: 'equals',
              value: true,
              action: 'warn',
              message: 'Some antibiotics increase skin sensitivity. Proceed with caution.',
              riskLevel: 'LOW',
            },
          ],
        },
        {
          id: 'blood_thinners',
          type: 'yesNo',
          label: 'Are you taking blood thinning medication?',
          validation: { required: true },
        },
        {
          id: 'steroids',
          type: 'yesNo',
          label: 'Are you using steroid creams on the treatment area?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'steroids',
              operator: 'equals',
              value: true,
              action: 'warn',
              message: 'Steroid use may thin the skin. Proceed with caution.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'hrt',
          type: 'yesNo',
          label: 'Are you taking HRT or hormonal medication?',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'medical_history',
      title: 'Medical History',
      fields: [
        {
          id: 'diabetes',
          type: 'yesNo',
          label: 'Do you have diabetes?',
          validation: { required: true },
        },
        {
          id: 'circulatory_problems',
          type: 'yesNo',
          label: 'Do you have any circulatory problems?',
          validation: { required: true },
        },
        {
          id: 'epilepsy',
          type: 'yesNo',
          label: 'Do you have epilepsy?',
          validation: { required: true },
        },
        {
          id: 'allergies',
          type: 'yesNo',
          label: 'Do you have any known allergies?',
          validation: { required: true },
        },
        {
          id: 'allergy_details',
          type: 'textarea',
          label: 'Please list any allergies',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'allergies', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'recent_treatments',
      title: 'Recent Treatments',
      fields: [
        {
          id: 'recent_laser',
          type: 'yesNo',
          label: 'Have you had laser treatment on the area in the last 4 weeks?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'recent_laser',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Cannot wax for at least 4 weeks after laser treatment.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'recent_peel',
          type: 'yesNo',
          label: 'Have you had a chemical peel or microdermabrasion in the last 2 weeks?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'recent_peel',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Cannot wax for at least 2 weeks after chemical peels or microdermabrasion.',
              riskLevel: 'HIGH',
            },
          ],
        },
      ],
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      fields: [
        {
          id: 'info_truthful',
          type: 'checkbox',
          label: 'I confirm all information provided is truthful and accurate',
          validation: { required: true },
        },
        {
          id: 'understand_risks',
          type: 'checkbox',
          label: 'I understand that withholding information may result in adverse reactions',
          validation: { required: true },
        },
      ],
    },
  ],
};

const intimateWaxingConsent: FormDefinition = {
  id: 'wfw_intimate_consent',
  name: 'Intimate Waxing Consent',
  description: 'Consent form for intimate waxing services',
  version: '1.0',
  brand: 'WAX_FOR_WOMEN',
  category: 'Consent Forms',
  requiresSignature: true,
  signatureLabel: 'Client',
  signatureDeclaration: 'I consent to the intimate waxing treatment described above and confirm I have understood the information provided.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 2555,
  sections: [
    {
      id: 'treatment_type',
      title: 'Treatment',
      fields: [
        {
          id: 'intimate_treatment',
          type: 'select',
          label: 'Intimate Waxing Treatment',
          options: [
            { value: 'bikini', label: 'Bikini Line' },
            { value: 'extended_bikini', label: 'Extended Bikini' },
            { value: 'brazilian', label: 'Brazilian (leaving a strip/shape)' },
            { value: 'hollywood', label: 'Hollywood (complete removal)' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'pregnancy_check',
      title: 'Pregnancy',
      fields: [
        {
          id: 'pregnant_intimate',
          type: 'yesNo',
          label: 'Are you currently pregnant?',
          validation: { required: true },
        },
        {
          id: 'pregnancy_weeks_intimate',
          type: 'number',
          label: 'How many weeks pregnant?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'pregnant_intimate', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'pregnancy_consent',
          type: 'checkbox',
          label: 'I understand my skin may be more sensitive during pregnancy and I wish to proceed',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'pregnant_intimate', operator: 'equals', value: true }],
            logicType: 'and',
          },
          validation: { required: true },
        },
        {
          id: 'late_pregnancy_warning',
          type: 'paragraph',
          label: '',
          content: 'Note: In late pregnancy (36+ weeks), we recommend checking with your midwife before intimate waxing.',
          conditionalLogic: {
            action: 'show',
            conditions: [
              { field: 'pregnant_intimate', operator: 'equals', value: true },
              { field: 'pregnancy_weeks_intimate', operator: 'greaterThanOrEqual', value: 36 },
            ],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'understanding',
      title: 'Understanding',
      fields: [
        {
          id: 'info_text',
          type: 'paragraph',
          label: '',
          content: 'Intimate waxing involves hair removal from sensitive areas. Please read and confirm your understanding of the following:',
        },
        {
          id: 'understand_exposure',
          type: 'checkbox',
          label: 'I understand that intimate areas will need to be exposed during the treatment',
          validation: { required: true },
        },
        {
          id: 'understand_discomfort',
          type: 'checkbox',
          label: 'I understand the treatment may cause temporary discomfort',
          validation: { required: true },
        },
        {
          id: 'understand_reactions',
          type: 'checkbox',
          label: 'I understand possible reactions include redness, minor irritation, and ingrown hairs',
          validation: { required: true },
        },
        {
          id: 'understand_professional',
          type: 'checkbox',
          label: 'I understand the treatment will be conducted in a professional manner by a trained therapist',
          validation: { required: true },
        },
        {
          id: 'understand_same_sex',
          type: 'checkbox',
          label: 'I understand intimate waxing is performed by a female therapist',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'hygiene',
      title: 'Hygiene',
      fields: [
        {
          id: 'confirm_hygiene',
          type: 'checkbox',
          label: 'I confirm I have showered/bathed prior to my appointment',
          validation: { required: true },
        },
        {
          id: 'no_infection',
          type: 'checkbox',
          label: 'I confirm I do not have any active infections affecting the treatment area',
          validation: { required: true },
        },
        {
          id: 'menstruation',
          type: 'yesNo',
          label: 'Are you currently menstruating?',
          validation: { required: true },
        },
        {
          id: 'menstruation_consent',
          type: 'checkbox',
          label: 'I understand I can still have the treatment while menstruating (with internal protection) and wish to proceed',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'menstruation', operator: 'equals', value: true }],
            logicType: 'and',
          },
          validation: { required: true },
        },
      ],
    },
    {
      id: 'consent',
      title: 'Consent',
      fields: [
        {
          id: 'consent_treatment',
          type: 'checkbox',
          label: 'I consent to receiving intimate waxing treatment',
          validation: { required: true },
        },
        {
          id: 'consent_touch',
          type: 'checkbox',
          label: 'I understand the therapist will need to work around intimate areas to perform the treatment safely',
          validation: { required: true },
        },
        {
          id: 'can_stop',
          type: 'checkbox',
          label: 'I understand I can ask to stop the treatment at any time',
          validation: { required: true },
        },
      ],
    },
  ],
};

const treatmentNotes: FormDefinition = {
  id: 'wfw_treatment_notes',
  name: 'Treatment Notes',
  description: 'Record of waxing treatment performed',
  version: '1.0',
  brand: 'WAX_FOR_WOMEN',
  category: 'Treatment Records',
  requiresSignature: true,
  signatureLabel: 'Therapist',
  signatureDeclaration: 'I confirm this treatment record is accurate.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 2555,
  sections: [
    {
      id: 'treatment_info',
      title: 'Treatment Information',
      fields: [
        {
          id: 'treatment_date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'therapist_name',
          type: 'text',
          label: 'Therapist',
          validation: { required: true },
          width: 'half',
        },
      ],
    },
    {
      id: 'pregnancy_status',
      title: 'Pregnancy Status',
      fields: [
        {
          id: 'client_pregnant',
          type: 'yesNo',
          label: 'Client Pregnant?',
          validation: { required: true },
        },
        {
          id: 'pregnancy_considerations',
          type: 'textarea',
          label: 'Pregnancy Considerations/Modifications Made',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'client_pregnant', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'areas_treated',
      title: 'Areas Treated',
      fields: [
        {
          id: 'treatment_areas',
          type: 'checkboxGroup',
          label: 'Areas Waxed',
          options: [
            { value: 'eyebrows', label: 'Eyebrows' },
            { value: 'lip', label: 'Upper Lip' },
            { value: 'chin', label: 'Chin' },
            { value: 'face', label: 'Full Face' },
            { value: 'underarms', label: 'Underarms' },
            { value: 'arms', label: 'Arms' },
            { value: 'full_legs', label: 'Full Legs' },
            { value: 'half_legs', label: 'Half Legs' },
            { value: 'bikini', label: 'Bikini' },
            { value: 'extended_bikini', label: 'Extended Bikini' },
            { value: 'brazilian', label: 'Brazilian' },
            { value: 'hollywood', label: 'Hollywood' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'wax_details',
      title: 'Wax Details',
      fields: [
        {
          id: 'wax_type',
          type: 'select',
          label: 'Wax Type Used',
          options: [
            { value: 'hot_wax', label: 'Hot Wax' },
            { value: 'strip_wax', label: 'Strip Wax' },
            { value: 'combination', label: 'Combination' },
          ],
          validation: { required: true },
        },
        {
          id: 'wax_brand',
          type: 'text',
          label: 'Wax Brand/Product',
        },
        {
          id: 'pre_treatment',
          type: 'text',
          label: 'Pre-treatment Products Used',
        },
        {
          id: 'post_treatment',
          type: 'text',
          label: 'Post-treatment Products Used',
        },
      ],
    },
    {
      id: 'observations',
      title: 'Observations',
      fields: [
        {
          id: 'skin_condition',
          type: 'select',
          label: 'Skin Condition',
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'sensitive', label: 'Sensitive' },
            { value: 'oily', label: 'Oily' },
            { value: 'dry', label: 'Dry' },
          ],
        },
        {
          id: 'hair_growth',
          type: 'select',
          label: 'Hair Growth',
          options: [
            { value: 'fine', label: 'Fine' },
            { value: 'medium', label: 'Medium' },
            { value: 'coarse', label: 'Coarse' },
          ],
        },
        {
          id: 'client_tolerance',
          type: 'select',
          label: 'Client Tolerance',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Found it difficult' },
          ],
        },
        {
          id: 'immediate_reaction',
          type: 'select',
          label: 'Immediate Skin Reaction',
          options: [
            { value: 'none', label: 'None' },
            { value: 'mild_redness', label: 'Mild redness (normal)' },
            { value: 'moderate_redness', label: 'Moderate redness' },
            { value: 'bumps', label: 'Bumps/raised areas' },
            { value: 'other', label: 'Other' },
          ],
        },
      ],
    },
    {
      id: 'notes',
      title: 'Notes',
      fields: [
        {
          id: 'treatment_notes',
          type: 'textarea',
          label: 'Treatment Notes',
          helpText: 'Any observations, modifications, or areas to note for future visits',
        },
        {
          id: 'aftercare_provided',
          type: 'yesNo',
          label: 'Aftercare advice provided',
          validation: { required: true },
        },
        {
          id: 'recommended_next',
          type: 'text',
          label: 'Recommended Next Appointment',
          helpText: 'e.g., 4 weeks',
        },
      ],
    },
  ],
};

const skinReactionRecord: FormDefinition = {
  id: 'wfw_skin_reaction',
  name: 'Skin Reaction Record',
  description: 'Document any adverse skin reaction following treatment',
  version: '1.0',
  brand: 'WAX_FOR_WOMEN',
  category: 'Treatment Records',
  requiresSignature: true,
  signatureLabel: 'Therapist/Manager',
  signatureDeclaration: 'I confirm this skin reaction record is accurate.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'incident_info',
      title: 'Incident Information',
      fields: [
        {
          id: 'treatment_date',
          type: 'date',
          label: 'Date of Treatment',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'reaction_date',
          type: 'date',
          label: 'Date Reaction Reported',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'therapist',
          type: 'text',
          label: 'Treating Therapist',
          validation: { required: true },
        },
        {
          id: 'areas_treated',
          type: 'text',
          label: 'Areas Treated',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'reaction_details',
      title: 'Reaction Details',
      fields: [
        {
          id: 'reaction_type',
          type: 'checkboxGroup',
          label: 'Type of Reaction',
          options: [
            { value: 'redness', label: 'Prolonged Redness' },
            { value: 'swelling', label: 'Swelling' },
            { value: 'bumps', label: 'Bumps/Spots' },
            { value: 'bruising', label: 'Bruising' },
            { value: 'skin_lifting', label: 'Skin Lifting' },
            { value: 'burns', label: 'Burns' },
            { value: 'allergic', label: 'Allergic Reaction' },
            { value: 'infection', label: 'Suspected Infection' },
            { value: 'ingrown', label: 'Severe Ingrown Hairs' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'severity',
          type: 'select',
          label: 'Severity',
          options: [
            { value: 'mild', label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe', label: 'Severe' },
          ],
          validation: { required: true },
          stopConditions: [
            {
              field: 'severity',
              operator: 'equals',
              value: 'severe',
              action: 'escalate',
              message: 'Severe reaction - requires manager review',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'reaction_description',
          type: 'textarea',
          label: 'Description of Reaction',
          validation: { required: true },
        },
        {
          id: 'photos_taken',
          type: 'yesNo',
          label: 'Photos taken?',
        },
      ],
    },
    {
      id: 'action_taken',
      title: 'Action Taken',
      fields: [
        {
          id: 'immediate_action',
          type: 'textarea',
          label: 'Immediate Action Taken',
          validation: { required: true },
        },
        {
          id: 'advice_given',
          type: 'textarea',
          label: 'Advice Given to Client',
          validation: { required: true },
        },
        {
          id: 'medical_referral',
          type: 'yesNo',
          label: 'Medical referral recommended?',
          validation: { required: true },
        },
        {
          id: 'follow_up_date',
          type: 'date',
          label: 'Follow-up Date',
        },
      ],
    },
    {
      id: 'investigation',
      title: 'Investigation',
      fields: [
        {
          id: 'possible_cause',
          type: 'textarea',
          label: 'Possible Cause',
        },
        {
          id: 'wax_batch',
          type: 'text',
          label: 'Wax Batch Number (if known)',
        },
        {
          id: 'other_complaints',
          type: 'yesNo',
          label: 'Any other clients affected?',
        },
        {
          id: 'preventive_measures',
          type: 'textarea',
          label: 'Preventive Measures for Future',
        },
      ],
    },
  ],
};

const aftercareAcknowledgement: FormDefinition = {
  id: 'wfw_aftercare',
  name: 'Aftercare Acknowledgement',
  description: 'Client acknowledgement of aftercare instructions',
  version: '1.0',
  brand: 'WAX_FOR_WOMEN',
  category: 'Consent Forms',
  requiresSignature: true,
  signatureLabel: 'Client',
  signatureDeclaration: 'I acknowledge I have received and understood the aftercare instructions.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 1095,
  sections: [
    {
      id: 'aftercare_instructions',
      title: 'Aftercare Instructions',
      fields: [
        {
          id: 'intro',
          type: 'paragraph',
          label: '',
          content: 'Following your waxing treatment, please follow these aftercare guidelines to minimise any reactions and get the best results:',
        },
        {
          id: 'avoid_heat',
          type: 'checkbox',
          label: 'Avoid hot baths, saunas, steam rooms, and vigorous exercise for 24 hours',
          validation: { required: true },
        },
        {
          id: 'avoid_sun',
          type: 'checkbox',
          label: 'Avoid sun exposure and tanning beds for 48 hours',
          validation: { required: true },
        },
        {
          id: 'avoid_products',
          type: 'checkbox',
          label: 'Avoid perfumed products, deodorant (underarms), and tight clothing on treated areas for 24 hours',
          validation: { required: true },
        },
        {
          id: 'avoid_touch',
          type: 'checkbox',
          label: 'Avoid touching the treated area unnecessarily',
          validation: { required: true },
        },
        {
          id: 'exfoliate',
          type: 'checkbox',
          label: 'Gently exfoliate 2-3 times per week after 48 hours to prevent ingrown hairs',
          validation: { required: true },
        },
        {
          id: 'moisturise',
          type: 'checkbox',
          label: 'Keep the area moisturised with a gentle, fragrance-free lotion',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'intimate_specific',
      title: 'Intimate Waxing Aftercare',
      description: 'Additional aftercare for bikini/intimate waxing',
      fields: [
        {
          id: 'intimate_aftercare',
          type: 'checkbox',
          label: 'Avoid intimate activity for 24-48 hours',
        },
        {
          id: 'cotton_underwear',
          type: 'checkbox',
          label: 'Wear loose cotton underwear',
        },
      ],
    },
    {
      id: 'reactions',
      title: 'Normal Reactions',
      fields: [
        {
          id: 'normal_info',
          type: 'paragraph',
          label: '',
          content: 'It is normal to experience some redness and sensitivity immediately after waxing. This typically subsides within a few hours. If you experience excessive pain, swelling, or signs of infection, please contact us or seek medical advice.',
        },
        {
          id: 'understand_reactions',
          type: 'checkbox',
          label: 'I understand what is normal and when to seek help',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'acknowledgement',
      title: 'Acknowledgement',
      fields: [
        {
          id: 'received_verbal',
          type: 'checkbox',
          label: 'I have received verbal aftercare instructions from my therapist',
          validation: { required: true },
        },
        {
          id: 'received_written',
          type: 'checkbox',
          label: 'I have been offered written aftercare instructions to take home',
          validation: { required: true },
        },
      ],
    },
  ],
};

// ============================================
// EXPORT ALL WAX FOR WOMEN FORMS
// ============================================

export const waxForWomenForms: FormDefinition[] = [
  clientIntake,
  contraindications,
  intimateWaxingConsent,
  treatmentNotes,
  skinReactionRecord,
  aftercareAcknowledgement,
];

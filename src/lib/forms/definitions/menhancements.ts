import { FormDefinition } from '../types';

// ============================================
// MENHANCEMENTS CLINICAL FORM DEFINITIONS
// Clinical Aesthetics + Sexual Wellness
// ============================================

// ============================================
// PATIENT REGISTRATION & MEDICAL HISTORY
// ============================================

const patientRegistration: FormDefinition = {
  id: 'menh_patient_registration',
  name: 'Patient Registration',
  description: 'New patient registration form',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Patient Records',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I confirm the information provided is accurate and complete.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650, // 10 years
  sections: [
    {
      id: 'personal_details',
      title: 'Personal Details',
      fields: [
        {
          id: 'title',
          type: 'select',
          label: 'Title',
          options: [
            { value: 'mr', label: 'Mr' },
            { value: 'mrs', label: 'Mrs' },
            { value: 'ms', label: 'Ms' },
            { value: 'miss', label: 'Miss' },
            { value: 'mx', label: 'Mx' },
            { value: 'dr', label: 'Dr' },
          ],
          validation: { required: true },
          width: 'quarter',
        },
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
          id: 'gender',
          type: 'select',
          label: 'Gender',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'non_binary', label: 'Non-Binary' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
          ],
          width: 'half',
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
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
          validation: { required: true },
        },
        {
          id: 'address_line_2',
          type: 'text',
          label: 'Address Line 2',
        },
        {
          id: 'city',
          type: 'text',
          label: 'City/Town',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'postcode',
          type: 'text',
          label: 'Postcode',
          validation: { required: true },
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
          id: 'emergency_relationship',
          type: 'text',
          label: 'Relationship',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'emergency_phone',
          type: 'phone',
          label: 'Emergency Contact Phone',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'gp_details',
      title: 'GP Details',
      fields: [
        {
          id: 'gp_name',
          type: 'text',
          label: 'GP Name',
          width: 'half',
        },
        {
          id: 'gp_practice',
          type: 'text',
          label: 'Practice Name',
          width: 'half',
        },
        {
          id: 'gp_address',
          type: 'textarea',
          label: 'Practice Address',
        },
        {
          id: 'gp_consent',
          type: 'checkbox',
          label: 'I consent to my GP being contacted if clinically necessary',
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
            { value: 'friend_family', label: 'Friend/Family Recommendation' },
            { value: 'doctor', label: 'Doctor Referral' },
            { value: 'returning', label: 'Returning Patient' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          id: 'referral_details',
          type: 'text',
          label: 'Please specify',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'referral_source', operator: 'equals', value: 'other' }],
            logicType: 'and',
          },
        },
      ],
    },
  ],
};

const medicalHistory: FormDefinition = {
  id: 'menh_medical_history',
  name: 'Medical History & Screening',
  description: 'Comprehensive medical history questionnaire',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Patient Records',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I confirm this medical history is accurate and complete. I understand it is my responsibility to update this information if my circumstances change.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'general_health',
      title: 'General Health',
      fields: [
        {
          id: 'general_health_rating',
          type: 'select',
          label: 'How would you rate your general health?',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
          ],
          validation: { required: true },
        },
        {
          id: 'under_doctor_care',
          type: 'yesNo',
          label: 'Are you currently under the care of a doctor for any condition?',
          validation: { required: true },
        },
        {
          id: 'doctor_care_details',
          type: 'textarea',
          label: 'Please provide details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'under_doctor_care', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'hospitalised_recently',
          type: 'yesNo',
          label: 'Have you been hospitalised or had surgery in the last 12 months?',
          validation: { required: true },
        },
        {
          id: 'hospitalised_details',
          type: 'textarea',
          label: 'Please provide details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'hospitalised_recently', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'medical_conditions',
      title: 'Medical Conditions',
      description: 'Please indicate if you have or have had any of the following:',
      fields: [
        {
          id: 'conditions',
          type: 'checkboxGroup',
          label: 'Current or past conditions',
          options: [
            { value: 'heart_disease', label: 'Heart disease or heart problems' },
            { value: 'high_blood_pressure', label: 'High blood pressure' },
            { value: 'low_blood_pressure', label: 'Low blood pressure' },
            { value: 'stroke', label: 'Stroke or TIA' },
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'thyroid', label: 'Thyroid disorder' },
            { value: 'blood_disorder', label: 'Blood disorder or clotting problems' },
            { value: 'liver_disease', label: 'Liver disease' },
            { value: 'kidney_disease', label: 'Kidney disease' },
            { value: 'cancer', label: 'Cancer (current or history)' },
            { value: 'autoimmune', label: 'Autoimmune condition' },
            { value: 'epilepsy', label: 'Epilepsy or seizures' },
            { value: 'psychiatric', label: 'Mental health condition' },
            { value: 'skin_condition', label: 'Skin condition (eczema, psoriasis, etc.)' },
            { value: 'keloid', label: 'Keloid or abnormal scarring' },
            { value: 'hiv_hepatitis', label: 'HIV or Hepatitis' },
            { value: 'pacemaker', label: 'Pacemaker or implanted device' },
            { value: 'none', label: 'None of the above' },
          ],
        },
        {
          id: 'conditions_details',
          type: 'textarea',
          label: 'Please provide details of any conditions selected',
        },
      ],
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      fields: [
        {
          id: 'smoking',
          type: 'select',
          label: 'Smoking status',
          options: [
            { value: 'never', label: 'Never smoked' },
            { value: 'former', label: 'Former smoker' },
            { value: 'current', label: 'Current smoker' },
            { value: 'vape', label: 'Vape only' },
          ],
          validation: { required: true },
        },
        {
          id: 'alcohol',
          type: 'select',
          label: 'Alcohol consumption',
          options: [
            { value: 'none', label: 'None' },
            { value: 'occasional', label: 'Occasional (1-2 times per week)' },
            { value: 'moderate', label: 'Moderate (3-5 times per week)' },
            { value: 'heavy', label: 'Heavy (daily)' },
          ],
        },
        {
          id: 'recreational_drugs',
          type: 'yesNo',
          label: 'Do you use recreational drugs?',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'sexual_health',
      title: 'Sexual Health',
      description: 'This information helps us provide appropriate care for sexual wellness treatments.',
      fields: [
        {
          id: 'seeking_treatment_for',
          type: 'checkboxGroup',
          label: 'Are you seeking treatment for any of the following?',
          options: [
            { value: 'ed', label: 'Erectile concerns' },
            { value: 'pe', label: 'Performance concerns' },
            { value: 'libido', label: 'Libido/desire concerns' },
            { value: 'peyronies', label: 'Penile curvature' },
            { value: 'aesthetics', label: 'Aesthetic concerns' },
            { value: 'none', label: 'Not applicable' },
          ],
        },
        {
          id: 'current_ed_medication',
          type: 'yesNo',
          label: 'Are you currently taking medication for erectile function?',
        },
        {
          id: 'ed_medication_details',
          type: 'text',
          label: 'Please specify medication',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'current_ed_medication', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
  ],
};

const medicationAllergies: FormDefinition = {
  id: 'menh_medication_allergies',
  name: 'Medication & Allergies',
  description: 'Current medications and allergy information',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Patient Records',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I confirm this medication and allergy information is complete and accurate.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'allergies',
      title: 'Allergies',
      fields: [
        {
          id: 'has_allergies',
          type: 'yesNo',
          label: 'Do you have any known allergies?',
          validation: { required: true },
        },
        {
          id: 'allergy_list',
          type: 'allergyList',
          label: 'Please list all allergies',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'has_allergies', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'latex_allergy',
          type: 'yesNo',
          label: 'Do you have a latex allergy?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'latex_allergy',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'Patient has latex allergy - ensure latex-free products are used',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'local_anaesthetic_allergy',
          type: 'yesNo',
          label: 'Have you ever had an allergic reaction to local anaesthetic?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'local_anaesthetic_allergy',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'Patient reports local anaesthetic allergy - requires clinical review before any procedures',
              riskLevel: 'HIGH',
            },
          ],
        },
      ],
    },
    {
      id: 'medications',
      title: 'Current Medications',
      fields: [
        {
          id: 'taking_medications',
          type: 'yesNo',
          label: 'Are you currently taking any medications?',
          validation: { required: true },
        },
        {
          id: 'medication_list',
          type: 'medicationList',
          label: 'Please list all current medications (including supplements)',
          helpText: 'Include prescription medications, over-the-counter drugs, and supplements',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'taking_medications', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'blood_thinners',
          type: 'yesNo',
          label: 'Are you taking blood thinning medication (Warfarin, Aspirin, Clopidogrel, etc.)?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'blood_thinners',
              operator: 'equals',
              value: true,
              action: 'warn',
              message: 'Patient on blood thinners - increased risk of bruising, bleeding. Assess individually.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'immunosuppressants',
          type: 'yesNo',
          label: 'Are you taking immunosuppressant medication?',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'previous_treatments',
      title: 'Previous Aesthetic Treatments',
      fields: [
        {
          id: 'had_aesthetic_treatments',
          type: 'yesNo',
          label: 'Have you had any aesthetic treatments before?',
          validation: { required: true },
        },
        {
          id: 'previous_treatments',
          type: 'checkboxGroup',
          label: 'Previous treatments',
          options: [
            { value: 'botox', label: 'Botulinum toxin (Botox)' },
            { value: 'filler', label: 'Dermal fillers' },
            { value: 'prp', label: 'PRP treatments' },
            { value: 'laser', label: 'Laser treatments' },
            { value: 'shockwave', label: 'Shockwave therapy' },
            { value: 'surgery', label: 'Cosmetic surgery' },
            { value: 'other', label: 'Other' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'had_aesthetic_treatments', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'complications',
          type: 'yesNo',
          label: 'Did you experience any complications from previous treatments?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'had_aesthetic_treatments', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'complications_details',
          type: 'textarea',
          label: 'Please describe the complications',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'complications', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
  ],
};

// ============================================
// CONSULTATION & TREATMENT PLANNING
// ============================================

const consultationNotes: FormDefinition = {
  id: 'menh_consultation_notes',
  name: 'Consultation Notes (SOAP)',
  description: 'Clinical consultation record using SOAP format',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Clinical Records',
  requiresSignature: true,
  signatureLabel: 'Practitioner',
  signatureDeclaration: 'I confirm this consultation record is accurate.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'consultation_info',
      title: 'Consultation Information',
      fields: [
        {
          id: 'consultation_date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'consultation_type',
          type: 'select',
          label: 'Consultation Type',
          options: [
            { value: 'initial', label: 'Initial Consultation' },
            { value: 'follow_up', label: 'Follow-up' },
            { value: 'review', label: 'Review' },
            { value: 'pre_treatment', label: 'Pre-Treatment Assessment' },
          ],
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'practitioner_name',
          type: 'text',
          label: 'Practitioner Name',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'subjective',
      title: 'Subjective',
      description: 'Patient reported symptoms, concerns, and history',
      fields: [
        {
          id: 'presenting_complaint',
          type: 'textarea',
          label: 'Presenting Complaint / Reason for Visit',
          helpText: 'What brings the patient in today? Use their own words where possible.',
          validation: { required: true },
        },
        {
          id: 'history_presenting_complaint',
          type: 'textarea',
          label: 'History of Presenting Complaint',
          helpText: 'Duration, onset, progression, previous treatments tried',
        },
        {
          id: 'patient_goals',
          type: 'textarea',
          label: 'Patient Goals / Expectations',
          helpText: 'What does the patient hope to achieve?',
        },
      ],
    },
    {
      id: 'objective',
      title: 'Objective',
      description: 'Clinical findings and examination',
      fields: [
        {
          id: 'examination_findings',
          type: 'textarea',
          label: 'Examination Findings',
          helpText: 'Document what you observed and measured',
          validation: { required: true },
        },
        {
          id: 'photographs_taken',
          type: 'yesNo',
          label: 'Clinical photographs taken?',
          validation: { required: true },
        },
        {
          id: 'measurements',
          type: 'textarea',
          label: 'Measurements (if applicable)',
        },
      ],
    },
    {
      id: 'assessment',
      title: 'Assessment',
      description: 'Clinical assessment and diagnosis',
      fields: [
        {
          id: 'clinical_assessment',
          type: 'textarea',
          label: 'Clinical Assessment',
          helpText: 'Your clinical impression and any diagnoses',
          validation: { required: true },
        },
        {
          id: 'suitable_for_treatment',
          type: 'yesNo',
          label: 'Is the patient suitable for treatment?',
          validation: { required: true },
        },
        {
          id: 'not_suitable_reason',
          type: 'textarea',
          label: 'Reason not suitable',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'suitable_for_treatment', operator: 'equals', value: false }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'plan',
      title: 'Plan',
      description: 'Treatment plan and recommendations',
      fields: [
        {
          id: 'recommended_treatment',
          type: 'textarea',
          label: 'Recommended Treatment',
          validation: { required: true },
        },
        {
          id: 'treatment_schedule',
          type: 'textarea',
          label: 'Treatment Schedule',
          helpText: 'Number of sessions, frequency, etc.',
        },
        {
          id: 'alternatives_discussed',
          type: 'textarea',
          label: 'Alternatives Discussed',
        },
        {
          id: 'risks_discussed',
          type: 'yesNo',
          label: 'Risks and benefits discussed with patient?',
          validation: { required: true },
        },
        {
          id: 'consent_obtained',
          type: 'yesNo',
          label: 'Consent form completed?',
        },
        {
          id: 'follow_up_plan',
          type: 'textarea',
          label: 'Follow-up Plan',
        },
      ],
    },
  ],
};

const contraindicationsChecklist: FormDefinition = {
  id: 'menh_contraindications',
  name: 'Contraindications Checklist',
  description: 'Pre-treatment contraindications screening',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Clinical Records',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I confirm I have answered all questions honestly and understand that providing inaccurate information could affect my treatment safety.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'treatment_info',
      title: 'Treatment Information',
      fields: [
        {
          id: 'planned_treatment',
          type: 'select',
          label: 'Planned Treatment',
          options: [
            { value: 'prp', label: 'PRP Therapy' },
            { value: 'shockwave', label: 'Shockwave Therapy' },
            { value: 'prp_shockwave', label: 'Combined PRP + Shockwave' },
            { value: 'intimate_aesthetics', label: 'Intimate Aesthetics' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'absolute_contraindications',
      title: 'Absolute Contraindications',
      description: 'These conditions mean treatment cannot proceed',
      fields: [
        {
          id: 'active_cancer',
          type: 'yesNo',
          label: 'Do you have active cancer or are you undergoing cancer treatment?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'active_cancer',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Active cancer is an absolute contraindication. Treatment cannot proceed.',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'blood_disorder',
          type: 'yesNo',
          label: 'Do you have a blood clotting disorder or take anticoagulant medication?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'blood_disorder',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Blood disorder/anticoagulation requires clinical review before proceeding.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'active_infection',
          type: 'yesNo',
          label: 'Do you currently have an active infection at or near the treatment area?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'active_infection',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Active infection present. Treatment must be postponed until resolved.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'skin_disease_treatment_area',
          type: 'yesNo',
          label: 'Do you have any skin disease or condition at the treatment area?',
          validation: { required: true },
        },
        {
          id: 'pregnant',
          type: 'yesNo',
          label: 'Are you pregnant or trying to conceive?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'pregnant',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Treatment is contraindicated during pregnancy.',
              riskLevel: 'HIGH',
            },
          ],
        },
      ],
    },
    {
      id: 'relative_contraindications',
      title: 'Relative Contraindications',
      description: 'These require clinical assessment',
      fields: [
        {
          id: 'immunocompromised',
          type: 'yesNo',
          label: 'Are you immunocompromised or taking immunosuppressant medication?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'immunocompromised',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'Requires senior practitioner review - immunocompromised patient.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'diabetes_uncontrolled',
          type: 'yesNo',
          label: 'Do you have uncontrolled diabetes?',
          validation: { required: true },
        },
        {
          id: 'recent_surgery',
          type: 'yesNo',
          label: 'Have you had surgery in the treatment area in the last 6 months?',
          validation: { required: true },
        },
        {
          id: 'metal_implants',
          type: 'yesNo',
          label: 'Do you have metal implants at or near the treatment area?',
          validation: { required: true },
        },
        {
          id: 'numbing_products',
          type: 'yesNo',
          label: 'Have you used any numbing products in the treatment area today?',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'prp_specific',
      title: 'PRP-Specific Questions',
      conditionalLogic: {
        action: 'show',
        conditions: [
          { field: 'planned_treatment', operator: 'equals', value: 'prp' },
          { field: 'planned_treatment', operator: 'equals', value: 'prp_shockwave' },
        ],
        logicType: 'or',
      },
      fields: [
        {
          id: 'platelet_disorder',
          type: 'yesNo',
          label: 'Do you have a platelet disorder or low platelet count?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'platelet_disorder',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Platelet disorder is a contraindication for PRP therapy.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'nsaids_recent',
          type: 'yesNo',
          label: 'Have you taken NSAIDs (ibuprofen, aspirin) in the last 7 days?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'nsaids_recent',
              operator: 'equals',
              value: true,
              action: 'warn',
              message: 'Recent NSAID use may affect PRP quality. Consider rescheduling.',
              riskLevel: 'LOW',
            },
          ],
        },
      ],
    },
    {
      id: 'shockwave_specific',
      title: 'Shockwave-Specific Questions',
      conditionalLogic: {
        action: 'show',
        conditions: [
          { field: 'planned_treatment', operator: 'equals', value: 'shockwave' },
          { field: 'planned_treatment', operator: 'equals', value: 'prp_shockwave' },
        ],
        logicType: 'or',
      },
      fields: [
        {
          id: 'pacemaker',
          type: 'yesNo',
          label: 'Do you have a pacemaker or implanted electronic device?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'pacemaker',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP: Shockwave therapy is contraindicated with pacemakers/implanted devices.',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'nerve_damage',
          type: 'yesNo',
          label: 'Do you have nerve damage or sensory loss in the treatment area?',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      fields: [
        {
          id: 'all_truthful',
          type: 'checkbox',
          label: 'I confirm all information provided is truthful and complete',
          validation: { required: true },
        },
        {
          id: 'understand_risks',
          type: 'checkbox',
          label: 'I understand that withholding information could affect my safety',
          validation: { required: true },
        },
      ],
    },
  ],
};

const treatmentPlan: FormDefinition = {
  id: 'menh_treatment_plan',
  name: 'Treatment Plan',
  description: 'Agreed treatment plan with patient',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Clinical Records',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I agree to the treatment plan outlined above and have had the opportunity to ask questions.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'plan_overview',
      title: 'Treatment Plan Overview',
      fields: [
        {
          id: 'plan_date',
          type: 'date',
          label: 'Plan Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'practitioner',
          type: 'text',
          label: 'Treating Practitioner',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'treatment_goals',
          type: 'textarea',
          label: 'Treatment Goals',
          helpText: 'What we aim to achieve',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'treatments',
      title: 'Planned Treatments',
      fields: [
        {
          id: 'treatments_planned',
          type: 'checkboxGroup',
          label: 'Treatments Included in Plan',
          options: [
            { value: 'prp', label: 'PRP Therapy' },
            { value: 'shockwave', label: 'Shockwave Therapy' },
            { value: 'combined', label: 'Combined PRP + Shockwave' },
            { value: 'holetox', label: 'Intimate Aesthetic Treatment' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'number_of_sessions',
          type: 'number',
          label: 'Total Number of Sessions',
          validation: { required: true, min: 1 },
          width: 'half',
        },
        {
          id: 'session_frequency',
          type: 'text',
          label: 'Session Frequency',
          helpText: 'e.g., Weekly, Fortnightly',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'expected_duration',
          type: 'text',
          label: 'Expected Treatment Duration',
          helpText: 'e.g., 6 weeks, 3 months',
        },
      ],
    },
    {
      id: 'costs',
      title: 'Treatment Costs',
      fields: [
        {
          id: 'cost_per_session',
          type: 'number',
          label: 'Cost per Session',
          width: 'half',
        },
        {
          id: 'total_cost',
          type: 'number',
          label: 'Total Treatment Cost',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'package_deal',
          type: 'yesNo',
          label: 'Package/course price applied?',
        },
        {
          id: 'payment_terms',
          type: 'textarea',
          label: 'Payment Terms',
          helpText: 'Payment schedule, deposits required, etc.',
        },
      ],
    },
    {
      id: 'expectations',
      title: 'Expectations',
      fields: [
        {
          id: 'expected_outcomes',
          type: 'textarea',
          label: 'Expected Outcomes',
          helpText: 'Realistic expectations discussed with patient',
          validation: { required: true },
        },
        {
          id: 'when_results_expected',
          type: 'text',
          label: 'When to Expect Results',
        },
        {
          id: 'maintenance_required',
          type: 'textarea',
          label: 'Maintenance / Ongoing Care',
        },
      ],
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      fields: [
        {
          id: 'alternatives_discussed',
          type: 'checkbox',
          label: 'Alternative treatments have been discussed',
          validation: { required: true },
        },
        {
          id: 'risks_explained',
          type: 'checkbox',
          label: 'Risks and side effects have been explained',
          validation: { required: true },
        },
        {
          id: 'questions_answered',
          type: 'checkbox',
          label: 'I have had the opportunity to ask questions',
          validation: { required: true },
        },
        {
          id: 'agree_to_plan',
          type: 'checkbox',
          label: 'I agree to proceed with this treatment plan',
          validation: { required: true },
        },
      ],
    },
  ],
};

// ============================================
// CONSENT FORMS
// ============================================

const consentGeneral: FormDefinition = {
  id: 'menh_consent_general',
  name: 'General Consent Form',
  description: 'General consent for treatment',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Consent Forms',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I confirm I have read and understood the information provided. I consent to the treatment described above.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'patient_info',
      title: 'Patient Information',
      fields: [
        {
          id: 'patient_name',
          type: 'text',
          label: 'Patient Name',
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
      ],
    },
    {
      id: 'treatment_info',
      title: 'Treatment Information',
      fields: [
        {
          id: 'treatment_name',
          type: 'text',
          label: 'Treatment Name',
          validation: { required: true },
        },
        {
          id: 'treatment_area',
          type: 'text',
          label: 'Treatment Area',
          validation: { required: true },
        },
        {
          id: 'practitioner_name',
          type: 'text',
          label: 'Treating Practitioner',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'understanding',
      title: 'Acknowledgement & Understanding',
      fields: [
        {
          id: 'info_text',
          type: 'paragraph',
          label: '',
          content: 'By signing this consent form, you acknowledge that:',
        },
        {
          id: 'understand_procedure',
          type: 'checkbox',
          label: 'The procedure has been explained to me in a way I understand',
          validation: { required: true },
        },
        {
          id: 'understand_risks',
          type: 'checkbox',
          label: 'The potential risks, side effects, and complications have been explained',
          validation: { required: true },
        },
        {
          id: 'understand_alternatives',
          type: 'checkbox',
          label: 'Alternative treatments have been discussed',
          validation: { required: true },
        },
        {
          id: 'understand_no_guarantee',
          type: 'checkbox',
          label: 'I understand results are not guaranteed and individual outcomes vary',
          validation: { required: true },
        },
        {
          id: 'understand_aftercare',
          type: 'checkbox',
          label: 'I have been provided with aftercare instructions',
          validation: { required: true },
        },
        {
          id: 'questions_answered',
          type: 'checkbox',
          label: 'I have had the opportunity to ask questions and all my questions have been answered',
          validation: { required: true },
        },
        {
          id: 'consent_freely',
          type: 'checkbox',
          label: 'I give my consent freely and voluntarily without any pressure',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'photography',
      title: 'Clinical Photography',
      fields: [
        {
          id: 'consent_photography',
          type: 'yesNo',
          label: 'I consent to clinical photographs being taken for my medical records',
          validation: { required: true },
        },
      ],
    },
  ],
};

const consentPrp: FormDefinition = {
  id: 'menh_consent_prp',
  name: 'PRP Therapy Consent',
  description: 'Specific consent for Platelet Rich Plasma therapy',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Consent Forms',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I consent to PRP therapy as described above. I confirm I have understood the procedure, risks, and aftercare requirements.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'procedure_info',
      title: 'About PRP Therapy',
      fields: [
        {
          id: 'about_prp',
          type: 'paragraph',
          label: '',
          content: 'Platelet Rich Plasma (PRP) therapy involves drawing a small amount of your blood, processing it to concentrate the platelets, and injecting this back into the treatment area. The growth factors in platelets can promote healing and regeneration.',
        },
      ],
    },
    {
      id: 'risks',
      title: 'Risks & Side Effects',
      fields: [
        {
          id: 'risks_info',
          type: 'paragraph',
          label: '',
          content: 'As with any injection procedure, there are risks involved. Please confirm you understand the following:',
        },
        {
          id: 'understand_common_effects',
          type: 'checkbox',
          label: 'Common effects include bruising, swelling, redness, and temporary discomfort at injection sites',
          validation: { required: true },
        },
        {
          id: 'understand_infection_risk',
          type: 'checkbox',
          label: 'There is a small risk of infection with any procedure involving needles',
          validation: { required: true },
        },
        {
          id: 'understand_variable_results',
          type: 'checkbox',
          label: 'Results vary between individuals and multiple treatments may be required',
          validation: { required: true },
        },
        {
          id: 'understand_no_guarantee',
          type: 'checkbox',
          label: 'Results are not guaranteed and some patients may not respond to treatment',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'aftercare',
      title: 'Aftercare Requirements',
      fields: [
        {
          id: 'aftercare_info',
          type: 'paragraph',
          label: '',
          content: 'Following your PRP treatment:',
        },
        {
          id: 'understand_no_nsaids',
          type: 'checkbox',
          label: 'I understand I should avoid NSAIDs (ibuprofen, aspirin) for 1 week',
          validation: { required: true },
        },
        {
          id: 'understand_no_alcohol',
          type: 'checkbox',
          label: 'I understand I should avoid alcohol for 48 hours',
          validation: { required: true },
        },
        {
          id: 'understand_activity_restriction',
          type: 'checkbox',
          label: 'I understand I should avoid strenuous activity for 48 hours',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'confirmations',
      title: 'Final Confirmations',
      fields: [
        {
          id: 'fasted_water',
          type: 'checkbox',
          label: 'I have been well hydrated today',
          validation: { required: true },
        },
        {
          id: 'no_blood_thinners',
          type: 'checkbox',
          label: 'I have not taken blood thinning medications/supplements as advised',
          validation: { required: true },
        },
        {
          id: 'not_unwell',
          type: 'checkbox',
          label: 'I am not currently unwell or fighting an infection',
          validation: { required: true },
        },
        {
          id: 'consent_blood_draw',
          type: 'checkbox',
          label: 'I consent to having blood drawn for PRP preparation',
          validation: { required: true },
        },
        {
          id: 'consent_injections',
          type: 'checkbox',
          label: 'I consent to PRP injections in the agreed treatment area',
          validation: { required: true },
        },
      ],
    },
  ],
};

const consentShockwave: FormDefinition = {
  id: 'menh_consent_shockwave',
  name: 'Shockwave Therapy Consent',
  description: 'Specific consent for Shockwave therapy',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Consent Forms',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I consent to Shockwave therapy as described above.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'procedure_info',
      title: 'About Shockwave Therapy',
      fields: [
        {
          id: 'about_shockwave',
          type: 'paragraph',
          label: '',
          content: 'Low-Intensity Shockwave Therapy (LiSWT) uses acoustic waves to stimulate blood flow and promote tissue regeneration. The treatment is non-invasive and involves applying the shockwave device to the treatment area.',
        },
      ],
    },
    {
      id: 'risks',
      title: 'Risks & Side Effects',
      fields: [
        {
          id: 'understand_sensation',
          type: 'checkbox',
          label: 'I understand the treatment may cause mild discomfort or tingling during treatment',
          validation: { required: true },
        },
        {
          id: 'understand_redness',
          type: 'checkbox',
          label: 'I understand temporary redness or mild bruising may occur',
          validation: { required: true },
        },
        {
          id: 'understand_results',
          type: 'checkbox',
          label: 'I understand results may take several weeks to become apparent',
          validation: { required: true },
        },
        {
          id: 'understand_multiple_sessions',
          type: 'checkbox',
          label: 'I understand multiple treatment sessions are usually required',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'contraindications_confirmed',
      title: 'Contraindications Confirmation',
      fields: [
        {
          id: 'no_pacemaker',
          type: 'checkbox',
          label: 'I confirm I do not have a pacemaker or implanted electronic device',
          validation: { required: true },
        },
        {
          id: 'no_blood_disorder',
          type: 'checkbox',
          label: 'I confirm I do not have a blood clotting disorder',
          validation: { required: true },
        },
        {
          id: 'no_active_cancer',
          type: 'checkbox',
          label: 'I confirm I do not have active cancer in the treatment area',
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
          label: 'I consent to receiving Shockwave therapy in the agreed treatment area',
          validation: { required: true },
        },
      ],
    },
  ],
};

const consentCombined: FormDefinition = {
  id: 'menh_consent_combined',
  name: 'Combined PRP + Shockwave Consent',
  description: 'Consent for combined PRP and Shockwave therapy',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Consent Forms',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I consent to both PRP and Shockwave therapy as described above.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'about_combined',
      title: 'About Combined Therapy',
      fields: [
        {
          id: 'info',
          type: 'paragraph',
          label: '',
          content: 'Combined PRP and Shockwave therapy uses both treatments to maximise therapeutic benefit. Shockwave therapy helps stimulate blood flow and prepare tissue, while PRP provides concentrated growth factors for healing and regeneration.',
        },
      ],
    },
    {
      id: 'prp_consent',
      title: 'PRP Therapy Consent',
      fields: [
        {
          id: 'prp_risks',
          type: 'checkbox',
          label: 'I understand PRP risks including bruising, swelling, infection risk, and variable results',
          validation: { required: true },
        },
        {
          id: 'prp_aftercare',
          type: 'checkbox',
          label: 'I understand PRP aftercare requirements (no NSAIDs, limit alcohol, rest)',
          validation: { required: true },
        },
        {
          id: 'consent_blood_draw',
          type: 'checkbox',
          label: 'I consent to blood being drawn for PRP preparation',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'shockwave_consent',
      title: 'Shockwave Therapy Consent',
      fields: [
        {
          id: 'shockwave_risks',
          type: 'checkbox',
          label: 'I understand Shockwave risks including mild discomfort and temporary redness',
          validation: { required: true },
        },
        {
          id: 'no_pacemaker',
          type: 'checkbox',
          label: 'I confirm I do not have a pacemaker or implanted electronic device',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'final_consent',
      title: 'Final Consent',
      fields: [
        {
          id: 'understand_all',
          type: 'checkbox',
          label: 'I have read and understood all information about both treatments',
          validation: { required: true },
        },
        {
          id: 'consent_both',
          type: 'checkbox',
          label: 'I consent to receiving both PRP and Shockwave therapy in the agreed treatment area',
          validation: { required: true },
        },
      ],
    },
  ],
};

const consentIntimateAesthetics: FormDefinition = {
  id: 'menh_consent_intimate',
  name: 'Intimate Aesthetics Consent',
  description: 'Consent for intimate aesthetic procedures',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Consent Forms',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I consent to the intimate aesthetic treatment as described above. I confirm I have understood the procedure, risks, and aftercare requirements.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'treatment_selection',
      title: 'Treatment',
      fields: [
        {
          id: 'treatment_type',
          type: 'select',
          label: 'Treatment Type',
          options: [
            { value: 'muscle_relaxant', label: 'Muscle Relaxant Treatment' },
            { value: 'skin_treatment', label: 'Intimate Skin Treatment' },
            { value: 'combination', label: 'Combination Treatment' },
          ],
          validation: { required: true },
        },
        {
          id: 'treatment_area',
          type: 'text',
          label: 'Specific Treatment Area',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'understanding',
      title: 'Understanding',
      fields: [
        {
          id: 'understand_intimate',
          type: 'checkbox',
          label: 'I understand this treatment involves an intimate area of the body',
          validation: { required: true },
        },
        {
          id: 'understand_procedure',
          type: 'checkbox',
          label: 'The procedure has been clearly explained to me',
          validation: { required: true },
        },
        {
          id: 'understand_may_need_exposure',
          type: 'checkbox',
          label: 'I understand the treatment area will need to be exposed during the procedure',
          validation: { required: true },
        },
        {
          id: 'understand_chaperone',
          type: 'checkbox',
          label: 'I have been offered the option of a chaperone',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'risks',
      title: 'Risks & Side Effects',
      fields: [
        {
          id: 'understand_common_risks',
          type: 'checkbox',
          label: 'I understand common side effects may include temporary redness, swelling, or bruising',
          validation: { required: true },
        },
        {
          id: 'understand_sensitivity',
          type: 'checkbox',
          label: 'I understand there may be temporary changes in sensitivity',
          validation: { required: true },
        },
        {
          id: 'understand_results_vary',
          type: 'checkbox',
          label: 'I understand results vary between individuals',
          validation: { required: true },
        },
        {
          id: 'understand_downtime',
          type: 'checkbox',
          label: 'I understand the recovery and downtime requirements',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'aftercare_consent',
      title: 'Aftercare & Consent',
      fields: [
        {
          id: 'understand_aftercare',
          type: 'checkbox',
          label: 'I have received and understood the aftercare instructions',
          validation: { required: true },
        },
        {
          id: 'understand_abstinence',
          type: 'checkbox',
          label: 'I understand any abstinence period required after treatment',
          validation: { required: true },
        },
        {
          id: 'consent_treatment',
          type: 'checkbox',
          label: 'I consent to the intimate aesthetic treatment described',
          validation: { required: true },
        },
        {
          id: 'consent_photographs',
          type: 'yesNo',
          label: 'I consent to clinical photographs being taken for my medical records only',
        },
      ],
    },
  ],
};

// ============================================
// PROCEDURE & FOLLOW-UP FORMS
// ============================================

const procedureRecord: FormDefinition = {
  id: 'menh_procedure_record',
  name: 'Procedure Record',
  description: 'Record of treatment/procedure performed',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Clinical Records',
  requiresSignature: true,
  signatureLabel: 'Practitioner',
  signatureDeclaration: 'I confirm this procedure record is accurate.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'procedure_info',
      title: 'Procedure Information',
      fields: [
        {
          id: 'procedure_date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'procedure_time',
          type: 'time',
          label: 'Time',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'practitioner_name',
          type: 'text',
          label: 'Practitioner',
          validation: { required: true },
        },
        {
          id: 'procedure_type',
          type: 'select',
          label: 'Procedure Type',
          options: [
            { value: 'prp', label: 'PRP Therapy' },
            { value: 'shockwave', label: 'Shockwave Therapy' },
            { value: 'combined', label: 'Combined PRP + Shockwave' },
            { value: 'intimate', label: 'Intimate Aesthetics' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'treatment_area',
          type: 'text',
          label: 'Treatment Area',
          validation: { required: true },
        },
        {
          id: 'session_number',
          type: 'number',
          label: 'Session Number',
          helpText: 'e.g., 2 of 6',
          width: 'half',
        },
      ],
    },
    {
      id: 'pre_procedure',
      title: 'Pre-Procedure',
      fields: [
        {
          id: 'consent_verified',
          type: 'yesNo',
          label: 'Consent form verified and signed',
          validation: { required: true },
        },
        {
          id: 'contraindications_checked',
          type: 'yesNo',
          label: 'Contraindications checklist completed',
          validation: { required: true },
        },
        {
          id: 'photographs_taken',
          type: 'yesNo',
          label: 'Clinical photographs taken',
        },
        {
          id: 'pre_procedure_notes',
          type: 'textarea',
          label: 'Pre-procedure Notes',
        },
      ],
    },
    {
      id: 'prp_details',
      title: 'PRP Details',
      conditionalLogic: {
        action: 'show',
        conditions: [
          { field: 'procedure_type', operator: 'equals', value: 'prp' },
          { field: 'procedure_type', operator: 'equals', value: 'combined' },
        ],
        logicType: 'or',
      },
      fields: [
        {
          id: 'blood_volume_drawn',
          type: 'number',
          label: 'Blood Volume Drawn (ml)',
          validation: { required: true },
        },
        {
          id: 'prp_volume_obtained',
          type: 'number',
          label: 'PRP Volume Obtained (ml)',
          validation: { required: true },
        },
        {
          id: 'prp_kit_batch',
          type: 'text',
          label: 'PRP Kit Batch/Lot Number',
          validation: { required: true },
        },
        {
          id: 'centrifuge_time',
          type: 'text',
          label: 'Centrifuge Time/Speed',
        },
        {
          id: 'injection_sites',
          type: 'textarea',
          label: 'Injection Sites and Volumes',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'shockwave_details',
      title: 'Shockwave Details',
      conditionalLogic: {
        action: 'show',
        conditions: [
          { field: 'procedure_type', operator: 'equals', value: 'shockwave' },
          { field: 'procedure_type', operator: 'equals', value: 'combined' },
        ],
        logicType: 'or',
      },
      fields: [
        {
          id: 'device_used',
          type: 'text',
          label: 'Device Used',
          validation: { required: true },
        },
        {
          id: 'energy_level',
          type: 'text',
          label: 'Energy Level/Settings',
          validation: { required: true },
        },
        {
          id: 'number_of_pulses',
          type: 'number',
          label: 'Number of Pulses',
        },
        {
          id: 'treatment_duration',
          type: 'text',
          label: 'Treatment Duration',
        },
        {
          id: 'areas_treated',
          type: 'textarea',
          label: 'Areas Treated',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'other_details',
      title: 'Procedure Details',
      conditionalLogic: {
        action: 'show',
        conditions: [
          { field: 'procedure_type', operator: 'equals', value: 'intimate' },
          { field: 'procedure_type', operator: 'equals', value: 'other' },
        ],
        logicType: 'or',
      },
      fields: [
        {
          id: 'product_used',
          type: 'text',
          label: 'Product Used',
        },
        {
          id: 'batch_number',
          type: 'text',
          label: 'Batch/Lot Number',
        },
        {
          id: 'quantity_used',
          type: 'text',
          label: 'Quantity Used',
        },
        {
          id: 'technique',
          type: 'textarea',
          label: 'Technique/Method',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'post_procedure',
      title: 'Post-Procedure',
      fields: [
        {
          id: 'patient_tolerance',
          type: 'select',
          label: 'Patient Tolerance',
          options: [
            { value: 'well', label: 'Tolerated well' },
            { value: 'mild_discomfort', label: 'Mild discomfort' },
            { value: 'moderate_discomfort', label: 'Moderate discomfort' },
            { value: 'significant_discomfort', label: 'Significant discomfort' },
          ],
          validation: { required: true },
        },
        {
          id: 'immediate_response',
          type: 'textarea',
          label: 'Immediate Response/Observations',
        },
        {
          id: 'aftercare_provided',
          type: 'yesNo',
          label: 'Aftercare instructions provided',
          validation: { required: true },
        },
        {
          id: 'complications',
          type: 'yesNo',
          label: 'Any complications during procedure?',
          validation: { required: true },
        },
        {
          id: 'complication_details',
          type: 'textarea',
          label: 'Complication Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'complications', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'next_appointment',
          type: 'date',
          label: 'Next Appointment Date',
        },
        {
          id: 'additional_notes',
          type: 'textarea',
          label: 'Additional Notes',
        },
      ],
    },
  ],
};

const adverseEvent: FormDefinition = {
  id: 'menh_adverse_event',
  name: 'Adverse Event Report',
  description: 'Report any adverse event or complication',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Clinical Records',
  requiresSignature: true,
  signatureLabel: 'Reporting Practitioner',
  signatureDeclaration: 'I confirm this adverse event report is accurate.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,
  sections: [
    {
      id: 'event_info',
      title: 'Event Information',
      fields: [
        {
          id: 'event_date',
          type: 'date',
          label: 'Date of Event',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'reported_date',
          type: 'date',
          label: 'Date Reported',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'treatment_date',
          type: 'date',
          label: 'Date of Original Treatment',
          validation: { required: true },
        },
        {
          id: 'treatment_type',
          type: 'text',
          label: 'Treatment Received',
          validation: { required: true },
        },
        {
          id: 'treating_practitioner',
          type: 'text',
          label: 'Treating Practitioner',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'event_details',
      title: 'Event Details',
      fields: [
        {
          id: 'event_severity',
          type: 'select',
          label: 'Severity',
          options: [
            { value: 'mild', label: 'Mild - Minor discomfort, resolved quickly' },
            { value: 'moderate', label: 'Moderate - Required intervention' },
            { value: 'severe', label: 'Severe - Significant impact' },
            { value: 'serious', label: 'Serious - Required medical attention' },
          ],
          validation: { required: true },
          stopConditions: [
            {
              field: 'event_severity',
              operator: 'equals',
              value: 'serious',
              action: 'escalate',
              message: 'Serious adverse event - requires immediate senior review and possible MHRA reporting',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'event_type',
          type: 'checkboxGroup',
          label: 'Type of Event',
          options: [
            { value: 'infection', label: 'Infection' },
            { value: 'bleeding', label: 'Excessive Bleeding/Haematoma' },
            { value: 'bruising', label: 'Severe Bruising' },
            { value: 'swelling', label: 'Excessive Swelling' },
            { value: 'allergic', label: 'Allergic Reaction' },
            { value: 'nerve', label: 'Nerve Damage/Numbness' },
            { value: 'pain', label: 'Persistent Pain' },
            { value: 'scarring', label: 'Scarring' },
            { value: 'other', label: 'Other' },
          ],
          validation: { required: true },
        },
        {
          id: 'event_description',
          type: 'textarea',
          label: 'Description of Event',
          helpText: 'Describe what happened, when it was noticed, progression',
          validation: { required: true, minLength: 50 },
        },
      ],
    },
    {
      id: 'management',
      title: 'Management',
      fields: [
        {
          id: 'action_taken',
          type: 'textarea',
          label: 'Action Taken',
          validation: { required: true },
        },
        {
          id: 'external_referral',
          type: 'yesNo',
          label: 'Was patient referred externally?',
          validation: { required: true },
        },
        {
          id: 'referral_details',
          type: 'textarea',
          label: 'Referral Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'external_referral', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'current_status',
          type: 'select',
          label: 'Current Status',
          options: [
            { value: 'resolved', label: 'Resolved' },
            { value: 'improving', label: 'Improving' },
            { value: 'ongoing', label: 'Ongoing' },
            { value: 'worsening', label: 'Worsening' },
          ],
          validation: { required: true },
        },
      ],
    },
    {
      id: 'follow_up',
      title: 'Follow-up',
      fields: [
        {
          id: 'follow_up_planned',
          type: 'yesNo',
          label: 'Is follow-up planned?',
          validation: { required: true },
        },
        {
          id: 'follow_up_date',
          type: 'date',
          label: 'Follow-up Date',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'follow_up_planned', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'mhra_reportable',
          type: 'yesNo',
          label: 'Is this potentially MHRA reportable?',
        },
        {
          id: 'learning_points',
          type: 'textarea',
          label: 'Learning Points / Recommendations',
        },
      ],
    },
  ],
};

const followUpReview: FormDefinition = {
  id: 'menh_follow_up_review',
  name: 'Follow-up Review',
  description: 'Follow-up review after treatment',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Clinical Records',
  requiresSignature: true,
  signatureLabel: 'Practitioner',
  signatureDeclaration: 'I confirm this follow-up review is accurate.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,
  sections: [
    {
      id: 'review_info',
      title: 'Review Information',
      fields: [
        {
          id: 'review_date',
          type: 'date',
          label: 'Date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'practitioner',
          type: 'text',
          label: 'Reviewing Practitioner',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'original_treatment',
          type: 'text',
          label: 'Treatment Being Reviewed',
          validation: { required: true },
        },
        {
          id: 'original_treatment_date',
          type: 'date',
          label: 'Date of Treatment',
          validation: { required: true },
        },
        {
          id: 'sessions_completed',
          type: 'number',
          label: 'Sessions Completed to Date',
        },
      ],
    },
    {
      id: 'patient_feedback',
      title: 'Patient Feedback',
      fields: [
        {
          id: 'overall_satisfaction',
          type: 'rating',
          label: 'Overall Satisfaction',
          maxRating: 5,
          validation: { required: true },
        },
        {
          id: 'improvement_noticed',
          type: 'select',
          label: 'Has the patient noticed improvement?',
          options: [
            { value: 'significant', label: 'Significant improvement' },
            { value: 'moderate', label: 'Moderate improvement' },
            { value: 'slight', label: 'Slight improvement' },
            { value: 'no_change', label: 'No change' },
            { value: 'worse', label: 'Condition worse' },
          ],
          validation: { required: true },
        },
        {
          id: 'patient_comments',
          type: 'textarea',
          label: 'Patient Comments',
        },
        {
          id: 'any_concerns',
          type: 'yesNo',
          label: 'Does the patient have any concerns?',
          validation: { required: true },
        },
        {
          id: 'concerns_details',
          type: 'textarea',
          label: 'Concern Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'any_concerns', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'clinical_assessment',
      title: 'Clinical Assessment',
      fields: [
        {
          id: 'examination_findings',
          type: 'textarea',
          label: 'Examination Findings',
          validation: { required: true },
        },
        {
          id: 'photographs_taken',
          type: 'yesNo',
          label: 'Follow-up photographs taken?',
        },
        {
          id: 'objective_improvement',
          type: 'select',
          label: 'Objective Improvement Observed',
          options: [
            { value: 'significant', label: 'Significant improvement' },
            { value: 'moderate', label: 'Moderate improvement' },
            { value: 'slight', label: 'Slight improvement' },
            { value: 'no_change', label: 'No change' },
            { value: 'worse', label: 'Worsening' },
          ],
          validation: { required: true },
        },
        {
          id: 'any_adverse_effects',
          type: 'yesNo',
          label: 'Any adverse effects reported or observed?',
          validation: { required: true },
        },
        {
          id: 'adverse_effects_details',
          type: 'textarea',
          label: 'Adverse Effect Details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'any_adverse_effects', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
      ],
    },
    {
      id: 'plan',
      title: 'Plan',
      fields: [
        {
          id: 'continue_treatment',
          type: 'yesNo',
          label: 'Continue with treatment plan?',
          validation: { required: true },
        },
        {
          id: 'plan_modifications',
          type: 'textarea',
          label: 'Plan Modifications (if any)',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'continue_treatment', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'discontinuation_reason',
          type: 'textarea',
          label: 'Reason for Discontinuation',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'continue_treatment', operator: 'equals', value: false }],
            logicType: 'and',
          },
        },
        {
          id: 'next_appointment',
          type: 'date',
          label: 'Next Appointment',
        },
        {
          id: 'additional_notes',
          type: 'textarea',
          label: 'Additional Notes',
        },
      ],
    },
  ],
};

// ============================================
// EXPORT ALL MENHANCEMENTS FORMS
// ============================================

export const menhancementsForms: FormDefinition[] = [
  // Patient Records
  patientRegistration,
  medicalHistory,
  medicationAllergies,

  // Clinical Records
  consultationNotes,
  contraindicationsChecklist,
  treatmentPlan,
  procedureRecord,
  adverseEvent,
  followUpReview,

  // Consent Forms
  consentGeneral,
  consentPrp,
  consentShockwave,
  consentCombined,
  consentIntimateAesthetics,
];

import { FormDefinition } from '../types';

// ============================================
// MENHANCEMENTS — DERMAL FILLERS
// Clinical Pathway: MEN-CP-008 | Version 1.0
// ============================================
// Three forms covering the full Dermal Filler pathway:
//   1. menh_fillers_consultation  — Sections A–E: zone selection, existing filler
//                                   assessment, NSR/tear trough gates, full
//                                   contraindication screen (B1–B12), photography
//                                   checklist, male aesthetic goals, MD referral
//                                   trigger summary
//   2. menh_fillers_consent       — Product/zone-specific consent with off-label
//                                   disclosure, non-HA reversibility declaration,
//                                   vascular/visual risk acknowledgement,
//                                   three-party sign-off (Patient / MD / Practitioner)
//   3. menh_fillers_procedure     — Day-of-treatment: hyaluronidase gate, product
//                                   verification, zone-by-zone volume/batch record,
//                                   30-minute post-injection observation, vision
//                                   checks, adverse event flag
// ============================================

// ============================================
// FORM 1: DERMAL FILLER CONSULTATION FORM
// ============================================

const fillersConsultation: FormDefinition = {
  id: 'menh_fillers_consultation',
  name: 'Dermal Filler — Consultation & Contraindication Screen',
  description:
    'Practitioner-completed assessment for aesthetic dermal filler treatment. Covers zone selection, existing filler assessment, NSR and tear trough safety gates, full contraindication screen (B1–B12), photography checklist, male aesthetic goal confirmation, and MD referral trigger summary. Document reference: MEN-CP-008.',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Dermal Fillers',
  requiresSignature: true,
  signatureLabel: 'Practitioner',
  signatureDeclaration:
    'I confirm this consultation assessment is accurate and complete. I have reviewed all stop conditions and MD referral triggers and will transmit this record to the Manchester Medical Director before any treatment is delivered.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,

  sections: [

    // ─── SECTION A — Presenting Concern & Zone Assessment ──────────────────────

    {
      id: 'section_a_zones',
      title: 'Section A — Presenting Concern & Zone Assessment',
      description: 'Document the patient\'s treatment goals, proposed zones, and baseline facial assessment.',
      fields: [

        {
          id: 'zones_requested',
          type: 'checkboxGroup',
          label: 'A1 — Zones the patient wishes to treat (tick all that apply)',
          validation: { required: true },
          options: [
            { value: 'lips',          label: 'Zone A — Lips' },
            { value: 'nasolabial',    label: 'Zone B — Nasolabial folds' },
            { value: 'marionette',    label: 'Zone C — Marionette lines / pre-jowl' },
            { value: 'cheeks',        label: 'Zone D — Cheeks / midface' },
            { value: 'tear_trough',   label: 'Zone E — Tear trough / periorbital' },
            { value: 'jawline',       label: 'Zone F — Jawline' },
            { value: 'chin',          label: 'Zone G — Chin' },
            { value: 'temples',       label: 'Zone H — Temples' },
            { value: 'nsr',           label: 'Zone I — Non-surgical rhinoplasty (NSR)' },
            { value: 'dorsal_hands',  label: 'Zone J — Dorsal hands' },
          ],
        },

        {
          id: 'patient_goals_verbatim',
          type: 'textarea',
          label: 'A2 — Patient goals (document in patient\'s own words)',
          helpText: 'Use the patient\'s own language. Do not paraphrase.',
          validation: { required: true },
        },

        {
          id: 'baseline_asymmetry',
          type: 'radio',
          label: 'A3a — Baseline facial asymmetry',
          validation: { required: true },
          options: [
            { value: 'none',    label: 'None identified' },
            { value: 'present', label: 'Present — describe below' },
          ],
        },

        {
          id: 'asymmetry_description',
          type: 'textarea',
          label: 'A3a — Asymmetry description',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'baseline_asymmetry', operator: 'equals', value: 'present' }],
          },
        },

        {
          id: 'asymmetry_disclosed',
          type: 'yesNo',
          label: 'A3a — Asymmetry disclosed to patient',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'baseline_asymmetry', operator: 'equals', value: 'present' }],
          },
        },

        {
          id: 'bony_anatomy_jawline',
          type: 'radio',
          label: 'A3b — Bony anatomy — Jawline (male)',
          options: [
            { value: 'defined',   label: 'Well-defined' },
            { value: 'moderate',  label: 'Moderate' },
            { value: 'receded',   label: 'Receded' },
          ],
        },

        {
          id: 'bony_anatomy_chin',
          type: 'radio',
          label: 'A3b — Bony anatomy — Chin (male)',
          options: [
            { value: 'projected', label: 'Projected' },
            { value: 'receded',   label: 'Receded' },
          ],
        },

        {
          id: 'orbital_hollowing',
          type: 'select',
          label: 'A3c — Orbital hollowing / tear trough depth',
          options: [
            { value: 'none',     label: 'None' },
            { value: 'mild',     label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe',   label: 'Severe' },
          ],
        },

        {
          id: 'orbital_fat_herniation',
          type: 'radio',
          label: 'A3d — Orbital fat herniation (lower eyelid)',
          helpText: 'Present fat herniation may worsen with filler placement and should be flagged to MD.',
          options: [
            { value: 'none',    label: 'None' },
            { value: 'present', label: 'Present' },
          ],
          stopConditions: [
            {
              field: 'orbital_fat_herniation',
              operator: 'equals',
              value: 'present',
              action: 'flag',
              message: 'Orbital fat herniation identified. Filler may worsen appearance. FLAG to MD — cheek volumisation may be preferred alternative.',
              riskLevel: 'MEDIUM',
            },
          ],
        },

        {
          id: 'prior_ha_filler',
          type: 'yesNo',
          label: 'A4a — Prior HA filler present (confirmed by palpation or history)',
          validation: { required: true },
        },

        {
          id: 'prior_ha_zones',
          type: 'text',
          label: 'A4a — Prior HA filler — zone(s)',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'prior_ha_filler', operator: 'equals', value: true }],
          },
        },

        {
          id: 'prior_ha_consistency',
          type: 'radio',
          label: 'A4a — Prior HA filler — consistency on palpation',
          options: [
            { value: 'soft',    label: 'Soft (integrating normally)' },
            { value: 'firm',    label: 'Firm' },
            { value: 'nodular', label: 'Nodular' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'prior_ha_filler', operator: 'equals', value: true }],
          },
        },

        {
          id: 'prior_non_ha_filler',
          type: 'yesNo',
          label: 'A4b — Prior non-HA, unknown, or permanent filler present',
          helpText: 'Includes PMMA, silicone, Sculptra, Radiesse from another provider, or any product of unknown type.',
          validation: { required: true },
          stopConditions: [
            {
              field: 'prior_non_ha_filler',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'URGENT MD REFERRAL REQUIRED: Prior non-HA, unknown, or permanent filler identified. Do not treat affected zone(s) without individual MD risk-benefit assessment. Permanent filler (PMMA, silicone) may be an absolute contraindication for that zone.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'prior_non_ha_zones',
          type: 'text',
          label: 'A4b — Non-HA / unknown filler — zone(s)',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'prior_non_ha_filler', operator: 'equals', value: true }],
          },
        },

        // A5 — NSR Gate

        {
          id: 'nsr_prior_rhinoplasty',
          type: 'yesNo',
          label: 'A5 — NSR: Prior surgical rhinoplasty',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'nsr' }],
          },
          stopConditions: [
            {
              field: 'nsr_prior_rhinoplasty',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP — NSR CANNOT PROCEED. Prior surgical rhinoplasty identified. Significantly elevated vascular risk. This patient requires individual MD assessment before NSR can be considered. Many practitioners decline post-rhinoplasty NSR.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'nsr_rhinoplasty_type',
          type: 'text',
          label: 'A5 — Prior rhinoplasty — type and date',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [
              { field: 'zones_requested', operator: 'includes', value: 'nsr' },
              { field: 'nsr_prior_rhinoplasty', operator: 'equals', value: true },
            ],
          },
        },

        {
          id: 'nsr_competency_on_file',
          type: 'yesNo',
          label: 'A5 — NSR: Practitioner NSR competency confirmed on file',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'nsr' }],
          },
          stopConditions: [
            {
              field: 'nsr_competency_on_file',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — NSR CANNOT PROCEED. Practitioner NSR competency is not confirmed on file. NSR requires documented training and individual competency assessment before this zone may be treated. Contact clinic manager.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'nsr_md_competency_confirmed',
          type: 'yesNo',
          label: 'A5 — NSR: MD has confirmed competency at prescribing consultation',
          helpText: 'MD must confirm practitioner NSR competency is on file when issuing the prescription.',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'nsr' }],
          },
        },

        // A6 — Tear Trough Gate

        {
          id: 'tt_fat_herniation_significant',
          type: 'radio',
          label: 'A6 — Tear trough: significant orbital fat herniation present',
          validation: { required: true },
          options: [
            { value: 'no',        label: 'No' },
            { value: 'yes',       label: 'Yes' },
            { value: 'uncertain', label: 'Uncertain' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'tear_trough' }],
          },
          stopConditions: [
            {
              field: 'tt_fat_herniation_significant',
              operator: 'equals',
              value: 'yes',
              action: 'escalate',
              message: 'FLAG TO MD: Significant orbital fat herniation present. Filler may worsen the appearance. MD to assess — cheek volumisation may reduce the shadow more safely. Tear trough filler may not be appropriate.',
              riskLevel: 'HIGH',
            },
            {
              field: 'tt_fat_herniation_significant',
              operator: 'equals',
              value: 'uncertain',
              action: 'flag',
              message: 'Orbital fat herniation uncertain — flag to MD for assessment before tear trough treatment.',
              riskLevel: 'MEDIUM',
            },
          ],
        },

      ],
    },

    // ─── SECTION B — Contraindication Screen ───────────────────────────────────

    {
      id: 'section_b_contraindications',
      title: 'Section B — Contraindication Screen',
      description: 'Complete all questions. Stop conditions and escalation triggers are built into each field.',
      fields: [

        {
          id: 'b1_active_infection',
          type: 'yesNo',
          label: 'B1 — Active infection, cold sore (HSV), cellulitis, or open wound at or near any proposed treatment zone',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b1_active_infection',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP — Defer treatment to affected zone(s) until the infection or wound is fully resolved.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'b1_infection_zones',
          type: 'text',
          label: 'B1 — Affected zone(s)',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b1_active_infection', operator: 'equals', value: true }],
          },
        },

        {
          id: 'b2_hsv_history',
          type: 'yesNo',
          label: 'B2 — History of cold sores (HSV-1) at or near the perioral / lip zone (if lip treatment is proposed)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b2_hsv_history',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'FLAG TO MD: HSV history at perioral zone. Antiviral prophylaxis is required (aciclovir or valaciclovir — POM, MD to prescribe) commencing 48 hours before perioral treatment. Perioral treatment must not proceed without confirmed antiviral prescription.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'b3_ha_allergy',
          type: 'yesNo',
          label: 'B3 — Known allergy to hyaluronic acid, any filler component, or streptococcal-derived products',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b3_ha_allergy',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP — Absolute contraindication. Known allergy to HA, filler component, or streptococcal-derived products. Treatment cannot proceed with affected product(s). FLAG to MD.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'b3_allergy_detail',
          type: 'text',
          label: 'B3 — Allergy detail (substance)',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b3_ha_allergy', operator: 'equals', value: true }],
          },
        },

        {
          id: 'b4_anaesthetic_allergy',
          type: 'yesNo',
          label: 'B4 — Known allergy to lidocaine or prilocaine',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b4_anaesthetic_allergy',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP — Lidocaine/prilocaine allergy identified. FLAG TO MD immediately. Alternative anaesthetic plan is required before treatment can proceed. EMLA cream cannot be used.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'b5_autoimmune_ctd',
          type: 'yesNo',
          label: 'B5 — Autoimmune connective tissue disease (SLE, Sjögren\'s, scleroderma, dermatomyositis)',
          validation: { required: true },
        },

        {
          id: 'b5_autoimmune_status',
          type: 'radio',
          label: 'B5 — Disease status',
          options: [
            { value: 'active',    label: 'Active / current flare' },
            { value: 'remission', label: 'In remission' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b5_autoimmune_ctd', operator: 'equals', value: true }],
          },
          stopConditions: [
            {
              field: 'b5_autoimmune_status',
              operator: 'equals',
              value: 'active',
              action: 'stop',
              message: 'STOP — Absolute contraindication. Active autoimmune connective tissue disease. Treatment cannot proceed.',
              riskLevel: 'CRITICAL',
            },
            {
              field: 'b5_autoimmune_status',
              operator: 'equals',
              value: 'remission',
              action: 'escalate',
              message: 'FLAG TO MD: Autoimmune CTD in remission. Requires individual MD risk-benefit assessment before treatment.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'b6_inflammatory_skin',
          type: 'yesNo',
          label: 'B6 — Active inflammatory skin disease at any proposed treatment site',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b6_inflammatory_skin',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP — Active inflammatory skin disease at treatment site. Defer treatment to affected zone(s) until resolved.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'b7_prior_granuloma',
          type: 'yesNo',
          label: 'B7 — History of inflammatory nodule or granuloma from prior HA filler treatment',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b7_prior_granuloma',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'URGENT FLAG TO MD: Prior inflammatory nodule or granuloma from HA filler. Elevated hypersensitivity and biofilm risk. MD individual assessment mandatory before treatment.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'b7_granuloma_detail',
          type: 'text',
          label: 'B7 — Product and site of prior granuloma',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b7_prior_granuloma', operator: 'equals', value: true }],
          },
        },

        {
          id: 'b8_anticoagulant',
          type: 'yesNo',
          label: 'B8 — Coagulopathy or anticoagulant / antiplatelet therapy (warfarin, DOAC, clopidogrel, high-dose aspirin)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b8_anticoagulant',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'FLAG TO MD: Anticoagulant or antiplatelet therapy. Particularly significant for tear trough and periorbital zones — elevated haematoma and bruising risk. MD to advise.',
              riskLevel: 'MEDIUM',
            },
          ],
        },

        {
          id: 'b8_anticoagulant_drug',
          type: 'text',
          label: 'B8 — Drug name and dose',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b8_anticoagulant', operator: 'equals', value: true }],
          },
        },

        {
          id: 'b9_recent_dental',
          type: 'yesNo',
          label: 'B9 — Recent dental procedure within the past 2 weeks (relevant if perioral / lip treatment is proposed)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b9_recent_dental',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP — Perioral / lip treatment must be deferred. Recent dental procedure within 2 weeks significantly elevates oral bacteria translocation risk following lip/perioral filler. Defer minimum 2 weeks post-dental procedure.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'b9_dental_date',
          type: 'date',
          label: 'B9 — Date of dental procedure',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b9_recent_dental', operator: 'equals', value: true }],
          },
        },

        {
          id: 'b10_diabetes',
          type: 'yesNo',
          label: 'B10 — Diabetes mellitus (poorly controlled)',
          validation: { required: true },
        },

        {
          id: 'b10_hba1c',
          type: 'text',
          label: 'B10 — Most recent HbA1c (mmol/mol)',
          helpText: 'HbA1c >75 mmol/mol: FLAG to MD. Elevated infection and wound healing risk.',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b10_diabetes', operator: 'equals', value: true }],
          },
        },

        {
          id: 'b10_hba1c_elevated_flag',
          type: 'yesNo',
          label: 'B10 — HbA1c confirmed above 75 mmol/mol',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b10_diabetes', operator: 'equals', value: true }],
          },
          stopConditions: [
            {
              field: 'b10_hba1c_elevated_flag',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'FLAG TO MD: HbA1c above 75 mmol/mol. Elevated infection risk and impaired healing. MD risk assessment required.',
              riskLevel: 'MEDIUM',
            },
          ],
        },

        {
          id: 'b11_immunosuppressant',
          type: 'yesNo',
          label: 'B11 — Immunosuppressant therapy (steroids, methotrexate, biologics, chemotherapy)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b11_immunosuppressant',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'FLAG TO MD: Immunosuppressant therapy identified. Elevated infection, poor healing, and granuloma risk. MD to assess.',
              riskLevel: 'MEDIUM',
            },
          ],
        },

        {
          id: 'b11_immunosuppressant_drug',
          type: 'text',
          label: 'B11 — Drug name(s)',
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'b11_immunosuppressant', operator: 'equals', value: true }],
          },
        },

        {
          id: 'b12_bdd',
          type: 'radio',
          label: 'B12 — Suspected or confirmed Body Dysmorphic Disorder',
          validation: { required: true },
          options: [
            { value: 'no',        label: 'No' },
            { value: 'suspected', label: 'Suspected' },
            { value: 'confirmed', label: 'Confirmed' },
          ],
          stopConditions: [
            {
              field: 'b12_bdd',
              operator: 'equals',
              value: 'suspected',
              action: 'stop',
              message: 'STOP — Suspected BDD. Treatment cannot proceed. Refer for psychological assessment. MD review is mandatory. Document in full.',
              riskLevel: 'CRITICAL',
            },
            {
              field: 'b12_bdd',
              operator: 'equals',
              value: 'confirmed',
              action: 'stop',
              message: 'STOP — Confirmed BDD. Treatment cannot proceed. Refer for psychological assessment. MD review is mandatory. Document in full.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'b13_medication_list',
          type: 'medicationList',
          label: 'B13 — Full current medication list',
          helpText: 'Include all prescribed and over-the-counter medications, supplements, and herbal preparations.',
          validation: { required: true },
        },

      ],
    },

    // ─── SECTION C — Photography Checklist ─────────────────────────────────────

    {
      id: 'section_c_photography',
      title: 'Section C — Photography Checklist',
      description: 'All applicable photographs must be taken and stored in the digital record before treatment proceeds. No photography = No treatment.',
      fields: [

        {
          id: 'photo_frontal_repose',
          type: 'yesNo',
          label: 'C — Full face frontal — neutral repose',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photo_frontal_repose',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Mandatory photograph not taken. Full face frontal (repose) must be captured and stored before treatment.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'photo_frontal_animated',
          type: 'yesNo',
          label: 'C — Full face frontal — animated (smile, frown, brow raise)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photo_frontal_animated',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Mandatory photograph not taken. Full face frontal (animated) must be captured.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'photo_lateral_left',
          type: 'yesNo',
          label: 'C — Lateral left view',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photo_lateral_left',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Mandatory photograph not taken.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'photo_lateral_right',
          type: 'yesNo',
          label: 'C — Lateral right view',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photo_lateral_right',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Mandatory photograph not taken.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'photo_three_quarter',
          type: 'yesNo',
          label: 'C — Three-quarter views (bilateral)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photo_three_quarter',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Mandatory photograph not taken.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'photo_zone_closeups',
          type: 'yesNo',
          label: 'C — Close-up photographs of each proposed treatment zone',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photo_zone_closeups',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Zone close-up photographs are mandatory before treatment.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'photo_underchin',
          type: 'radio',
          label: 'C — Under-chin / profile view (jawline or chin treatment)',
          options: [
            { value: 'taken', label: 'Taken and stored' },
            { value: 'na',    label: 'N/A — jawline and chin not being treated' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'or',
            conditions: [
              { field: 'zones_requested', operator: 'includes', value: 'jawline' },
              { field: 'zones_requested', operator: 'includes', value: 'chin' },
            ],
          },
        },

        {
          id: 'photo_nose_views',
          type: 'radio',
          label: 'C — Nose views — frontal, lateral, and basal (NSR)',
          options: [
            { value: 'taken', label: 'All three views taken and stored' },
            { value: 'na',    label: 'N/A — NSR not being treated' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'nsr' }],
          },
          stopConditions: [
            {
              field: 'photo_nose_views',
              operator: 'equals',
              value: 'na',
              action: 'stop',
              message: 'STOP — All three nose view photographs (frontal, lateral, basal) are mandatory for NSR treatment.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'photo_dorsal_hands',
          type: 'radio',
          label: 'C — Dorsal hand photographs',
          options: [
            { value: 'taken', label: 'Taken and stored (bilateral)' },
            { value: 'na',    label: 'N/A — Hand treatment not being performed' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'dorsal_hands' }],
          },
        },

        {
          id: 'photos_stored_digital_record',
          type: 'yesNo',
          label: 'C — All photographs stored in the patient\'s digital record (Clinical Vault)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photos_stored_digital_record',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Photographs must be stored in the patient\'s Clinical Vault before treatment proceeds.',
              riskLevel: 'HIGH',
            },
          ],
        },

      ],
    },

    // ─── SECTION D — Male Aesthetic Goals ──────────────────────────────────────

    {
      id: 'section_d_male_goals',
      title: 'Section D — Male Aesthetic Goals Checklist',
      description: 'Complete for all facial filler treatments. Male aesthetic goals are structural and architectural — volume softening or feminisation is not the goal.',
      fields: [

        {
          id: 'd_goals_documented',
          type: 'yesNo',
          label: 'D — Treatment goals documented in patient\'s own words — structural/architectural goal confirmed (not softening/feminising)',
          validation: { required: true },
        },

        {
          id: 'd_cheek_lateral_confirmed',
          type: 'radio',
          label: 'D — Cheek treatment: lateral placement confirmed — NOT apple cheek (medial malar volumisation feminises the male face)',
          options: [
            { value: 'confirmed', label: 'Confirmed — lateral cheek projection is the target' },
            { value: 'na',        label: 'N/A — cheeks not being treated' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'cheeks' }],
          },
        },

        {
          id: 'd_lip_definition_confirmed',
          type: 'radio',
          label: 'D — Lip treatment: subtle definition goal confirmed — NOT volume-focused (male lip should not protrude beyond lower lip)',
          options: [
            { value: 'confirmed', label: 'Confirmed — definition/border enhancement, not volume augmentation' },
            { value: 'na',        label: 'N/A — lips not being treated' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'lips' }],
          },
        },

        {
          id: 'd_jawline_architectural',
          type: 'radio',
          label: 'D — Jawline/chin: strong architectural goal confirmed and documented',
          options: [
            { value: 'confirmed', label: 'Confirmed — mandibular border sharpening / chin projection' },
            { value: 'na',        label: 'N/A — jawline and chin not being treated' },
          ],
          conditionalLogic: {
            action: 'show',
            logicType: 'or',
            conditions: [
              { field: 'zones_requested', operator: 'includes', value: 'jawline' },
              { field: 'zones_requested', operator: 'includes', value: 'chin' },
            ],
          },
        },

        {
          id: 'd_asymmetry_disclosed',
          type: 'radio',
          label: 'D — Baseline facial asymmetry',
          options: [
            { value: 'documented_disclosed', label: 'Documented and disclosed to patient' },
            { value: 'none',                 label: 'None present' },
          ],
          validation: { required: true },
        },

      ],
    },

    // ─── SECTION E — MD Referral Trigger Summary ────────────────────────────────

    {
      id: 'section_e_md_summary',
      title: 'Section E — MD Referral Trigger Summary',
      description: 'Complete this section after reviewing Sections A–D. Summarise all flags, escalations, and stop conditions identified.',
      fields: [

        { id: 'e_trigger_unknown_filler',  type: 'yesNo', label: 'Prior unknown / permanent filler (Trigger A4b)', validation: { required: true } },
        { id: 'e_trigger_ha_allergy',      type: 'yesNo', label: 'HA / filler allergy — absolute contraindication (Trigger B3)', validation: { required: true } },
        { id: 'e_trigger_autoimmune',      type: 'yesNo', label: 'Autoimmune CTD — active — absolute contraindication (Trigger B5)', validation: { required: true } },
        { id: 'e_trigger_granuloma',       type: 'yesNo', label: 'Prior granuloma / inflammatory nodule (Trigger B7)', validation: { required: true } },
        { id: 'e_trigger_infection',       type: 'yesNo', label: 'Active infection at treatment site (Trigger B1)', validation: { required: true } },
        { id: 'e_trigger_hsv',             type: 'yesNo', label: 'HSV history — perioral zone — antiviral prophylaxis required (Trigger B2)', validation: { required: true } },
        { id: 'e_trigger_nsr_rhinoplasty', type: 'yesNo', label: 'Prior rhinoplasty with NSR proposed — MD individual assessment required (Trigger A5)', validation: { required: true } },
        { id: 'e_trigger_nsr_competency',  type: 'yesNo', label: 'NSR proposed — competency not on file (Trigger A5)', validation: { required: true } },
        { id: 'e_trigger_tt_fat',          type: 'yesNo', label: 'Tear trough — significant orbital fat herniation — MD assessment (Trigger A6)', validation: { required: true } },
        { id: 'e_trigger_anticoagulant',   type: 'yesNo', label: 'Anticoagulant / coagulopathy (Trigger B8)', validation: { required: true } },
        { id: 'e_trigger_dental',          type: 'yesNo', label: 'Recent dental (<2 weeks) — perioral treatment deferred (Trigger B9)', validation: { required: true } },
        { id: 'e_trigger_bdd',             type: 'yesNo', label: 'BDD suspected or confirmed — treatment stopped (Trigger B12)', validation: { required: true } },
        { id: 'e_trigger_no_photos',       type: 'yesNo', label: 'Photographs not completed — treatment stopped (Section C)', validation: { required: true } },

        {
          id: 'e_md_prescribing_required',
          type: 'radio',
          label: 'MD prescribing consultation required',
          validation: { required: true },
          options: [
            { value: 'yes_new',    label: 'Yes — new prescription required' },
            { value: 'yes_repeat', label: 'Yes — established patient repeat (MD to confirm)' },
            { value: 'no',         label: 'No — not applicable' },
          ],
        },

        {
          id: 'e_practitioner_declaration',
          type: 'paragraph',
          label: '',
          helpText: 'By signing this form, the Practitioner confirms: all sections above are accurate and complete; all stop conditions and MD referral triggers have been identified; this record will be transmitted to the Manchester Medical Director prior to treatment; no treatment involving prescription medicines will be delivered without a valid MD prescription on file.',
        },

      ],
    },

  ],
};


// ============================================
// FORM 2: DERMAL FILLER CONSENT FORM
// ============================================

const fillersConsent: FormDefinition = {
  id: 'menh_fillers_consent',
  name: 'Dermal Filler — Informed Consent',
  description:
    'Three-party consent document for aesthetic dermal filler treatment. Covers treatment description, all three POM prescriptions, off-label disclosure, reversibility (HA vs non-HA), vascular/visual risk declarations, and sign-off by Patient, Manchester MD, and treating Practitioner. Document reference: MEN-CP-008.',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Dermal Fillers',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration:
    'I confirm I have read and understood this consent document, or it has been fully explained to me. I consent to the treatment as specified.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,

  sections: [

    {
      id: 'section_treatment_info',
      title: 'Treatment Information',
      fields: [

        {
          id: 'zones_to_be_treated',
          type: 'checkboxGroup',
          label: 'Zone(s) to be treated today (confirm all that apply)',
          validation: { required: true },
          options: [
            { value: 'lips',         label: 'Zone A — Lips' },
            { value: 'nasolabial',   label: 'Zone B — Nasolabial folds' },
            { value: 'marionette',   label: 'Zone C — Marionette lines' },
            { value: 'cheeks',       label: 'Zone D — Cheeks / midface' },
            { value: 'tear_trough',  label: 'Zone E — Tear trough' },
            { value: 'jawline',      label: 'Zone F — Jawline' },
            { value: 'chin',         label: 'Zone G — Chin' },
            { value: 'temples',      label: 'Zone H — Temples' },
            { value: 'nsr',          label: 'Zone I — Non-surgical rhinoplasty' },
            { value: 'dorsal_hands', label: 'Zone J — Dorsal hands' },
          ],
        },

        {
          id: 'treatment_explanation_read',
          type: 'yesNo',
          label: 'I confirm I have been given and understand what the treatment involves: injection of HA gel using needle or cannula to add volume or restore structure to the zones listed above.',
          validation: { required: true },
        },

        {
          id: 'pom_declaration',
          type: 'checkboxGroup',
          label: 'Prescription medicines — I confirm I understand that the following prescription-only medicines have been prescribed by the Manchester Medical Director specifically for me:',
          validation: { required: true },
          options: [
            { value: 'emla',          label: 'EMLA cream (topical anaesthetic)' },
            { value: 'lidocaine',     label: 'Injectable lidocaine (nerve block anaesthetic — if required)' },
            { value: 'hyaluronidase', label: 'Hyaluronidase (held in treatment room for emergency use)' },
          ],
        },

      ],
    },

    {
      id: 'section_off_label',
      title: 'Off-Label Use',
      fields: [
        {
          id: 'off_label_acknowledged',
          type: 'yesNo',
          label: 'I understand that most aesthetic filler zones are off-label uses of these products. Off-label prescribing by a qualified doctor is lawful in the UK when clinically justified. The Manchester Medical Director has assessed this in my case.',
          validation: { required: true },
        },
      ],
    },

    {
      id: 'section_reversibility',
      title: 'Reversibility',
      fields: [

        {
          id: 'ha_reversibility_understood',
          type: 'yesNo',
          label: 'I understand that HA filler is reversible with hyaluronidase and that complete reversal is not guaranteed — some product may remain and multiple sessions may be needed.',
          validation: { required: true },
        },

        {
          id: 'non_ha_planned',
          type: 'yesNo',
          label: 'A non-HA filler (e.g., Sculptra or Radiesse) is planned for one or more of my zones today',
          validation: { required: true },
        },

        {
          id: 'non_ha_product_name',
          type: 'text',
          label: 'Non-HA product name and zone(s)',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'non_ha_planned', operator: 'equals', value: true }],
          },
        },

        {
          id: 'non_ha_irreversibility_accepted',
          type: 'yesNo',
          label: 'I confirm I have been specifically informed and accept that non-HA filler (as named above) is NOT reversible with hyaluronidase. I consent to this product being used.',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            logicType: 'and',
            conditions: [{ field: 'non_ha_planned', operator: 'equals', value: true }],
          },
          stopConditions: [
            {
              field: 'non_ha_irreversibility_accepted',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Patient has not consented to the use of non-HA (irreversible) filler. Non-HA product cannot be used until this consent is given.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

      ],
    },

    {
      id: 'section_risks',
      title: 'Risks and Complications',
      fields: [

        {
          id: 'common_risks_acknowledged',
          type: 'yesNo',
          label: 'I accept that common expected side effects include bruising, swelling, redness, temporary firmness, and mild tenderness, resolving within 1–2 weeks.',
          validation: { required: true },
        },

        {
          id: 'vascular_skin_risk_acknowledged',
          type: 'yesNo',
          label: 'I understand the risk of vascular occlusion: filler can block a blood vessel, potentially causing skin blanching or tissue damage (necrosis). Hyaluronidase is injected immediately if this occurs. Permanent scarring is possible even with prompt management.',
          validation: { required: true },
        },

        {
          id: 'blindness_risk_acknowledged',
          type: 'yesNo',
          label: 'I understand the rare but serious risk of visual loss or blindness in zones near the nose, glabella, and periorbital areas. This is potentially permanent. Emergency protocol is in place. I accept this risk.',
          validation: { required: true },
          stopConditions: [
            {
              field: 'blindness_risk_acknowledged',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Patient has not acknowledged the risk of visual loss. Consent cannot proceed without this acknowledgement. Explain in full and re-present.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'visual_symptoms_duty_understood',
          type: 'yesNo',
          label: 'I understand that if I experience any sudden change in vision — greyness, blurring, flashing lights, or loss of vision — I must tell my Practitioner immediately if in clinic, or call 999 if I have left the clinic.',
          validation: { required: true },
          stopConditions: [
            {
              field: 'visual_symptoms_duty_understood',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Patient must understand their duty to report visual symptoms immediately. This must be confirmed before treatment.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'asymmetry_preexisting_acknowledged',
          type: 'yesNo',
          label: 'I understand that any baseline facial asymmetry has been documented and pre-dates this treatment.',
          validation: { required: true },
        },

        {
          id: 'results_not_guaranteed',
          type: 'yesNo',
          label: 'I understand that results are not guaranteed and final assessment should not be made until 4 weeks post-treatment (6 weeks for tear trough).',
          validation: { required: true },
        },

        {
          id: 'consent_photos',
          type: 'yesNo',
          label: 'I consent to clinical photographs being taken and stored securely in my patient record.',
          validation: { required: true },
        },

        {
          id: 'consent_hyaluronidase_emergency',
          type: 'yesNo',
          label: 'I consent to hyaluronidase being injected if a vascular emergency occurs during or after treatment.',
          validation: { required: true },
          stopConditions: [
            {
              field: 'consent_hyaluronidase_emergency',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Patient has not consented to emergency hyaluronidase administration. Treatment cannot proceed without this consent.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'age_confirmed',
          type: 'yesNo',
          label: 'I confirm I am over 18 years of age.',
          validation: { required: true },
          stopConditions: [
            {
              field: 'age_confirmed',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Treatment cannot be performed on patients under 18 years of age.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'right_to_withdraw',
          type: 'yesNo',
          label: 'I understand I may withdraw consent at any time before the first injection is administered.',
          validation: { required: true },
        },

      ],
    },

    {
      id: 'section_md_signoff',
      title: 'Manchester Medical Director — Prescribing & Treatment Plan Sign-off',
      description: 'Completed by the Manchester Medical Director at the prescribing consultation.',
      fields: [

        { id: 'md_name',              type: 'text',      label: 'MD full name',                  validation: { required: true } },
        { id: 'md_gmc_number',        type: 'text',      label: 'GMC number',                    validation: { required: true, pattern: '^\\d{7}$', patternMessage: 'GMC number must be exactly 7 digits' } },
        { id: 'md_zones_approved',    type: 'text',      label: 'Zones approved for treatment',  validation: { required: true } },
        { id: 'md_consultation_date', type: 'date',      label: 'Date of MD prescribing consultation', validation: { required: true } },

        {
          id: 'md_non_ha_approved',
          type: 'radio',
          label: 'Non-HA product approved',
          options: [
            { value: 'yes', label: 'Yes — product and zone documented in treatment record' },
            { value: 'na',  label: 'N/A — HA products only' },
          ],
          validation: { required: true },
        },

        {
          id: 'md_hyaluronidase_prescribed',
          type: 'yesNo',
          label: 'Hyaluronidase prescribed — emergency use protocol confirmed',
          validation: { required: true },
          stopConditions: [
            {
              field: 'md_hyaluronidase_prescribed',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Hyaluronidase must be prescribed by the MD before any filler is opened. This is a mandatory hard gate.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'md_antiviral_prescribed',
          type: 'radio',
          label: 'Antiviral prophylaxis prescribed (perioral HSV history)',
          options: [
            { value: 'yes', label: 'Yes — aciclovir/valaciclovir prescribed; commenced 48 hours pre-treatment' },
            { value: 'na',  label: 'N/A — no HSV history / no perioral treatment' },
          ],
          validation: { required: true },
        },

        { id: 'md_signature', type: 'signature', label: 'MD signature', validation: { required: true } },

      ],
    },

    {
      id: 'section_practitioner_verify',
      title: 'Treating Practitioner — Day-of-Treatment Verification',
      description: 'Completed by the treating Practitioner immediately before the first injection.',
      fields: [

        {
          id: 'pv_all_prescriptions_present',
          type: 'yesNo',
          label: 'All three MD prescriptions (EMLA, injectable lidocaine, hyaluronidase) present and valid',
          validation: { required: true },
          stopConditions: [
            {
              field: 'pv_all_prescriptions_present',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — All three prescriptions must be present and valid before any product is opened. Contact Manchester MD.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'pv_hyaluronidase_in_room',
          type: 'yesNo',
          label: 'Hyaluronidase physically in the treatment room — vials confirmed before first syringe is opened',
          validation: { required: true },
          stopConditions: [
            {
              field: 'pv_hyaluronidase_in_room',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — HARD GATE: Hyaluronidase must be physically present in the treatment room before any syringe of filler is opened. Retrieve hyaluronidase before proceeding.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        { id: 'pv_hyaluronidase_batch',    type: 'text',      label: 'Hyaluronidase batch number in room', validation: { required: true } },
        { id: 'pv_hyaluronidase_expiry',   type: 'date',      label: 'Hyaluronidase expiry date',          validation: { required: true } },

        {
          id: 'pv_products_match_plan',
          type: 'yesNo',
          label: 'All filler products match the MD treatment plan — batch numbers match prescription',
          validation: { required: true },
          stopConditions: [
            {
              field: 'pv_products_match_plan',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Products do not match the MD prescription. Do not open or use any non-matching product. Contact Manchester MD.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'pv_no_new_contraindications',
          type: 'yesNo',
          label: 'No new contraindications identified since the consultation form was completed',
          validation: { required: true },
          stopConditions: [
            {
              field: 'pv_no_new_contraindications',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — New contraindication identified. Do not proceed. Document the new finding, contact Manchester MD, and re-assess.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        { id: 'pv_baseline_photos_taken',     type: 'yesNo', label: 'Pre-treatment photographs taken today (baseline for this session)', validation: { required: true } },
        { id: 'pv_vascular_protocol_visible', type: 'yesNo', label: 'Vascular occlusion emergency protocol card visible in the treatment room', validation: { required: true } },

        {
          id: 'pv_nsr_competency_confirmed',
          type: 'radio',
          label: 'NSR competency on file (if NSR is being performed)',
          options: [
            { value: 'confirmed', label: 'Confirmed — on file' },
            { value: 'na',        label: 'N/A — NSR not being performed today' },
          ],
        },

        { id: 'pv_practitioner_name',         type: 'text',      label: 'Practitioner full name',         validation: { required: true } },
        { id: 'pv_practitioner_registration', type: 'text',      label: 'Practitioner registration number', validation: { required: true } },
        { id: 'pv_signature',                 type: 'signature', label: 'Practitioner signature',         validation: { required: true } },

      ],
    },

  ],
};


// ============================================
// FORM 3: DERMAL FILLER PROCEDURE RECORD
// ============================================

const fillersProcedure: FormDefinition = {
  id: 'menh_fillers_procedure',
  name: 'Dermal Filler — Procedure Record',
  description:
    'Procedural documentation for aesthetic dermal filler treatment. Records all products used (name, batch, expiry, volume), zone-by-zone technique notes, post-injection observation, 30-minute visual checks, and adverse event flag. Document reference: MEN-CP-008.',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'Dermal Fillers',
  requiresSignature: true,
  signatureLabel: 'Practitioner',
  signatureDeclaration:
    'I confirm this procedure record is accurate and complete. All products and volumes are as documented. Post-injection observation was completed and the patient was discharged in satisfactory condition.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,

  sections: [

    {
      id: 'section_pre_gates',
      title: 'Pre-Procedure Mandatory Checks',
      description: 'Complete all checks before opening any product.',
      fields: [

        {
          id: 'gate_prescription_confirmed',
          type: 'yesNo',
          label: 'MD prescription confirmed and on file before any syringe is opened',
          validation: { required: true },
          stopConditions: [
            {
              field: 'gate_prescription_confirmed',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — HARD GATE: No prescription, no treatment. MD prescription must be on file before opening any product.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'gate_hyaluronidase_on_tray',
          type: 'yesNo',
          label: 'Hyaluronidase confirmed physically present on the treatment tray before first syringe opened',
          validation: { required: true },
          stopConditions: [
            {
              field: 'gate_hyaluronidase_on_tray',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — HARD GATE: Hyaluronidase must be physically on the tray before the first syringe is opened. No exceptions. Absolute requirement per MEN-CP-008.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        { id: 'gate_emla_applied_time', type: 'time',  label: 'EMLA applied at (time)', helpText: 'EMLA requires minimum 30–60 minutes contact time for anaesthetic effect.', validation: { required: true } },
        { id: 'gate_site_cleansed',     type: 'yesNo', label: 'Treatment site(s) cleansed with antiseptic and EMLA removed prior to injection', validation: { required: true } },

      ],
    },

    {
      id: 'section_zone_products',
      title: 'Products Used — Record All Opened Syringes',
      description: 'Record every product opened. Do not leave batch numbers blank.',
      fields: [

        // Zone A — Lips
        { id: 'zone_a_treated',     type: 'yesNo', label: 'Zone A — Lips treated today' },
        { id: 'zone_a_product',     type: 'text',        label: 'Zone A — Product name',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_a_treated', operator: 'equals', value: true }] } },
        { id: 'zone_a_batch',       type: 'batchNumber', label: 'Zone A — Batch number',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_a_treated', operator: 'equals', value: true }] } },
        { id: 'zone_a_expiry',      type: 'date',        label: 'Zone A — Expiry date',     conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_a_treated', operator: 'equals', value: true }] } },
        { id: 'zone_a_volume_ml',   type: 'number',      label: 'Zone A — Total volume (mL)', helpText: 'Male lips: 0.5–1.0 mL total. Do NOT over-evert the upper lip.', validation: { min: 0, max: 2 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_a_treated', operator: 'equals', value: true }] } },

        // Zone B — Nasolabial Folds
        { id: 'zone_b_treated',     type: 'yesNo', label: 'Zone B — Nasolabial folds treated today' },
        { id: 'zone_b_product',     type: 'text',        label: 'Zone B — Product name',   helpText: 'Cannula strongly preferred. Do not inject at the alar crease junction.', conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_b_treated', operator: 'equals', value: true }] } },
        { id: 'zone_b_batch',       type: 'batchNumber', label: 'Zone B — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_b_treated', operator: 'equals', value: true }] } },
        { id: 'zone_b_expiry',      type: 'date',        label: 'Zone B — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_b_treated', operator: 'equals', value: true }] } },
        { id: 'zone_b_volume_ml',   type: 'number',      label: 'Zone B — Volume per side (mL)', validation: { min: 0, max: 3 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_b_treated', operator: 'equals', value: true }] } },

        // Zone C — Marionette
        { id: 'zone_c_treated',     type: 'yesNo', label: 'Zone C — Marionette lines treated today' },
        { id: 'zone_c_product',     type: 'text',        label: 'Zone C — Product name',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_c_treated', operator: 'equals', value: true }] } },
        { id: 'zone_c_batch',       type: 'batchNumber', label: 'Zone C — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_c_treated', operator: 'equals', value: true }] } },
        { id: 'zone_c_expiry',      type: 'date',        label: 'Zone C — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_c_treated', operator: 'equals', value: true }] } },
        { id: 'zone_c_volume_ml',   type: 'number',      label: 'Zone C — Volume per side (mL)', validation: { min: 0, max: 2 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_c_treated', operator: 'equals', value: true }] } },

        // Zone D — Cheeks
        { id: 'zone_d_treated',     type: 'yesNo', label: 'Zone D — Cheeks / midface treated today' },

        {
          id: 'zone_d_non_ha',
          type: 'yesNo',
          label: 'Zone D — Non-HA product (Radiesse, Sculptra) used',
          conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_d_treated', operator: 'equals', value: true }] },
          stopConditions: [
            {
              field: 'zone_d_non_ha',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'Non-HA product confirmed for Zone D. Verify non-HA irreversibility consent is signed and MD non-HA approval is documented.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'zone_d_lateral_confirmed',
          type: 'yesNo',
          label: 'Zone D — Lateral cheek placement confirmed (NOT apple cheek / medial malar)',
          helpText: 'Male aesthetic: lateral and posterosuperior projection. Medial apple cheek placement feminises the face.',
          validation: { required: true },
          conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_d_treated', operator: 'equals', value: true }] },
        },

        { id: 'zone_d_product',   type: 'text',        label: 'Zone D — Product name',   helpText: 'If Radiesse: confirm non-HA consent obtained.',                 conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_d_treated', operator: 'equals', value: true }] } },
        { id: 'zone_d_batch',     type: 'batchNumber', label: 'Zone D — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_d_treated', operator: 'equals', value: true }] } },
        { id: 'zone_d_expiry',    type: 'date',        label: 'Zone D — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_d_treated', operator: 'equals', value: true }] } },
        { id: 'zone_d_volume_ml', type: 'number',      label: 'Zone D — Volume per side (mL)', helpText: 'Typically 1.0–2.0 mL per side.', validation: { min: 0, max: 4 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_d_treated', operator: 'equals', value: true }] } },

        // Zone E — Tear Trough (cannula only)
        { id: 'zone_e_treated', type: 'yesNo', label: 'Zone E — Tear trough treated today' },

        {
          id: 'zone_e_cannula_confirmed',
          type: 'yesNo',
          label: 'Zone E — CANNULA ONLY confirmed — sharp needle NOT used in tear trough',
          validation: { required: true },
          conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_e_treated', operator: 'equals', value: true }] },
          stopConditions: [
            {
              field: 'zone_e_cannula_confirmed',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Tear trough must be treated with cannula only. Sharp needle is NOT permitted in the tear trough.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        { id: 'zone_e_product',   type: 'text',        label: 'Zone E — Product name',   helpText: 'Low-medium G\' HA only. High G\' HA will create Tyndall effect.',  conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_e_treated', operator: 'equals', value: true }] } },
        { id: 'zone_e_batch',     type: 'batchNumber', label: 'Zone E — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_e_treated', operator: 'equals', value: true }] } },
        { id: 'zone_e_expiry',    type: 'date',        label: 'Zone E — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_e_treated', operator: 'equals', value: true }] } },
        { id: 'zone_e_volume_ml', type: 'number',      label: 'Zone E — Volume per side (mL)', helpText: 'Maximum 0.7 mL per side. Under-correction is preferable.', validation: { min: 0, max: 0.7 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_e_treated', operator: 'equals', value: true }] } },

        // Zone F — Jawline
        { id: 'zone_f_treated', type: 'yesNo', label: 'Zone F — Jawline treated today' },
        { id: 'zone_f_facial_artery_avoided', type: 'yesNo', label: 'Zone F — Facial artery crossing point at anterior edge of masseter avoided', validation: { required: true }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_f_treated', operator: 'equals', value: true }] } },
        { id: 'zone_f_product',   type: 'text',        label: 'Zone F — Product name',   helpText: 'High G\' HA (Volux, Defyne/Lyft) or Radiesse. Deep periosteal placement.', conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_f_treated', operator: 'equals', value: true }] } },
        { id: 'zone_f_batch',     type: 'batchNumber', label: 'Zone F — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_f_treated', operator: 'equals', value: true }] } },
        { id: 'zone_f_expiry',    type: 'date',        label: 'Zone F — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_f_treated', operator: 'equals', value: true }] } },
        { id: 'zone_f_volume_ml', type: 'number',      label: 'Zone F — Volume per side (mL)', validation: { min: 0, max: 4 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_f_treated', operator: 'equals', value: true }] } },

        // Zone G — Chin
        { id: 'zone_g_treated', type: 'yesNo', label: 'Zone G — Chin treated today' },
        { id: 'zone_g_periosteal_confirmed', type: 'yesNo', label: 'Zone G — Central periosteal injection confirmed (avoid lateral perimental injection unless MD-directed)', validation: { required: true }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_g_treated', operator: 'equals', value: true }] } },
        { id: 'zone_g_product',   type: 'text',        label: 'Zone G — Product name',   helpText: 'High G\' HA (Volux) or Radiesse. Central bolus at periosteal level.', conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_g_treated', operator: 'equals', value: true }] } },
        { id: 'zone_g_batch',     type: 'batchNumber', label: 'Zone G — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_g_treated', operator: 'equals', value: true }] } },
        { id: 'zone_g_expiry',    type: 'date',        label: 'Zone G — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_g_treated', operator: 'equals', value: true }] } },
        { id: 'zone_g_volume_ml', type: 'number',      label: 'Zone G — Total volume (mL)', validation: { min: 0, max: 3 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_g_treated', operator: 'equals', value: true }] } },

        // Zone H — Temples
        { id: 'zone_h_treated', type: 'yesNo', label: 'Zone H — Temples treated today' },
        { id: 'zone_h_sta_palpated', type: 'yesNo', label: 'Zone H — Superficial temporal artery palpated or mapped before injection', validation: { required: true }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_h_treated', operator: 'equals', value: true }] } },
        { id: 'zone_h_product',   type: 'text',        label: 'Zone H — Product name',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_h_treated', operator: 'equals', value: true }] } },
        { id: 'zone_h_batch',     type: 'batchNumber', label: 'Zone H — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_h_treated', operator: 'equals', value: true }] } },
        { id: 'zone_h_expiry',    type: 'date',        label: 'Zone H — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_h_treated', operator: 'equals', value: true }] } },
        { id: 'zone_h_volume_ml', type: 'number',      label: 'Zone H — Volume per side (mL)', validation: { min: 0, max: 3 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_h_treated', operator: 'equals', value: true }] } },

        // Zone I — NSR (highest risk)
        { id: 'zone_i_treated', type: 'yesNo', label: 'Zone I — Non-surgical rhinoplasty performed today' },

        {
          id: 'zone_i_hyaluronidase_drawn',
          type: 'yesNo',
          label: 'Zone I — NSR: Hyaluronidase drawn up and ready on tray BEFORE touching the nose',
          validation: { required: true },
          conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_i_treated', operator: 'equals', value: true }] },
          stopConditions: [
            {
              field: 'zone_i_hyaluronidase_drawn',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — HARD GATE: For NSR, hyaluronidase must be drawn up and ready on the tray before the nose is touched. Non-negotiable.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'zone_i_visual_warning_given',
          type: 'yesNo',
          label: 'Zone I — Patient instructed to immediately report any visual change before every injection point',
          validation: { required: true },
          conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_i_treated', operator: 'equals', value: true }] },
          stopConditions: [
            {
              field: 'zone_i_visual_warning_given',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Visual symptom warning must be given to the patient before each injection point in the NSR zone. This is mandatory.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        { id: 'zone_i_counter_pressure', type: 'yesNo', label: 'Zone I — Counter-pressure at supratrochlear region applied during nasal injection', helpText: 'Reduces retrograde arterial pressure gradient.', validation: { required: true }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_i_treated', operator: 'equals', value: true }] } },
        { id: 'zone_i_product',   type: 'text',        label: 'Zone I — Product name',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_i_treated', operator: 'equals', value: true }] } },
        { id: 'zone_i_batch',     type: 'batchNumber', label: 'Zone I — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_i_treated', operator: 'equals', value: true }] } },
        { id: 'zone_i_expiry',    type: 'date',        label: 'Zone I — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_i_treated', operator: 'equals', value: true }] } },
        { id: 'zone_i_volume_ml', type: 'number',      label: 'Zone I — Total volume (mL)', helpText: 'Max 0.1 mL per bolus. Move needle between each bolus — never accumulate at one point.', validation: { min: 0, max: 1.5 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_i_treated', operator: 'equals', value: true }] } },

        // Zone J — Dorsal Hands
        { id: 'zone_j_treated', type: 'yesNo', label: 'Zone J — Dorsal hands treated today' },

        {
          id: 'zone_j_cannula_confirmed',
          type: 'yesNo',
          label: 'Zone J — Cannula ONLY confirmed for dorsal hands',
          validation: { required: true },
          conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_j_treated', operator: 'equals', value: true }] },
          stopConditions: [
            {
              field: 'zone_j_cannula_confirmed',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Dorsal hands must be treated with cannula only. Sharp needle must not be used in this zone.',
              riskLevel: 'HIGH',
            },
          ],
        },

        { id: 'zone_j_product',   type: 'text',        label: 'Zone J — Product name',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_j_treated', operator: 'equals', value: true }] } },
        { id: 'zone_j_batch',     type: 'batchNumber', label: 'Zone J — Batch number',   conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_j_treated', operator: 'equals', value: true }] } },
        { id: 'zone_j_expiry',    type: 'date',        label: 'Zone J — Expiry date',    conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_j_treated', operator: 'equals', value: true }] } },
        { id: 'zone_j_volume_ml', type: 'number',      label: 'Zone J — Volume per hand (mL)', helpText: '0.5–1.0 mL per pass. Fan above extensor tendons — do NOT inject into tendon sheaths.', validation: { min: 0, max: 3 }, conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'zone_j_treated', operator: 'equals', value: true }] } },

      ],
    },

    {
      id: 'section_post_injection',
      title: 'Post-Injection Mandatory Checks',
      description: '30-minute minimum observation is mandatory for all dermal filler treatments.',
      fields: [

        {
          id: 'post_skin_inspection',
          type: 'radio',
          label: 'Immediate post-injection skin inspection — all treatment zones assessed',
          validation: { required: true },
          options: [
            { value: 'normal',    label: 'Normal — no blanching, no mottling, symmetry consistent with baseline' },
            { value: 'blanching', label: 'Blanching or mottling identified — VASCULAR OCCLUSION PROTOCOL ACTIVATED' },
          ],
          stopConditions: [
            {
              field: 'post_skin_inspection',
              operator: 'equals',
              value: 'blanching',
              action: 'stop',
              message: 'STOP — VASCULAR OCCLUSION. Activate the Vascular Occlusion Emergency Protocol (Section 1.9, MEN-CP-008) IMMEDIATELY. Reconstitute hyaluronidase now. Call MD emergency line. Do not discharge patient.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        { id: 'post_cold_pack',              type: 'yesNo', label: 'Cold pack (cloth-wrapped) applied to treated area(s)', validation: { required: true } },
        { id: 'post_no_massage_instructed',  type: 'yesNo', label: 'Patient instructed: no massaging, pressing, or rubbing for 24 hours', validation: { required: true } },
        { id: 'post_observation_start_time', type: 'time',  label: '30-minute observation start time', validation: { required: true } },

        {
          id: 'post_vision_check_15min',
          type: 'radio',
          label: 'Vision check at 15 minutes — patient asked: "Any change in your vision? Any greyness or blurring?"',
          validation: { required: true },
          options: [
            { value: 'normal',   label: 'Normal — no visual symptoms reported' },
            { value: 'symptoms', label: 'Visual symptoms reported — EMERGENCY PROTOCOL ACTIVATED' },
          ],
          stopConditions: [
            {
              field: 'post_vision_check_15min',
              operator: 'equals',
              value: 'symptoms',
              action: 'stop',
              message: 'STOP — OPHTHALMIC EMERGENCY. Visual symptoms at 15 minutes. Activate Visual Loss Protocol (Section 1.9, MEN-CP-008) IMMEDIATELY. Call 999. Call MD emergency line simultaneously.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'post_vision_check_30min',
          type: 'radio',
          label: 'Vision check at 30 minutes — patient asked: "Any change in your vision? Any greyness or blurring?"',
          validation: { required: true },
          options: [
            { value: 'normal',   label: 'Normal — no visual symptoms reported' },
            { value: 'symptoms', label: 'Visual symptoms reported — EMERGENCY PROTOCOL ACTIVATED' },
          ],
          stopConditions: [
            {
              field: 'post_vision_check_30min',
              operator: 'equals',
              value: 'symptoms',
              action: 'stop',
              message: 'STOP — OPHTHALMIC EMERGENCY. Visual symptoms at 30 minutes. Activate Visual Loss Protocol (Section 1.9, MEN-CP-008) IMMEDIATELY. Call 999. Call MD emergency line simultaneously.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'post_observation_clear',
          type: 'yesNo',
          label: '30-minute observation completed — patient discharged in satisfactory condition (no vascular compromise, allergy, or visual change)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'post_observation_clear',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Do not discharge patient until 30-minute observation is complete and satisfactory. If there is any concern, contact Manchester MD before discharge.',
              riskLevel: 'HIGH',
            },
          ],
        },

        { id: 'post_digital_record_complete', type: 'yesNo', label: 'Digital record completed — all products, batches, volumes, entry points, and adverse events documented', validation: { required: true } },
        { id: 'post_two_week_check_booked',   type: 'yesNo', label: '2-week check appointment booked', validation: { required: true } },
        { id: 'post_two_week_check_date',     type: 'date',  label: '2-week check date', conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'post_two_week_check_booked', operator: 'equals', value: true }] } },
        { id: 'post_four_week_review_booked', type: 'yesNo', label: '4-week review booked (6-week for tear trough)', validation: { required: true } },
        { id: 'post_four_week_review_date',   type: 'date',  label: '4-week review date', conditionalLogic: { action: 'show', logicType: 'and', conditions: [{ field: 'post_four_week_review_booked', operator: 'equals', value: true }] } },
        { id: 'post_48hr_followup_triggered', type: 'yesNo', label: 'Automated 48-hour follow-up contact triggered in CRM', validation: { required: true } },
        { id: 'post_aftercare_issued',        type: 'yesNo', label: 'Aftercare protocol (MEN-CP-008 Part 4) issued to patient', validation: { required: true } },
        { id: 'post_visual_emergency_recap',  type: 'yesNo', label: 'Visual and vascular emergency red flags verbally reviewed with patient before discharge', validation: { required: true } },

        {
          id: 'post_adverse_event_flag',
          type: 'radio',
          label: 'Adverse event during or after treatment',
          validation: { required: true },
          options: [
            { value: 'none',    label: 'None — routine treatment, no complications' },
            { value: 'grade_1', label: 'Grade 1 — expected (bruising, mild swelling) — documented below' },
            { value: 'grade_2', label: 'Grade 2 — moderate (haematoma, asymmetry, suspected infection) — MD notified' },
            { value: 'grade_3', label: 'Grade 3 — severe (vascular occlusion, visual change, anaphylaxis) — 999 called + full escalation activated' },
          ],
          stopConditions: [
            {
              field: 'post_adverse_event_flag',
              operator: 'equals',
              value: 'grade_2',
              action: 'escalate',
              message: 'Grade 2 adverse event: Contact Manchester MD directly. Complete Adverse Event Report in the app. Record all actions taken and MD guidance received.',
              riskLevel: 'HIGH',
            },
            {
              field: 'post_adverse_event_flag',
              operator: 'equals',
              value: 'grade_3',
              action: 'stop',
              message: 'Grade 3 adverse event: 999 must already be called. Full escalation protocol active. Log in app — webhook triggers WhatsApp HQ Emergency Group and HubSpot MEDICAL EMERGENCY flag. MD notified via emergency line simultaneously.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'post_adverse_event_notes',
          type: 'textarea',
          label: 'Adverse event notes — describe event, actions taken, and outcome',
          conditionalLogic: {
            action: 'show',
            logicType: 'or',
            conditions: [
              { field: 'post_adverse_event_flag', operator: 'equals', value: 'grade_1' },
              { field: 'post_adverse_event_flag', operator: 'equals', value: 'grade_2' },
              { field: 'post_adverse_event_flag', operator: 'equals', value: 'grade_3' },
            ],
          },
        },

      ],
    },

  ],
};


// ============================================
// EXPORT
// ============================================

export const dermalFillerForms = [fillersConsultation, fillersConsent, fillersProcedure];

import { FormDefinition } from '../types';

// ============================================
// MENHANCEMENTS — BOTULINUM TOXIN TYPE A
// Clinical Pathway: MEN-CP-007 | Version 1.0
// ============================================
// Three forms covering the full BoNT-A pathway:
//   1. menh_botox_consultation  — Sections A–E: zone assessment, contraindication
//                                 screen, photography checklist, male brow
//                                 assessment, MD referral trigger summary
//   2. menh_botox_consent       — Specific consent with off-label disclosures,
//                                 zone-specific risk declarations, three-party
//                                 sign-off (Patient / MD / Practitioner)
//   3. menh_botox_procedure     — Day-of-treatment: prescription verification,
//                                 product & reconstitution, zone-by-zone IU
//                                 recording, post-injection checklist
// ============================================

// ============================================
// FORM 1: BOTOX CONSULTATION FORM
// (Practitioner-completed pre-treatment assessment)
// ============================================

const botoxConsultation: FormDefinition = {
  id: 'menh_botox_consultation',
  name: 'Botulinum Toxin — Consultation & Contraindication Screen',
  description:
    'Practitioner-completed assessment for BoNT-A treatment. Covers zone selection, full contraindication screen, baseline photography checklist, male brow assessment, and MD referral trigger summary. Document reference: MEN-CP-007.',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'BoNT-A (Botox)',
  requiresSignature: true,
  signatureLabel: 'Practitioner',
  signatureDeclaration:
    'I confirm this consultation assessment is accurate and complete. I have completed the MD Referral Trigger Summary and will transmit to the Manchester Medical Director before any treatment is delivered.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,

  sections: [

    // ─── SECTION A — Presenting Concern & Zone Assessment ─────────────────────

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
            { value: 'forehead',    label: 'Forehead lines' },
            { value: 'glabellar',   label: 'Glabellar frown lines' },
            { value: 'crows_feet',  label: 'Crow\'s feet (lateral canthal lines)' },
            { value: 'brow_lift',   label: 'Brow lift' },
            { value: 'bunny_lines', label: 'Bunny lines (nasalis)' },
            { value: 'lip_flip',    label: 'Lip flip (orbicularis oris)' },
            { value: 'chin',        label: 'Chin dimpling (mentalis)' },
            { value: 'platysma',    label: 'Platysmal bands (neck)' },
            { value: 'masseter',    label: 'Masseter (jaw slimming)' },
            { value: 'hyperhidrosis', label: 'Axillary hyperhidrosis' },
          ],
        },

        {
          id: 'patient_goal_verbatim',
          type: 'textarea',
          label: 'A2 — Primary aesthetic goal (document in patient\'s own words)',
          helpText: 'Use the patient\'s own language. Do not paraphrase.',
          validation: { required: true },
        },

        {
          id: 'baseline_asymmetry',
          type: 'yesNo',
          label: 'A3 — Baseline facial asymmetry present at rest?',
          validation: { required: true },
        },
        {
          id: 'baseline_asymmetry_description',
          type: 'textarea',
          label: 'Describe asymmetry and confirm discussed with patient',
          helpText: 'Document precise nature of asymmetry. Patient must be informed before treatment.',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'baseline_asymmetry', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'brow_position',
          type: 'radio',
          label: 'A3 — Male brow position at rest',
          options: [
            { value: 'horizontal_normal', label: 'Horizontal / at orbital rim (normal male)' },
            { value: 'elevated',          label: 'Elevated above orbital rim' },
            { value: 'ptotic',            label: 'Ptotic / below orbital rim' },
          ],
          validation: { required: true },
          helpText: 'Normal male brow sits AT or below the supraorbital rim — flat and horizontal.',
        },

        {
          id: 'animation_forehead',
          type: 'radio',
          label: 'A4 — Forehead lines on animation',
          options: [
            { value: 'none',     label: 'None' },
            { value: 'mild',     label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe',   label: 'Severe' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'forehead' }],
            logicType: 'and',
          },
        },
        {
          id: 'animation_glabellar',
          type: 'radio',
          label: 'A4 — Glabellar frown lines on animation',
          options: [
            { value: 'none',     label: 'None' },
            { value: 'mild',     label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe',   label: 'Severe' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'glabellar' }],
            logicType: 'and',
          },
        },
        {
          id: 'animation_crows_feet',
          type: 'radio',
          label: 'A4 — Crow\'s feet on animation',
          options: [
            { value: 'none',     label: 'None' },
            { value: 'mild',     label: 'Mild' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'severe',   label: 'Severe' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'crows_feet' }],
            logicType: 'and',
          },
        },
        {
          id: 'masseter_assessment',
          type: 'radio',
          label: 'A5 — Masseter hypertrophy on clenching',
          options: [
            { value: 'mild',        label: 'Mild' },
            { value: 'moderate',    label: 'Moderate' },
            { value: 'significant', label: 'Significant' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'masseter' }],
            logicType: 'and',
          },
        },
        {
          id: 'masseter_asymmetric',
          type: 'yesNo',
          label: 'A5 — Masseter asymmetric?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'masseter' }],
            logicType: 'and',
          },
        },

        {
          id: 'hyperhidrosis_starch_iodine',
          type: 'yesNo',
          label: 'A6 — Starch-iodine test (Minor\'s Test) performed?',
          helpText: 'Mandatory before hyperhidrosis treatment. Maps active sweat zones for injection grid.',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'hyperhidrosis' }],
            logicType: 'and',
          },
          stopConditions: [
            {
              field: 'hyperhidrosis_starch_iodine',
              operator: 'equals',
              value: false,
              action: 'warn',
              message: 'Starch-iodine test not yet performed. Must be completed before hyperhidrosis treatment.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'hyperhidrosis_qol',
          type: 'number',
          label: 'A6 — Patient-reported impact on quality of life (1 = minimal, 10 = severe)',
          validation: { required: true, min: 1, max: 10 },
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'hyperhidrosis' }],
            logicType: 'and',
          },
        },

        {
          id: 'prior_bont_treatment',
          type: 'yesNo',
          label: 'A7 — Previous BoNT-A treatment history?',
          validation: { required: true },
        },
        {
          id: 'prior_bont_date',
          type: 'date',
          label: 'Most recent treatment date',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'prior_bont_treatment', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'prior_bont_product',
          type: 'select',
          label: 'Product used',
          width: 'half',
          options: [
            { value: 'botox',      label: 'Botox (OnabotulinumtoxinA)' },
            { value: 'azzalure',   label: 'Azzalure (AbobotulinumtoxinA)' },
            { value: 'bocouture',  label: 'Bocouture (IncobotulinumtoxinA)' },
            { value: 'dysport',    label: 'Dysport (AbobotulinumtoxinA)' },
            { value: 'xeomin',     label: 'Xeomin (IncobotulinumtoxinA)' },
            { value: 'unknown',    label: 'Unknown' },
          ],
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'prior_bont_treatment', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'prior_bont_zones',
          type: 'text',
          label: 'Zones previously treated',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'prior_bont_treatment', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'prior_bont_outcome',
          type: 'textarea',
          label: 'Outcome and any adverse reactions',
          helpText: 'Include any ptosis, dysphagia, asymmetry, or unexpected spread.',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'prior_bont_treatment', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'prior_bont_adverse_flag',
          type: 'yesNo',
          label: 'Did the patient experience an adverse reaction to prior BoNT-A?',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'prior_bont_treatment', operator: 'equals', value: true }],
            logicType: 'and',
          },
          stopConditions: [
            {
              field: 'prior_bont_adverse_flag',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'URGENT: Prior BoNT-A adverse reaction reported. Flag to MD immediately — may affect product selection or suitability.',
              riskLevel: 'HIGH',
            },
          ],
        },
      ],
    },

    // ─── SECTION B — Contraindication Screen ──────────────────────────────────

    {
      id: 'section_b_contraindications',
      title: 'Section B — Contraindication Screen',
      description: 'Complete for ALL patients at every session. Hard stops require immediate cessation of the pathway.',
      fields: [

        {
          id: 'b1_heading',
          type: 'heading',
          label: 'Absolute Contraindications — Treatment MUST NOT proceed if any of these are positive',
          headingLevel: 4,
          content: '',
        },

        {
          id: 'b1_neuromuscular',
          type: 'yesNo',
          label: 'B1 — Does the patient have a neuromuscular junction disorder? (Myasthenia gravis, Lambert-Eaton myasthenic syndrome, motor neurone disease, or any other neuromuscular disorder)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b1_neuromuscular',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'HARD STOP — Absolute contraindication. Neuromuscular junction disorder. BoNT-A MUST NOT be administered under any circumstances. Treatment pathway closed.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'b2_aminoglycosides',
          type: 'yesNo',
          label: 'B2 — Is the patient currently taking aminoglycoside antibiotics? (Gentamicin, tobramycin, amikacin, neomycin)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b2_aminoglycosides',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'HARD STOP — Absolute contraindication. Current aminoglycoside use potentiates BoNT-A neuromuscular effect unpredictably. Defer minimum 2 weeks post-completion of antibiotic course.',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'b2_aminoglycoside_drug',
          type: 'text',
          label: 'Specify aminoglycoside drug',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'b2_aminoglycosides', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'b3_lincosamides',
          type: 'yesNo',
          label: 'B3 — Is the patient currently taking lincosamide antibiotics? (Clindamycin, lincomycin)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b3_lincosamides',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'HARD STOP — Absolute contraindication. Current lincosamide use potentiates BoNT-A. Defer treatment.',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'b3_lincosamide_drug',
          type: 'text',
          label: 'Specify lincosamide drug',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'b3_lincosamides', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'b4_active_infection',
          type: 'yesNo',
          label: 'B4 — Is there an active infection, cold sore (HSV-1), inflammation, or open wound at any proposed treatment site?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b4_active_infection',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'STOP — Affected zone(s) must not be treated. Defer until infection/cold sore is fully resolved. Document which zones are affected.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'b4_infection_zones',
          type: 'text',
          label: 'Specify affected zone(s)',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'b4_active_infection', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'b5_bont_allergy',
          type: 'yesNo',
          label: 'B5 — Known allergy to Botulinum Toxin Type A or any product component? (Human albumin, lactose, sucrose)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b5_bont_allergy',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'HARD STOP — Absolute contraindication. Known BoNT-A allergy. Treatment must not proceed.',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'b5_allergy_details',
          type: 'text',
          label: 'Specify allergy details',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'b5_bont_allergy', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'b_relative_heading',
          type: 'heading',
          label: 'Relative Contraindications — MD Review Required',
          headingLevel: 4,
          content: '',
        },

        {
          id: 'b6_swallowing_difficulties',
          type: 'yesNo',
          label: 'B6 — Swallowing difficulties or respiratory muscle weakness (any cause)?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b6_swallowing_difficulties',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'URGENT — Flag to MD immediately. Platysmal treatment is absolutely contraindicated. All other zones require individual MD risk assessment before proceeding.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'b7_anticoagulants',
          type: 'yesNo',
          label: 'B7 — Anticoagulant or antiplatelet therapy?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b7_anticoagulants',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'FLAG to MD — Elevated bruising risk, particularly crow\'s feet and glabellar zones. MD to advise.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'b7_anticoagulant_drug',
          type: 'text',
          label: 'Specify drug and indication',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'b7_anticoagulants', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'b8_peripheral_neuropathy',
          type: 'yesNo',
          label: 'B8 — Peripheral neuropathy (any cause)?',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b8_peripheral_neuropathy',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'FLAG to MD — BoNT-A response may be exaggerated or unpredictable in peripheral neuropathy.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'b8_neuropathy_cause',
          type: 'text',
          label: 'Specify cause',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'b8_peripheral_neuropathy', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'b9_neuromuscular_meds',
          type: 'yesNo',
          label: 'B9 — Concurrent neuromuscular-affecting medications? (Magnesium at therapeutic doses, quinine, spectinomycin)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'b9_neuromuscular_meds',
              operator: 'equals',
              value: true,
              action: 'flag',
              message: 'FLAG to MD — Drug interaction review required before proceeding.',
              riskLevel: 'MEDIUM',
            },
          ],
        },
        {
          id: 'b9_neuromuscular_drug',
          type: 'text',
          label: 'Specify drug',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'b9_neuromuscular_meds', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },

        {
          id: 'b10_wind_instrument',
          type: 'yesNo',
          label: 'B10 — Does the patient play a wind instrument, is a professional singer, or require precise lip function for their profession? (Relevant only if lip flip is proposed)',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'lip_flip' }],
            logicType: 'and',
          },
          stopConditions: [
            {
              field: 'b10_wind_instrument',
              operator: 'equals',
              value: true,
              action: 'escalate',
              message: 'FLAG — Lip flip may NOT be appropriate. MD to assess and document risk of oral incompetence to professional function before proceeding.',
              riskLevel: 'HIGH',
            },
          ],
        },

        {
          id: 'b11_platysma_dysphagia',
          type: 'yesNo',
          label: 'B11 — History of dysphagia or difficulty swallowing? (Relevant only if platysmal band treatment is proposed)',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'platysma' }],
            logicType: 'and',
          },
          stopConditions: [
            {
              field: 'b11_platysma_dysphagia',
              operator: 'equals',
              value: true,
              action: 'stop',
              message: 'HARD STOP — Absolute contraindication for platysmal band treatment. History of dysphagia. Platysmal treatment must not proceed.',
              riskLevel: 'CRITICAL',
            },
          ],
        },

        {
          id: 'b12_current_medications',
          type: 'medicationList',
          label: 'B12 — Full current medications list (including supplements)',
          helpText: 'Review all entries for aminoglycosides, lincosamides, and neuromuscular-affecting agents.',
          validation: { required: true },
        },
      ],
    },

    // ─── SECTION C — Baseline Photography Checklist ───────────────────────────

    {
      id: 'section_c_photography',
      title: 'Section C — Baseline Photography Checklist',
      description: 'No photography = No treatment. All items must be confirmed before transmitting to MD.',
      fields: [
        {
          id: 'photo_full_face_repose',
          type: 'checkbox',
          label: 'Full face, frontal, neutral repose — taken and stored in digital record',
          validation: { required: true },
          stopConditions: [
            {
              field: 'photo_full_face_repose',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Mandatory baseline photograph not completed. Treatment cannot proceed.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'photo_full_animation',
          type: 'checkbox',
          label: 'Full face, frontal, maximum expression (brow raise, frown, smile, squint) — taken and stored',
          validation: { required: true },
        },
        {
          id: 'photo_lateral_bilateral',
          type: 'checkbox',
          label: 'Lateral views (bilateral) — taken and stored',
          validation: { required: true },
        },
        {
          id: 'photo_zone_closeups',
          type: 'checkbox',
          label: 'Close-up of each proposed treatment zone at rest and on animation — taken and stored',
          validation: { required: true },
        },
        {
          id: 'photo_masseter_oblique',
          type: 'checkbox',
          label: 'Masseter — oblique bilateral on clenching — taken and stored',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'masseter' }],
            logicType: 'and',
          },
        },
        {
          id: 'photo_axillary_map',
          type: 'checkbox',
          label: 'Axillary starch-iodine positive zone map — photographed and stored',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'hyperhidrosis' }],
            logicType: 'and',
          },
        },
      ],
    },

    // ─── SECTION D — Male Brow Assessment ─────────────────────────────────────

    {
      id: 'section_d_brow',
      title: 'Section D — Male Brow Assessment',
      description: 'Complete for ALL patients receiving facial BoNT-A treatment.',
      conditionalLogic: {
        action: 'show',
        conditions: [
          { field: 'zones_requested', operator: 'includes', value: 'forehead' },
          { field: 'zones_requested', operator: 'includes', value: 'glabellar' },
          { field: 'zones_requested', operator: 'includes', value: 'crows_feet' },
          { field: 'zones_requested', operator: 'includes', value: 'brow_lift' },
          { field: 'zones_requested', operator: 'includes', value: 'bunny_lines' },
          { field: 'zones_requested', operator: 'includes', value: 'lip_flip' },
          { field: 'zones_requested', operator: 'includes', value: 'chin' },
          { field: 'zones_requested', operator: 'includes', value: 'platysma' },
          { field: 'zones_requested', operator: 'includes', value: 'masseter' },
        ],
        logicType: 'or',
      },
      fields: [
        {
          id: 'd1_brow_position_confirmed',
          type: 'checkbox',
          label: 'D1 — Brow position documented: at or below supraorbital rim (normal male brow)',
          validation: { required: true },
        },
        {
          id: 'd1_brow_atypical',
          type: 'textarea',
          label: 'If atypical — describe',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'd1_brow_position_confirmed', operator: 'equals', value: false }],
            logicType: 'and',
          },
        },
        {
          id: 'd2_patient_goal_confirmed',
          type: 'checkbox',
          label: 'D2 — Patient has verbally confirmed: goal is to maintain horizontal, masculine brow — NOT to arch or elevate the medial brow',
          validation: { required: true },
        },
        {
          id: 'd3_forehead_safe_distance',
          type: 'checkbox',
          label: 'D3 — Forehead treatment plan does not include injection within 3 cm of the brow (male safe minimum)',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'forehead' }],
            logicType: 'and',
          },
        },
        {
          id: 'd4_forehead_with_glabellar',
          type: 'checkbox',
          label: 'D4 — Forehead treatment is paired with glabellar treatment in this session, OR patient is established with documented stable brow depressor treatment',
          helpText: 'Isolated frontalis treatment without brow depressor treatment causes brow descent in male patients.',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'zones_requested', operator: 'includes', value: 'forehead' }],
            logicType: 'and',
          },
        },
      ],
    },

    // ─── SECTION E — MD Referral Trigger Summary ──────────────────────────────

    {
      id: 'section_e_md_referral',
      title: 'Section E — MD Referral Trigger Summary',
      description: 'Complete before transmitting to Manchester Medical Director. This section generates the MD referral package.',
      fields: [
        {
          id: 'md_referral_required',
          type: 'radio',
          label: 'MD Prescribing Consultation required?',
          options: [
            { value: 'yes_new_patient',  label: 'YES — New patient (mandatory)' },
            { value: 'yes_new_zone',     label: 'YES — First treatment in a new zone for this patient (mandatory)' },
            { value: 'yes_contraindication', label: 'YES — Relative contraindication identified (mandatory)' },
            { value: 'repeat_applicable', label: 'Repeat prescription applicable — confirmed no new contraindications' },
          ],
          validation: { required: true },
        },
        {
          id: 'md_referral_notes',
          type: 'textarea',
          label: 'Additional notes for MD',
          helpText: 'Include any nuance from the contraindication screen, brow anatomy observations, or patient concerns the MD should be aware of.',
        },
        {
          id: 'practitioner_confirms_transmit',
          type: 'checkbox',
          label: 'I confirm I will transmit this completed form to the Manchester Medical Director and will not open, reconstitute, or draw up any BoNT-A product until a valid MD prescription is confirmed on this patient\'s digital record',
          validation: { required: true },
        },
      ],
    },
  ],
};

// ============================================
// FORM 2: BOTOX CONSENT FORM
// (Patient-facing — three-party sign-off)
// ============================================

const botoxConsent: FormDefinition = {
  id: 'menh_botox_consent',
  name: 'Botulinum Toxin — Informed Consent',
  description:
    'Treatment-specific informed consent for BoNT-A. Includes off-label disclosure per zone, zone-specific risk declarations (ptosis, dysphagia, oral incompetence), and three-party sign-off (Patient / Manchester Medical Director / Treating Practitioner). Document reference: MEN-CP-007 Part 3.',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'BoNT-A (Botox)',
  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration:
    'I confirm I have read and understood this consent document, or it has been fully explained to me. I have had the opportunity to ask questions and am satisfied with the answers. I give my consent freely and voluntarily.',
  allowDraft: false,
  allowResume: false,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,

  sections: [

    {
      id: 'consent_patient_info',
      title: 'Patient & Treatment Details',
      fields: [
        {
          id: 'consent_patient_name',
          type: 'text',
          label: 'Patient Full Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'consent_dob',
          type: 'date',
          label: 'Date of Birth',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'consent_zones_being_treated',
          type: 'checkboxGroup',
          label: 'Zones being treated today (confirm with Practitioner)',
          validation: { required: true },
          options: [
            { value: 'glabellar',   label: 'Glabellar frown lines' },
            { value: 'forehead',    label: 'Forehead lines' },
            { value: 'crows_feet',  label: 'Crow\'s feet' },
            { value: 'brow_lift',   label: 'Brow lift' },
            { value: 'bunny_lines', label: 'Bunny lines' },
            { value: 'lip_flip',    label: 'Lip flip' },
            { value: 'chin',        label: 'Chin dimpling' },
            { value: 'platysma',    label: 'Platysmal bands (neck)' },
            { value: 'masseter',    label: 'Masseter (jaw slimming)' },
            { value: 'hyperhidrosis', label: 'Axillary hyperhidrosis' },
          ],
        },
        {
          id: 'consent_product_prescribed',
          type: 'select',
          label: 'Product prescribed by Manchester MD',
          validation: { required: true },
          options: [
            { value: 'botox',     label: 'Botox (OnabotulinumtoxinA)' },
            { value: 'azzalure',  label: 'Azzalure (AbobotulinumtoxinA)' },
            { value: 'bocouture', label: 'Bocouture (IncobotulinumtoxinA)' },
            { value: 'dysport',   label: 'Dysport (AbobotulinumtoxinA)' },
            { value: 'xeomin',    label: 'Xeomin (IncobotulinumtoxinA)' },
          ],
        },
        {
          id: 'consent_clinic',
          type: 'select',
          label: 'Clinic',
          validation: { required: true },
          options: [
            { value: 'manchester', label: 'Manchester' },
            { value: 'leeds',      label: 'Leeds' },
            { value: 'wilmslow',   label: 'Wilmslow' },
            { value: 'wigan',      label: 'Wigan' },
          ],
        },
      ],
    },

    {
      id: 'consent_what_it_involves',
      title: 'What the Treatment Involves',
      fields: [
        {
          id: 'treatment_explanation',
          type: 'paragraph',
          label: '',
          content:
            'Botulinum Toxin Type A is a purified protein that temporarily blocks nerve signals to muscles, causing targeted relaxation. For aesthetic treatment, this smooths lines created by muscle contraction. For axillary hyperhidrosis, it blocks nerve signals to sweat glands, reducing sweating. The treatment is delivered by injection using a very fine needle directly into the targeted muscle or skin. The procedure takes approximately 15–30 minutes depending on the number of zones treated. Onset: 2–5 days. Full effect: 10–14 days. Duration: 3–4 months (facial); 4–7 months (hyperhidrosis).',
        },
        {
          id: 'consent_understand_pom',
          type: 'checkbox',
          label: 'I understand Botulinum Toxin is a Prescription-Only Medicine, prescribed for me specifically by the Menhancements Manchester Medical Director following a clinical assessment. The Medical Director does not administer the injection — my treating Practitioner does.',
          validation: { required: true },
        },
      ],
    },

    {
      id: 'consent_off_label',
      title: 'Off-Label Use Disclosure',
      description: 'Confirm which zones being treated today represent off-label use.',
      fields: [
        {
          id: 'off_label_info',
          type: 'paragraph',
          label: '',
          content:
            'BoNT-A is licensed for glabellar frown lines and crow\'s feet. All other facial aesthetic uses and axillary hyperhidrosis (for some products) are off-label. Off-label prescribing by a qualified doctor is lawful in the UK when the prescriber has assessed it as clinically appropriate. The Manchester MD has done so in your case.',
        },
        {
          id: 'off_label_forehead',
          type: 'checkbox',
          label: 'Forehead lines — off-label use confirmed and understood',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'forehead' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_brow_lift',
          type: 'checkbox',
          label: 'Brow lift — off-label use confirmed and understood',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'brow_lift' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_bunny_lines',
          type: 'checkbox',
          label: 'Bunny lines — off-label use confirmed and understood',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'bunny_lines' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_lip_flip',
          type: 'checkbox',
          label: 'Lip flip — off-label use confirmed and understood',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'lip_flip' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_chin',
          type: 'checkbox',
          label: 'Chin dimpling — off-label use confirmed and understood',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'chin' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_platysma',
          type: 'checkbox',
          label: 'Platysmal bands (neck) — off-label use confirmed and understood',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'platysma' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_masseter',
          type: 'checkbox',
          label: 'Masseter (jaw slimming) — off-label use confirmed and understood',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'masseter' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_glabellar_licensed',
          type: 'checkbox',
          label: 'Glabellar frown lines — licensed indication confirmed',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'glabellar' }],
            logicType: 'and',
          },
        },
        {
          id: 'off_label_crows_feet_licensed',
          type: 'checkbox',
          label: 'Crow\'s feet — licensed indication confirmed',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'crows_feet' }],
            logicType: 'and',
          },
        },
      ],
    },

    {
      id: 'consent_realistic_outcomes',
      title: 'Realistic Outcomes',
      fields: [
        {
          id: 'outcomes_info',
          type: 'paragraph',
          label: '',
          content:
            'Botulinum Toxin relaxes muscles. It does not remove lines already present at rest — it reduces lines caused by muscle movement. For deep lines at rest, results will be partial and may improve with repeated treatments over time. No specific outcome is guaranteed.',
        },
        {
          id: 'consent_understand_outcomes',
          type: 'checkbox',
          label: 'I understand results are not guaranteed and individual responses vary',
          validation: { required: true },
        },
        {
          id: 'consent_understand_duration',
          type: 'checkbox',
          label: 'I understand the treatment is temporary (3–4 months facial; 4–7 months hyperhidrosis) and repeat treatment is required to maintain results',
          validation: { required: true },
        },
      ],
    },

    {
      id: 'consent_risks',
      title: 'Risks & Potential Complications',
      fields: [
        {
          id: 'consent_common_risks',
          type: 'checkbox',
          label: 'Common effects: I understand redness, mild swelling, bruising (resolves within days–2 weeks), mild headache, and temporary tenderness are expected and usually self-resolving',
          validation: { required: true },
        },
        {
          id: 'consent_asymmetry_risk',
          type: 'checkbox',
          label: 'Asymmetry: I understand asymmetry of treatment effect is possible and is usually addressable at the 2-week review',
          validation: { required: true },
        },
        {
          id: 'consent_brow_risk',
          type: 'checkbox',
          label: 'Brow drop / brow heaviness: I understand temporary brow descent can occur with frontalis treatment and resolves as the product wears off',
          validation: { required: true },
        },

        // Zone-specific risk declarations — shown conditionally

        {
          id: 'consent_ptosis_risk',
          type: 'checkbox',
          label: 'EYELID PTOSIS: I understand that glabellar treatment carries a rare risk of upper eyelid drooping (ptosis) if the toxin spreads to the levator palpebrae muscle. This is typically temporary (2–8 weeks). I understand apraclonidine eye drops may be prescribed by the MD to partially manage it while it resolves. I understand the specific injection rules in place to minimise this risk.',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'glabellar' }],
            logicType: 'and',
          },
        },

        {
          id: 'consent_oral_incompetence_risk',
          type: 'checkbox',
          label: 'ORAL INCOMPETENCE: I understand that lip flip treatment may transiently affect oral function — difficulty using a straw, drinking from a bottle, or whistling. I understand this is caused by low-dose relaxation of the orbicularis oris and is temporary.',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'lip_flip' }],
            logicType: 'and',
          },
        },

        {
          id: 'consent_dysphagia_risk',
          type: 'checkbox',
          label: 'DYSPHAGIA: I understand that platysmal band treatment carries a risk of difficulty swallowing if the toxin spreads to the swallowing musculature. Severe dysphagia is a medical emergency requiring 999. I understand the dose limits and injection rules in place to minimise this risk.',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'platysma' }],
            logicType: 'and',
          },
        },

        {
          id: 'consent_smile_asymmetry_risk',
          type: 'checkbox',
          label: 'SMILE ASYMMETRY: I understand that masseter treatment carries a risk of smile asymmetry if the toxin spreads to adjacent facial muscles. I understand the specific injection boundary rules in place to minimise this risk.',
          validation: { required: true },
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'masseter' }],
            logicType: 'and',
          },
        },

        {
          id: 'consent_systemic_risk',
          type: 'checkbox',
          label: 'SYSTEMIC EFFECTS: I understand that systemic muscle weakness, difficulty swallowing or breathing after treatment are very rare but serious. I will call 999 immediately if I experience these symptoms after treatment.',
          validation: { required: true },
        },

        {
          id: 'consent_anaphylaxis_risk',
          type: 'checkbox',
          label: 'ALLERGIC REACTION: I understand that allergic reaction and anaphylaxis are rare. I understand the clinic carries emergency adrenaline.',
          validation: { required: true },
        },
      ],
    },

    {
      id: 'consent_declarations',
      title: 'Consent Declarations',
      fields: [
        {
          id: 'consent_had_opportunity',
          type: 'checkbox',
          label: 'I have had the opportunity to ask questions and am satisfied with the answers received',
          validation: { required: true },
        },
        {
          id: 'consent_asymmetry_acknowledged',
          type: 'checkbox',
          label: 'I acknowledge that any pre-existing facial asymmetry has been documented and pre-dates this treatment',
          validation: { required: true },
        },
        {
          id: 'consent_photos_consent',
          type: 'checkbox',
          label: 'I consent to clinical photographs being taken and stored securely in my patient record',
          validation: { required: true },
        },
        {
          id: 'consent_age_18',
          type: 'checkbox',
          label: 'I confirm I am over 18 years of age',
          validation: { required: true },
        },
        {
          id: 'consent_can_withdraw',
          type: 'checkbox',
          label: 'I understand I may withdraw consent at any time before the first injection is administered',
          validation: { required: true },
        },
      ],
    },

    {
      id: 'consent_md_signoff',
      title: 'Manchester Medical Director — Prescribing Sign-off',
      description: 'To be completed by the Manchester Medical Director following prescribing consultation.',
      fields: [
        {
          id: 'md_name',
          type: 'text',
          label: 'MD Full Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'md_gmc_number',
          type: 'text',
          label: 'GMC Number',
          validation: { required: true, pattern: '^\\d{7}$', patternMessage: 'Must be 7 digits' },
          width: 'half',
        },
        {
          id: 'md_product_prescribed',
          type: 'select',
          label: 'Product prescribed',
          validation: { required: true },
          options: [
            { value: 'botox',     label: 'Botox (OnabotulinumtoxinA)' },
            { value: 'azzalure',  label: 'Azzalure (AbobotulinumtoxinA)' },
            { value: 'bocouture', label: 'Bocouture (IncobotulinumtoxinA)' },
            { value: 'dysport',   label: 'Dysport (AbobotulinumtoxinA)' },
            { value: 'xeomin',    label: 'Xeomin (IncobotulinumtoxinA)' },
          ],
        },
        // Zone-by-zone prescribed IU
        {
          id: 'md_iu_glabellar',
          type: 'number',
          label: 'Glabellar — prescribed IU',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'glabellar' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_forehead',
          type: 'number',
          label: 'Forehead — prescribed IU',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'forehead' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_crows_feet',
          type: 'number',
          label: 'Crow\'s feet — prescribed IU (per side)',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'crows_feet' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_brow_lift',
          type: 'number',
          label: 'Brow lift — prescribed IU (per side)',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'brow_lift' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_bunny_lines',
          type: 'number',
          label: 'Bunny lines — prescribed IU',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'bunny_lines' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_lip_flip',
          type: 'number',
          label: 'Lip flip — prescribed IU (max 4)',
          width: 'half',
          validation: { max: 4 },
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'lip_flip' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_chin',
          type: 'number',
          label: 'Chin dimpling — prescribed IU',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'chin' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_platysma',
          type: 'number',
          label: 'Platysmal bands — prescribed IU (max 40 total)',
          width: 'half',
          validation: { max: 40 },
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'platysma' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_masseter',
          type: 'number',
          label: 'Masseter — prescribed IU (per side)',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'masseter' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_iu_hyperhidrosis',
          type: 'number',
          label: 'Axillary hyperhidrosis — prescribed IU (per axilla, typically 50)',
          width: 'half',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'consent_zones_being_treated', operator: 'includes', value: 'hyperhidrosis' }],
            logicType: 'and',
          },
        },
        {
          id: 'md_confirms_consultation',
          type: 'checkbox',
          label: 'I confirm I have conducted a prescribing consultation, reviewed the patient\'s medical history, confirmed contraindication clearance, reviewed baseline photographs, reviewed male brow anatomy where applicable, disclosed any off-label use, and issued a prescription as documented in the patient\'s digital record',
          validation: { required: true },
        },
      ],
    },

    {
      id: 'consent_practitioner_verification',
      title: 'Treating Practitioner — Day-of-Treatment Verification',
      description: 'Mandatory checklist at every treatment session, including repeats.',
      fields: [
        {
          id: 'pract_name',
          type: 'text',
          label: 'Practitioner Full Name',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'pract_reg_number',
          type: 'text',
          label: 'Registration Number',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'pract_md_prescription_present',
          type: 'checkbox',
          label: 'MD prescription is present, dated, and signed on this patient\'s digital record — product, total IU per zone, and dilution confirmed',
          validation: { required: true },
        },
        {
          id: 'pract_product_matches',
          type: 'checkbox',
          label: 'Product in hand matches the MD prescription exactly (brand name and formulation)',
          validation: { required: true },
        },
        {
          id: 'pract_batch_confirmed',
          type: 'checkbox',
          label: 'Product batch number and expiry confirmed and recorded in the digital system',
          validation: { required: true },
        },
        {
          id: 'pract_batch_number',
          type: 'text',
          label: 'Batch number confirmed',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'pract_expiry_date',
          type: 'date',
          label: 'Expiry date confirmed',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'pract_no_new_contraindications',
          type: 'checkbox',
          label: 'No new contraindications identified today — verbal screen completed: new medications (especially aminoglycosides), new diagnoses, new neurological symptoms',
          validation: { required: true },
        },
        {
          id: 'pract_photos_on_file',
          type: 'checkbox',
          label: 'Baseline photographs are on file and today\'s pre-treatment photographs have been taken',
          validation: { required: true },
        },
        {
          id: 'pract_consent_signed',
          type: 'checkbox',
          label: 'Signed Informed Consent is on file',
          validation: { required: true },
        },
        {
          id: 'pract_dilution_prepared',
          type: 'text',
          label: 'Reconstitution: saline volume used',
          helpText: 'e.g., 2.0 mL per 100 IU vial = 5 IU per 0.1 mL',
          validation: { required: true },
        },
      ],
    },
  ],
};

// ============================================
// FORM 3: BOTOX PROCEDURE RECORD
// (Day-of-treatment zone-by-zone clinical record)
// ============================================

const botoxProcedureRecord: FormDefinition = {
  id: 'menh_botox_procedure',
  name: 'Botulinum Toxin — Procedure Record',
  description:
    'Day-of-treatment clinical record. Captures prescription verification, product and reconstitution details, zone-by-zone IU delivered, injection observations, and post-injection mandatory checklist. Document reference: MEN-CP-007 Part 1.',
  version: '1.0',
  brand: 'MENHANCEMENTS',
  category: 'BoNT-A (Botox)',
  requiresSignature: true,
  signatureLabel: 'Practitioner',
  signatureDeclaration:
    'I confirm this procedure record is accurate and complete. The MD prescription was verified before any product was opened. All clinical steps were performed in accordance with MEN-CP-007.',
  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: true,
  retentionDays: 3650,

  sections: [

    // ─── Prescription Verification (Stage 3 checklist) ────────────────────────

    {
      id: 'proc_prescription_verification',
      title: 'Stage 3 — Prescription Verification (Mandatory Before Opening Any Product)',
      description: 'Every item must be confirmed. If any item cannot be confirmed — STOP and contact MD.',
      fields: [
        {
          id: 'proc_patient_identity_confirmed',
          type: 'checkbox',
          label: 'Patient identity confirmed: full name + date of birth match digital record',
          validation: { required: true },
        },
        {
          id: 'proc_md_prescription_present',
          type: 'checkbox',
          label: 'MD prescription is present on digital record — dated, signed, specifying product name, IU per zone, and dilution',
          validation: { required: true },
          stopConditions: [
            {
              field: 'proc_md_prescription_present',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'HARD STOP — No valid MD prescription on record. Contact MD immediately. No product may be opened until a valid prescription is confirmed.',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'proc_prescription_ref',
          type: 'text',
          label: 'MD Prescription reference / date',
          validation: { required: true },
          width: 'half',
          helpText: 'Date of MD prescription as shown on the digital record.',
        },
        {
          id: 'proc_product_matches_prescription',
          type: 'checkbox',
          label: 'Product in hand matches the MD prescription exactly (product name and formulation)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'proc_product_matches_prescription',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'HARD STOP — Product does not match prescription. Do NOT substitute. Contact MD for a new prescription. Different BoNT-A products have different unit equivalencies.',
              riskLevel: 'CRITICAL',
            },
          ],
        },
        {
          id: 'proc_consent_on_file',
          type: 'checkbox',
          label: 'Signed Informed Consent (menh_botox_consent) is on file',
          validation: { required: true },
        },
        {
          id: 'proc_no_new_contraindications',
          type: 'checkbox',
          label: 'No new contraindications identified today — verbal screen completed (new medications, new diagnoses, new neurological symptoms)',
          validation: { required: true },
        },
        {
          id: 'proc_photos_taken_today',
          type: 'checkbox',
          label: 'Today\'s pre-treatment photographs taken and stored in digital record',
          validation: { required: true },
        },
        {
          id: 'proc_male_brow_assessment',
          type: 'checkbox',
          label: 'Male brow assessment completed and documented (for facial treatment)',
          validation: { required: true },
        },
      ],
    },

    // ─── Product & Reconstitution ──────────────────────────────────────────────

    {
      id: 'proc_product_reconstitution',
      title: 'Product & Reconstitution',
      fields: [
        {
          id: 'proc_product_used',
          type: 'select',
          label: 'Product used today',
          validation: { required: true },
          options: [
            { value: 'botox',     label: 'Botox (OnabotulinumtoxinA)' },
            { value: 'azzalure',  label: 'Azzalure (AbobotulinumtoxinA)' },
            { value: 'bocouture', label: 'Bocouture (IncobotulinumtoxinA)' },
            { value: 'dysport',   label: 'Dysport (AbobotulinumtoxinA)' },
            { value: 'xeomin',    label: 'Xeomin (IncobotulinumtoxinA)' },
          ],
        },
        {
          id: 'proc_vial_size',
          type: 'select',
          label: 'Vial size',
          validation: { required: true },
          width: 'half',
          options: [
            { value: '50_iu',  label: '50 IU vial' },
            { value: '100_iu', label: '100 IU vial' },
            { value: '125_iu', label: '125 IU vial (Azzalure)' },
            { value: '300_iu', label: '300 IU vial (Dysport)' },
            { value: '500_iu', label: '500 IU vial (Dysport)' },
          ],
        },
        {
          id: 'proc_batch_number',
          type: 'batchNumber',
          label: 'Batch number',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'proc_expiry_date',
          type: 'date',
          label: 'Expiry date',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'proc_reconstitution_time',
          type: 'time',
          label: 'Time of reconstitution',
          validation: { required: true },
          width: 'half',
          helpText: 'Botox/Bocouture/Xeomin: use within 24 hours (refrigerated) or 4 hours (room temp). Azzalure: use within 8 hours.',
        },
        {
          id: 'proc_saline_volume_ml',
          type: 'number',
          label: 'Saline volume added (mL)',
          validation: { required: true },
          width: 'third',
          helpText: 'Standard facial: 2.0–2.5 mL per 100 IU. Hyperhidrosis: 4.0 mL per 100 IU.',
        },
        {
          id: 'proc_concentration',
          type: 'text',
          label: 'Resulting concentration',
          validation: { required: true },
          width: 'third',
          helpText: 'e.g., 5 IU per 0.1 mL (at 2.0 mL/100 IU)',
        },
        {
          id: 'proc_solution_inspected',
          type: 'checkbox',
          label: 'Reconstituted solution inspected — clear and colourless with no particulate matter',
          validation: { required: true },
          stopConditions: [
            {
              field: 'proc_solution_inspected',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — Reconstituted solution is not clear and colourless. Discard and do not use. Document and contact MD.',
              riskLevel: 'HIGH',
            },
          ],
        },
      ],
    },

    // ─── Zones Treated Today ──────────────────────────────────────────────────

    {
      id: 'proc_zones_treated',
      title: 'Zones Treated Today',
      description: 'Select all zones injected this session. IU fields for each zone will appear below.',
      fields: [
        {
          id: 'proc_zones_today',
          type: 'checkboxGroup',
          label: 'Zones injected today',
          validation: { required: true },
          options: [
            { value: 'glabellar',     label: 'Glabellar (procerus + corrugator)' },
            { value: 'forehead',      label: 'Forehead (frontalis)' },
            { value: 'crows_feet',    label: 'Crow\'s feet (orbicularis oculi — lateral)' },
            { value: 'brow_lift',     label: 'Brow lift (lateral brow depressor)' },
            { value: 'bunny_lines',   label: 'Bunny lines (nasalis)' },
            { value: 'lip_flip',      label: 'Lip flip (orbicularis oris)' },
            { value: 'chin',          label: 'Chin dimpling (mentalis)' },
            { value: 'platysma',      label: 'Platysmal bands (platysma)' },
            { value: 'masseter',      label: 'Masseter (bilateral)' },
            { value: 'hyperhidrosis', label: 'Axillary hyperhidrosis' },
          ],
        },
      ],
    },

    // ─── Zone A — Glabellar ────────────────────────────────────────────────────

    {
      id: 'proc_zone_glabellar',
      title: 'Zone A — Glabellar Frown Lines',
      description: 'Procerus + Corrugator supercilii. Max male dose: 35 IU Botox-equivalent. Ptosis prevention rules mandatory.',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'glabellar' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'glabellar_iu_delivered',
          type: 'number',
          label: 'Total IU delivered — Glabellar',
          validation: { required: true, min: 1, max: 35 },
          width: 'half',
          helpText: 'Male range: 25–35 IU Botox-equivalent. Check against MD prescription.',
        },
        {
          id: 'glabellar_ptosis_rule_confirmed',
          type: 'checkbox',
          label: 'Ptosis prevention rule confirmed: no injection within 1 cm of supraorbital rim; no injection medially past mid-pupillary line; firm pressure applied to inferior injection points for 30 seconds post-injection; no massage',
          validation: { required: true },
        },
        {
          id: 'glabellar_notes',
          type: 'textarea',
          label: 'Glabellar clinical notes',
          helpText: 'Point count, any asymmetry, patient tolerance.',
        },
      ],
    },

    // ─── Zone B — Forehead ────────────────────────────────────────────────────

    {
      id: 'proc_zone_forehead',
      title: 'Zone B — Forehead Lines (Frontalis)',
      description: 'Male minimum safe distance from brow: 3–4 cm. Maximum dose: 25 IU.',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'forehead' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'forehead_iu_delivered',
          type: 'number',
          label: 'Total IU delivered — Forehead',
          validation: { required: true, min: 1, max: 25 },
          width: 'half',
          helpText: 'Male range: 10–25 IU. Start conservatively — top-up at 2 weeks preferred over over-treatment.',
        },
        {
          id: 'forehead_injection_points',
          type: 'number',
          label: 'Number of injection points',
          validation: { required: true, min: 4, max: 6 },
          width: 'half',
          helpText: '4–6 points across upper forehead, minimum 3.5 cm above brow.',
        },
        {
          id: 'forehead_brow_distance_confirmed',
          type: 'checkbox',
          label: 'Confirmed: all injection points are minimum 3.5 cm above the brow (male safe distance)',
          validation: { required: true },
        },
        {
          id: 'forehead_with_glabellar_confirmed',
          type: 'checkbox',
          label: 'Confirmed: glabellar is also being treated this session (or patient is established with stable depressor treatment)',
          validation: { required: true },
        },
        {
          id: 'forehead_notes',
          type: 'textarea',
          label: 'Forehead clinical notes',
        },
      ],
    },

    // ─── Zone C — Crow's Feet ─────────────────────────────────────────────────

    {
      id: 'proc_zone_crows_feet',
      title: 'Zone C — Crow\'s Feet (Lateral Canthal Lines)',
      description: 'Orbicularis oculi — lateral fibres. Stay at least 1 cm lateral to orbital rim.',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'crows_feet' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'crows_left_iu',
          type: 'number',
          label: 'Left side — IU delivered',
          validation: { required: true, min: 1, max: 18 },
          width: 'half',
          helpText: 'Male range: 10–18 IU per side.',
        },
        {
          id: 'crows_right_iu',
          type: 'number',
          label: 'Right side — IU delivered',
          validation: { required: true, min: 1, max: 18 },
          width: 'half',
        },
        {
          id: 'crows_safety_rule',
          type: 'checkbox',
          label: 'Confirmed: no injection within 1 cm of lower eyelid margin; all points at least 1 cm lateral to bony orbital rim; superficial injection only',
          validation: { required: true },
        },
        {
          id: 'crows_notes',
          type: 'textarea',
          label: 'Crow\'s feet clinical notes',
        },
      ],
    },

    // ─── Zone D — Brow Lift ───────────────────────────────────────────────────

    {
      id: 'proc_zone_brow_lift',
      title: 'Zone D — Brow Lift (Lateral Brow Depressor)',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'brow_lift' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'brow_lift_left_iu',
          type: 'number',
          label: 'Left side — IU delivered',
          validation: { required: true, min: 1, max: 5 },
          width: 'half',
          helpText: 'Male: 2–3 IU per side. Minimal dose — subtle lateral elevation only.',
        },
        {
          id: 'brow_lift_right_iu',
          type: 'number',
          label: 'Right side — IU delivered',
          validation: { required: true, min: 1, max: 5 },
          width: 'half',
        },
        {
          id: 'brow_lift_notes',
          type: 'textarea',
          label: 'Brow lift clinical notes',
        },
      ],
    },

    // ─── Zone E — Bunny Lines ─────────────────────────────────────────────────

    {
      id: 'proc_zone_bunny_lines',
      title: 'Zone E — Bunny Lines (Nasalis)',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'bunny_lines' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'bunny_iu_delivered',
          type: 'number',
          label: 'Total IU delivered — Bunny lines',
          validation: { required: true, min: 1, max: 16 },
          width: 'half',
          helpText: '2–4 IU per side. Inject minimum 1 cm above alar crease.',
        },
        {
          id: 'bunny_safe_distance',
          type: 'checkbox',
          label: 'Confirmed: all injection points at least 1 cm above the alar crease',
          validation: { required: true },
        },
        {
          id: 'bunny_notes',
          type: 'textarea',
          label: 'Bunny lines clinical notes',
        },
      ],
    },

    // ─── Zone F — Lip Flip ────────────────────────────────────────────────────

    {
      id: 'proc_zone_lip_flip',
      title: 'Zone F — Lip Flip (Orbicularis Oris)',
      description: 'CRITICAL LOW-DOSE ZONE. Maximum total dose: 4 IU Botox-equivalent. Do not exceed.',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'lip_flip' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'lip_flip_iu_delivered',
          type: 'number',
          label: 'Total IU delivered — Lip flip',
          validation: { required: true, min: 1, max: 4 },
          width: 'half',
          helpText: 'MAXIMUM 4 IU total. Over-injection causes oral incompetence.',
        },
        {
          id: 'lip_flip_oral_counselled',
          type: 'checkbox',
          label: 'Patient counselled: oral function may be transiently affected (difficulty using straws, drinking from bottles). Patient accepts this.',
          validation: { required: true },
        },
        {
          id: 'lip_flip_notes',
          type: 'textarea',
          label: 'Lip flip clinical notes',
        },
      ],
    },

    // ─── Zone G — Chin ────────────────────────────────────────────────────────

    {
      id: 'proc_zone_chin',
      title: 'Zone G — Chin Dimpling (Mentalis)',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'chin' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'chin_iu_delivered',
          type: 'number',
          label: 'Total IU delivered — Chin',
          validation: { required: true, min: 1, max: 8 },
          width: 'half',
          helpText: '4–8 IU total. Bilateral symmetrical placement mandatory.',
        },
        {
          id: 'chin_bilateral_confirmed',
          type: 'checkbox',
          label: 'Confirmed: bilateral symmetrical injection technique used',
          validation: { required: true },
        },
        {
          id: 'chin_notes',
          type: 'textarea',
          label: 'Chin clinical notes',
        },
      ],
    },

    // ─── Zone H — Platysmal Bands ─────────────────────────────────────────────

    {
      id: 'proc_zone_platysma',
      title: 'Zone H — Platysmal Bands (Neck)',
      description: 'HIGHER RISK ZONE. Maximum total dose: 40 IU. Patient must be upright at 30° during injection.',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'platysma' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'platysma_iu_delivered',
          type: 'number',
          label: 'Total IU delivered — Platysma (all bands combined)',
          validation: { required: true, min: 1, max: 40 },
          width: 'half',
          helpText: 'MAXIMUM 40 IU total. Never exceed this limit.',
        },
        {
          id: 'platysma_bands_count',
          type: 'number',
          label: 'Number of visible bands treated',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'platysma_patient_upright',
          type: 'checkbox',
          label: 'Confirmed: patient was upright at 30° during injection (not fully reclined)',
          validation: { required: true },
        },
        {
          id: 'platysma_depth_rule',
          type: 'checkbox',
          label: 'Confirmed: injection was directly into the visible band only — NOT deep to the platysma; NOT lateral to the visible band',
          validation: { required: true },
        },
        {
          id: 'platysma_notes',
          type: 'textarea',
          label: 'Platysmal bands clinical notes',
          helpText: 'Note each band treated, point count, IU per band, any swallowing discomfort reported.',
        },
      ],
    },

    // ─── Zone I — Masseter ────────────────────────────────────────────────────

    {
      id: 'proc_zone_masseter',
      title: 'Zone I — Masseter (Jaw Slimming)',
      description: 'Inject into inferior-posterior quadrant of masseter on clenching. Anterior and superior borders must be avoided.',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'masseter' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'masseter_left_iu',
          type: 'number',
          label: 'Left masseter — IU delivered',
          validation: { required: true, min: 1, max: 40 },
          width: 'half',
          helpText: 'Male range: 20–40 IU per side. Start lower end — top-up at 2 weeks.',
        },
        {
          id: 'masseter_right_iu',
          type: 'number',
          label: 'Right masseter — IU delivered',
          validation: { required: true, min: 1, max: 40 },
          width: 'half',
        },
        {
          id: 'masseter_anterior_border_marked',
          type: 'checkbox',
          label: 'Confirmed: anterior border of masseter marked on clenching — all injections posterior to this line',
          validation: { required: true },
        },
        {
          id: 'masseter_zygomatic_border',
          type: 'checkbox',
          label: 'Confirmed: no injection within 1 cm superiorly of the zygomatic arch (parotid and zygomatic nerve territory)',
          validation: { required: true },
        },
        {
          id: 'masseter_post_clench',
          type: 'checkbox',
          label: 'Patient instructed to clench and unclench jaw 20 times immediately post-injection',
          validation: { required: true },
        },
        {
          id: 'masseter_notes',
          type: 'textarea',
          label: 'Masseter clinical notes',
        },
      ],
    },

    // ─── Zone J — Axillary Hyperhidrosis ──────────────────────────────────────

    {
      id: 'proc_zone_hyperhidrosis',
      title: 'Zone J — Axillary Hyperhidrosis',
      description: 'Intradermal injection only. 50 IU per axilla (100 IU bilateral). EMLA requires separate MD prescription.',
      conditionalLogic: {
        action: 'show',
        conditions: [{ field: 'proc_zones_today', operator: 'includes', value: 'hyperhidrosis' }],
        logicType: 'and',
      },
      fields: [
        {
          id: 'hyperhidrosis_emla_prescribed',
          type: 'checkbox',
          label: 'EMLA topical anaesthetic is prescribed by MD (separate EMLA prescription confirmed on digital record)',
          validation: { required: true },
          stopConditions: [
            {
              field: 'hyperhidrosis_emla_prescribed',
              operator: 'equals',
              value: false,
              action: 'stop',
              message: 'STOP — EMLA is a POM. A separate MD prescription for EMLA must be on file before application. Contact MD.',
              riskLevel: 'HIGH',
            },
          ],
        },
        {
          id: 'hyperhidrosis_left_iu',
          type: 'number',
          label: 'Left axilla — IU delivered',
          validation: { required: true, min: 1, max: 50 },
          width: 'half',
          helpText: 'Standard: 50 IU per axilla at 4 mL/100 IU dilution.',
        },
        {
          id: 'hyperhidrosis_right_iu',
          type: 'number',
          label: 'Right axilla — IU delivered',
          validation: { required: true, min: 1, max: 50 },
          width: 'half',
        },
        {
          id: 'hyperhidrosis_left_points',
          type: 'number',
          label: 'Left axilla — injection points',
          validation: { required: true },
          width: 'half',
          helpText: 'Typically 15–20 points per axilla on 1–1.5 cm grid.',
        },
        {
          id: 'hyperhidrosis_right_points',
          type: 'number',
          label: 'Right axilla — injection points',
          validation: { required: true },
          width: 'half',
        },
        {
          id: 'hyperhidrosis_intradermal_confirmed',
          type: 'checkbox',
          label: 'Confirmed: all injections were intradermal (2–3 mm depth, bevel-up, small bleb formed at each point)',
          validation: { required: true },
        },
        {
          id: 'hyperhidrosis_notes',
          type: 'textarea',
          label: 'Hyperhidrosis clinical notes',
        },
      ],
    },

    // ─── Post-Injection Mandatory Checklist ───────────────────────────────────

    {
      id: 'proc_post_injection',
      title: 'Post-Injection Mandatory Checklist',
      description: 'All steps must be completed before patient leaves the clinic.',
      fields: [
        {
          id: 'post_cold_pack_applied',
          type: 'checkbox',
          label: 'Cold pack (wrapped in cloth — no direct skin contact) applied to all injection sites for 2–3 minutes',
          validation: { required: true },
        },
        {
          id: 'post_no_massage_confirmed',
          type: 'checkbox',
          label: 'Patient instructed: do NOT touch, press, or massage any injection site for 24 hours',
          validation: { required: true },
        },
        {
          id: 'post_observation_period',
          type: 'checkbox',
          label: 'Patient observed in clinic for minimum 20 minutes post-injection — no vasovagal response, no allergic reaction, no immediate neurological symptom',
          validation: { required: true },
        },
        {
          id: 'post_patient_tolerance',
          type: 'select',
          label: 'Patient tolerance',
          validation: { required: true },
          options: [
            { value: 'well',                 label: 'Tolerated well' },
            { value: 'mild_discomfort',      label: 'Mild discomfort' },
            { value: 'moderate_discomfort',  label: 'Moderate discomfort' },
            { value: 'significant_discomfort', label: 'Significant discomfort — documented' },
          ],
        },
        {
          id: 'post_two_week_review_booked',
          type: 'checkbox',
          label: '2-week review appointment booked',
          validation: { required: true },
        },
        {
          id: 'post_two_week_date',
          type: 'date',
          label: '2-week review date',
          validation: { required: true },
        },
        {
          id: 'post_aftercare_issued',
          type: 'checkbox',
          label: 'Aftercare protocol issued and verbally reviewed with patient (4-hour upright rule, no massage, no exercise 24 hours, emergency red flags)',
          validation: { required: true },
        },
        {
          id: 'post_48hr_followup_triggered',
          type: 'checkbox',
          label: '48-hour automated follow-up contact triggered via CRM',
          validation: { required: true },
        },
        {
          id: 'post_adverse_event',
          type: 'yesNo',
          label: 'Any adverse event or unexpected response during this session?',
          validation: { required: true },
        },
        {
          id: 'post_adverse_event_details',
          type: 'textarea',
          label: 'Adverse event details',
          helpText: 'If Grade 3 — activate full escalation protocol via the Adverse Event Report form.',
          conditionalLogic: {
            action: 'show',
            conditions: [{ field: 'post_adverse_event', operator: 'equals', value: true }],
            logicType: 'and',
          },
        },
        {
          id: 'post_additional_notes',
          type: 'textarea',
          label: 'Additional clinical notes',
        },
      ],
    },
  ],
};

// ============================================
// EXPORT
// ============================================

export const botoxForms: FormDefinition[] = [
  botoxConsultation,
  botoxConsent,
  botoxProcedureRecord,
];

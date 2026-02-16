import { FormDefinition } from "../types";

/**
 * TREATMENT JOURNEY DEFINITION
 * Used for: Menhancements, Wax for Men, and Wax for Women
 * Features: Phased Logic, CQC Stop-Logic, and Media Consent
 */
export const TreatmentJourney: FormDefinition = {
  // Master ID used for routing and database categorization
  id: "treatment-journey", 
  title: "Clinical Procedure & Legal Consent",
  version: "2.1 (CQC + Media Consent)",
  
  // Pin to top of clinical dashboard
  priority: 10, 
  category: "Clinical",
  
  requiresSignature: true,
  fields: [
    { id: "sec1", label: "Treatment Selection", type: "section" },
    { 
      id: "treatmentType", 
      label: "Select Procedure Category", 
      type: "select", 
      options: [
        "Facial Aesthetics", 
        "Sexual Wellness", 
        "Intimate Waxing", 
        "Body Waxing", 
        "Advanced Skincare"
      ],
      required: true 
    },

    // --- AESTHETICS & SEXUAL WELLNESS CLINICAL RECORD ---
    { 
      id: "clin_sec", 
      label: "Clinical Record (Toxins/Fillers/PRP)", 
      type: "section", 
      condition: (data) => ["Facial Aesthetics", "Sexual Wellness", "Advanced Skincare"].includes(data.treatmentType) 
    },
    { 
      id: "product_batch", 
      label: "Product Batch / Lot Number", 
      type: "text", 
      condition: (data) => ["Facial Aesthetics", "Sexual Wellness"].includes(data.treatmentType), 
      required: true 
    },
    { 
      id: "treatment_area", 
      label: "Specific Area Treated", 
      type: "text", 
      placeholder: "e.g., Jawline, Penis Shaft, Glabella" 
    },
    { 
      id: "device_settings", 
      label: "Device Settings (if Shockwave)", 
      type: "text", 
      condition: (data) => data.treatmentType === "Sexual Wellness" 
    },

    // --- WAXING SPECIFIC SECTION ---
    { 
      id: "wax_sec", 
      label: "Waxing Procedure Notes", 
      type: "section", 
      condition: (data) => data.treatmentType?.includes("Waxing") 
    },
    { 
      id: "pregnancy_status", 
      label: "Are you currently pregnant? (Women's Waxing Only)", 
      type: "radio", 
      options: ["Yes", "No", "N/A"],
      condition: (data) => data.treatmentType === "Intimate Waxing" 
    },
    { id: "skin_sensitivity", label: "Known Skin Sensitivities", type: "text" },

    // --- CLINICAL PHOTOGRAPHY & CONSENT ---
    { id: "media_sec", label: "Clinical Photography & Consent", type: "section" },
    { 
      id: "photo_consent_obtained", 
      label: "Has the patient signed the Image Consent or provided specific consent for today's photos?", 
      type: "radio", 
      options: ["Yes - Full Marketing", "Yes - Medical Records Only", "No - Consent Refused"],
      required: true 
    },
    { 
      id: "before_photo", 
      label: "Upload 'Before' Photo", 
      type: "file", 
      condition: (data) => data.photo_consent_obtained && data.photo_consent_obtained !== "No - Consent Refused" 
    },
    { 
      id: "after_photo", 
      label: "Upload 'After' Photo", 
      type: "file", 
      condition: (data) => data.photo_consent_obtained && data.photo_consent_obtained !== "No - Consent Refused" 
    },

    // --- CQC MANDATORY SCREENING (HARD STOPS) ---
    { id: "scr_sec", label: "Mandatory Safety Screening", type: "section" },
    { 
      id: "blood_disorder", 
      label: "Do you have any blood-clotting or bleeding disorders?", 
      type: "radio", 
      options: ["Yes", "No"], 
      required: true,
      stopCondition: (val) => val === "Yes" ? { 
        message: "STOP: Procedure contraindicated for blood disorders. Consult Dr. Phil.", 
        action: "stop", 
        riskLevel: "CRITICAL" 
      } : null
    },
    { 
      id: "active_infection", 
      label: "Are there any active infections/sores in the treatment area?", 
      type: "radio", 
      options: ["Yes", "No"], 
      required: true,
      stopCondition: (val) => val === "Yes" ? { 
        message: "STOP: Cannot treat area with active infection. Risk of spreading.", 
        action: "stop", 
        riskLevel: "HIGH" 
      } : null
    },

    // --- LEGAL CONSENT ---
    { id: "con_sec", label: "Informed Consent Acknowledgement", type: "section" },
    { 
      id: "risk_ack", 
      label: "I have been fully informed of the specific risks (bruising, swelling, infection, or temporary numbness).", 
      type: "checkbox", 
      required: true 
    },
    { 
      id: "aftercare_ack", 
      label: "I have received and understood the aftercare instructions specific to my brand.", 
      type: "checkbox", 
      required: true 
    },

    { id: "signature", label: "Patient / Client Digital Signature", type: "signature", required: true }
  ]
};
import { FormDefinition } from "../types";

export const UnifiedIntake: FormDefinition = {
  id: "unified_intake",
  title: "Client Registration & Medical History",
  version: "1.0",
  requiresSignature: true,
  fields: [
    { id: "sec1", label: "Personal Details", type: "section" },
    { id: "firstName", label: "First Name", type: "text", required: true },
    { id: "lastName", label: "Last Name", type: "text", required: true },
    { id: "dob", label: "Date of Birth", type: "date", required: true },
    
    { id: "sec2", label: "Medical Screening", type: "section" },
    { 
      id: "blood_thinners", 
      label: "Are you taking any blood-thinning medication?", 
      type: "radio", 
      options: ["Yes", "No"],
      required: true,
      stopCondition: (val) => val === "Yes" ? { message: "Client on blood thinners - Consult Lead Clinician", action: "escalate", riskLevel: "MEDIUM" } : null
    },
    { 
      id: "allergies", 
      label: "Do you have any known allergies?", 
      type: "radio", 
      options: ["Yes", "No"], 
      required: true 
    },
    { 
      id: "allergy_details", 
      label: "Please specify allergies", 
      type: "text", 
      condition: (data) => data.allergies === "Yes" 
    },

    { id: "sec3", label: "Consent & GDPR", type: "section" },
    { id: "gdpr_agree", label: "I agree to the storage of my medical data for treatment purposes", type: "checkbox", required: true },
    { id: "marketing_opt_in", label: "I would like to receive updates and offers via email/SMS", type: "checkbox" },
    
    { id: "signature", label: "Client Signature", type: "signature", required: true }
  ]
};

import { FormDefinition } from "../types";

export const GovernanceLog: FormDefinition = {
  id: "governance_log",
  title: "Internal Governance & Safety Log",
  version: "1.0 (CQC Compliant)",
  requiresSignature: true,
  fields: [
    { id: "sec1", label: "Event Categorization", type: "section" },
    { 
      id: "logType", 
      label: "Select Log Type", 
      type: "select", 
      options: ["Incident/Near Miss", "Safeguarding Concern", "Clinical Adverse Event", "Customer Complaint"],
      required: true 
    },

    // --- INCIDENT FIELDS ---
    { id: "inc_sec", label: "Incident Details", type: "section", condition: (data) => data.logType === "Incident/Near Miss" },
    { id: "incident_desc", label: "Description of what happened", type: "text", condition: (data) => data.logType === "Incident/Near Miss", required: true },
    { id: "witnesses", label: "Witness Names", type: "text", condition: (data) => data.logType === "Incident/Near Miss" },

    // --- SAFEGUARDING FIELDS ---
    { id: "saf_sec", label: "Safeguarding Details", type: "section", condition: (data) => data.logType === "Safeguarding Concern" },
    { id: "person_at_risk", label: "Name of Person at Risk", type: "text", condition: (data) => data.logType === "Safeguarding Concern", required: true },
    { id: "action_taken", label: "Immediate Action Taken", type: "text", condition: (data) => data.logType === "Safeguarding Concern" },

    // --- COMPLAINT FIELDS ---
    { id: "comp_sec", label: "Complaint Investigation", type: "section", condition: (data) => data.logType === "Customer Complaint" },
    { id: "client_name", label: "Client Name", type: "text", condition: (data) => data.logType === "Customer Complaint", required: true },
    { id: "resolution", label: "Proposed Resolution", type: "text", condition: (data) => data.logType === "Customer Complaint" },

    // --- SIGN OFF ---
    { id: "sign_sec", label: "Staff Declaration", type: "section" },
    { id: "declaration", label: "I confirm this report is an accurate and honest account of the event.", type: "checkbox", required: true },
    { id: "signature", label: "Staff Signature", type: "signature", required: true }
  ]
};

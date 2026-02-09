'use client';

// PLG UK Hub - Command Centre: Governance Form Renderer
// Non-client forms for Fire Safety, Cleaning Logs, Staff Training, etc.

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getBrandTheme } from '@/lib/brands/theme';
import { SignaturePad } from '@/components/signature/SignaturePad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Brand } from '@/lib/forms/types';
import {
  Flame,
  SprayCan,
  GraduationCap,
  Wrench,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
} from 'lucide-react';

// ============================================
// GOVERNANCE FORM DEFINITIONS
// ============================================

export type GovernanceFormType =
  | 'FIRE_SAFETY_CHECK'
  | 'CLEANING_LOG'
  | 'STAFF_TRAINING_SIGNOFF'
  | 'EQUIPMENT_CHECK'
  | 'INCIDENT_REPORT'
  | 'WASTE_DISPOSAL_LOG';

interface GovernanceFormConfig {
  type: GovernanceFormType;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: GovernanceField[];
}

interface GovernanceField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'yesNo' | 'select' | 'date' | 'time' | 'number' | 'checklist';
  required: boolean;
  options?: { value: string; label: string }[];
  checklistItems?: string[];
  placeholder?: string;
  failValue?: string | boolean; // Value that indicates non-compliance
}

const GOVERNANCE_FORMS: GovernanceFormConfig[] = [
  {
    type: 'FIRE_SAFETY_CHECK',
    title: 'Fire Safety Check',
    description: 'Daily fire safety inspection and equipment verification',
    icon: <Flame className="w-5 h-5" />,
    fields: [
      { id: 'date', label: 'Date of Check', type: 'date', required: true },
      { id: 'time', label: 'Time of Check', type: 'time', required: true },
      { id: 'fire_exits_clear', label: 'All fire exits clear and unobstructed?', type: 'yesNo', required: true, failValue: false },
      { id: 'fire_extinguishers_present', label: 'Fire extinguishers present and in date?', type: 'yesNo', required: true, failValue: false },
      { id: 'fire_alarm_tested', label: 'Fire alarm tested and working?', type: 'yesNo', required: true, failValue: false },
      { id: 'emergency_lighting', label: 'Emergency lighting functional?', type: 'yesNo', required: true, failValue: false },
      { id: 'fire_blanket', label: 'Fire blanket accessible and in date?', type: 'yesNo', required: true, failValue: false },
      { id: 'assembly_point_clear', label: 'Assembly point accessible?', type: 'yesNo', required: true, failValue: false },
      { id: 'evacuation_plan_displayed', label: 'Evacuation plan clearly displayed?', type: 'yesNo', required: true, failValue: false },
      { id: 'issues', label: 'Issues Found', type: 'textarea', required: false, placeholder: 'Describe any issues...' },
    ],
  },
  {
    type: 'CLEANING_LOG',
    title: 'Cleaning & Infection Control Log',
    description: 'Record of cleaning activities and infection control measures',
    icon: <SprayCan className="w-5 h-5" />,
    fields: [
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'shift', label: 'Shift', type: 'select', required: true, options: [
        { value: 'morning', label: 'Morning' },
        { value: 'afternoon', label: 'Afternoon' },
        { value: 'evening', label: 'Evening' },
      ]},
      { id: 'areas_cleaned', label: 'Areas Cleaned', type: 'checklist', required: true, checklistItems: [
        'Reception area', 'Treatment room 1', 'Treatment room 2', 'Consultation room',
        'Bathroom/WC', 'Kitchen/Staff area', 'Waiting area', 'Storage room',
      ]},
      { id: 'surfaces_disinfected', label: 'All surfaces disinfected between clients?', type: 'yesNo', required: true, failValue: false },
      { id: 'sharps_disposed', label: 'Sharps bin checked (not more than 2/3 full)?', type: 'yesNo', required: true, failValue: false },
      { id: 'hand_sanitiser_stocked', label: 'Hand sanitiser stations stocked?', type: 'yesNo', required: true, failValue: false },
      { id: 'ppe_available', label: 'PPE supplies adequate?', type: 'yesNo', required: true, failValue: false },
      { id: 'clinical_waste_disposed', label: 'Clinical waste properly segregated and stored?', type: 'yesNo', required: true, failValue: false },
      { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false, placeholder: 'Any additional cleaning notes...' },
    ],
  },
  {
    type: 'STAFF_TRAINING_SIGNOFF',
    title: 'Staff Training Sign-off',
    description: 'Record staff training completion and certification',
    icon: <GraduationCap className="w-5 h-5" />,
    fields: [
      { id: 'training_type', label: 'Training Type', type: 'select', required: true, options: [
        { value: 'fire_safety', label: 'Fire Safety' },
        { value: 'infection_control', label: 'Infection Control' },
        { value: 'cqc_compliance', label: 'CQC Compliance' },
        { value: 'gdpr_data_protection', label: 'GDPR & Data Protection' },
        { value: 'safeguarding', label: 'Safeguarding' },
        { value: 'first_aid', label: 'First Aid' },
        { value: 'manual_handling', label: 'Manual Handling' },
        { value: 'anaphylaxis', label: 'Anaphylaxis Management' },
        { value: 'product_training', label: 'Product Training' },
        { value: 'other', label: 'Other' },
      ]},
      { id: 'training_date', label: 'Training Date', type: 'date', required: true },
      { id: 'expiry_date', label: 'Certification Expiry Date', type: 'date', required: false },
      { id: 'trainer_name', label: 'Trainer/Assessor Name', type: 'text', required: true, placeholder: 'Name of trainer' },
      { id: 'cert_reference', label: 'Certificate Reference', type: 'text', required: false, placeholder: 'Certificate number (if applicable)' },
      { id: 'passed', label: 'Training Passed?', type: 'yesNo', required: true, failValue: false },
      { id: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Any additional notes about the training...' },
    ],
  },
  {
    type: 'EQUIPMENT_CHECK',
    title: 'Equipment Check',
    description: 'Verify all clinical equipment is functional and calibrated',
    icon: <Wrench className="w-5 h-5" />,
    fields: [
      { id: 'date', label: 'Date of Check', type: 'date', required: true },
      { id: 'equipment_name', label: 'Equipment Name', type: 'text', required: true, placeholder: 'e.g., Autoclave, Fridge, Laser' },
      { id: 'serial_number', label: 'Serial Number', type: 'text', required: false },
      { id: 'is_functional', label: 'Equipment functional?', type: 'yesNo', required: true, failValue: false },
      { id: 'calibration_date', label: 'Last Calibration Date', type: 'date', required: false },
      { id: 'next_service_date', label: 'Next Service Date', type: 'date', required: false },
      { id: 'temperature_check', label: 'Temperature Reading (if applicable)', type: 'text', required: false, placeholder: 'e.g., 2-8°C' },
      { id: 'issues', label: 'Issues Found', type: 'textarea', required: false },
    ],
  },
  {
    type: 'INCIDENT_REPORT',
    title: 'Incident Report',
    description: 'Log any incidents, near-misses, or adverse events',
    icon: <AlertTriangle className="w-5 h-5" />,
    fields: [
      { id: 'date', label: 'Date of Incident', type: 'date', required: true },
      { id: 'time', label: 'Time of Incident', type: 'time', required: true },
      { id: 'incident_type', label: 'Incident Type', type: 'select', required: true, options: [
        { value: 'adverse_reaction', label: 'Adverse Reaction' },
        { value: 'near_miss', label: 'Near Miss' },
        { value: 'injury', label: 'Injury' },
        { value: 'equipment_failure', label: 'Equipment Failure' },
        { value: 'complaint', label: 'Complaint' },
        { value: 'data_breach', label: 'Data Breach' },
        { value: 'other', label: 'Other' },
      ]},
      { id: 'description', label: 'Description of Incident', type: 'textarea', required: true, placeholder: 'Provide a detailed account...' },
      { id: 'persons_involved', label: 'Persons Involved', type: 'textarea', required: true, placeholder: 'Names and roles of all involved' },
      { id: 'action_taken', label: 'Immediate Action Taken', type: 'textarea', required: true, placeholder: 'Describe actions taken...' },
      { id: 'requires_followup', label: 'Requires Follow-up?', type: 'yesNo', required: true },
      { id: 'reported_to', label: 'Reported To', type: 'text', required: false, placeholder: 'Name of person reported to' },
    ],
  },
  {
    type: 'WASTE_DISPOSAL_LOG',
    title: 'Waste Disposal Log',
    description: 'Record clinical and hazardous waste disposal',
    icon: <Trash2 className="w-5 h-5" />,
    fields: [
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'waste_type', label: 'Waste Type', type: 'select', required: true, options: [
        { value: 'sharps', label: 'Sharps' },
        { value: 'clinical', label: 'Clinical Waste' },
        { value: 'pharmaceutical', label: 'Pharmaceutical Waste' },
        { value: 'hazardous', label: 'Hazardous Waste' },
        { value: 'general', label: 'General Waste' },
      ]},
      { id: 'container_id', label: 'Container/Bin ID', type: 'text', required: true, placeholder: 'Container reference' },
      { id: 'quantity', label: 'Quantity/Weight', type: 'text', required: true, placeholder: 'e.g., 1 sharps bin, 2kg' },
      { id: 'collection_company', label: 'Collection Company', type: 'text', required: false, placeholder: 'Waste collection provider' },
      { id: 'consignment_note', label: 'Consignment Note Number', type: 'text', required: false },
      { id: 'stored_correctly', label: 'Waste stored correctly before collection?', type: 'yesNo', required: true, failValue: false },
      { id: 'notes', label: 'Notes', type: 'textarea', required: false },
    ],
  },
];

export function getGovernanceFormConfig(type: GovernanceFormType): GovernanceFormConfig | undefined {
  return GOVERNANCE_FORMS.find((f) => f.type === type);
}

export function getAllGovernanceFormConfigs(): GovernanceFormConfig[] {
  return GOVERNANCE_FORMS;
}

// ============================================
// GOVERNANCE FIELD RENDERER
// ============================================

interface FieldProps {
  field: GovernanceField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

function GovernanceFieldRenderer({ field, value, onChange, error }: FieldProps) {
  switch (field.type) {
    case 'text':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <Input
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );

    case 'date':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <Input
            type="date"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );

    case 'time':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <Input
            type="time"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );

    case 'number':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <Input
            type="number"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );

    case 'yesNo': {
      const boolVal = value as boolean | undefined;
      const isNonCompliant = boolVal === field.failValue;

      return (
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange(true)}
                className={cn(
                  'px-4 py-1.5 text-sm rounded-md border transition-colors',
                  boolVal === true ? 'bg-green-100 border-green-300 text-green-700 font-medium' : 'bg-white border-gray-300 text-gray-600'
                )}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onChange(false)}
                className={cn(
                  'px-4 py-1.5 text-sm rounded-md border transition-colors',
                  boolVal === false ? 'bg-red-100 border-red-300 text-red-700 font-medium' : 'bg-white border-gray-300 text-gray-600'
                )}
              >
                No
              </button>
            </div>
          </div>
          {isNonCompliant && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <XCircle className="w-3 h-3" />
              Non-compliant - requires follow-up
            </div>
          )}
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );
    }

    case 'checklist':
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {field.checklistItems?.map((item) => {
              const checked = Array.isArray(value) && (value as string[]).includes(item);
              return (
                <label key={item} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const current = Array.isArray(value) ? (value as string[]) : [];
                      onChange(e.target.checked ? [...current, item] : current.filter((v) => v !== item));
                    }}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              );
            })}
          </div>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      );

    default:
      return null;
  }
}

// ============================================
// GOVERNANCE FORM RENDERER
// ============================================

interface GovernanceFormRendererProps {
  formType: GovernanceFormType;
  brand: Brand;
  onSubmit: (data: { formType: GovernanceFormType; data: Record<string, unknown>; signatureData: string; isCompliant: boolean; issues: string[] }) => Promise<void>;
  onCancel: () => void;
}

export function GovernanceFormRenderer({ formType, brand, onSubmit, onCancel }: GovernanceFormRendererProps) {
  const config = getGovernanceFormConfig(formType);
  const theme = getBrandTheme(brand);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!config) return <p className="text-red-600">Unknown form type: {formType}</p>;

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of config.fields) {
      if (field.required) {
        const val = formData[field.id];
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          newErrors[field.id] = `${field.label} is required.`;
        }
      }
    }
    if (!signatureData) {
      newErrors['signature'] = 'Signature is required to complete this form.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    // Determine compliance
    const issues: string[] = [];
    for (const field of config.fields) {
      if (field.failValue !== undefined && formData[field.id] === field.failValue) {
        issues.push(`${field.label}: Non-compliant`);
      }
    }

    try {
      await onSubmit({
        formType,
        data: formData,
        signatureData: signatureData!,
        isCompliant: issues.length === 0,
        issues,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2" style={{ borderColor: theme.primary }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme.primary }}>
          {config.icon}
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>{config.title}</h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>{config.description}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5 mb-6">
        {config.fields.map((field) => (
          <GovernanceFieldRenderer
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(val) => handleFieldChange(field.id, val)}
            error={errors[field.id]}
          />
        ))}

        {/* Signature */}
        <div className="pt-4 border-t">
          <SignaturePad
            value={signatureData || undefined}
            onChange={setSignatureData}
            label="Completed By (Signature)"
            declaration="I confirm that this check has been completed accurately."
            required
            error={errors['signature']}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="text-white"
          style={{ backgroundColor: theme.primary }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit & Sign'}
          <ClipboardCheck className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

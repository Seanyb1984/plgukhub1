import { z } from 'zod';

// ============================================
// BRAND TYPES
// ============================================

export type Brand = 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK';

export const BRANDS: Brand[] = ['MENHANCEMENTS', 'WAX_FOR_MEN', 'WAX_FOR_WOMEN', 'PLG_UK'];

export const BRAND_LABELS: Record<Brand, string> = {
  MENHANCEMENTS: 'Menhancements',
  WAX_FOR_MEN: 'Wax for Men',
  WAX_FOR_WOMEN: 'Wax for Women',
  PLG_UK: 'PLG UK',
};

// ============================================
// FIELD TYPES
// ============================================

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'signature'
  | 'file'
  | 'heading'
  | 'paragraph'
  | 'divider'
  | 'address'
  | 'rating'
  | 'nps'
  | 'yesNo'
  | 'yesNoNa'
  | 'medicationList'
  | 'allergyList';

// ============================================
// CONDITION TYPES
// ============================================

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'includes'
  | 'notIncludes';

export interface FieldCondition {
  field: string;
  operator: ConditionOperator;
  value?: string | number | boolean | string[];
}

export interface ConditionalLogic {
  action: 'show' | 'hide' | 'require' | 'disable';
  conditions: FieldCondition[];
  logicType: 'and' | 'or';
}

// ============================================
// STOP/ESCALATE LOGIC
// ============================================

export type StopAction = 'stop' | 'escalate' | 'warn' | 'flag';

export interface StopCondition {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean | string[];
  action: StopAction;
  message: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// ============================================
// FIELD OPTIONS
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  triggersStop?: StopCondition;
}

// ============================================
// VALIDATION
// ============================================

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
  customValidation?: string; // Function name for custom validation
}

// ============================================
// FIELD DEFINITION
// ============================================

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  validation?: FieldValidation;
  options?: SelectOption[];
  conditionalLogic?: ConditionalLogic;
  stopConditions?: StopCondition[];

  // UI options
  width?: 'full' | 'half' | 'third' | 'quarter';
  className?: string;
  helpText?: string;

  // For heading/paragraph
  content?: string;
  headingLevel?: 1 | 2 | 3 | 4;

  // For file uploads
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes

  // For signature
  signatureHeight?: number;

  // For rating/NPS
  maxRating?: number;
  lowLabel?: string;
  highLabel?: string;
}

// ============================================
// SECTION DEFINITION
// ============================================

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditionalLogic?: ConditionalLogic;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// ============================================
// FORM DEFINITION
// ============================================

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  version: string;
  brand: Brand | Brand[] | 'ALL';
  category: string;

  // Form structure
  sections: FormSection[];

  // Signature requirements
  requiresSignature: boolean;
  signatureLabel?: string;
  signatureDeclaration?: string;

  // Submission settings
  allowDraft: boolean;
  allowResume: boolean;

  // Client association
  requiresClient: boolean;

  // Data retention
  retentionDays?: number;

  // PDF settings
  generatePdf: boolean;
  pdfTemplate?: string;

  // Risk assessment
  hasStopLogic: boolean;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// FORM DATA TYPES
// ============================================

export type FormData = Record<string, unknown>;

export interface FormSubmissionData {
  formType: string;
  formVersion: string;
  brand: Brand;
  siteId: string;
  clientId?: string;
  appointmentId?: string;
  data: FormData;
  signatureData?: string;
  signedByName?: string;
}

// ============================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================

export const BrandSchema = z.enum(['MENHANCEMENTS', 'WAX_FOR_MEN', 'WAX_FOR_WOMEN', 'PLG_UK']);

export const SubmissionStatusSchema = z.enum(['DRAFT', 'SUBMITTED', 'SIGNED', 'LOCKED', 'AMENDED']);

export const RiskLevelSchema = z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const FormSubmissionSchema = z.object({
  formType: z.string().min(1),
  formVersion: z.string().default('1.0'),
  brand: BrandSchema,
  siteId: z.string().min(1),
  clientId: z.string().optional(),
  appointmentId: z.string().optional(),
  data: z.record(z.unknown()),
  signatureData: z.string().optional(),
  signedByName: z.string().optional(),
});

// ============================================
// UTILITY TYPES
// ============================================

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  stopConditions: StopCondition[];
}

export interface FormContext {
  brand: Brand;
  siteId: string;
  clientId?: string;
  userId?: string;
  isReadOnly: boolean;
  isDraft: boolean;
}

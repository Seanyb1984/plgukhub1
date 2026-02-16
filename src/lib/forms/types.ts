export type FieldType = 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'signature' | 'header' | 'section';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; 
  placeholder?: string;
  condition?: (data: any) => boolean; 
  stopCondition?: (value: any) => { message: string; action: 'stop' | 'escalate'; riskLevel: 'MEDIUM' | 'HIGH' | 'CRITICAL' } | null;
}

export interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  version: string;
  requiresSignature: boolean;
  fields: FormField[];
}

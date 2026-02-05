import { z } from 'zod';
import {
  FormDefinition,
  FormField,
  FormSection,
  FormData,
  FieldCondition,
  ConditionalLogic,
  StopCondition,
  FormValidationResult,
} from './types';

// ============================================
// CONDITION EVALUATION
// ============================================

export function evaluateCondition(
  condition: FieldCondition,
  data: FormData
): boolean {
  const fieldValue = data[condition.field];

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;

    case 'notEquals':
      return fieldValue !== condition.value;

    case 'contains':
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(String(condition.value).toLowerCase());
      }
      return false;

    case 'notContains':
      if (typeof fieldValue === 'string') {
        return !fieldValue.toLowerCase().includes(String(condition.value).toLowerCase());
      }
      return true;

    case 'greaterThan':
      return Number(fieldValue) > Number(condition.value);

    case 'lessThan':
      return Number(fieldValue) < Number(condition.value);

    case 'greaterThanOrEqual':
      return Number(fieldValue) >= Number(condition.value);

    case 'lessThanOrEqual':
      return Number(fieldValue) <= Number(condition.value);

    case 'isEmpty':
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    case 'isNotEmpty':
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== '' &&
        (!Array.isArray(fieldValue) || fieldValue.length > 0)
      );

    case 'includes':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value);
      }
      return false;

    case 'notIncludes':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(condition.value);
      }
      return true;

    default:
      return false;
  }
}

export function evaluateConditionalLogic(
  logic: ConditionalLogic,
  data: FormData
): boolean {
  const results = logic.conditions.map((condition) =>
    evaluateCondition(condition, data)
  );

  if (logic.logicType === 'and') {
    return results.every((result) => result);
  }
  return results.some((result) => result);
}

// ============================================
// FIELD VISIBILITY
// ============================================

export function isFieldVisible(field: FormField, data: FormData): boolean {
  if (!field.conditionalLogic) {
    return true;
  }

  const shouldShow = evaluateConditionalLogic(field.conditionalLogic, data);

  if (field.conditionalLogic.action === 'show') {
    return shouldShow;
  }
  if (field.conditionalLogic.action === 'hide') {
    return !shouldShow;
  }

  return true;
}

export function isSectionVisible(section: FormSection, data: FormData): boolean {
  if (!section.conditionalLogic) {
    return true;
  }

  const shouldShow = evaluateConditionalLogic(section.conditionalLogic, data);

  if (section.conditionalLogic.action === 'show') {
    return shouldShow;
  }
  if (section.conditionalLogic.action === 'hide') {
    return !shouldShow;
  }

  return true;
}

// ============================================
// FIELD VALIDATION
// ============================================

export function createFieldSchema(field: FormField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'phone':
      schema = z.string();
      if (field.validation?.minLength) {
        schema = (schema as z.ZodString).min(field.validation.minLength);
      }
      if (field.validation?.maxLength) {
        schema = (schema as z.ZodString).max(field.validation.maxLength);
      }
      if (field.validation?.pattern) {
        schema = (schema as z.ZodString).regex(
          new RegExp(field.validation.pattern),
          field.validation.patternMessage || 'Invalid format'
        );
      }
      break;

    case 'email':
      schema = z.string().email('Please enter a valid email address');
      break;

    case 'number':
    case 'rating':
    case 'nps':
      schema = z.number();
      if (field.validation?.min !== undefined) {
        schema = (schema as z.ZodNumber).min(field.validation.min);
      }
      if (field.validation?.max !== undefined) {
        schema = (schema as z.ZodNumber).max(field.validation.max);
      }
      break;

    case 'date':
    case 'time':
    case 'datetime':
      schema = z.string();
      break;

    case 'select':
    case 'radio':
      if (field.options?.length) {
        const values = field.options.map((opt) => opt.value);
        schema = z.enum(values as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;

    case 'multiselect':
    case 'checkboxGroup':
      schema = z.array(z.string());
      break;

    case 'checkbox':
    case 'yesNo':
      schema = z.boolean();
      break;

    case 'yesNoNa':
      schema = z.enum(['yes', 'no', 'na']);
      break;

    case 'signature':
      schema = z.string().min(1, 'Signature is required');
      break;

    case 'file':
      schema = z.string(); // File path or URL
      break;

    case 'address':
      schema = z.object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
      });
      break;

    case 'medicationList':
    case 'allergyList':
      schema = z.array(
        z.object({
          name: z.string(),
          details: z.string().optional(),
        })
      );
      break;

    case 'heading':
    case 'paragraph':
    case 'divider':
      // No validation for display-only fields
      schema = z.any();
      break;

    default:
      schema = z.any();
  }

  // Apply required/optional
  if (!field.validation?.required) {
    schema = schema.optional().nullable();
  }

  return schema;
}

// ============================================
// STOP CONDITION EVALUATION
// ============================================

export function evaluateStopConditions(
  form: FormDefinition,
  data: FormData
): StopCondition[] {
  const triggeredConditions: StopCondition[] = [];

  for (const section of form.sections) {
    for (const field of section.fields) {
      // Check field-level stop conditions
      if (field.stopConditions) {
        for (const stopCondition of field.stopConditions) {
          if (evaluateCondition(stopCondition, data)) {
            triggeredConditions.push(stopCondition);
          }
        }
      }

      // Check option-level stop conditions
      if (field.options) {
        for (const option of field.options) {
          if (option.triggersStop) {
            const fieldValue = data[field.id];
            if (
              fieldValue === option.value ||
              (Array.isArray(fieldValue) && fieldValue.includes(option.value))
            ) {
              triggeredConditions.push(option.triggersStop);
            }
          }
        }
      }
    }
  }

  return triggeredConditions;
}

// ============================================
// FULL FORM VALIDATION
// ============================================

export function validateForm(
  form: FormDefinition,
  data: FormData,
  isDraft: boolean = false
): FormValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Skip validation for drafts (except stop conditions)
  if (!isDraft) {
    for (const section of form.sections) {
      // Skip hidden sections
      if (!isSectionVisible(section, data)) {
        continue;
      }

      for (const field of section.fields) {
        // Skip hidden fields
        if (!isFieldVisible(field, data)) {
          continue;
        }

        // Skip display-only fields
        if (['heading', 'paragraph', 'divider'].includes(field.type)) {
          continue;
        }

        const fieldSchema = createFieldSchema(field);
        const result = fieldSchema.safeParse(data[field.id]);

        if (!result.success) {
          errors[field.id] = result.error.errors[0]?.message || 'Invalid value';
        }
      }
    }

    // Validate signature if required
    if (form.requiresSignature && !data.signature) {
      errors.signature = 'Signature is required';
    }
  }

  // Evaluate stop conditions (always, even for drafts)
  const stopConditions = evaluateStopConditions(form, data);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    stopConditions,
  };
}

// ============================================
// FIELD HELPERS
// ============================================

export function getVisibleFields(
  form: FormDefinition,
  data: FormData
): FormField[] {
  const visibleFields: FormField[] = [];

  for (const section of form.sections) {
    if (!isSectionVisible(section, data)) {
      continue;
    }

    for (const field of section.fields) {
      if (isFieldVisible(field, data)) {
        visibleFields.push(field);
      }
    }
  }

  return visibleFields;
}

export function getRequiredFields(
  form: FormDefinition,
  data: FormData
): FormField[] {
  return getVisibleFields(form, data).filter(
    (field) =>
      field.validation?.required &&
      !['heading', 'paragraph', 'divider'].includes(field.type)
  );
}

export function getCompletionPercentage(
  form: FormDefinition,
  data: FormData
): number {
  const requiredFields = getRequiredFields(form, data);
  if (requiredFields.length === 0) return 100;

  const completedFields = requiredFields.filter((field) => {
    const value = data[field.id];
    return (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (!Array.isArray(value) || value.length > 0)
    );
  });

  return Math.round((completedFields.length / requiredFields.length) * 100);
}

# Adding New Forms

This guide explains how to add new form definitions to the PLG UK Hub platform.

## Overview

Forms are defined as TypeScript objects that describe:
- Form metadata (name, brand, category)
- Sections and fields
- Validation rules
- Conditional logic
- Stop/escalation conditions
- Signature requirements

## Quick Start

### 1. Create a Form Definition

Create or edit a file in `src/lib/forms/definitions/`:

```typescript
import { FormDefinition } from '../types';

export const myNewForm: FormDefinition = {
  id: 'my_new_form',                    // Unique identifier (snake_case)
  name: 'My New Form',                   // Display name
  description: 'Description of the form',
  version: '1.0',
  brand: 'MENHANCEMENTS',               // Or 'ALL', or array ['MENHANCEMENTS', 'WAX_FOR_MEN']
  category: 'Clinical Records',          // For grouping in UI

  requiresSignature: true,
  signatureLabel: 'Patient',
  signatureDeclaration: 'I confirm this is accurate.',

  allowDraft: true,
  allowResume: true,
  requiresClient: true,
  generatePdf: true,
  hasStopLogic: false,
  retentionDays: 3650,                  // 10 years

  sections: [
    {
      id: 'section_1',
      title: 'Section Title',
      description: 'Optional section description',
      fields: [
        // ... field definitions
      ],
    },
  ],
};
```

### 2. Register the Form

Add your form to the exports in the appropriate definitions file:

```typescript
// In src/lib/forms/definitions/menhancements.ts
export const menhancementsForms: FormDefinition[] = [
  // ... existing forms
  myNewForm,
];
```

### 3. Add Data Retention Policy (Optional)

Add to the seed script or via admin:

```typescript
prisma.dataRetentionPolicy.create({
  data: {
    formType: 'my_new_form',
    retentionDays: 3650,
    description: 'Retained for 10 years per policy',
  },
});
```

## Field Types

### Text Fields

```typescript
{
  id: 'field_name',
  type: 'text',           // or 'textarea', 'email', 'phone'
  label: 'Field Label',
  placeholder: 'Enter value...',
  helpText: 'Additional instructions',
  validation: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: '^[A-Za-z]+$',
    patternMessage: 'Letters only',
  },
  width: 'half',          // 'full', 'half', 'third', 'quarter'
}
```

### Number Fields

```typescript
{
  id: 'age',
  type: 'number',
  label: 'Age',
  validation: {
    required: true,
    min: 0,
    max: 120,
  },
}
```

### Date/Time Fields

```typescript
{
  id: 'appointment_date',
  type: 'date',           // or 'time', 'datetime'
  label: 'Appointment Date',
  validation: { required: true },
}
```

### Selection Fields

```typescript
// Single select dropdown
{
  id: 'status',
  type: 'select',
  label: 'Status',
  options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  validation: { required: true },
}

// Radio buttons
{
  id: 'gender',
  type: 'radio',
  label: 'Gender',
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ],
}

// Multiple select / Checkboxes
{
  id: 'symptoms',
  type: 'checkboxGroup',
  label: 'Symptoms',
  options: [
    { value: 'headache', label: 'Headache' },
    { value: 'nausea', label: 'Nausea' },
    { value: 'fatigue', label: 'Fatigue' },
  ],
}
```

### Yes/No Fields

```typescript
{
  id: 'has_allergies',
  type: 'yesNo',
  label: 'Do you have any allergies?',
  validation: { required: true },
}

{
  id: 'completed',
  type: 'yesNoNa',        // Yes, No, or N/A
  label: 'Task completed?',
}
```

### Special Fields

```typescript
// Signature
{
  id: 'signature',
  type: 'signature',
  label: 'Please sign below',
  signatureHeight: 200,
}

// Rating (1-5 stars)
{
  id: 'satisfaction',
  type: 'rating',
  label: 'Overall satisfaction',
  maxRating: 5,
}

// NPS (0-10)
{
  id: 'nps_score',
  type: 'nps',
  label: 'How likely to recommend?',
  lowLabel: 'Not at all likely',
  highLabel: 'Extremely likely',
}

// File upload
{
  id: 'document',
  type: 'file',
  label: 'Upload document',
  acceptedFileTypes: ['application/pdf', 'image/*'],
  maxFileSize: 10485760,  // 10MB
}

// Medication list
{
  id: 'medications',
  type: 'medicationList',
  label: 'Current medications',
}

// Allergy list
{
  id: 'allergies',
  type: 'allergyList',
  label: 'Known allergies',
}
```

### Display Fields

```typescript
// Heading
{
  id: 'section_heading',
  type: 'heading',
  label: 'Important Information',
  headingLevel: 2,
}

// Paragraph
{
  id: 'info_text',
  type: 'paragraph',
  label: '',
  content: 'Please read the following carefully...',
}

// Divider
{
  id: 'divider_1',
  type: 'divider',
  label: '',
}
```

## Conditional Logic

Show/hide fields based on other answers:

```typescript
{
  id: 'allergy_details',
  type: 'textarea',
  label: 'Please describe your allergies',
  conditionalLogic: {
    action: 'show',                      // or 'hide', 'require', 'disable'
    conditions: [
      {
        field: 'has_allergies',
        operator: 'equals',
        value: true,
      },
    ],
    logicType: 'and',                    // or 'or'
  },
}
```

### Operators

- `equals` / `notEquals`
- `contains` / `notContains`
- `greaterThan` / `lessThan`
- `greaterThanOrEqual` / `lessThanOrEqual`
- `isEmpty` / `isNotEmpty`
- `includes` / `notIncludes` (for arrays)

## Stop/Escalation Logic

Add conditions that trigger warnings or stop form submission:

### Field-Level Stop Conditions

```typescript
{
  id: 'pregnant',
  type: 'yesNo',
  label: 'Are you pregnant?',
  validation: { required: true },
  stopConditions: [
    {
      field: 'pregnant',
      operator: 'equals',
      value: true,
      action: 'stop',                    // 'stop', 'escalate', 'warn', 'flag'
      message: 'STOP: Treatment is contraindicated during pregnancy.',
      riskLevel: 'HIGH',                 // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    },
  ],
}
```

### Option-Level Triggers

```typescript
{
  id: 'incident_type',
  type: 'select',
  label: 'Type of Incident',
  options: [
    { value: 'minor', label: 'Minor' },
    {
      value: 'riddor',
      label: 'RIDDOR Reportable',
      triggersStop: {
        field: 'incident_type',
        operator: 'equals',
        value: 'riddor',
        action: 'escalate',
        message: 'RIDDOR reportable - requires immediate notification',
        riskLevel: 'CRITICAL',
      },
    },
  ],
}
```

### Stop Actions

| Action | Behavior |
|--------|----------|
| `stop` | Prevents form submission, shows error |
| `escalate` | Flags for senior review, allows submission |
| `warn` | Shows warning, allows submission |
| `flag` | Silently flags submission, no user message |

## Section Conditional Logic

Hide entire sections based on conditions:

```typescript
{
  id: 'pregnancy_section',
  title: 'Pregnancy Information',
  conditionalLogic: {
    action: 'show',
    conditions: [
      { field: 'gender', operator: 'equals', value: 'female' },
    ],
    logicType: 'and',
  },
  fields: [
    // ... fields
  ],
}
```

## Best Practices

### Naming Conventions

- Form IDs: `brand_form_name` (e.g., `menh_patient_registration`)
- Field IDs: `snake_case` (e.g., `date_of_birth`)
- Section IDs: `descriptive_name` (e.g., `personal_details`)

### Field Labels

- Use clear, professional language
- Avoid jargon where possible
- For clinical forms, use proper medical terminology
- For intimate procedures, use respectful, consent-forward language

### Validation

- Always require essential fields
- Use appropriate field types (email for email, phone for phone)
- Set sensible min/max lengths
- Provide helpful error messages

### Conditional Logic

- Test all condition paths
- Consider mobile users (don't hide too many fields)
- Document complex logic

### Stop Conditions

- Use sparingly - only for genuine safety concerns
- Provide clear, actionable messages
- Consider who sees the message (staff vs patient)

## Testing Your Form

1. Start the dev server: `npm run dev`
2. Log in as a practitioner
3. Navigate to Forms > New Form
4. Select your form from the list
5. Test all fields, conditions, and validations
6. Submit and verify the data is stored correctly

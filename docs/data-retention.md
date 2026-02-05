# Data Retention Policies

## Overview

PLG UK Hub implements configurable data retention policies to ensure compliance with:
- GDPR (General Data Protection Regulation)
- NHS Records Management Code
- Industry best practices

## Default Retention Periods

| Form Category | Retention Period | Rationale |
|---------------|------------------|-----------|
| Patient Registration | 10 years | Medical records guideline |
| Clinical Records | 10 years | Medical records guideline |
| Consent Forms | 10 years | Legal requirement |
| Treatment Notes | 7 years | Standard business records |
| Incident Reports | 10 years | Legal/insurance purposes |
| Safeguarding Records | 25 years | Child protection guidelines |
| Complaints | 7 years | Business records |
| Financial Records | 7 years | HMRC requirements |
| Operational Checklists | 1 year | Operational purposes |
| Feedback Forms | 3 years | Business analysis |

## Form-Specific Retention

### Clinical Forms (Menhancements)

| Form | Retention | Notes |
|------|-----------|-------|
| Patient Registration | 10 years | From last contact |
| Medical History | 10 years | Update, don't delete |
| Consultation Notes | 10 years | From date of consultation |
| Consent Forms | 10 years | From date of procedure |
| Procedure Records | 10 years | Equipment batch numbers for recalls |
| Adverse Event Reports | 10 years | May need for MHRA reporting |

### Waxing Forms (Wax for Men/Women)

| Form | Retention | Notes |
|------|-----------|-------|
| Client Intake | 7 years | From last visit |
| Contraindications | 7 years | Update on each visit |
| Treatment Notes | 7 years | From date of treatment |
| Skin Reaction Records | 10 years | For liability purposes |
| Consent Forms | 7 years | From date signed |

### Operations Forms (PLG UK)

| Form | Retention | Notes |
|------|-----------|-------|
| Daily Checklists | 1 year | Rolling archive |
| Cleaning Logs | 1 year | Health & Safety compliance |
| Equipment Maintenance | 10 years | Asset lifecycle |
| Fire Safety Checks | 10 years | Insurance/compliance |
| Incident/Near Miss | 10 years | Legal requirements |
| Safeguarding | 25 years | Statutory requirement |

### HR Forms

| Form | Retention | Notes |
|------|-----------|-------|
| Onboarding | 6 years after leaving | HMRC requirement |
| Training Records | 6 years after leaving | CPD evidence |
| Access Requests | 3 years | Audit trail |

### Finance Forms

| Form | Retention | Notes |
|------|-----------|-------|
| Refund Requests | 7 years | Tax records |
| Expense Claims | 7 years | HMRC requirement |
| Purchase Requests | 7 years | Tax records |

## Configuration

### Database Configuration

Retention policies are stored in the `DataRetentionPolicy` table:

```sql
SELECT * FROM "DataRetentionPolicy";
```

### Adding/Modifying Policies

Via Prisma:

```typescript
await prisma.dataRetentionPolicy.upsert({
  where: { formType: 'my_form_type' },
  update: { retentionDays: 3650 },
  create: {
    formType: 'my_form_type',
    retentionDays: 3650,
    description: 'Retained for 10 years per policy',
  },
});
```

### Form Definition

Forms can specify retention in their definition:

```typescript
const myForm: FormDefinition = {
  // ...
  retentionDays: 3650, // 10 years
  // ...
};
```

## Retention Process

### Automated Deletion (Future Feature)

A scheduled job will:
1. Identify records past retention date
2. Archive to cold storage (if required)
3. Delete from active database
4. Create audit log entry

### Manual Review

For critical records (safeguarding, legal holds):
- Automated deletion is paused
- Manual review required
- Senior approval needed for deletion

## Subject Access Requests (SAR)

Under GDPR, individuals can request their data:

1. **Request Received** - Log via SAR form
2. **Identity Verified** - Check ID before processing
3. **Data Gathered** - Export all related records
4. **Review** - Check for exemptions
5. **Deliver** - Provide within 30 days

### SAR Export Function

```typescript
import { exportClientDataForSAR } from '@/lib/exports/csv';

const { client, submissions } = await exportClientDataForSAR(
  'client@email.com',
  '07700900000'
);
```

## Right to Erasure

Clients can request data deletion, subject to:

### Cannot Delete

- Active legal proceedings
- Regulatory compliance requirements
- Unexpired retention period
- Public health purposes

### Can Delete

- Marketing preferences
- Non-essential personal data
- Data past retention period

### Process

1. Verify identity
2. Check legal holds
3. Delete or anonymize data
4. Document in audit log

## Audit Trail

All retention actions are logged:

```typescript
// Audit log entry
{
  action: 'DELETE',
  reason: 'Retention period expired',
  approvedBy: 'admin@plguk.co.uk',
  timestamp: '2024-01-15T10:30:00Z',
}
```

## Compliance Checks

### Monthly Review

- Run retention report
- Identify records approaching retention end
- Flag any unusual patterns

### Annual Audit

- Review retention policies
- Update for regulatory changes
- Test SAR export process
- Verify audit trail integrity

## Emergency Data Hold

For litigation or regulatory investigation:

1. Identify affected records
2. Apply legal hold flag
3. Suspend automatic deletion
4. Document hold details
5. Remove hold when resolved

## Contact

For data protection queries:
- Data Protection Officer: dpo@plguk.co.uk
- Compliance queries: compliance@plguk.co.uk

# Roles and Permissions

## Overview

PLG UK Hub implements role-based access control (RBAC) with three primary roles:

- **ADMIN** - Full system access
- **PRACTITIONER** - Clinical/treatment access
- **RECEPTION** - Front desk operations

## Role Definitions

### ADMIN

Full access to all system features within their brand scope.

**Capabilities:**
- View and manage all submissions
- Create, edit, and delete users
- Export data (CSV, PDF)
- Process SAR requests
- Access audit logs
- Configure system settings
- View all brands (if PLG_UK admin)

**Use Cases:**
- Clinic managers
- Operations directors
- Data protection officers
- IT administrators

### PRACTITIONER

Clinical staff with patient/client interaction.

**Capabilities:**
- View submissions for their site
- Create new submissions
- Sign off on treatments
- View their own audit trail
- Access clinical forms
- Create amendments (with reason)

**Cannot:**
- Delete submissions
- Export bulk data
- Manage users
- Process SAR requests

**Use Cases:**
- Doctors
- Nurses
- Therapists
- Treatment specialists

### RECEPTION

Front desk and administrative staff.

**Capabilities:**
- Create new client records
- Start new form submissions
- View non-clinical submissions
- Search clients
- View appointment-related forms

**Cannot:**
- Sign clinical forms
- View full medical history
- Export data
- Access clinical notes (practitioner-only)

**Use Cases:**
- Receptionists
- Administrative assistants
- Booking coordinators

## Brand Scoping

### Multi-Brand Access

Users are assigned to a single brand:
- MENHANCEMENTS
- WAX_FOR_MEN
- WAX_FOR_WOMEN
- PLG_UK

### PLG_UK Special Access

PLG_UK brand users (typically head office) can:
- View submissions across all brands
- Access group-level reports
- Process cross-brand SAR requests
- Manage operational forms for all sites

### Site Scoping

Within their brand, users are assigned to a specific site:
- Data access is limited to their site by default
- ADMIN users can view all sites in their brand
- PLG_UK ADMINs can view all sites across all brands

## Permission Matrix

| Action | ADMIN | PRACTITIONER | RECEPTION |
|--------|-------|--------------|-----------|
| View submissions (own site) | ✅ | ✅ | ✅ |
| View submissions (all sites) | ✅ | ❌ | ❌ |
| Create submissions | ✅ | ✅ | ✅ |
| Sign clinical forms | ✅ | ✅ | ❌ |
| Create amendments | ✅ | ✅ | ❌ |
| View audit logs | ✅ | Own only | ❌ |
| Export CSV | ✅ | ❌ | ❌ |
| Export PDF | ✅ | ✅ | ✅ |
| Process SAR | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| View other brands | PLG_UK only | ❌ | ❌ |

## Form Access

### By Role

| Form Category | ADMIN | PRACTITIONER | RECEPTION |
|---------------|-------|--------------|-----------|
| Patient Registration | ✅ | ✅ | ✅ |
| Medical History | ✅ | ✅ | ❌ |
| Consultation Notes | ✅ | ✅ | ❌ |
| Consent Forms | ✅ | ✅ | ✅ (view only) |
| Procedure Records | ✅ | ✅ | ❌ |
| Treatment Notes | ✅ | ✅ | ❌ |
| Complaints | ✅ | ✅ | ✅ |
| Incidents | ✅ | ✅ | ✅ |
| Operational Checklists | ✅ | ✅ | ✅ |
| Finance Forms | ✅ | ❌ | ❌ |
| HR Forms | ✅ | ❌ | ❌ |
| IT Forms | ✅ | ✅ | ✅ |

### By Brand

| Form | MENHANCEMENTS | WAX_FOR_MEN | WAX_FOR_WOMEN | PLG_UK |
|------|---------------|-------------|---------------|--------|
| Patient Registration | ✅ | ❌ | ❌ | ❌ |
| Medical History | ✅ | ❌ | ❌ | ❌ |
| Clinical Consent | ✅ | ❌ | ❌ | ❌ |
| Waxing Intake | ❌ | ✅ | ✅ | ❌ |
| Waxing Contraindications | ❌ | ✅ | ✅ | ❌ |
| Intimate Waxing Consent | ❌ | ✅ | ✅ | ❌ |
| Pregnancy Considerations | ❌ | ❌ | ✅ | ❌ |
| Complaints | ✅ | ✅ | ✅ | ✅ |
| Incidents | ✅ | ✅ | ✅ | ✅ |
| Safeguarding | ✅ | ✅ | ✅ | ✅ |
| Operations Forms | ✅ | ✅ | ✅ | ✅ |
| HR Forms | ❌ | ❌ | ❌ | ✅ |
| Finance Forms | ❌ | ❌ | ❌ | ✅ |

## Implementation

### Checking Permissions

```typescript
import { auth, canAccessBrand, canExportData } from '@/lib/auth';

const session = await auth();

// Check brand access
if (canAccessBrand(session.user.brand, targetBrand)) {
  // Allow access
}

// Check export permission
if (canExportData(session.user.role)) {
  // Show export button
}
```

### Route Protection

```typescript
// In page component
export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  // Page content
}
```

### API Route Protection

```typescript
// In API route
export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Handle request
}
```

## User Management

### Creating Users

Only ADMIN users can create new users:

```typescript
// Via Prisma
await prisma.user.create({
  data: {
    email: 'new.user@example.com',
    name: 'New User',
    passwordHash: await hash('temporaryPassword', 12),
    role: 'PRACTITIONER',
    brand: 'MENHANCEMENTS',
    siteId: 'site-id-here',
  },
});
```

### Password Reset

1. ADMIN generates reset link
2. User receives email
3. User sets new password
4. Old sessions invalidated

### Deactivating Users

Users are soft-deleted (deactivated, not removed):

```typescript
await prisma.user.update({
  where: { id: userId },
  data: { isActive: false },
});
```

Deactivated users:
- Cannot log in
- Retain audit trail
- Can be reactivated

## Audit Trail

All permission-relevant actions are logged:

- Login attempts (success/failure)
- Role changes
- Data exports
- Sensitive form access
- Amendment creations

```typescript
// Example audit entry
{
  action: 'EXPORT',
  userId: 'user-id',
  timestamp: '2024-01-15T10:30:00Z',
  details: {
    exportType: 'CSV',
    recordCount: 150,
    filters: { brand: 'MENHANCEMENTS', dateRange: '2024-01' },
  },
}
```

## Best Practices

### Principle of Least Privilege

- Assign minimum required role
- Use RECEPTION for non-clinical staff
- Reserve ADMIN for management only

### Regular Reviews

- Monthly: Review user access
- Quarterly: Audit role assignments
- Annually: Review role definitions

### Off-boarding

When staff leave:
1. Deactivate account immediately
2. Review recent activity
3. Transfer ownership of drafts
4. Retain for audit purposes

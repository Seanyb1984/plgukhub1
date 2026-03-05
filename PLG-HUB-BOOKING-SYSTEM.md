# PLG Hub - Booking System Build Guide

## Context

PLG Hub v1 already exists as a Next.js application with compliance and consent form functionality built. This guide adds a native booking engine to the existing app. No third-party booking platforms (Fresha or otherwise) - everything lives within PLG Hub.

Before starting any phase, Claude Code should examine the existing codebase to understand:
- Current Prisma schema (what models already exist)
- Current auth setup (NextAuth config, user model, session structure)
- Current folder structure under src/app/
- Existing UI component library (shadcn/ui components already installed, Tailwind config)
- Existing layout and navigation structure
- Any existing Organisation, Brand, Location, User, Treatment, or Client models

Do not recreate models that already exist. Extend or modify them where needed.

---

## Tech Stack (use what v1 already has, add only what's missing)

Check for and install only what's missing:

| Need | Package | Check first |
|---|---|---|
| Date handling | `date-fns` | May already be installed |
| Calendar UI | `@dnd-kit/core`, `@dnd-kit/sortable` | For drag interactions on calendar |
| Form handling | `react-hook-form`, `@hookform/resolvers`, `zod` | Likely already in place from consent forms |
| Job queue | `bullmq` | New - for scheduling SMS/email sends |
| SMS | `twilio` | New |
| Email | `resend` | New - or check if another email service is already configured |
| Payments | `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js` | May already be partially set up |
| Icons | `lucide-react` | Likely already installed |

---

## Database Schema Additions

These models need to be added to the existing Prisma schema. If any similar models already exist (Client, Treatment, User, Location, etc.), extend them rather than creating duplicates.

### New models for the booking system

```prisma
// ============================================
// SCHEDULING MODELS
// ============================================

// Staff working hours template
// Skip if something similar already exists
model StaffSchedule {
  id            String   @id @default(cuid())
  userId        String
  dayOfWeek     Int      // 0 = Monday, 6 = Sunday
  startTime     String   // "09:00"
  endTime       String   // "18:00"
  locationId    String?
  isAvailable   Boolean  @default(true)

  user          User     @relation(fields: [userId], references: [id])
  location      Location? @relation(fields: [locationId], references: [id])

  @@unique([userId, dayOfWeek, locationId])
}

// Staff schedule overrides (holidays, sick days, one-off changes)
model ScheduleOverride {
  id            String   @id @default(cuid())
  userId        String
  date          DateTime @db.Date
  isAvailable   Boolean  @default(false) // false = day off
  startTime     String?  // custom hours if available
  endTime       String?
  reason        String?  // "Annual leave", "Training day"

  user          User     @relation(fields: [userId], references: [id])

  @@unique([userId, date])
}

// Room (treatment room at a location)
// Skip if already exists
model Room {
  id            String       @id @default(cuid())
  locationId    String
  name          String       // "Room 1", "Treatment Suite"
  isActive      Boolean      @default(true)

  location      Location     @relation(fields: [locationId], references: [id])
  appointments  Appointment[]
}

// The core appointment model
model Appointment {
  id            String            @id @default(cuid())
  orgId         String
  locationId    String
  clientId      String
  userId        String            // practitioner
  treatmentId   String
  roomId        String?
  startTime     DateTime
  endTime       DateTime
  status        AppointmentStatus @default(BOOKED)
  notes         String?
  source        BookingSource     @default(RECEPTION)
  depositAmount Int?              // pence, if deposit taken
  depositPaid   Boolean           @default(false)
  cancellationReason String?
  cancelledAt   DateTime?
  noShowAt      DateTime?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  organisation  Organisation @relation(fields: [orgId], references: [id])
  location      Location     @relation(fields: [locationId], references: [id])
  client        Client       @relation(fields: [clientId], references: [id])
  user          User         @relation(fields: [userId], references: [id])
  treatment     Treatment    @relation(fields: [treatmentId], references: [id])
  room          Room?        @relation(fields: [roomId], references: [id])
  reminders     Reminder[]

  @@index([orgId, locationId, startTime])
  @@index([userId, startTime])
  @@index([clientId])
  @@index([status])
}

enum AppointmentStatus {
  BOOKED
  CONFIRMED
  CHECKED_IN
  IN_PROGRESS
  COMPLETED
  NO_SHOW
  CANCELLED_BY_CLIENT
  CANCELLED_BY_CLINIC
}

enum BookingSource {
  RECEPTION    // staff booked via dashboard
  ONLINE       // client booked via hosted page
  EMBED        // client booked via iframe widget
  WIDGET       // client booked via popup widget
  WALK_IN      // walk-in, booked at desk
  PHONE        // phone booking
}

// Waitlist for when slots are full
model WaitlistEntry {
  id            String   @id @default(cuid())
  orgId         String
  clientId      String
  treatmentId   String
  locationId    String
  userId        String?  // preferred practitioner (optional)
  preferredDays String[] // ["monday", "wednesday", "friday"]
  preferredTime String?  // "morning", "afternoon", "evening", or specific time
  notes         String?
  status        WaitlistStatus @default(WAITING)
  notifiedAt    DateTime?
  createdAt     DateTime @default(now())

  client        Client   @relation(fields: [clientId], references: [id])
  treatment     Treatment @relation(fields: [treatmentId], references: [id])
  location      Location @relation(fields: [locationId], references: [id])

  @@index([orgId, locationId, status])
}

enum WaitlistStatus {
  WAITING
  NOTIFIED
  BOOKED
  EXPIRED
  CANCELLED
}

// ============================================
// COMMUNICATION MODELS
// ============================================

model Reminder {
  id              String       @id @default(cuid())
  appointmentId   String
  type            ReminderType
  channel         CommsChannel @default(SMS)
  scheduledFor    DateTime
  sentAt          DateTime?
  status          ReminderStatus @default(PENDING)
  failedReason    String?

  appointment     Appointment  @relation(fields: [appointmentId], references: [id], onDelete: Cascade)

  @@index([scheduledFor, status])
}

enum ReminderType {
  CONFIRMATION
  TWENTY_FOUR_HOUR
  TWO_HOUR
  FOLLOW_UP
  REBOOK
  REVIEW
}

enum CommsChannel {
  SMS
  EMAIL
}

enum ReminderStatus {
  PENDING
  SENT
  FAILED
  CANCELLED
}

// ============================================
// BOOKING WIDGET CONFIGURATION
// ============================================

model BookingConfig {
  id                    String   @id @default(cuid())
  orgId                 String
  brandId               String?
  locationId            String?
  isEnabled             Boolean  @default(true)
  allowPractitionerChoice Boolean @default(true)
  requireDeposit        Boolean  @default(false)
  depositAmount         Int?     // pence
  minLeadTimeHours      Int      @default(2)
  maxAdvanceBookingDays Int      @default(56) // 8 weeks
  allowedDomains        String[] // for iframe embed security
  customThankYouMessage String?
  customRedirectUrl     String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  organisation          Organisation @relation(fields: [orgId], references: [id])

  @@unique([orgId, brandId, locationId])
}
```

### Fields to add to existing models (if they don't already have them)

Check each existing model and add only what's missing:

```prisma
// Add to Treatment model (if not already present):
//   durationMins  Int           // treatment duration in minutes
//   isOnlineBookable Boolean    @default(true)
//   bookingBuffer Int           @default(0)  // minutes buffer between appointments

// Add to Client model (if not already present):
//   phone         String?
//   smsConsent    Boolean       @default(false)
//   marketingConsent Boolean    @default(false)
//   source        String?       // "online", "walk-in", "referral"

// Add to User model (if not already present):
//   colour        String?       // hex colour for calendar display
//   isBookable    Boolean       @default(true) // appears in online booking
```

---

## Build Phases

### PHASE 1 - Staff Scheduling + Calendar View (Week 1-2)

This is the foundation. Without this, nothing else works.

#### 1.1 Staff schedule management

Create a page at the existing dashboard route, e.g. `/dashboard/staff/[id]/schedule` or wherever staff management currently lives.

Build:
- Weekly schedule template per staff member (StaffSchedule model)
  - For each day: start time, end time, location, available yes/no
  - Visual weekly grid editor
- Schedule overrides for specific dates (ScheduleOverride model)
  - Holiday/day off booking
  - Custom hours for a specific date
  - Bulk date range selection for holidays
- Room management per location
  - CRUD for rooms at each location
  - Active/inactive toggle

#### 1.2 Calendar view

Create the main calendar page. This should be a primary navigation item in the dashboard sidebar.

Route: `/dashboard/calendar` (or adjust to match existing routing pattern)

Day view (primary view):
- Time axis on the left (15-minute increments, 07:00 to 21:00 or configurable)
- One column per practitioner working that day at the selected location
- Appointments render as coloured blocks (colour = treatment category or practitioner colour)
- Block shows: client first name, treatment name, duration
- Click block to open appointment detail panel (slide-out or modal)
- Click empty slot to start a new booking
- Location selector dropdown at top
- Date picker at top
- "Today" quick button

Week view:
- Condensed version showing appointment density per day per practitioner
- Click a day to switch to day view for that date

Month view:
- Calendar grid showing appointment count per day
- Colour intensity based on capacity utilisation
- Click a day to switch to day view

Filter controls:
- Filter by location (dropdown)
- Filter by practitioner (multi-select)
- Filter by brand (multi-select)
- Filter by room (multi-select)

Real-time visual indicators:
- Grey out unavailable slots (outside staff hours, overrides)
- Highlight current time with a red line
- Visual capacity indicator (percentage booked vs available)

#### 1.3 Appointment CRUD (internal/staff booking)

Build the booking flow used by staff at reception:

Quick-book flow:
1. Click empty slot on calendar (pre-fills practitioner and time)
2. Or click "New Booking" button
3. Select location (pre-filled if already selected on calendar)
4. Select practitioner (pre-filled if clicked from their column)
5. Select treatment (searchable dropdown, grouped by category)
   - If treatment has sub-options, show them
   - Duration auto-fills from treatment
6. Select date and time (pre-filled if clicked from calendar)
   - Show available slots based on practitioner schedule and existing bookings
7. Search or create client
   - Search by name, email, or phone
   - Quick-create form if client doesn't exist
8. Optional: select room
9. Optional: add notes
10. Confirm and create

Availability calculation logic:
```
For a given practitioner + location + date:
1. Get their StaffSchedule for that day of week
2. Check for ScheduleOverride on that specific date
3. Get all existing appointments for that practitioner on that date
4. Calculate available slots:
   - Start from schedule start time
   - For each slot (15-min increments):
     - Is it within working hours? 
     - Does it overlap with an existing appointment?
     - Is the treatment duration (+ buffer) available from this start time?
   - Return available start times
```

Appointment actions:
- View details
- Edit (change time, practitioner, treatment, room)
- Check in (status > CHECKED_IN)
- Start (status > IN_PROGRESS)
- Complete (status > COMPLETED)
- Cancel with reason (status > CANCELLED_BY_CLIENT or CANCELLED_BY_CLINIC)
- Mark as no-show (status > NO_SHOW)
- Reschedule (creates audit trail of the move)

**Phase 1 deliverable: Staff schedules configured. Calendar showing appointments. Staff can create, view, edit, and manage appointments internally.**

---

### PHASE 2 - Online Booking (Public-Facing) (Week 3-4)

This replaces Fresha. Three modes, one shared booking flow.

#### 2.1 Shared booking flow component

Build a reusable `<BookingFlow />` component that works in all three modes. It handles:

Step 1 - Select treatment:
- Show treatment categories (grouped by brand if multiple brands at location)
- Select category > select treatment > select sub-option (if applicable)
- Show price and duration

Step 2 - Select location:
- Skip if location is pre-set via URL parameter
- Show available locations with addresses
- Filter to locations where the selected treatment is offered

Step 3 - Select practitioner:
- "No preference" option (default)
- Show available practitioners with their photo/avatar
- Only show practitioners who can perform the selected treatment
- Skip entirely if BookingConfig.allowPractitionerChoice is false

Step 4 - Select date and time:
- Date picker (next X weeks, based on BookingConfig.maxAdvanceBookingDays)
- Available time slots for selected date
- Slots calculated using same availability logic as internal booking
- If "no preference" practitioner, show all available slots across all practitioners
- Grey out dates with no availability
- Respect BookingConfig.minLeadTimeHours

Step 5 - Client details:
- First name, last name, email, phone (all required for new clients)
- Returning client: "Already been before? Enter your email" - lookup and pre-fill
- SMS consent checkbox
- Marketing consent checkbox
- Any treatment-specific consent form (if the treatment has requiresConsent = true, render the consent form inline here - connect to existing PLG Hub v1 consent form system)

Step 6 - Confirmation:
- Summary of everything selected
- If deposit required: Stripe Elements card input (payment happens within PLG Hub, not a redirect)
- Confirm button

Step 7 - Success:
- Confirmation message with appointment details
- "Add to calendar" button (generates .ics file download)
- Booking reference number

#### 2.2 Hosted booking page

Route: `/booking/[orgSlug]` and `/booking/[orgSlug]/[brandSlug]` and `/booking/[orgSlug]/[brandSlug]/[locationSlug]`

- Full page with header (brand logo, name) and footer
- Renders the `<BookingFlow />` component
- Brand palette applied from org/brand settings
- Mobile responsive
- SEO meta tags (each page is indexable)
- Custom domain support: organisations can point a CNAME (e.g. book.waxformen.co.uk) to this route. Implement via Next.js middleware that reads the Host header and maps it to an org/brand.

#### 2.3 Embeddable iframe page

Route: `/embed/booking/[orgSlug]/[brandSlug]/[locationSlug]`

- Same `<BookingFlow />` but with NO header, footer, or external navigation
- Minimal chrome - just the booking flow
- Brand palette applied
- Outputs embed code from the dashboard:
```html
<iframe
  src="https://hub.plguk.com/embed/booking/plg-uk/wax-for-men/manchester"
  width="100%"
  height="700"
  frameborder="0"
  style="border:none; border-radius:8px;"
  allow="payment"
></iframe>
```
- Auto-resize: use window.postMessage to send height updates to parent window
- Include a small script on the embed page that posts its document height whenever content changes:
```javascript
const observer = new ResizeObserver(() => {
  window.parent.postMessage(
    { type: 'plghub-resize', height: document.body.scrollHeight },
    '*'
  );
});
observer.observe(document.body);
```

#### 2.4 Floating popup widget

File: `/public/widget.js` (must be lightweight, under 5KB gzipped)

Usage:
```html
<script
  src="https://hub.plguk.com/widget.js"
  data-org="plg-uk"
  data-brand="wax-for-men"
  data-location="manchester"
  data-color="#c6986f"
  data-position="bottom-right"
  data-text="Book Now"
></script>
```

What widget.js does:
1. Reads data attributes from its own script tag
2. Injects a floating button into the page (styled with data-color, positioned with data-position)
3. On click: creates a full-screen overlay/modal with an iframe pointing to the embed booking URL
4. Includes a close button on the overlay
5. Listens for postMessage from the iframe for:
   - Height resize
   - Booking complete (can trigger custom callback)
   - Close request

#### 2.5 Embed configuration dashboard

Route: add to existing settings area, e.g. `/dashboard/settings/booking-widget`

Build a settings page where the org admin can:
- Toggle online booking on/off per brand and location
- Generate embed code (iframe snippet) per brand/location
- Generate widget script snippet per brand/location
- Preview the booking flow in each mode
- Configure per BookingConfig model:
  - Require deposit (on/off + amount)
  - Minimum lead time (hours)
  - Maximum advance booking (days)
  - Allow practitioner choice (on/off)
  - Whitelist domains for iframe embedding
  - Custom thank-you message
  - Custom redirect URL (hosted mode only)
- Toggle which treatments are available for online booking (uses isOnlineBookable flag on Treatment)

#### 2.6 Technical requirements for embed

- Set response headers on embed routes:
  - `X-Frame-Options: ALLOWALL` (or remove the header)
  - `Content-Security-Policy: frame-ancestors *` (or restrict to whitelisted domains from BookingConfig.allowedDomains)
- Cookie handling: use `SameSite=None; Secure` for session cookies on embed routes so authentication works cross-origin
- CORS: allow requests from whitelisted domains
- All Stripe payment processing happens inside the PLG Hub iframe. Card details never touch the host website.
- The `/booking/` and `/embed/booking/` routes should NOT require authentication (they're public-facing)
- Rate limiting on the booking API endpoints to prevent abuse

**Phase 2 deliverable: Clients can book online via three modes. Booking pages can be embedded on existing PLG websites (waxformen.co.uk, menhancements.co.uk, etc.). Fresha booking links can be replaced.**

---

### PHASE 3 - Automated Reminders + Communications (Week 5-6)

#### 3.1 Communication infrastructure

Set up:
- Twilio account + UK phone number for SMS
- Resend account + verified sending domain for email
- BullMQ worker connected to Redis for processing scheduled jobs

Create library files:
- `lib/sms.ts` - Twilio send wrapper with error handling and logging
- `lib/email.ts` - Resend send wrapper with error handling and logging
- `lib/queue.ts` - BullMQ queue setup and job definitions

Message template system:
- Stored templates with merge tags: `{firstName}`, `{lastName}`, `{treatmentName}`, `{date}`, `{time}`, `{location}`, `{locationAddress}`, `{practitionerName}`, `{bookingRef}`
- Default templates seeded for each reminder type
- Editable per organisation from Settings > Communications
- Character count display for SMS (160 char limit awareness)

#### 3.2 Automated triggers

When an appointment is created:
1. Send booking confirmation immediately (SMS + email)
2. Schedule 24-hour reminder (SMS) - calculate send time as appointment.startTime minus 24 hours
3. Optionally schedule 2-hour reminder (SMS) - configurable per org

When an appointment is completed:
4. Schedule follow-up message (email, 24 hours after)
5. Schedule review request (email, 48 hours after)
6. Schedule rebook reminder (SMS + email, X days after - configurable, default 28 days)

When an appointment is cancelled:
7. Cancel all pending reminders for that appointment
8. Send cancellation confirmation to client

Consent checking:
- Before ANY SMS send: check client.smsConsent === true
- Before ANY marketing email: check client.marketingConsent === true
- Booking confirmations and reminders are transactional (not marketing) but still respect smsConsent

BullMQ job processing:
- Worker runs on a schedule (every minute) checking for pending reminders where scheduledFor <= now
- Process each reminder: render template, send via appropriate channel, update status
- Retry failed sends up to 3 times with exponential backoff
- Log all sends to the Reminder model for audit trail

#### 3.3 Communication settings

Route: add to settings area, e.g. `/dashboard/settings/communications`

- Toggle each reminder type on/off
- Edit SMS and email templates
- Set rebook reminder timing (days after last visit)
- Test send functionality (send a test message to your own phone/email)
- View delivery logs

**Phase 3 deliverable: Clients automatically receive booking confirmations, reminders, and follow-ups. No manual work required. Communication history visible on client profiles.**

---

### PHASE 4 - Google Calendar Sync (Week 6, alongside Phase 3)

Optional feature. Staff can sync their PLG Hub schedule to their personal Google Calendar.

#### 4.1 Setup

- Create Google Cloud project with Calendar API enabled
- OAuth2 consent screen configuration
- Store credentials in environment variables

#### 4.2 Per-staff OAuth flow

Route: `/dashboard/settings/my-account/calendar-sync` (or similar)

1. Staff member clicks "Connect Google Calendar"
2. OAuth2 redirect to Google
3. Staff authorises access to their Google Calendar
4. Callback stores encrypted refresh token against their User record
5. PLG Hub creates a new calendar called "PLG Hub" in their Google account
6. Toggle sync on/off

#### 4.3 Sync logic

When an appointment is created/updated/deleted involving a staff member who has sync enabled:
- Push event to their Google Calendar using calendar.events.insert/update/delete
- Event details (GDPR safe): treatment name, client first name only (no surname, phone, or email), location name, time
- Handle token refresh automatically
- If sync fails, log the error but never block the booking flow
- One-way only: PLG Hub > Google Calendar. Never read from Google Calendar.

**Phase 4 deliverable: Staff who want it can see their PLG Hub appointments in their Google Calendar. Completely optional per person.**

---

### PHASE 5 - Fresha Migration + Go Live (Week 7-8)

#### 5.1 Data migration

Build a CSV import tool at `/dashboard/settings/import`:
- Import clients from Fresha CSV export (map columns: name, email, phone, notes)
- Deduplicate against existing clients (match on email or phone)
- Import appointment history (for reporting continuity)
- Preview import before committing
- Log import results (imported, skipped, duplicated)

#### 5.2 Cutover plan

1. All staff trained on new calendar and booking system
2. Update booking links:
   - waxformen.co.uk - replace Fresha widget/link with PLG Hub embed
   - menhancements.co.uk - replace Fresha widget/link with PLG Hub embed
   - waxforwomen.co.uk - replace Fresha widget/link with PLG Hub embed
   - enhance-her.co.uk - replace Fresha widget/link with PLG Hub embed
   - Google Business Profile booking links updated
   - Instagram bio links updated
   - Any other social media booking links
3. Run PLG Hub and Fresha in parallel for 2 weeks
4. Full cutover: disable Fresha, PLG Hub is the sole system

---

## Environment Variables (add to existing .env)

Only add what's not already in your .env:

```env
# Twilio (SMS)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+44..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@plghub.com"

# Stripe (if not already configured)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google Calendar (optional staff sync)
GOOGLE_CALENDAR_CLIENT_ID="..."
GOOGLE_CALENDAR_CLIENT_SECRET="..."
GOOGLE_CALENDAR_REDIRECT_URI="https://hub.plguk.com/api/auth/callback/google-calendar"

# Redis (for BullMQ job queue)
REDIS_URL="redis://localhost:6379"

# Booking
NEXT_PUBLIC_BOOKING_BASE_URL="https://hub.plguk.com"
```

---

## API Routes to Create

Add these under the existing API structure:

```
src/app/api/
├── appointments/
│   ├── route.ts                    # GET (list), POST (create)
│   ├── [id]/
│   │   ├── route.ts                # GET, PATCH, DELETE
│   │   ├── check-in/route.ts       # POST
│   │   ├── complete/route.ts       # POST
│   │   ├── cancel/route.ts         # POST
│   │   └── no-show/route.ts        # POST
│   └── availability/
│       └── route.ts                # GET - calculate available slots
├── booking/
│   ├── slots/route.ts              # GET - public endpoint for available slots
│   ├── create/route.ts             # POST - public endpoint for online booking
│   └── lookup/route.ts             # POST - client email/phone lookup for returning clients
├── staff/
│   └── schedule/
│       ├── route.ts                # GET, PUT - staff schedule template
│       └── overrides/route.ts      # GET, POST, DELETE - schedule overrides
├── waitlist/
│   ├── route.ts                    # GET, POST
│   └── [id]/route.ts              # PATCH, DELETE
├── reminders/
│   └── process/route.ts           # POST - cron job endpoint to process pending reminders
├── webhooks/
│   └── stripe/route.ts            # POST - Stripe webhook handler (if not already exists)
└── google-calendar/
    ├── auth/route.ts               # GET - initiate OAuth flow
    ├── callback/route.ts           # GET - OAuth callback
    └── sync/route.ts               # POST - manual sync trigger
```

The `/booking/*` routes are PUBLIC (no auth required).
All other routes require authentication and org-scoping.

---

## Seed Data for PLG UK

When seeding, check what already exists in the database first. Only add what's missing.

Staff schedules to seed:
- Default working hours: 09:00 - 18:00, Monday to Saturday
- Sunday: closed (unless overridden)
- Per location

Rooms to seed:
- Manchester: Room 1, Room 2 (adjust based on actual studio layout)
- Wilmslow: Room 1
- Leeds: Room 1

Booking config to seed:
- Online booking enabled for all brands/locations
- No deposit required (initially)
- Min lead time: 2 hours
- Max advance booking: 8 weeks (56 days)
- Practitioner choice: enabled

Reminder templates to seed:
- Confirmation SMS: "Hi {firstName}, your {treatmentName} at {location} is confirmed for {date} at {time}. See you then!"
- 24h reminder SMS: "Reminder: {firstName}, you have {treatmentName} tomorrow at {time} at {location}. Reply CANCEL to cancel."
- Follow-up email: subject "How was your visit?" - body thanking them and asking for feedback
- Review request email: subject "Leave us a review?" - body with Google review link
- Rebook SMS: "Hi {firstName}, it's been a while! Ready for your next {treatmentName}? Book at {bookingLink}"

---

## What Comes After the Booking System

Once the booking engine is live and Fresha is switched off, the next modules to add (in priority order):

1. POS + Checkout (payments at point of treatment completion)
2. Membership engine (UNLIMIWAX subscriptions)
3. Marketing campaigns (SMS + email campaigns to segmented client lists)
4. Loyalty programme
5. Inventory management
6. Advanced reporting dashboard
7. Predictive intelligence (churn scoring, revenue forecasting)

Each of these will get their own build guide when you're ready for them. The database schema for all future modules is in the full PLG-HUB-BUILD-GUIDE.md file for reference.

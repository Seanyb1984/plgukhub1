'use client';

// PLG UK Hub - FormRenderer with Phased Stepper Logic
// Handles the 4-Phase Treatment Journey with field.id mapping
// NOTE: Functions cannot be passed from Server to Client components;
// all field logic is resolved via field.id mapping in this renderer.

import React, { useState, useCallback, useMemo } from 'react';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { getBrandTheme, getBrandCSSVariables, brandRequiresPOM } from '@/lib/brands/theme';
import {
  PHASE_CONFIGS,
  SAFETY_SCREENING_QUESTIONS,
  TREATMENT_TYPES,
  POM_GATE_CONFIG,
  type PhaseId,
  type SafetyQuestion,
  type InjectionPoint,
} from '@/lib/treatment-journey/types';
import { TreatmentJourneyEngine } from '@/lib/treatment-journey/engine';
import type { Brand } from '@/lib/forms/types';
import { SignaturePad } from '@/components/signature/SignaturePad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  XOctagon,
  ChevronRight,
  ChevronLeft,
  Search,
  UserPlus,
  Camera,
  Send,
  Shield,
  Stethoscope,
  FileSignature,
  ClipboardList,
  CheckSquare,
} from 'lucide-react';

// ============================================
// FIELD RENDERER MAP (field.id -> component)
// Avoids passing functions from Server to Client
// ============================================

interface FieldRendererProps {
  fieldId: string;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
  brand: Brand;
}

// ============================================
// STEPPER COMPONENT
// ============================================

interface StepperProps {
  phases: typeof PHASE_CONFIGS;
  currentPhase: PhaseId;
  completedPhases: Set<PhaseId>;
  stoppedAtPhase?: PhaseId;
  brand: Brand;
  onPhaseClick: (phase: PhaseId) => void;
}

const PHASE_ICONS: Record<PhaseId, React.ReactNode> = {
  0: <Search className="w-4 h-4" />,
  1: <Stethoscope className="w-4 h-4" />,
  2: <FileSignature className="w-4 h-4" />,
  3: <ClipboardList className="w-4 h-4" />,
  4: <CheckSquare className="w-4 h-4" />,
};

function Stepper({ phases, currentPhase, completedPhases, stoppedAtPhase, brand, onPhaseClick }: StepperProps) {
  const theme = getBrandTheme(brand);

  return (
    <nav aria-label="Treatment Journey Progress" className="mb-8">
      <ol className="flex items-center w-full">
        {phases.map((phase, index) => {
          const isCompleted = completedPhases.has(phase.id);
          const isCurrent = currentPhase === phase.id;
          const isStopped = stoppedAtPhase === phase.id;
          const isAccessible = isCompleted || isCurrent;

          return (
            <li key={phase.id} className={cn('flex items-center', index < phases.length - 1 && 'flex-1')}>
              <button
                type="button"
                onClick={() => isAccessible && onPhaseClick(phase.id)}
                disabled={!isAccessible}
                className={cn(
                  'flex flex-col items-center gap-1 group relative',
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                )}
                title={phase.description}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    isStopped && 'border-red-500 bg-red-50 text-red-600',
                    isCompleted && !isStopped && 'border-transparent text-white',
                    isCurrent && !isStopped && 'border-transparent text-white ring-4 ring-opacity-30',
                    !isCompleted && !isCurrent && !isStopped && 'border-gray-300 bg-white text-gray-400'
                  )}
                  style={{
                    backgroundColor: isStopped
                      ? undefined
                      : isCompleted
                        ? theme.stepCompleted
                        : isCurrent
                          ? theme.stepActive
                          : undefined,
                    boxShadow: isCurrent ? `0 0 0 4px ${theme.stepActive}4d` : undefined,
                  }}
                >
                  {isStopped ? (
                    <XOctagon className="w-5 h-5" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    PHASE_ICONS[phase.id] || <Circle className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium text-center max-w-[80px] leading-tight',
                    isCurrent ? 'font-semibold' : 'text-gray-500'
                  )}
                  style={{ color: isCurrent ? theme.text : undefined }}
                >
                  {phase.name}
                </span>
              </button>

              {index < phases.length - 1 && (
                <div
                  className={cn('flex-1 h-0.5 mx-2', isCompleted ? 'bg-green-500' : 'bg-gray-200')}
                  style={{ backgroundColor: isCompleted ? theme.stepCompleted : undefined }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ============================================
// PHASE 0: CLIENT IDENTIFICATION
// ============================================

interface Phase0Props {
  brand: Brand;
  onClientSelected: (client: { id: string; firstName: string; lastName: string; email?: string; phone?: string } | null) => void;
  onQuickAdd: (data: { firstName: string; lastName: string; email?: string; phone?: string; dateOfBirth?: string }) => void;
  searchClients: (query: string) => Promise<Array<{ id: string; firstName: string; lastName: string; email?: string; phone?: string; status: string }>>;
}

function Phase0Identification({ brand, onClientSelected, onQuickAdd, searchClients }: Phase0Props) {
  const theme = getBrandTheme(brand);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; firstName: string; lastName: string; email?: string; phone?: string; status: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [quickAddData, setQuickAddData] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchClients(query);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    },
    [searchClients]
  );

  const handleSelectClient = useCallback(
    (client: (typeof searchResults)[0]) => {
      setSelectedClient(client);
      onClientSelected(client);
      setSearchResults([]);
      setSearchQuery(`${client.firstName} ${client.lastName}`);
    },
    [onClientSelected]
  );

  const handleQuickAdd = useCallback(() => {
    onQuickAdd(quickAddData);
    setShowQuickAdd(false);
  }, [quickAddData, onQuickAdd]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6" style={{ color: theme.primary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
            Client Identification
          </h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            Search for an existing client or quick-add a new enquiry
          </p>
        </div>
      </div>

      {/* Live Search */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 text-base"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => handleSelectClient(client)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{client.firstName} {client.lastName}</p>
                  <p className="text-sm text-gray-500">{client.email || client.phone || 'No contact info'}</p>
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full font-medium',
                    client.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  )}
                >
                  {client.status === 'ACTIVE' ? 'Active' : 'Prospect'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Client Display */}
      {selectedClient && (
        <div className="p-4 rounded-lg border-2" style={{ borderColor: theme.stepCompleted, backgroundColor: `${theme.stepCompleted}10` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" style={{ color: theme.stepCompleted }} />
              <div>
                <p className="font-semibold">{selectedClient.firstName} {selectedClient.lastName}</p>
                <p className="text-sm text-gray-500">Client selected</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedClient(null);
                onClientSelected(null);
                setSearchQuery('');
              }}
            >
              Change
            </Button>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Quick Add Toggle */}
      {!showQuickAdd ? (
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base gap-2"
          onClick={() => setShowQuickAdd(true)}
        >
          <UserPlus className="w-5 h-5" />
          Quick Add New Enquiry
        </Button>
      ) : (
        <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
          <h3 className="font-medium text-gray-900">New Client (Quick Add)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <Input
                value={quickAddData.firstName}
                onChange={(e) => setQuickAddData((d) => ({ ...d, firstName: e.target.value }))}
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <Input
                value={quickAddData.lastName}
                onChange={(e) => setQuickAddData((d) => ({ ...d, lastName: e.target.value }))}
                placeholder="Last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={quickAddData.email}
                onChange={(e) => setQuickAddData((d) => ({ ...d, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                type="tel"
                value={quickAddData.phone}
                onChange={(e) => setQuickAddData((d) => ({ ...d, phone: e.target.value }))}
                placeholder="07xxx xxx xxx"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <Input
                type="date"
                value={quickAddData.dateOfBirth}
                onChange={(e) => setQuickAddData((d) => ({ ...d, dateOfBirth: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handleQuickAdd} disabled={!quickAddData.firstName || !quickAddData.lastName}>
              Add & Continue
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowQuickAdd(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// PHASE 1: POM TRIAGE
// ============================================

interface Phase1Props {
  brand: Brand;
  prescribers: Array<{ id: string; name: string; gmcNumber: string; prescriberType: string }>;
  value: { prescriberId: string; gmcNumber: string; faceToFaceDate: string; pomNotes: string };
  onChange: (data: Phase1Props['value']) => void;
  errors: string[];
}

function Phase1POMTriage({ brand, prescribers, value, onChange, errors }: Phase1Props) {
  const theme = getBrandTheme(brand);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Stethoscope className="w-6 h-6" style={{ color: theme.primary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
            POM Triage - Prescriber Verification
          </h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            Prescription-Only Medicine treatments require a verified prescriber
          </p>
        </div>
      </div>

      {/* Prescriber Warning Banner */}
      <div className="p-4 rounded-lg border-2 border-amber-300 bg-amber-50">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">POM Gate Active</p>
            <p className="text-sm text-amber-700">
              This treatment involves Prescription-Only Medicines. A registered prescriber (e.g., Dr. Phil)
              must be verified with their GMC number and a face-to-face consultation date.
            </p>
          </div>
        </div>
      </div>

      {/* Prescriber Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prescriber <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-offset-0"
            style={{ focusRingColor: theme.primary } as React.CSSProperties}
            value={value.prescriberId}
            onChange={(e) => {
              const prescriber = prescribers.find((p) => p.id === e.target.value);
              onChange({
                ...value,
                prescriberId: e.target.value,
                gmcNumber: prescriber?.gmcNumber || value.gmcNumber,
              });
            }}
          >
            <option value="">Select prescriber...</option>
            {prescribers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.prescriberType}) - GMC: {p.gmcNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GMC Number <span className="text-red-500">*</span>
          </label>
          <Input
            value={value.gmcNumber}
            onChange={(e) => onChange({ ...value, gmcNumber: e.target.value })}
            placeholder="7-digit GMC number"
            maxLength={7}
          />
          <p className="text-xs text-gray-500 mt-1">
            General Medical Council registration number. Must be 7 digits.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Face-to-Face Consultation <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={value.faceToFaceDate}
            onChange={(e) => onChange({ ...value, faceToFaceDate: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-gray-500 mt-1">
            The client must have had a face-to-face consultation within the last {POM_GATE_CONFIG.faceToFaceMaxDaysAgo} days.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
          <textarea
            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={value.pomNotes}
            onChange={(e) => onChange({ ...value, pomNotes: e.target.value })}
            placeholder="Any notes from the POM triage..."
          />
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <XOctagon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// PHASE 2: LEGAL CONSENT WITH STOP-LOGIC
// ============================================

interface Phase2Props {
  brand: Brand;
  screeningResponses: Record<string, boolean | string>;
  onScreeningChange: (questionId: string, value: boolean | string) => void;
  signatureData: string | null;
  onSignatureChange: (data: string | null) => void;
  signedByName: string;
  onSignedByNameChange: (name: string) => void;
  consentAccepted: boolean;
  onConsentChange: (accepted: boolean) => void;
  hardStops: SafetyQuestion[];
  softWarnings: SafetyQuestion[];
  errors: string[];
}

function Phase2LegalConsent({
  brand,
  screeningResponses,
  onScreeningChange,
  signatureData,
  onSignatureChange,
  signedByName,
  onSignedByNameChange,
  consentAccepted,
  onConsentChange,
  hardStops,
  softWarnings,
  errors,
}: Phase2Props) {
  const theme = getBrandTheme(brand);
  const applicableQuestions = SAFETY_SCREENING_QUESTIONS.filter((q) => {
    if (q.appliesToBrands === 'ALL') return true;
    return q.appliesToBrands.includes(brand);
  });

  const hasHardStop = hardStops.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <FileSignature className="w-6 h-6" style={{ color: theme.primary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
            Legal Consent & Safety Screening
          </h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            CQC-mandated safety screening. Answer all questions honestly.
          </p>
        </div>
      </div>

      {/* Safety Screening Questions */}
      <div className="border rounded-lg overflow-hidden">
        <div className="px-4 py-3 font-semibold text-white flex items-center gap-2" style={{ backgroundColor: theme.primary }}>
          <Shield className="w-4 h-4" />
          CQC Safety Screening
        </div>
        <div className="divide-y">
          {applicableQuestions.map((question) => {
            const response = screeningResponses[question.id];
            const isTriggered = response === question.triggerValue;

            return (
              <div key={question.id} className={cn('p-4', isTriggered && question.stopType === 'hard' && 'bg-red-50', isTriggered && question.stopType === 'soft' && 'bg-amber-50')}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-gray-800 flex-1">{question.question}</p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onScreeningChange(question.id, true)}
                      className={cn(
                        'px-4 py-1.5 text-sm rounded-md border transition-colors',
                        response === true
                          ? 'bg-red-100 border-red-300 text-red-700 font-medium'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => onScreeningChange(question.id, false)}
                      className={cn(
                        'px-4 py-1.5 text-sm rounded-md border transition-colors',
                        response === false
                          ? 'bg-green-100 border-green-300 text-green-700 font-medium'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      No
                    </button>
                  </div>
                </div>
                {isTriggered && (
                  <div className={cn('mt-2 p-2 rounded text-sm flex items-start gap-2', question.stopType === 'hard' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')}>
                    {question.stopType === 'hard' ? <XOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <span>{question.stopMessage}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hard Stop Banner */}
      {hasHardStop && (
        <div className="p-6 rounded-lg border-2 border-red-500 bg-red-50">
          <div className="flex items-center gap-3 mb-3">
            <XOctagon className="w-8 h-8 text-red-600" />
            <h3 className="text-lg font-bold text-red-800">TREATMENT CANNOT PROCEED</h3>
          </div>
          <p className="text-red-700 mb-2">
            One or more safety screening responses have triggered a HARD STOP.
            This treatment journey must be cancelled or the client must be referred.
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {hardStops.map((stop) => (
              <li key={stop.id}>{stop.stopMessage}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Soft Warnings */}
      {softWarnings.length > 0 && !hasHardStop && (
        <div className="p-4 rounded-lg border border-amber-300 bg-amber-50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Proceed with Caution</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
            {softWarnings.map((warn) => (
              <li key={warn.id}>{warn.stopMessage}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Consent Declaration & Signature (only if no hard stop) */}
      {!hasHardStop && (
        <>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3">Consent Declaration</h3>
            <div className="text-sm text-gray-700 space-y-2 mb-4">
              <p>I, the undersigned, confirm that:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All information provided above is true and accurate to the best of my knowledge.</li>
                <li>I have been informed of the risks, benefits, and alternatives to the proposed treatment.</li>
                <li>I have had the opportunity to ask questions and have received satisfactory answers.</li>
                <li>I consent to the proposed treatment and understand that I can withdraw consent at any time.</li>
                <li>I understand that photographs may be taken for clinical records.</li>
              </ul>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => onConsentChange(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-900">
                I have read, understood, and agree to the above declaration. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (as confirmation) <span className="text-red-500">*</span>
            </label>
            <Input
              value={signedByName}
              onChange={(e) => onSignedByNameChange(e.target.value)}
              placeholder="Type your full legal name"
            />
          </div>

          <SignaturePad
            value={signatureData || undefined}
            onChange={onSignatureChange}
            label="Digital Signature"
            declaration="By signing below, you confirm your consent to the treatment."
            required
          />
        </>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <XOctagon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// PHASE 3: CLINICAL RECORD
// ============================================

interface Phase3Props {
  brand: Brand;
  value: {
    treatmentType: string;
    treatmentArea: string[];
    productUsed: string;
    batchNumber: string;
    lotNumber: string;
    expiryDate: string;
    dosage: string;
    clinicalNotes: string;
  };
  onChange: (data: Phase3Props['value']) => void;
  beforePhotos: string[];
  onPhotoCapture: (photoData: string) => void;
  onPhotoDelete: (index: number) => void;
  onOpenFacialMapping: () => void;
  errors: string[];
}

function Phase3ClinicalRecord({ brand, value, onChange, beforePhotos, onPhotoCapture, onPhotoDelete, onOpenFacialMapping, errors }: Phase3Props) {
  const theme = getBrandTheme(brand);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const treatmentTypes = TREATMENT_TYPES.filter((t) => {
    if (Array.isArray(t.brand)) return t.brand.includes(brand);
    return t.brand === brand;
  });

  const selectedTreatment = treatmentTypes.find((t) => t.id === value.treatmentType);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Camera unavailable or permission denied.');
      setShowCamera(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w > 0 && h > 0) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = w;
          canvasRef.current.height = h;
          ctx.drawImage(videoRef.current, 0, 0);
          const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
          onPhotoCapture(dataUrl);
        }
      }
    }
    // Stop camera
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
    setShowCamera(false);
  }, [onPhotoCapture]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="w-6 h-6" style={{ color: theme.primary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
            Clinical Record
          </h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            Record procedure details, batch numbers, and capture before photos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Treatment Type <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white"
            value={value.treatmentType}
            onChange={(e) => onChange({ ...value, treatmentType: e.target.value, treatmentArea: [] })}
          >
            <option value="">Select treatment...</option>
            {treatmentTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Used <span className="text-red-500">*</span>
          </label>
          {selectedTreatment?.defaultProducts?.length ? (
            <select
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white"
              value={value.productUsed}
              onChange={(e) => onChange({ ...value, productUsed: e.target.value })}
            >
              <option value="">Select product...</option>
              {selectedTreatment.defaultProducts.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="other">Other (specify in notes)</option>
            </select>
          ) : (
            <Input
              value={value.productUsed}
              onChange={(e) => onChange({ ...value, productUsed: e.target.value })}
              placeholder="Product name"
            />
          )}
        </div>
      </div>

      {/* Treatment Areas */}
      {selectedTreatment && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Treatment Area(s) <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedTreatment.commonAreas.map((area) => (
              <label key={area} className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={value.treatmentArea.includes(area)}
                  onChange={(e) => {
                    const areas = e.target.checked
                      ? [...value.treatmentArea, area]
                      : value.treatmentArea.filter((a) => a !== area);
                    onChange({ ...value, treatmentArea: areas });
                  }}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{area}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Batch/Lot Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch Number <span className="text-red-500">*</span>
          </label>
          <Input
            value={value.batchNumber}
            onChange={(e) => onChange({ ...value, batchNumber: e.target.value })}
            placeholder="Batch/Lot #"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
          <Input
            value={value.lotNumber}
            onChange={(e) => onChange({ ...value, lotNumber: e.target.value })}
            placeholder="Lot #"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <Input
            type="date"
            value={value.expiryDate}
            onChange={(e) => onChange({ ...value, expiryDate: e.target.value })}
          />
        </div>
      </div>

      {/* Dosage (for injectables) */}
      {selectedTreatment?.category === 'Injectable' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
          <Input
            value={value.dosage}
            onChange={(e) => onChange({ ...value, dosage: e.target.value })}
            placeholder="e.g., 20 units"
          />
        </div>
      )}

      {/* Clinical Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
        <textarea
          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={value.clinicalNotes}
          onChange={(e) => onChange({ ...value, clinicalNotes: e.target.value })}
          placeholder="Record any clinical observations, technique notes, or complications..."
        />
      </div>

      {/* Before Photos */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Before Photos</h3>
          <div className="flex gap-2">
            {brand === 'MENHANCEMENTS' && (
              <Button type="button" variant="outline" size="sm" onClick={onOpenFacialMapping}>
                Facial Mapping
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={startCamera} className="gap-1">
              <Camera className="w-4 h-4" />
              Capture Photo
            </Button>
          </div>
        </div>

        {cameraError && (
          <p className="text-sm text-red-600 mb-3">{cameraError}</p>
        )}

        {showCamera && (
          <div className="mb-4 border rounded-lg overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full max-h-80 object-contain" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-2 bg-gray-900 flex justify-center gap-2">
              <Button type="button" onClick={capturePhoto} size="sm">
                Capture
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => {
                if (videoRef.current?.srcObject) {
                  (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
                }
                setShowCamera(false);
              }} className="text-white">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {beforePhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {beforePhotos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                <img src={photo} alt={`Before photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onPhotoDelete(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-label="Delete photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No photos captured yet</p>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <XOctagon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// PHASE 4: CLOSE-OUT
// ============================================

interface Phase4Props {
  brand: Brand;
  afterPhotos: string[];
  onPhotoCapture: (photoData: string) => void;
  onPhotoDelete: (index: number) => void;
  aftercareProvided: boolean;
  onAftercareChange: (provided: boolean) => void;
  sendAftercareEmail: boolean;
  onSendEmailChange: (send: boolean) => void;
  aftercareTemplateId: string;
  onTemplateChange: (id: string) => void;
  followUpDate: string;
  onFollowUpDateChange: (date: string) => void;
  followUpNotes: string;
  onFollowUpNotesChange: (notes: string) => void;
  errors: string[];
  clientEmail?: string;
}

function Phase4CloseOut({
  brand,
  afterPhotos,
  onPhotoCapture,
  onPhotoDelete,
  aftercareProvided,
  onAftercareChange,
  sendAftercareEmail,
  onSendEmailChange,
  aftercareTemplateId,
  onTemplateChange,
  followUpDate,
  onFollowUpDateChange,
  followUpNotes,
  onFollowUpNotesChange,
  errors,
  clientEmail,
}: Phase4Props) {
  const theme = getBrandTheme(brand);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Camera unavailable or permission denied.');
      setShowCamera(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w > 0 && h > 0) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = w;
          canvasRef.current.height = h;
          ctx.drawImage(videoRef.current, 0, 0);
          const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
          onPhotoCapture(dataUrl);
        }
      }
    }
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
    setShowCamera(false);
  }, [onPhotoCapture]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <CheckSquare className="w-6 h-6" style={{ color: theme.primary }} />
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
            Close-out
          </h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            Capture after photos and send aftercare instructions
          </p>
        </div>
      </div>

      {/* After Photos */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">After Photos</h3>
          <Button type="button" variant="outline" size="sm" onClick={startCamera} className="gap-1">
            <Camera className="w-4 h-4" />
            Capture Photo
          </Button>
        </div>

        {cameraError && (
          <p className="text-sm text-red-600 mb-3">{cameraError}</p>
        )}

        {showCamera && (
          <div className="mb-4 border rounded-lg overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full max-h-80 object-contain" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-2 bg-gray-900 flex justify-center gap-2">
              <Button type="button" onClick={capturePhoto} size="sm">
                Capture
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => {
                if (videoRef.current?.srcObject) {
                  (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
                }
                setShowCamera(false);
              }} className="text-white">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {afterPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {afterPhotos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                <img src={photo} alt={`After photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onPhotoDelete(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  aria-label="Delete photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No after photos captured yet</p>
        )}
      </div>

      {/* Aftercare */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-gray-900">Aftercare</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={aftercareProvided}
            onChange={(e) => onAftercareChange(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-medium">
            Aftercare instructions have been provided to the client <span className="text-red-500">*</span>
          </span>
        </label>

        <div className="border-t pt-4">
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={sendAftercareEmail}
              onChange={(e) => onSendEmailChange(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Send aftercare email via Gmail</span>
            </div>
          </label>

          {sendAftercareEmail && (
            <div className="ml-7 space-y-3">
              {clientEmail && (
                <p className="text-sm text-gray-600">
                  Email will be sent to: <strong>{clientEmail}</strong>
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aftercare Template</label>
                <select
                  className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white"
                  value={aftercareTemplateId}
                  onChange={(e) => onTemplateChange(e.target.value)}
                >
                  <option value="">Default template</option>
                  <option value="botox_aftercare">Botox Aftercare</option>
                  <option value="filler_aftercare">Dermal Filler Aftercare</option>
                  <option value="prp_aftercare">PRP Aftercare</option>
                  <option value="waxing_aftercare">Waxing Aftercare</option>
                  <option value="chemical_peel_aftercare">Chemical Peel Aftercare</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
          <Input
            type="date"
            value={followUpDate}
            onChange={(e) => onFollowUpDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes</label>
          <Input
            value={followUpNotes}
            onChange={(e) => onFollowUpNotesChange(e.target.value)}
            placeholder="Any follow-up instructions..."
          />
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <XOctagon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN FORM RENDERER (Phased Stepper)
// ============================================

export interface FormRendererProps {
  brand: Brand;
  siteId: string;
  practitionerId: string;
  // Data callbacks (cannot pass functions from Server -> Client, but these
  // are client-side callbacks within the client boundary)
  searchClients: (query: string) => Promise<Array<{ id: string; firstName: string; lastName: string; email?: string; phone?: string; status: string }>>;
  prescribers: Array<{ id: string; name: string; gmcNumber: string; prescriberType: string }>;
  onComplete: (journeyData: Record<string, unknown>) => Promise<void>;
  onSaveDraft: (journeyData: Record<string, unknown>, phase: PhaseId) => Promise<void>;
  onCancel: () => void;
  // Optional: resume from existing journey
  initialPhase?: PhaseId;
  initialData?: Record<string, unknown>;
}

export function FormRenderer({
  brand,
  siteId,
  practitionerId,
  searchClients,
  prescribers,
  onComplete,
  onSaveDraft,
  onCancel,
  initialPhase = 0,
  initialData,
}: FormRendererProps) {
  const engine = useMemo(() => new TreatmentJourneyEngine(brand), [brand]);
  const theme = getBrandTheme(brand);
  const cssVars = getBrandCSSVariables(brand);
  const requiredPhases = engine.getRequiredPhases();
  const applicablePhaseConfigs = PHASE_CONFIGS.filter((p) => requiredPhases.includes(p.id));

  // ---- State ----
  const [currentPhase, setCurrentPhase] = useState<PhaseId>(initialPhase);
  const [completedPhases, setCompletedPhases] = useState<Set<PhaseId>>(new Set());
  const [stoppedAtPhase, setStoppedAtPhase] = useState<PhaseId | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phaseErrors, setPhaseErrors] = useState<string[]>([]);

  // Phase data
  type ClientSelection = { id: string; firstName: string; lastName: string; email?: string; phone?: string } | null;
  const [selectedClient, setSelectedClient] = useState<ClientSelection>(
    (initialData?.client as ClientSelection) ?? null
  );
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientData, setNewClientData] = useState<{ firstName: string; lastName: string; email?: string; phone?: string; dateOfBirth?: string } | null>(null);

  const [pomData, setPomData] = useState({
    prescriberId: (initialData?.prescriberId as string) ?? '',
    gmcNumber: (initialData?.gmcNumber as string) ?? '',
    faceToFaceDate: (initialData?.faceToFaceDate as string) ?? '',
    pomNotes: (initialData?.pomNotes as string) ?? '',
  });

  const [screeningResponses, setScreeningResponses] = useState<Record<string, boolean | string>>(
    (initialData?.screeningResponses as Record<string, boolean | string>) ?? {}
  );
  const [signatureData, setSignatureData] = useState<string | null>((initialData?.signatureData as string) ?? null);
  const [signedByName, setSignedByName] = useState((initialData?.signedByName as string) ?? '');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [hardStops, setHardStops] = useState<SafetyQuestion[]>([]);
  const [softWarnings, setSoftWarnings] = useState<SafetyQuestion[]>([]);

  const [clinicalData, setClinicalData] = useState({
    treatmentType: (initialData?.treatmentType as string) ?? '',
    treatmentArea: (initialData?.treatmentArea as string[]) ?? [],
    productUsed: (initialData?.productUsed as string) ?? '',
    batchNumber: (initialData?.batchNumber as string) ?? '',
    lotNumber: (initialData?.lotNumber as string) ?? '',
    expiryDate: (initialData?.expiryDate as string) ?? '',
    dosage: (initialData?.dosage as string) ?? '',
    clinicalNotes: (initialData?.clinicalNotes as string) ?? '',
  });
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [showFacialMapping, setShowFacialMapping] = useState(false);

  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [aftercareProvided, setAftercareProvided] = useState(false);
  const [sendAftercareEmail, setSendAftercareEmail] = useState(false);
  const [aftercareTemplateId, setAftercareTemplateId] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');

  // ---- Safety Screening Evaluation ----
  const evaluateScreening = useCallback(
    (responses: Record<string, boolean | string>) => {
      const questions = engine.getApplicableScreeningQuestions();
      const hard: SafetyQuestion[] = [];
      const soft: SafetyQuestion[] = [];

      for (const q of questions) {
        if (responses[q.id] === q.triggerValue) {
          if (q.stopType === 'hard') hard.push(q);
          else soft.push(q);
        }
      }

      setHardStops(hard);
      setSoftWarnings(soft);
    },
    [engine]
  );

  const handleScreeningChange = useCallback(
    (questionId: string, value: boolean | string) => {
      const updated = { ...screeningResponses, [questionId]: value };
      setScreeningResponses(updated);
      evaluateScreening(updated);
    },
    [screeningResponses, evaluateScreening]
  );

  // ---- Phase Navigation ----
  const validateCurrentPhase = useCallback((): boolean => {
    let result;

    switch (currentPhase) {
      case 0:
        result = engine.validatePhase0({
          clientId: selectedClient?.id ?? null,
          isNewClient,
          firstName: isNewClient ? (newClientData?.firstName ?? '') : (selectedClient?.firstName ?? ''),
          lastName: isNewClient ? (newClientData?.lastName ?? '') : (selectedClient?.lastName ?? ''),
        });
        break;

      case 1:
        result = engine.validatePhase1({
          isPomTreatment: true,
          prescriberId: pomData.prescriberId,
          prescriberName: prescribers.find((p) => p.id === pomData.prescriberId)?.name ?? '',
          gmcNumber: pomData.gmcNumber,
          faceToFaceDate: pomData.faceToFaceDate,
          pomNotes: pomData.pomNotes,
        });
        break;

      case 2:
        result = engine.validatePhase2(
          {
            screeningResponses,
            hardStopTriggered: hardStops.length > 0,
            softWarnings: softWarnings.map((w) => w.stopMessage),
            consentDeclaration: consentAccepted ? 'accepted' : '',
            signatureData: signatureData ?? '',
            signedByName,
          },
          engine.isPOMPhaseRequired()
        );
        break;

      case 3:
        result = engine.validatePhase3({
          ...clinicalData,
          beforePhotos,
        });
        break;

      case 4:
        result = engine.validatePhase4({
          afterPhotos,
          aftercareProvided,
          aftercareTemplateId,
          sendAftercareEmail,
          followUpDate,
          followUpNotes,
        });
        break;

      default:
        return false;
    }

    setPhaseErrors(result.errors);

    if (result.hardStop) {
      setStoppedAtPhase(currentPhase);
    }

    return result.canProceed;
  }, [
    currentPhase, engine, selectedClient, isNewClient, newClientData, pomData,
    prescribers, screeningResponses, hardStops, softWarnings, consentAccepted,
    signatureData, signedByName, clinicalData, beforePhotos, afterPhotos,
    aftercareProvided, aftercareTemplateId, sendAftercareEmail, followUpDate, followUpNotes,
  ]);

  const goToNextPhase = useCallback(() => {
    if (!validateCurrentPhase()) return;

    setCompletedPhases((prev) => new Set([...prev, currentPhase]));
    setPhaseErrors([]);

    const nextPhase = engine.getNextPhase(currentPhase);
    if (nextPhase !== null) {
      setCurrentPhase(nextPhase);
    }
  }, [currentPhase, engine, validateCurrentPhase]);

  const goToPreviousPhase = useCallback(() => {
    setPhaseErrors([]);
    const prevPhase = engine.getPreviousPhase(currentPhase);
    if (prevPhase !== null) {
      setCurrentPhase(prevPhase);
    }
  }, [currentPhase, engine]);

  const goToPhase = useCallback(
    (phase: PhaseId) => {
      if (completedPhases.has(phase) || phase === currentPhase) {
        setPhaseErrors([]);
        setCurrentPhase(phase);
      }
    },
    [completedPhases, currentPhase]
  );

  // ---- Submit ----
  const handleComplete = useCallback(async () => {
    if (!validateCurrentPhase()) return;

    setIsSubmitting(true);
    try {
      const journeyData = {
        brand,
        siteId,
        practitionerId,
        client: selectedClient,
        isNewClient,
        newClientData,
        pomData: engine.isPOMPhaseRequired() ? pomData : null,
        screeningResponses,
        signatureData,
        signedByName,
        consentAccepted,
        clinicalData,
        beforePhotos,
        afterPhotos,
        aftercareProvided,
        sendAftercareEmail,
        aftercareTemplateId,
        followUpDate,
        followUpNotes,
      };

      await onComplete(journeyData);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateCurrentPhase, brand, siteId, practitionerId, selectedClient, isNewClient,
    newClientData, engine, pomData, screeningResponses, signatureData, signedByName,
    consentAccepted, clinicalData, beforePhotos, afterPhotos, aftercareProvided,
    sendAftercareEmail, aftercareTemplateId, followUpDate, followUpNotes, onComplete,
  ]);

  const handleSaveDraft = useCallback(async () => {
    const journeyData = {
      brand,
      siteId,
      practitionerId,
      client: selectedClient,
      pomData,
      screeningResponses,
      clinicalData,
      beforePhotos,
    };
    await onSaveDraft(journeyData, currentPhase);
  }, [brand, siteId, practitionerId, selectedClient, pomData, screeningResponses, clinicalData, beforePhotos, currentPhase, onSaveDraft]);

  const isLastPhase = engine.getNextPhase(currentPhase) === null;
  const isFirstPhase = engine.getPreviousPhase(currentPhase) === null;

  return (
    <div className="max-w-4xl mx-auto" style={cssVars as React.CSSProperties}>
      {/* Brand Header */}
      <div className="mb-6 pb-4 border-b-2" style={{ borderColor: theme.primary }}>
        <h1 className="text-2xl font-bold" style={{ color: theme.primary }}>
          {theme.label} - Treatment Journey
        </h1>
        <p className="text-sm" style={{ color: theme.textMuted }}>{theme.tagline}</p>
      </div>

      {/* Stepper */}
      <Stepper
        phases={applicablePhaseConfigs}
        currentPhase={currentPhase}
        completedPhases={completedPhases}
        stoppedAtPhase={stoppedAtPhase}
        brand={brand}
        onPhaseClick={goToPhase}
      />

      {/* Phase Content */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6" style={{ borderColor: theme.border }}>
        {currentPhase === 0 && (
          <Phase0Identification
            brand={brand}
            onClientSelected={(client) => {
              setSelectedClient(client);
              setIsNewClient(false);
            }}
            onQuickAdd={(data) => {
              setNewClientData(data);
              setIsNewClient(true);
              setSelectedClient({ id: 'new', firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone });
            }}
            searchClients={searchClients}
          />
        )}

        {currentPhase === 1 && (
          <Phase1POMTriage
            brand={brand}
            prescribers={prescribers}
            value={pomData}
            onChange={setPomData}
            errors={phaseErrors}
          />
        )}

        {currentPhase === 2 && (
          <Phase2LegalConsent
            brand={brand}
            screeningResponses={screeningResponses}
            onScreeningChange={handleScreeningChange}
            signatureData={signatureData}
            onSignatureChange={setSignatureData}
            signedByName={signedByName}
            onSignedByNameChange={setSignedByName}
            consentAccepted={consentAccepted}
            onConsentChange={setConsentAccepted}
            hardStops={hardStops}
            softWarnings={softWarnings}
            errors={phaseErrors}
          />
        )}

        {currentPhase === 3 && (
          <Phase3ClinicalRecord
            brand={brand}
            value={clinicalData}
            onChange={setClinicalData}
            beforePhotos={beforePhotos}
            onPhotoCapture={(photo) => setBeforePhotos((prev) => [...prev, photo])}
            onPhotoDelete={(i) => setBeforePhotos((prev) => prev.filter((_, idx) => idx !== i))}
            onOpenFacialMapping={() => setShowFacialMapping(true)}
            errors={phaseErrors}
          />
        )}

        {currentPhase === 4 && (
          <Phase4CloseOut
            brand={brand}
            afterPhotos={afterPhotos}
            onPhotoCapture={(photo) => setAfterPhotos((prev) => [...prev, photo])}
            onPhotoDelete={(i) => setAfterPhotos((prev) => prev.filter((_, idx) => idx !== i))}
            aftercareProvided={aftercareProvided}
            onAftercareChange={setAftercareProvided}
            sendAftercareEmail={sendAftercareEmail}
            onSendEmailChange={setSendAftercareEmail}
            aftercareTemplateId={aftercareTemplateId}
            onTemplateChange={setAftercareTemplateId}
            followUpDate={followUpDate}
            onFollowUpDateChange={setFollowUpDate}
            followUpNotes={followUpNotes}
            onFollowUpNotesChange={setFollowUpNotes}
            errors={phaseErrors}
            clientEmail={selectedClient?.email}
          />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {!isFirstPhase && (
            <Button type="button" variant="outline" onClick={goToPreviousPhase} className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>

          {isLastPhase ? (
            <Button
              type="button"
              onClick={handleComplete}
              disabled={isSubmitting || !!stoppedAtPhase}
              className="gap-1 text-white"
              style={{ backgroundColor: theme.primary }}
            >
              {isSubmitting ? 'Completing...' : 'Complete Journey'}
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goToNextPhase}
              disabled={!!stoppedAtPhase}
              className="gap-1 text-white"
              style={{ backgroundColor: theme.primary }}
            >
              Next Phase
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

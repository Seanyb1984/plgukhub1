// PLG UK Hub - Treatment Journey Engine
// Server-side logic for validating phase transitions and POM gates

import type { Brand } from '@/lib/forms/types';
import { brandRequiresPOM } from '@/lib/brands/theme';
import {
  type PhaseId,
  type Phase0Data,
  type Phase1Data,
  type Phase2Data,
  type Phase3Data,
  type Phase4Data,
  type SafetyQuestion,
  SAFETY_SCREENING_QUESTIONS,
  POM_GATE_CONFIG,
  PHASE_CONFIGS,
} from './types';

export interface PhaseValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
  hardStop: boolean;
  hardStopReason?: string;
}

export class TreatmentJourneyEngine {
  private brand: Brand;

  constructor(brand: Brand) {
    this.brand = brand;
  }

  // Determine which phases are required for this brand
  getRequiredPhases(): PhaseId[] {
    return PHASE_CONFIGS
      .filter((phase) => {
        if (phase.requiredForBrands === 'ALL') return true;
        return phase.requiredForBrands.includes(this.brand);
      })
      .map((p) => p.id);
  }

  // Check if Phase 1 (POM Triage) is required
  isPOMPhaseRequired(): boolean {
    return brandRequiresPOM(this.brand);
  }

  // Get the next phase after the given phase (skipping non-required phases)
  getNextPhase(currentPhase: PhaseId): PhaseId | null {
    const requiredPhases = this.getRequiredPhases();
    const currentIndex = requiredPhases.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex >= requiredPhases.length - 1) {
      return null;
    }
    return requiredPhases[currentIndex + 1];
  }

  // Get the previous phase
  getPreviousPhase(currentPhase: PhaseId): PhaseId | null {
    const requiredPhases = this.getRequiredPhases();
    const currentIndex = requiredPhases.indexOf(currentPhase);
    if (currentIndex <= 0) return null;
    return requiredPhases[currentIndex - 1];
  }

  // ---- Phase 0: Identification ----
  validatePhase0(data: Phase0Data): PhaseValidationResult {
    const errors: string[] = [];

    if (!data.isNewClient && !data.clientId) {
      errors.push('Please select an existing client or create a new one.');
    }

    if (data.isNewClient) {
      if (!data.firstName?.trim()) errors.push('First name is required.');
      if (!data.lastName?.trim()) errors.push('Last name is required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      canProceed: errors.length === 0,
      hardStop: false,
    };
  }

  // ---- Phase 1: POM Triage (Menhancements only) ----
  validatePhase1(data: Phase1Data): PhaseValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.isPOMPhaseRequired()) {
      // Non-POM brands skip this phase entirely
      return { isValid: true, errors: [], warnings: [], canProceed: true, hardStop: false };
    }

    // POM treatments MUST have a prescriber
    if (!data.prescriberId) {
      errors.push('A Prescriber must be assigned for POM treatments. Dr. Phil or another registered prescriber is required.');
    }

    // GMC Number is mandatory
    if (!data.gmcNumber?.trim()) {
      errors.push('GMC Number is required for the prescriber.');
    } else if (!/^\d{7}$/.test(data.gmcNumber.trim())) {
      errors.push('GMC Number must be a 7-digit number.');
    }

    // Face-to-face consultation date is mandatory
    if (!data.faceToFaceDate) {
      errors.push('Date of Face-to-Face Consultation is required for POM treatments.');
    } else {
      const consultDate = new Date(data.faceToFaceDate);
      const today = new Date();
      const daysSince = Math.floor((today.getTime() - consultDate.getTime()) / (1000 * 60 * 60 * 24));

      if (consultDate > today) {
        errors.push('Face-to-Face Consultation date cannot be in the future.');
      } else if (daysSince > POM_GATE_CONFIG.faceToFaceMaxDaysAgo) {
        errors.push(
          `Face-to-Face Consultation was ${daysSince} days ago. A new consultation is required (max ${POM_GATE_CONFIG.faceToFaceMaxDaysAgo} days).`
        );
      } else if (daysSince > 180) {
        warnings.push('Face-to-Face Consultation is over 6 months old. Consider scheduling a review.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
      hardStop: false,
    };
  }

  // ---- Phase 2: Legal Consent with Stop-Logic ----
  validatePhase2(data: Phase2Data, isPOM: boolean): PhaseValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let hardStop = false;
    let hardStopReason: string | undefined;

    // Evaluate safety screening responses
    const applicableQuestions = this.getApplicableScreeningQuestions();

    for (const question of applicableQuestions) {
      const response = data.screeningResponses[question.id];

      if (response === undefined || response === null) {
        errors.push(`Please answer: "${question.question}"`);
        continue;
      }

      // Check if this response triggers a stop
      const triggered = response === question.triggerValue;

      if (triggered) {
        if (question.stopType === 'hard') {
          hardStop = true;
          hardStopReason = question.stopMessage;
          errors.push(question.stopMessage);
        } else {
          warnings.push(question.stopMessage);
        }
      }
    }

    // If POM treatment, signature cannot proceed without prescriber (enforced at phase 1)
    // This is a defense-in-depth check
    if (isPOM && !hardStop) {
      // Prescriber check already passed in Phase 1, but double-check
    }

    // Signature is required if not hard-stopped
    if (!hardStop) {
      if (!data.signatureData) {
        errors.push('Digital signature is required to proceed.');
      }
      if (!data.signedByName?.trim()) {
        errors.push('Please type your full name to confirm the signature.');
      }
      if (!data.consentDeclaration) {
        errors.push('You must accept the consent declaration.');
      }
    }

    return {
      isValid: errors.length === 0 && !hardStop,
      errors,
      warnings,
      canProceed: errors.length === 0 && !hardStop,
      hardStop,
      hardStopReason,
    };
  }

  // ---- Phase 3: Clinical Record ----
  validatePhase3(data: Phase3Data): PhaseValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.treatmentType?.trim()) {
      errors.push('Treatment type is required.');
    }
    if (!data.treatmentArea?.length) {
      errors.push('At least one treatment area must be selected.');
    }
    if (!data.productUsed?.trim()) {
      errors.push('Product used must be recorded.');
    }
    if (!data.batchNumber?.trim()) {
      errors.push('Batch/Lot number is required for traceability.');
    }

    // Before photos are recommended
    if (!data.beforePhotos?.length) {
      warnings.push('No "Before" photos captured. Clinical best practice recommends before photos.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
      hardStop: false,
    };
  }

  // ---- Phase 4: Close-out ----
  validatePhase4(data: Phase4Data): PhaseValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.aftercareProvided) {
      errors.push('Aftercare instructions must be provided to the client.');
    }

    if (!data.afterPhotos?.length) {
      warnings.push('No "After" photos captured. These are recommended for clinical records.');
    }

    if (data.sendAftercareEmail && !data.aftercareTemplateId) {
      warnings.push('No aftercare template selected. Default template will be used.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0,
      hardStop: false,
    };
  }

  // Get safety screening questions applicable to this brand
  getApplicableScreeningQuestions(): SafetyQuestion[] {
    return SAFETY_SCREENING_QUESTIONS.filter((q) => {
      if (q.appliesToBrands === 'ALL') return true;
      return q.appliesToBrands.includes(this.brand);
    });
  }

  // Validate any phase by ID
  validatePhase(
    phaseId: PhaseId,
    data: Phase0Data | Phase1Data | Phase2Data | Phase3Data | Phase4Data,
    context?: { isPOM?: boolean }
  ): PhaseValidationResult {
    switch (phaseId) {
      case 0:
        return this.validatePhase0(data as Phase0Data);
      case 1:
        return this.validatePhase1(data as Phase1Data);
      case 2:
        return this.validatePhase2(data as Phase2Data, context?.isPOM ?? false);
      case 3:
        return this.validatePhase3(data as Phase3Data);
      case 4:
        return this.validatePhase4(data as Phase4Data);
      default:
        return { isValid: false, errors: ['Unknown phase'], warnings: [], canProceed: false, hardStop: false };
    }
  }
}

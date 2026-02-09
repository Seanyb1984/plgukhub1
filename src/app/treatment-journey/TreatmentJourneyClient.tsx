'use client';

// PLG UK Hub - Treatment Journey Client Component
// Wraps FormRenderer with server action callbacks and brand detection

import React, { useState, useCallback } from 'react';
import { FormRenderer } from '@/components/treatment-journey/FormRenderer';
import { FacialMappingCanvas } from '@/components/facial-mapping/FacialMappingCanvas';
import { getBrandTheme, getBrandCSSVariables } from '@/lib/brands/theme';
import type { Brand } from '@/lib/forms/types';
import type { PhaseId, FacialMappingData } from '@/lib/treatment-journey/types';
import {
  searchClientsAction,
  saveTreatmentJourneyDraftAction,
  completeTreatmentJourneyAction,
} from '@/lib/actions/treatment-journey';
import {
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TreatmentJourneyClientProps {
  prescribers: Array<{ id: string; name: string; gmcNumber: string; prescriberType: string }>;
}

export function TreatmentJourneyClient({ prescribers }: TreatmentJourneyClientProps) {
  // Brand selection (in production, this would come from the user's session)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [completedJourney, setCompletedJourney] = useState<{ id: string; journeyNumber: string } | null>(null);

  const brands: { id: Brand; label: string; description: string }[] = [
    { id: 'MENHANCEMENTS', label: 'Menhancements', description: 'Medical Aesthetics (POM)' },
    { id: 'WAX_FOR_MEN', label: 'Wax for Men', description: 'Professional Male Grooming' },
    { id: 'WAX_FOR_WOMEN', label: 'Wax for Women', description: 'Professional Beauty & Waxing' },
  ];

  // Client search callback
  const handleSearchClients = useCallback(async (query: string) => {
    return searchClientsAction(query);
  }, []);

  // Save draft callback
  const handleSaveDraft = useCallback(async (journeyData: Record<string, unknown>, phase: PhaseId) => {
    await saveTreatmentJourneyDraftAction(journeyData, phase);
  }, []);

  // Complete journey callback
  const handleComplete = useCallback(async (journeyData: Record<string, unknown>) => {
    const result = await completeTreatmentJourneyAction(journeyData);
    setCompletedJourney(result);
    setJourneyComplete(true);
  }, []);

  // Cancel callback
  const handleCancel = useCallback(() => {
    setSelectedBrand(null);
  }, []);

  // Brand selection screen
  if (!selectedBrand) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PLG UK Hub</h1>
          <p className="text-gray-500">Select a brand to begin a new treatment journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => {
            const theme = getBrandTheme(brand.id);
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => setSelectedBrand(brand.id)}
                className="group relative p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold mb-4"
                  style={{ backgroundColor: theme.primary }}
                >
                  {brand.label.charAt(0)}
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: theme.text }}>
                  {brand.label}
                </h2>
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {brand.description}
                </p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: theme.primary }}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Journey complete screen
  if (journeyComplete && completedJourney) {
    const theme = getBrandTheme(selectedBrand);
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${theme.stepCompleted}20` }}
        >
          <CheckCircle2 className="w-10 h-10" style={{ color: theme.stepCompleted }} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Treatment Journey Complete</h1>
        <p className="text-gray-500 mb-1">
          Journey reference: <strong>{completedJourney.journeyNumber}</strong>
        </p>
        <p className="text-gray-500 mb-8">
          All phases have been completed and recorded successfully.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setJourneyComplete(false);
              setCompletedJourney(null);
              setSelectedBrand(null);
            }}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Button>
          <Button
            type="button"
            onClick={() => {
              setJourneyComplete(false);
              setCompletedJourney(null);
            }}
            className="text-white"
            style={{ backgroundColor: theme.primary }}
          >
            Start New Journey
          </Button>
        </div>
      </div>
    );
  }

  // Active journey
  return (
    <div className="px-6 py-8">
      <FormRenderer
        brand={selectedBrand}
        siteId="default-site" // Would come from session
        practitionerId="default-practitioner" // Would come from session
        searchClients={handleSearchClients}
        prescribers={prescribers}
        onComplete={handleComplete}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
      />
    </div>
  );
}

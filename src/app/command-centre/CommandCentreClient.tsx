'use client';

// PLG UK Hub - Command Centre Client Component
// Governance forms: Fire Safety, Cleaning, Training, Equipment, Incidents, Waste

import React, { useState, useCallback } from 'react';
import {
  GovernanceFormRenderer,
  getAllGovernanceFormConfigs,
  type GovernanceFormType,
} from '@/components/command-centre/GovernanceFormRenderer';
import { getBrandTheme } from '@/lib/brands/theme';
import { submitGovernanceFormAction } from '@/lib/actions/treatment-journey';
import { Button } from '@/components/ui/button';
import {
  Shield,
  ArrowLeft,
  CheckCircle2,
  Flame,
  SprayCan,
  GraduationCap,
  Wrench,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import type { Brand } from '@/lib/forms/types';

const FORM_ICONS: Record<string, React.ReactNode> = {
  FIRE_SAFETY_CHECK: <Flame className="w-6 h-6" />,
  CLEANING_LOG: <SprayCan className="w-6 h-6" />,
  STAFF_TRAINING_SIGNOFF: <GraduationCap className="w-6 h-6" />,
  EQUIPMENT_CHECK: <Wrench className="w-6 h-6" />,
  INCIDENT_REPORT: <AlertTriangle className="w-6 h-6" />,
  WASTE_DISPOSAL_LOG: <Trash2 className="w-6 h-6" />,
};

export function CommandCentreClient() {
  const [activeForm, setActiveForm] = useState<GovernanceFormType | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const brand: Brand = 'PLG_UK'; // Command centre uses PLG_UK branding
  const theme = getBrandTheme(brand);
  const forms = getAllGovernanceFormConfigs();

  const handleSubmit = useCallback(
    async (data: {
      formType: GovernanceFormType;
      data: Record<string, unknown>;
      signatureData: string;
      isCompliant: boolean;
      issues: string[];
    }) => {
      await submitGovernanceFormAction({
        formType: data.formType,
        brand,
        siteId: 'default-site', // Would come from session
        completedById: 'default-user', // Would come from session
        formData: data.data,
        signatureData: data.signatureData,
        isCompliant: data.isCompliant,
        issues: data.issues,
      });
      setSubmitSuccess(true);
    },
    [brand]
  );

  // Success screen
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-50">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted</h1>
        <p className="text-gray-500 mb-8">Governance record has been logged and signed successfully.</p>
        <div className="flex gap-3 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitSuccess(false);
              setActiveForm(null);
            }}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Command Centre
          </Button>
        </div>
      </div>
    );
  }

  // Active form
  if (activeForm) {
    return (
      <div className="px-6 py-8">
        <GovernanceFormRenderer
          formType={activeForm}
          brand={brand}
          onSubmit={handleSubmit}
          onCancel={() => setActiveForm(null)}
        />
      </div>
    );
  }

  // Form selection grid
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: theme.primary }}>
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>Command Centre</h1>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            Governance, compliance, and operational checks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <button
            key={form.type}
            type="button"
            onClick={() => setActiveForm(form.type)}
            className="group p-5 rounded-xl border bg-white text-left transition-all hover:shadow-md hover:border-gray-300"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: theme.primary }}
              >
                {FORM_ICONS[form.type] || <Shield className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {form.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{form.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// PLG UK Hub - Brand Theme System
// Detects user brand and switches theme: Menhancements (clinical/premium),
// Waxing brands (efficient/clean)

import type { Brand } from '@/lib/forms/types';

export interface BrandTheme {
  brand: Brand;
  label: string;
  tagline: string;
  // Color palette
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textMuted: string;
  // Semantic colours
  success: string;
  warning: string;
  danger: string;
  info: string;
  // Stepper colours
  stepActive: string;
  stepCompleted: string;
  stepPending: string;
  // Typography
  headingFont: string;
  bodyFont: string;
  // Logo/icon hint
  logoPath: string;
}

export const BRAND_THEMES: Record<Brand, BrandTheme> = {
  MENHANCEMENTS: {
    brand: 'MENHANCEMENTS',
    label: 'Menhancements',
    tagline: 'Premium Medical Aesthetics for Men',
    // Clinical / Premium - Dark charcoal with gold accents
    primary: '#1a1a2e',
    primaryHover: '#16213e',
    primaryForeground: '#ffffff',
    secondary: '#c9a84c',
    secondaryHover: '#b8963a',
    accent: '#e2b04a',
    background: '#f8f7f4',
    surface: '#ffffff',
    surfaceHover: '#f5f3ef',
    border: '#d4cfc5',
    text: '#1a1a2e',
    textMuted: '#6b6b7b',
    success: '#2d6a4f',
    warning: '#e9c46a',
    danger: '#c1121f',
    info: '#457b9d',
    stepActive: '#c9a84c',
    stepCompleted: '#2d6a4f',
    stepPending: '#d4cfc5',
    headingFont: '"Geist", "Inter", system-ui, sans-serif',
    bodyFont: '"Geist", "Inter", system-ui, sans-serif',
    logoPath: '/brands/menhancements-logo.svg',
  },

  WAX_FOR_MEN: {
    brand: 'WAX_FOR_MEN',
    label: 'Wax for Men',
    tagline: 'Professional Male Grooming',
    // Clean / Efficient - Steel blue with sharp edges
    primary: '#2b4162',
    primaryHover: '#1d3050',
    primaryForeground: '#ffffff',
    secondary: '#4a90d9',
    secondaryHover: '#3a7ec5',
    accent: '#5da3ed',
    background: '#f4f6f9',
    surface: '#ffffff',
    surfaceHover: '#eef2f7',
    border: '#d1d9e6',
    text: '#1e293b',
    textMuted: '#64748b',
    success: '#059669',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#2563eb',
    stepActive: '#4a90d9',
    stepCompleted: '#059669',
    stepPending: '#d1d9e6',
    headingFont: '"Geist", "Inter", system-ui, sans-serif',
    bodyFont: '"Geist", "Inter", system-ui, sans-serif',
    logoPath: '/brands/wax-for-men-logo.svg',
  },

  WAX_FOR_WOMEN: {
    brand: 'WAX_FOR_WOMEN',
    label: 'Wax for Women',
    tagline: 'Professional Beauty & Waxing',
    // Soft / Clean - Soft rose with warm undertones
    primary: '#7c3a5e',
    primaryHover: '#6b2f50',
    primaryForeground: '#ffffff',
    secondary: '#d4758b',
    secondaryHover: '#c46378',
    accent: '#e8a0b2',
    background: '#fdf6f8',
    surface: '#ffffff',
    surfaceHover: '#fdf0f3',
    border: '#ebd4db',
    text: '#3d1c2e',
    textMuted: '#8b6b7a',
    success: '#059669',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#7c3aed',
    stepActive: '#d4758b',
    stepCompleted: '#059669',
    stepPending: '#ebd4db',
    headingFont: '"Geist", "Inter", system-ui, sans-serif',
    bodyFont: '"Geist", "Inter", system-ui, sans-serif',
    logoPath: '/brands/wax-for-women-logo.svg',
  },

  PLG_UK: {
    brand: 'PLG_UK',
    label: 'PLG UK',
    tagline: 'PLG UK Hub - Multi-Brand Management',
    // Corporate / Neutral - Slate with teal accent
    primary: '#0f172a',
    primaryHover: '#1e293b',
    primaryForeground: '#ffffff',
    secondary: '#0d9488',
    secondaryHover: '#0f766e',
    accent: '#14b8a6',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceHover: '#f1f5f9',
    border: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    success: '#059669',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0284c7',
    stepActive: '#0d9488',
    stepCompleted: '#059669',
    stepPending: '#e2e8f0',
    headingFont: '"Geist", "Inter", system-ui, sans-serif',
    bodyFont: '"Geist", "Inter", system-ui, sans-serif',
    logoPath: '/brands/plg-uk-logo.svg',
  },
};

export function getBrandTheme(brand: Brand): BrandTheme {
  return BRAND_THEMES[brand] ?? BRAND_THEMES.PLG_UK;
}

export function getBrandCSSVariables(brand: Brand): Record<string, string> {
  const theme = getBrandTheme(brand);
  return {
    '--brand-primary': theme.primary,
    '--brand-primary-hover': theme.primaryHover,
    '--brand-primary-fg': theme.primaryForeground,
    '--brand-secondary': theme.secondary,
    '--brand-secondary-hover': theme.secondaryHover,
    '--brand-accent': theme.accent,
    '--brand-bg': theme.background,
    '--brand-surface': theme.surface,
    '--brand-surface-hover': theme.surfaceHover,
    '--brand-border': theme.border,
    '--brand-text': theme.text,
    '--brand-text-muted': theme.textMuted,
    '--brand-success': theme.success,
    '--brand-warning': theme.warning,
    '--brand-danger': theme.danger,
    '--brand-info': theme.info,
    '--brand-step-active': theme.stepActive,
    '--brand-step-completed': theme.stepCompleted,
    '--brand-step-pending': theme.stepPending,
  };
}

// Determine if a brand requires POM (Prescription-Only Medicine) workflows
export function brandRequiresPOM(brand: Brand): boolean {
  return brand === 'MENHANCEMENTS';
}

// Determine if a brand is a waxing brand (simpler workflow)
export function isWaxingBrand(brand: Brand): boolean {
  return brand === 'WAX_FOR_MEN' || brand === 'WAX_FOR_WOMEN';
}

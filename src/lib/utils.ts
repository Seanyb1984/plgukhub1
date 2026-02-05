import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateResumeToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatBrand(brand: string): string {
  const brandLabels: Record<string, string> = {
    MENHANCEMENTS: 'Menhancements',
    WAX_FOR_MEN: 'Wax for Men',
    WAX_FOR_WOMEN: 'Wax for Women',
    PLG_UK: 'PLG UK',
  };
  return brandLabels[brand] || brand;
}

export function formatRole(role: string): string {
  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrator',
    PRACTITIONER: 'Practitioner',
    RECEPTION: 'Reception',
  };
  return roleLabels[role] || role;
}

export function formatStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    SIGNED: 'Signed',
    LOCKED: 'Locked',
    AMENDED: 'Amended',
  };
  return statusLabels[status] || status;
}

export function formatRiskLevel(level: string): string {
  const riskLabels: Record<string, string> = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };
  return riskLabels[level] || level;
}

export function getRiskLevelColor(level: string): string {
  const colors: Record<string, string> = {
    NONE: 'text-gray-500',
    LOW: 'text-yellow-600',
    MEDIUM: 'text-orange-600',
    HIGH: 'text-red-600',
    CRITICAL: 'text-red-800 font-bold',
  };
  return colors[level] || 'text-gray-500';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    SIGNED: 'bg-green-100 text-green-800',
    LOCKED: 'bg-purple-100 text-purple-800',
    AMENDED: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

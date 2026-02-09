'use client';

// PLG UK Hub - Compliance Status Badge
// Displays GREEN/AMBER/RED status from the Legal Watchdog scanner

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, ChevronDown, ExternalLink, Eye, X } from 'lucide-react';
import { getComplianceStatusAction } from '@/lib/actions/treatment-journey';

interface ComplianceStatus {
  status: 'GREEN' | 'AMBER' | 'RED';
  unreadCount: number;
  actionRequiredCount: number;
  lastScanAt: string | null;
  recentAlerts: Array<{
    id: string;
    source: string;
    title: string;
    severity: string;
    scannedAt: string;
  }>;
}

const STATUS_CONFIG = {
  GREEN: {
    label: 'Compliant',
    icon: ShieldCheck,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
  },
  AMBER: {
    label: 'Review Needed',
    icon: ShieldAlert,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500',
  },
  RED: {
    label: 'Action Required',
    icon: ShieldX,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
  },
};

export function ComplianceBadge() {
  const [status, setStatus] = useState<ComplianceStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComplianceStatusAction()
      .then(setStatus)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !status) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-500 text-sm">
        <Shield className="w-4 h-4 animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  const config = STATUS_CONFIG[status.status];
  const Icon = config.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
          config.bgColor,
          config.borderColor,
          config.textColor,
          'hover:shadow-md'
        )}
      >
        <span className={cn('w-2 h-2 rounded-full', config.dotColor)} />
        <Icon className="w-4 h-4" />
        <span>{config.label}</span>
        {status.unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {status.unreadCount}
          </span>
        )}
        <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Compliance Status</h3>
              <p className="text-xs text-gray-500">
                Last scan: {status.lastScanAt
                  ? new Date(status.lastScanAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : 'Never'}
              </p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 border-b bg-gray-50 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{status.unreadCount}</p>
              <p className="text-xs text-gray-500">Unread Alerts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{status.actionRequiredCount}</p>
              <p className="text-xs text-gray-500">Action Required</p>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {status.recentAlerts.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-400">No recent alerts</p>
            ) : (
              status.recentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded',
                          alert.severity === 'ACTION_REQUIRED' && 'bg-red-100 text-red-700',
                          alert.severity === 'WARNING' && 'bg-amber-100 text-amber-700',
                          alert.severity === 'INFO' && 'bg-blue-100 text-blue-700'
                        )}>
                          {alert.source}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(alert.scannedAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mt-1 line-clamp-2">{alert.title}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

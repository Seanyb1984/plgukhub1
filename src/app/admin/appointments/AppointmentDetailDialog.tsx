'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  User,
  Clock,
  MapPin,
  Syringe,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface AppointmentData {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  source: string;
  notes: string | null;
  cancellationReason: string | null;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
  };
  treatment: {
    id: string;
    name: string;
    category: string;
    durationMins: number;
    isPom: boolean;
  };
  user: {
    id: string;
    name: string;
    colour: string | null;
    role: string;
  };
  room: {
    id: string;
    name: string;
  } | null;
}

interface AppointmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange: () => void;
  appointment: AppointmentData | null;
}

// ============================================
// STATUS CONFIG
// ============================================

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'secondary' }
> = {
  BOOKED: { label: 'Booked', variant: 'blue' },
  CONFIRMED: { label: 'Confirmed', variant: 'blue' },
  CHECKED_IN: { label: 'Checked In', variant: 'amber' },
  IN_PROGRESS: { label: 'In Progress', variant: 'purple' },
  COMPLETED: { label: 'Completed', variant: 'green' },
  NO_SHOW: { label: 'No Show', variant: 'red' },
  CANCELLED_BY_CLIENT: { label: 'Cancelled (Client)', variant: 'secondary' },
  CANCELLED_BY_CLINIC: { label: 'Cancelled (Clinic)', variant: 'secondary' },
};

type ActionKey = 'check_in' | 'start' | 'complete' | 'cancel_client' | 'cancel_clinic' | 'no_show' | 'confirm';

const STATUS_ACTIONS: Record<string, { action: ActionKey; label: string; variant: 'primary' | 'default' | 'destructive' | 'warning' | 'success' | 'outline' }[]> = {
  BOOKED: [
    { action: 'confirm', label: 'Confirm', variant: 'outline' },
    { action: 'check_in', label: 'Check In', variant: 'primary' },
    { action: 'no_show', label: 'No Show', variant: 'warning' },
    { action: 'cancel_client', label: 'Cancel (Client)', variant: 'destructive' },
  ],
  CONFIRMED: [
    { action: 'check_in', label: 'Check In', variant: 'primary' },
    { action: 'no_show', label: 'No Show', variant: 'warning' },
    { action: 'cancel_client', label: 'Cancel (Client)', variant: 'destructive' },
  ],
  CHECKED_IN: [
    { action: 'start', label: 'Start Treatment', variant: 'primary' },
    { action: 'no_show', label: 'No Show', variant: 'warning' },
    { action: 'cancel_clinic', label: 'Cancel (Clinic)', variant: 'destructive' },
  ],
  IN_PROGRESS: [
    { action: 'complete', label: 'Complete', variant: 'success' },
    { action: 'cancel_clinic', label: 'Cancel (Clinic)', variant: 'destructive' },
  ],
  COMPLETED: [],
  NO_SHOW: [],
  CANCELLED_BY_CLIENT: [],
  CANCELLED_BY_CLINIC: [],
};

// ============================================
// COMPONENT
// ============================================

export default function AppointmentDetailDialog({
  open,
  onClose,
  onStatusChange,
  appointment,
}: AppointmentDetailDialogProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!appointment) return null;

  const statusCfg = STATUS_CONFIG[appointment.status] || {
    label: appointment.status,
    variant: 'secondary' as const,
  };
  const actions = STATUS_ACTIONS[appointment.status] || [];

  const startDt = new Date(appointment.startTime);
  const endDt = new Date(appointment.endTime);

  const handleAction = async (action: ActionKey) => {
    // For cancel actions, require a reason
    if ((action === 'cancel_client' || action === 'cancel_clinic') && !showCancelInput) {
      setShowCancelInput(true);
      return;
    }
    if ((action === 'cancel_client' || action === 'cancel_clinic') && !cancelReason.trim()) {
      setError('Cancellation reason is required');
      return;
    }

    setActionLoading(action);
    setError('');

    try {
      const res = await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          cancellationReason: cancelReason || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update status');
        return;
      }

      setShowCancelInput(false);
      setCancelReason('');
      onStatusChange();
    } catch {
      setError('Network error');
    } finally {
      setActionLoading(null);
    }
  };

  const isTerminal = ['COMPLETED', 'NO_SHOW', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC'].includes(
    appointment.status
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="flex-1">Appointment Details</DialogTitle>
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </div>
          <DialogDescription>
            {format(startDt, 'EEEE d MMMM yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <User className="w-4 h-4 text-slate-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">
                {appointment.client.firstName} {appointment.client.lastName}
              </p>
              <div className="flex flex-col gap-0.5 mt-1">
                {appointment.client.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="w-3 h-3" />
                    {appointment.client.phone}
                  </div>
                )}
                {appointment.client.email && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="w-3 h-3" />
                    {appointment.client.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Treatment + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Syringe className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Treatment</p>
                <p className="text-sm font-medium text-slate-800">
                  {appointment.treatment.name}
                </p>
                {appointment.treatment.isPom && (
                  <span className="text-[10px] text-amber-700 font-medium">POM</span>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Time</p>
                <p className="text-sm font-medium text-slate-800">
                  {format(startDt, 'HH:mm')} - {format(endDt, 'HH:mm')}
                </p>
                <p className="text-xs text-slate-400">
                  {appointment.treatment.durationMins}min
                </p>
              </div>
            </div>
          </div>

          {/* Practitioner + Room */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <div
                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: appointment.user.colour || '#6366f1' }}
              />
              <div>
                <p className="text-xs text-slate-500">Practitioner</p>
                <p className="text-sm font-medium text-slate-800">
                  {appointment.user.name}
                </p>
              </div>
            </div>
            {appointment.room && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Room</p>
                  <p className="text-sm font-medium text-slate-800">
                    {appointment.room.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500">Notes</p>
                <p className="text-sm text-slate-700">{appointment.notes}</p>
              </div>
            </div>
          )}

          {/* Cancellation reason */}
          {appointment.cancellationReason && (
            <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-xs text-red-600 font-medium">Cancellation Reason</p>
                <p className="text-sm text-red-700">{appointment.cancellationReason}</p>
              </div>
            </div>
          )}

          {/* Cancel reason input */}
          {showCancelInput && (
            <div>
              <Label className="text-slate-700">Cancellation Reason</Label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={2}
                className="mt-1 flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                placeholder="Reason for cancellation..."
                autoFocus
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Status Actions */}
          {!isTerminal && actions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {actions.map((a) => (
                <Button
                  key={a.action}
                  variant={a.variant}
                  size="sm"
                  onClick={() => handleAction(a.action)}
                  loading={actionLoading === a.action}
                  disabled={actionLoading !== null}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

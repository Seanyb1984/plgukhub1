'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addMinutes } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { Search, AlertTriangle } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface StaffMember {
  id: string;
  name: string;
  colour: string | null;
  role: string;
}

interface TreatmentOption {
  id: string;
  name: string;
  category: string;
  durationMins: number;
  isPom: boolean;
  price: number;
  brand: string;
}

interface RoomOption {
  id: string;
  name: string;
}

interface ClientResult {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
}

interface NewAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  siteId: string;
  date: Date;
  staff: StaffMember[];
  treatments: TreatmentOption[];
  rooms: RoomOption[];
  prefillPractitionerId?: string;
  prefillTime?: string; // HH:mm
}

// ============================================
// COMPONENT
// ============================================

export default function NewAppointmentDialog({
  open,
  onClose,
  onCreated,
  siteId,
  date,
  staff,
  treatments,
  rooms,
  prefillPractitionerId,
  prefillTime,
}: NewAppointmentDialogProps) {
  // Form state
  const [practitionerId, setPractitionerId] = useState(prefillPractitionerId || '');
  const [treatmentId, setTreatmentId] = useState('');
  const [startTime, setStartTime] = useState(prefillTime || '09:00');
  const [roomId, setRoomId] = useState('');
  const [notes, setNotes] = useState('');

  // Client search
  const [clientQuery, setClientQuery] = useState('');
  const [clientResults, setClientResults] = useState<ClientResult[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientResult | null>(null);
  const [clientSearching, setClientSearching] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setPractitionerId(prefillPractitionerId || '');
      setStartTime(prefillTime || '09:00');
      setTreatmentId('');
      setRoomId('');
      setNotes('');
      setClientQuery('');
      setClientResults([]);
      setSelectedClient(null);
      setError('');
    }
  }, [open, prefillPractitionerId, prefillTime]);

  // Debounced client search
  const searchClients = useCallback(async (q: string) => {
    if (q.length < 2) {
      setClientResults([]);
      return;
    }
    setClientSearching(true);
    try {
      const res = await fetch(`/api/clients/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setClientResults(Array.isArray(data) ? data : []);
      }
    } catch {
      // silently fail
    } finally {
      setClientSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchClients(clientQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [clientQuery, searchClients]);

  // Compute end time from treatment duration
  const selectedTreatment = treatments.find((t) => t.id === treatmentId);
  const durationMins = selectedTreatment?.durationMins || 30;

  const dateStr = format(date, 'yyyy-MM-dd');
  const startDateTime = new Date(`${dateStr}T${startTime}:00`);
  const endDateTime = addMinutes(startDateTime, durationMins);
  const endTimeStr = format(endDateTime, 'HH:mm');

  // Group treatments by category
  const treatmentsByCategory = treatments.reduce<Record<string, TreatmentOption[]>>(
    (acc, t) => {
      const cat = t.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(t);
      return acc;
    },
    {}
  );

  const handleSubmit = async () => {
    if (!selectedClient) {
      setError('Select a client');
      return;
    }
    if (!practitionerId) {
      setError('Select a practitioner');
      return;
    }
    if (!treatmentId) {
      setError('Select a treatment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          clientId: selectedClient.id,
          userId: practitionerId,
          treatmentId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          roomId: roomId && roomId !== '__none__' ? roomId : null,
          notes: notes || null,
          source: 'RECEPTION',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create appointment');
        return;
      }

      onCreated();
      onClose();
    } catch {
      setError('Network error — could not create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
          <DialogDescription>
            {format(date, 'EEEE d MMMM yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client Search */}
          <div>
            <Label className="text-slate-700">Client</Label>
            {selectedClient ? (
              <div className="flex items-center justify-between mt-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedClient.email || selectedClient.phone || 'No contact info'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedClient(null);
                    setClientQuery('');
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={clientQuery}
                  onChange={(e) => setClientQuery(e.target.value)}
                  className="pl-9"
                />
                {clientResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {clientResults.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                        onClick={() => {
                          setSelectedClient(c);
                          setClientQuery('');
                          setClientResults([]);
                        }}
                      >
                        <span className="font-medium text-slate-800">
                          {c.firstName} {c.lastName}
                        </span>
                        {c.email && (
                          <span className="text-slate-400 ml-2">{c.email}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {clientSearching && (
                  <p className="text-xs text-slate-400 mt-1">Searching...</p>
                )}
              </div>
            )}
          </div>

          {/* Treatment Select */}
          <div>
            <Label className="text-slate-700">Treatment</Label>
            <Select value={treatmentId} onValueChange={setTreatmentId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select treatment" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(treatmentsByCategory).map(([cat, items]) => (
                  <SelectGroup key={cat}>
                    <SelectLabel>{cat.replace(/_/g, ' ').toUpperCase()}</SelectLabel>
                    {items.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} ({t.durationMins}min)
                        {t.isPom && ' [POM]'}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {selectedTreatment?.isPom && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5" />
                POM treatment — requires MD prescription
              </div>
            )}
          </div>

          {/* Practitioner + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-700">Practitioner</Label>
              <Select value={practitionerId} onValueChange={setPractitionerId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-700">Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min="07:00"
                max="21:00"
                step="900"
                className="mt-1"
              />
              <p className="text-xs text-slate-400 mt-0.5">
                Ends at {endTimeStr} ({durationMins}min)
              </p>
            </div>
          </div>

          {/* Room */}
          {rooms.length > 0 && (
            <div>
              <Label className="text-slate-700">Room (optional)</Label>
              <Select value={roomId} onValueChange={setRoomId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="No room assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No room</SelectItem>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label className="text-slate-700">Notes (optional)</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              placeholder="Booking notes..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

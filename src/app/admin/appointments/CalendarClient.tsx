'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { format, addDays, subDays, isToday, getHours, getMinutes, differenceInMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Loader2 } from 'lucide-react';
import NewAppointmentDialog from './NewAppointmentDialog';
import AppointmentDetailDialog from './AppointmentDetailDialog';

// ============================================
// Types
// ============================================
interface Site {
  id: string;
  name: string;
  brand: string;
}

interface StaffMember {
  id: string;
  name: string;
  colour: string | null;
  role: string;
}

interface AppointmentData {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  source: string;
  cancellationReason: string | null;
  client: { id: string; firstName: string; lastName: string; email: string | null; phone: string | null };
  user: { id: string; name: string; colour: string | null; role: string };
  treatment: { id: string; name: string; category: string; durationMins: number; price: number; isPom: boolean };
  room: { id: string; name: string } | null;
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

interface CalendarClientProps {
  sites: Site[];
}

// ============================================
// Constants
// ============================================
const HOUR_HEIGHT = 60; // px per hour
const START_HOUR = 7;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const STATUS_COLOURS: Record<string, string> = {
  BOOKED: 'bg-blue-100 border-blue-400 text-blue-800',
  CONFIRMED: 'bg-indigo-100 border-indigo-400 text-indigo-800',
  CHECKED_IN: 'bg-amber-100 border-amber-400 text-amber-800',
  IN_PROGRESS: 'bg-green-100 border-green-400 text-green-800',
  COMPLETED: 'bg-slate-100 border-slate-300 text-slate-600',
  NO_SHOW: 'bg-red-100 border-red-300 text-red-600',
  CANCELLED_BY_CLIENT: 'bg-gray-100 border-gray-300 text-gray-500',
  CANCELLED_BY_CLINIC: 'bg-gray-100 border-gray-300 text-gray-500',
};

const PRACTITIONER_COLOURS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#3b82f6', '#84cc16',
];

// ============================================
// Component
// ============================================
export default function CalendarClient({ sites }: CalendarClientProps) {
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [treatments, setTreatments] = useState<TreatmentOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [newApptDefaults, setNewApptDefaults] = useState<{ userId?: string; hour?: number; minute?: number }>({});
  const [detailAppt, setDetailAppt] = useState<AppointmentData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Current time indicator + scroll ref
  const [now, setNow] = useState(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on load
  useEffect(() => {
    if (gridRef.current && isToday(selectedDate) && !loading) {
      const currentHour = getHours(new Date());
      const scrollTo = Math.max(0, (currentHour - START_HOUR - 1) * HOUR_HEIGHT);
      gridRef.current.scrollTop = scrollTo;
    }
  }, [selectedDate, loading]);

  const fetchData = useCallback(async () => {
    if (!selectedSiteId) return;
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const res = await fetch(`/api/appointments?siteId=${selectedSiteId}&date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        setStaff(data.staff || []);
        setRooms(data.rooms || []);
        setTreatments(data.treatments || []);
      }
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSiteId, selectedDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Assign colours to practitioners who don't have one
  const staffWithColours = staff.map((s, i) => ({
    ...s,
    colour: s.colour || PRACTITIONER_COLOURS[i % PRACTITIONER_COLOURS.length],
  }));

  // Get appointments for a specific practitioner
  const getApptForStaff = (userId: string) =>
    appointments.filter((a) =>
      a.user.id === userId &&
      !['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC'].includes(a.status)
    );

  // Calculate position and height for an appointment block
  const getBlockStyle = (appt: AppointmentData) => {
    const start = new Date(appt.startTime);
    const end = new Date(appt.endTime);
    const startMins = (getHours(start) - START_HOUR) * 60 + getMinutes(start);
    const durationMins = differenceInMinutes(end, start);
    return {
      top: `${(startMins / 60) * HOUR_HEIGHT}px`,
      height: `${Math.max((durationMins / 60) * HOUR_HEIGHT - 2, 20)}px`,
    };
  };

  // Current time line position
  const nowMins = (getHours(now) - START_HOUR) * 60 + getMinutes(now);
  const showNowLine = isToday(selectedDate) && nowMins >= 0 && nowMins <= (END_HOUR - START_HOUR) * 60;

  // Handle clicking an empty slot
  const handleSlotClick = (userId: string, hour: number, quarter: number) => {
    setNewApptDefaults({ userId, hour, minute: quarter * 15 });
    setNewApptOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          {/* Site Picker */}
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Date Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDate((d) => subDays(d, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isToday(selectedDate)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            {format(selectedDate, 'EEEE, d MMMM yyyy')}
          </h2>
        </div>

        <button
          onClick={() => { setNewApptDefaults({}); setNewApptOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-6 py-2 border-b border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex-shrink-0">
        <span>
          <strong className="text-slate-700">{appointments.length}</strong> appointment{appointments.length !== 1 ? 's' : ''}
        </span>
        <span>
          <strong className="text-slate-700">{staffWithColours.length}</strong> staff on
        </span>
        <span>
          <strong className="text-slate-700">{appointments.filter((a) => a.status === 'COMPLETED').length}</strong> completed
        </span>
        <span>
          <strong className="text-slate-700">{appointments.filter((a) => a.status === 'NO_SHOW').length}</strong> no-shows
        </span>
      </div>

      {/* Calendar Grid */}
      <div ref={gridRef} className="flex-1 overflow-auto bg-slate-50">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : staffWithColours.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <User className="w-8 h-8 text-slate-300" />
            <p className="text-sm text-slate-500">No bookable staff found at this site.</p>
            <p className="text-xs text-slate-400">Set up staff schedules in Settings to see columns here.</p>
          </div>
        ) : (
          <div className="flex min-w-max">
            {/* Time Axis */}
            <div className="w-16 flex-shrink-0 border-r border-slate-200 bg-white sticky left-0 z-10">
              {/* Header spacer */}
              <div className="h-12 border-b border-slate-200" />
              {/* Hour labels */}
              <div className="relative" style={{ height: `${(END_HOUR - START_HOUR) * HOUR_HEIGHT}px` }}>
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full text-right pr-2"
                    style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT - 8}px` }}
                  >
                    <span className="text-[11px] text-slate-400 font-mono">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practitioner Columns */}
            {staffWithColours.map((member) => (
              <div key={member.id} className="flex-1 min-w-[200px] border-r border-slate-200">
                {/* Column Header */}
                <div className="h-12 flex items-center gap-2 px-3 border-b border-slate-200 bg-white sticky top-0 z-10">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: member.colour }}
                  />
                  <span className="text-sm font-medium text-slate-700 truncate">{member.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0">
                    {member.role}
                  </span>
                </div>

                {/* Day Column */}
                <div
                  className="relative bg-white"
                  style={{ height: `${(END_HOUR - START_HOUR) * HOUR_HEIGHT}px` }}
                >
                  {/* Hour grid lines */}
                  {HOURS.map((hour) => (
                    <div key={hour}>
                      <div
                        className="absolute w-full border-t border-slate-100"
                        style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
                      />
                      {/* Clickable 15-min slots */}
                      {[0, 1, 2, 3].map((q) => (
                        <div
                          key={q}
                          className="absolute w-full cursor-pointer hover:bg-indigo-50/50 transition-colors"
                          style={{
                            top: `${(hour - START_HOUR) * HOUR_HEIGHT + q * (HOUR_HEIGHT / 4)}px`,
                            height: `${HOUR_HEIGHT / 4}px`,
                          }}
                          onClick={() => handleSlotClick(member.id, hour, q)}
                        />
                      ))}
                    </div>
                  ))}

                  {/* Appointment Blocks */}
                  {getApptForStaff(member.id).map((appt) => {
                    const style = getBlockStyle(appt);
                    const statusClass = STATUS_COLOURS[appt.status] || STATUS_COLOURS.BOOKED;
                    return (
                      <div
                        key={appt.id}
                        className={`absolute left-1 right-1 rounded-md border-l-4 px-2 py-1 cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow ${statusClass}`}
                        style={{ ...style, borderLeftColor: member.colour }}
                        onClick={(e) => { e.stopPropagation(); setDetailAppt(appt); setDetailDialogOpen(true); }}
                      >
                        <p className="text-xs font-semibold truncate">
                          {appt.client.firstName} {appt.client.lastName}
                        </p>
                        <p className="text-[11px] truncate opacity-80">
                          {appt.treatment.name}
                        </p>
                        <p className="text-[10px] opacity-60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(appt.startTime), 'HH:mm')} - {format(new Date(appt.endTime), 'HH:mm')}
                        </p>
                      </div>
                    );
                  })}

                  {/* Current Time Line */}
                  {showNowLine && (
                    <div
                      className="absolute left-0 right-0 z-20 pointer-events-none"
                      style={{ top: `${(nowMins / 60) * HOUR_HEIGHT}px` }}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                        <div className="flex-1 h-[2px] bg-red-500" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <NewAppointmentDialog
        open={newApptOpen}
        onClose={() => setNewApptOpen(false)}
        onCreated={() => {
          setNewApptOpen(false);
          fetchData();
        }}
        siteId={selectedSiteId}
        date={selectedDate}
        staff={staffWithColours}
        treatments={treatments}
        rooms={rooms}
        prefillPractitionerId={newApptDefaults.userId}
        prefillTime={
          newApptDefaults.hour !== undefined && newApptDefaults.minute !== undefined
            ? `${String(newApptDefaults.hour).padStart(2, '0')}:${String(newApptDefaults.minute).padStart(2, '0')}`
            : undefined
        }
      />

      <AppointmentDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setDetailAppt(null);
        }}
        onStatusChange={() => {
          setDetailDialogOpen(false);
          setDetailAppt(null);
          fetchData();
        }}
        appointment={detailAppt}
      />
    </div>
  );
}

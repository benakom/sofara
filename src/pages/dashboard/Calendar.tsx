import { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Phone,
  Video, Coffee, FileText, X, CalendarDays, LayoutList, Trash2, Edit2
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, parseISO } from "date-fns";
import { fr, enUS } from "date-fns/locale";

type EventType = "call" | "meeting" | "follow-up" | "visit" | "signing" | "personal";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO
  time: string;
  endTime?: string;
  type: EventType;
  description?: string;
  location?: string;
  contact?: string;
}

const EVENT_CONFIG: Record<EventType, { label: string; labelEn: string; color: string; bg: string; border: string; icon: typeof Phone }> = {
  call:      { label: "Appel",       labelEn: "Call",       color: "text-violet-700", bg: "bg-violet-50",  border: "border-violet-200", icon: Phone },
  meeting:   { label: "Rendez-vous", labelEn: "Meeting",    color: "text-cyan-700",   bg: "bg-cyan-50",    border: "border-cyan-200",   icon: Video },
  "follow-up": { label: "Relance",   labelEn: "Follow-up",  color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  icon: Clock },
  visit:     { label: "Visite",      labelEn: "Visit",      color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: MapPin },
  signing:   { label: "Signature",   labelEn: "Signing",    color: "text-rose-700",   bg: "bg-rose-50",    border: "border-rose-200",   icon: FileText },
  personal:  { label: "Personnel",   labelEn: "Personal",   color: "text-slate-600",  bg: "bg-slate-50",   border: "border-slate-200",  icon: Coffee },
};

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Call avec Ahmed — Off-plan Emaar", date: "2026-03-07", time: "10:00", endTime: "10:30", type: "call", contact: "Ahmed B." },
  { id: "2", title: "Visite showroom DAMAC", date: "2026-03-09", time: "14:00", endTime: "16:00", type: "visit", location: "DAMAC Hills 2" },
  { id: "3", title: "Relance lead Sarah", date: "2026-03-06", time: "11:00", type: "follow-up", contact: "Sarah M." },
  { id: "4", title: "Signing — Booking Sobha", date: "2026-03-12", time: "09:00", endTime: "10:00", type: "signing", contact: "Jean-Pierre D.", location: "Sofara Office" },
  { id: "5", title: "Meeting équipe hebdo", date: "2026-03-10", time: "09:30", endTime: "10:00", type: "meeting" },
];

const Calendar = () => {
  const { lang } = useLanguage();
  const locale = lang === "fr" ? fr : enUS;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<"month" | "agenda">("month");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("");
  const [formType, setFormType] = useState<EventType>("call");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formContact, setFormContact] = useState("");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = useMemo(() => {
    const d: Date[] = [];
    let day = calStart;
    while (day <= calEnd) { d.push(day); day = addDays(day, 1); }
    return d;
  }, [currentMonth]);

  const getEventsForDate = (date: Date) =>
    events.filter(e => isSameDay(parseISO(e.date), date)).sort((a, b) => a.time.localeCompare(b.time));

  const selectedEvents = getEventsForDate(selectedDate);

  const upcomingEvents = useMemo(() =>
    events
      .filter(e => parseISO(e.date) >= new Date())
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 8),
    [events]
  );

  const resetForm = () => {
    setFormTitle(""); setFormDate(""); setFormTime("09:00"); setFormEndTime("");
    setFormType("call"); setFormDescription(""); setFormLocation(""); setFormContact("");
    setEditingEvent(null);
  };

  const openNewEvent = (date?: Date) => {
    resetForm();
    setFormDate(format(date || selectedDate, "yyyy-MM-dd"));
    setShowForm(true);
  };

  const openEditEvent = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setFormTitle(ev.title); setFormDate(ev.date); setFormTime(ev.time);
    setFormEndTime(ev.endTime || ""); setFormType(ev.type);
    setFormDescription(ev.description || ""); setFormLocation(ev.location || "");
    setFormContact(ev.contact || "");
    setShowForm(true);
  };

  const saveEvent = () => {
    if (!formTitle.trim() || !formDate || !formTime) return;
    const ev: CalendarEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      title: formTitle, date: formDate, time: formTime, endTime: formEndTime || undefined,
      type: formType, description: formDescription || undefined,
      location: formLocation || undefined, contact: formContact || undefined,
    };
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? ev : e));
    } else {
      setEvents(prev => [...prev, ev]);
    }
    setShowForm(false);
    resetForm();
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const weekDays = lang === "fr"
    ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const todayStats = useMemo(() => {
    const todayEvs = getEventsForDate(new Date());
    return { total: todayEvs.length, calls: todayEvs.filter(e => e.type === "call").length };
  }, [events]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[hsl(var(--dash-fg))] font-display">
            {lang === "fr" ? "Calendrier" : "Calendar"}
          </h1>
          <p className="text-sm text-[hsl(var(--dash-muted-fg))]">
            {lang === "fr" ? "Organisez vos rendez-vous et relances" : "Manage your appointments and follow-ups"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-[hsl(var(--dash-border))] overflow-hidden">
            <button
              onClick={() => setView("month")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "month" ? "bg-gradient-primary text-white" : "bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> {lang === "fr" ? "Mois" : "Month"}
            </button>
            <button
              onClick={() => setView("agenda")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "agenda" ? "bg-gradient-primary text-white" : "bg-[hsl(var(--dash-card))] text-[hsl(var(--dash-muted-fg))] hover:text-[hsl(var(--dash-fg))]"
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" /> Agenda
            </button>
          </div>
          <button
            onClick={() => openNewEvent()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-primary text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === "fr" ? "Nouvel événement" : "New event"}</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: lang === "fr" ? "Aujourd'hui" : "Today", value: todayStats.total, sub: lang === "fr" ? "événements" : "events" },
          { label: lang === "fr" ? "Appels prévus" : "Planned calls", value: todayStats.calls, sub: lang === "fr" ? "aujourd'hui" : "today" },
          { label: lang === "fr" ? "Cette semaine" : "This week", value: events.filter(e => { const d = parseISO(e.date); const now = new Date(); const weekEnd = addDays(now, 7); return d >= now && d <= weekEnd; }).length, sub: lang === "fr" ? "événements" : "events" },
          { label: lang === "fr" ? "Ce mois" : "This month", value: events.filter(e => isSameMonth(parseISO(e.date), currentMonth)).length, sub: lang === "fr" ? "total" : "total" },
        ].map((s, i) => (
          <div key={i} className="dash-card rounded-xl p-3 sm:p-4">
            <p className="text-xs text-[hsl(var(--dash-muted-fg))] mb-1">{s.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-[hsl(var(--dash-fg))]">{s.value}</p>
            <p className="text-[10px] text-[hsl(var(--dash-muted-fg))]">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
        {/* Main calendar / agenda */}
        <div className="dash-card rounded-xl overflow-hidden">
          {view === "month" ? (
            <>
              {/* Month navigation */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[hsl(var(--dash-border))]">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors text-[hsl(var(--dash-fg))]">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base sm:text-lg font-semibold text-[hsl(var(--dash-fg))] font-display capitalize">
                  {format(currentMonth, "MMMM yyyy", { locale })}
                </h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-[hsl(var(--dash-muted))] transition-colors text-[hsl(var(--dash-fg))]">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Week headers */}
              <div className="grid grid-cols-7 border-b border-[hsl(var(--dash-border))]">
                {weekDays.map(d => (
                  <div key={d} className="py-2 text-center text-[11px] font-semibold text-[hsl(var(--dash-muted-fg))] uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7">
                {days.map((day, i) => {
                  const dayEvents = getEventsForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const today = isToday(day);

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      className={`relative min-h-[68px] sm:min-h-[90px] p-1 sm:p-1.5 border-b border-r border-[hsl(var(--dash-border)/.5)] text-left transition-colors group
                        ${isSelected ? "bg-[hsl(var(--primary)/.06)]" : "hover:bg-[hsl(var(--dash-muted)/.5)]"}
                        ${!isCurrentMonth ? "opacity-40" : ""}
                      `}
                    >
                      <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-medium
                        ${today ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm" : ""}
                        ${isSelected && !today ? "ring-2 ring-[hsl(var(--dash-accent))] text-[hsl(var(--dash-accent))]" : "text-[hsl(var(--dash-fg))]"}
                      `}>
                        {format(day, "d")}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {dayEvents.slice(0, 2).map(ev => {
                          const cfg = EVENT_CONFIG[ev.type];
                          return (
                            <div key={ev.id} className={`hidden sm:block text-[10px] px-1 py-0.5 rounded ${cfg.bg} ${cfg.color} truncate leading-tight font-medium`}>
                              {ev.time} {ev.title.substring(0, 15)}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <span className="hidden sm:block text-[9px] text-[hsl(var(--dash-muted-fg))] pl-1">+{dayEvents.length - 2}</span>
                        )}
                        {/* Mobile dots */}
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 sm:hidden mt-1 justify-center">
                            {dayEvents.slice(0, 3).map(ev => (
                              <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${EVENT_CONFIG[ev.type].bg.replace("50", "400")}`} style={{ backgroundColor: ev.type === "call" ? "#8b5cf6" : ev.type === "meeting" ? "#06b6d4" : ev.type === "follow-up" ? "#f59e0b" : ev.type === "visit" ? "#10b981" : ev.type === "signing" ? "#f43f5e" : "#64748b" }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Agenda view */
            <div className="divide-y divide-[hsl(var(--dash-border))]">
              <div className="px-4 sm:px-6 py-4">
                <h2 className="text-base font-semibold text-[hsl(var(--dash-fg))] font-display">
                  {lang === "fr" ? "Événements à venir" : "Upcoming events"}
                </h2>
              </div>
              {upcomingEvents.length === 0 ? (
                <div className="px-6 py-12 text-center text-[hsl(var(--dash-muted-fg))] text-sm">
                  {lang === "fr" ? "Aucun événement prévu" : "No upcoming events"}
                </div>
              ) : (
                upcomingEvents.map(ev => {
                  const cfg = EVENT_CONFIG[ev.type];
                  const Icon = cfg.icon;
                  return (
                    <div key={ev.id} className="px-4 sm:px-6 py-3 flex items-start gap-3 hover:bg-[hsl(var(--dash-muted)/.3)] transition-colors group">
                      <div className={`w-9 h-9 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[hsl(var(--dash-fg))] truncate">{ev.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[hsl(var(--dash-muted-fg))]">
                          <span>{format(parseISO(ev.date), "EEE d MMM", { locale })}</span>
                          <span>•</span>
                          <span>{ev.time}{ev.endTime ? ` - ${ev.endTime}` : ""}</span>
                        </div>
                        {ev.contact && <p className="text-xs text-[hsl(var(--dash-muted-fg))] mt-0.5 flex items-center gap-1"><User className="w-3 h-3" /> {ev.contact}</p>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditEvent(ev)} className="p-1.5 rounded-md hover:bg-[hsl(var(--dash-muted))] text-[hsl(var(--dash-muted-fg))]"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteEvent(ev.id)} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right sidebar — selected day detail */}
        <div className="space-y-4">
          {/* Selected date events */}
          <div className="dash-card rounded-xl">
            <div className="px-4 py-3 border-b border-[hsl(var(--dash-border))] flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[hsl(var(--dash-fg))] capitalize">
                  {format(selectedDate, "EEEE d MMMM", { locale })}
                </p>
                <p className="text-[11px] text-[hsl(var(--dash-muted-fg))]">
                  {selectedEvents.length} {lang === "fr" ? "événement(s)" : "event(s)"}
                </p>
              </div>
              <button
                onClick={() => openNewEvent(selectedDate)}
                className="w-7 h-7 rounded-lg bg-gradient-primary text-white flex items-center justify-center hover:brightness-110 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[hsl(var(--dash-border)/.5)]">
              {selectedEvents.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <CalendarDays className="w-8 h-8 mx-auto text-[hsl(var(--dash-muted-fg)/.3)] mb-2" />
                  <p className="text-xs text-[hsl(var(--dash-muted-fg))]">
                    {lang === "fr" ? "Aucun événement" : "No events"}
                  </p>
                  <button
                    onClick={() => openNewEvent(selectedDate)}
                    className="mt-2 text-xs text-[hsl(var(--dash-accent))] font-medium hover:underline"
                  >
                    {lang === "fr" ? "+ Ajouter" : "+ Add"}
                  </button>
                </div>
              ) : (
                selectedEvents.map(ev => {
                  const cfg = EVENT_CONFIG[ev.type];
                  const Icon = cfg.icon;
                  return (
                    <div key={ev.id} className={`px-4 py-3 border-l-[3px] ${cfg.border} group`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-md ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--dash-fg))] leading-tight">{ev.title}</p>
                            <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] mt-0.5">
                              {ev.time}{ev.endTime ? ` → ${ev.endTime}` : ""}
                            </p>
                            {ev.location && (
                              <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {ev.location}
                              </p>
                            )}
                            {ev.contact && (
                              <p className="text-[11px] text-[hsl(var(--dash-muted-fg))] flex items-center gap-1 mt-0.5">
                                <User className="w-3 h-3" /> {ev.contact}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditEvent(ev)} className="p-1 rounded hover:bg-[hsl(var(--dash-muted))]"><Edit2 className="w-3 h-3 text-[hsl(var(--dash-muted-fg))]" /></button>
                          <button onClick={() => deleteEvent(ev.id)} className="p-1 rounded hover:bg-rose-50"><Trash2 className="w-3 h-3 text-rose-400" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Event type legend */}
          <div className="dash-card rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-[hsl(var(--dash-fg))] mb-2">
              {lang === "fr" ? "Types d'événements" : "Event types"}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(EVENT_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded ${cfg.bg} ${cfg.color} flex items-center justify-center`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] text-[hsl(var(--dash-muted-fg))]">
                      {lang === "fr" ? cfg.label : cfg.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => { setShowForm(false); resetForm(); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-50 bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900 font-display">
                  {editingEvent
                    ? (lang === "fr" ? "Modifier l'événement" : "Edit event")
                    : (lang === "fr" ? "Nouvel événement" : "New event")}
                </h3>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Type selector */}
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Type</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(EVENT_CONFIG).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      const selected = formType === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setFormType(key as EventType)}
                          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-medium border transition-all
                            ${selected ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "border-slate-200 text-slate-500 hover:border-slate-300"}
                          `}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {lang === "fr" ? cfg.label : cfg.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">{lang === "fr" ? "Titre" : "Title"} *</label>
                  <input
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder={lang === "fr" ? "Ex: Appel avec Ahmed — Off-plan Emaar" : "Ex: Call with Ahmed — Off-plan Emaar"}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)] focus:border-[hsl(var(--primary))]"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Date *</label>
                    <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{lang === "fr" ? "Début" : "Start"} *</label>
                    <input type="time" value={formTime} onChange={e => setFormTime(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{lang === "fr" ? "Fin" : "End"}</label>
                    <input type="time" value={formEndTime} onChange={e => setFormEndTime(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                    />
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Contact</label>
                    <input value={formContact} onChange={e => setFormContact(e.target.value)}
                      placeholder="Nom du lead"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{lang === "fr" ? "Lieu" : "Location"}</label>
                    <input value={formLocation} onChange={e => setFormLocation(e.target.value)}
                      placeholder={lang === "fr" ? "Ex: Showroom DAMAC" : "Ex: DAMAC Showroom"}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Notes</label>
                  <textarea
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    rows={2}
                    placeholder={lang === "fr" ? "Notes supplémentaires..." : "Additional notes..."}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.3)] resize-none"
                  />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {lang === "fr" ? "Annuler" : "Cancel"}
                </button>
                <button
                  onClick={saveEvent}
                  disabled={!formTitle.trim() || !formDate || !formTime}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-primary text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingEvent
                    ? (lang === "fr" ? "Modifier" : "Update")
                    : (lang === "fr" ? "Créer" : "Create")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;

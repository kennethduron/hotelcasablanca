"use client";

import { BedDouble, CalendarDays, Check, ChevronLeft, ChevronRight, MessageCircle, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useTransition } from "react";

import { checkAvailabilityAction, createReservationAction } from "@/app/(public)/reservar/actions";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatLongDate } from "@/i18n/format";
import { intlLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { PreferredContactMethod, Room } from "@/types/hotel";

const contactMethodValues: PreferredContactMethod[] = ["WhatsApp", "Correo electrónico", "Llamada telefónica"];

interface ReservationWizardProps {
  rooms: Room[];
  locale: Locale;
  dictionary: Dictionary;
  error?: string;
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
}

interface ReservationState {
  checkIn: string; checkOut: string; roomId: string; adults: number; children: number;
  guestName: string; guestEmail: string; guestPhone: string; guestCountry: string;
  guestDocumentNumber: string; guestDocumentType: string; guestAddress: string; notes: string;
  preferredContactMethod: PreferredContactMethod;
}

const defaultState: ReservationState = { checkIn: "", checkOut: "", roomId: "suite-premium", adults: 2, children: 0, guestName: "", guestEmail: "", guestPhone: "", guestCountry: "Honduras", guestDocumentNumber: "", guestDocumentType: "Identidad", guestAddress: "", notes: "", preferredContactMethod: "WhatsApp" };

export function ReservationWizard({ rooms, locale, dictionary, error, initialRoomId, initialCheckIn = "", initialCheckOut = "", initialAdults = 2, initialChildren = 0 }: ReservationWizardProps) {
  const labels = dictionary.booking;
  const [step, setStep] = useState(0);
  const [reservation, setReservation] = useState(() => ({ ...defaultState, roomId: initialRoomId ?? defaultState.roomId, checkIn: initialCheckIn, checkOut: initialCheckOut, adults: Math.max(1, initialAdults), children: Math.max(0, initialChildren) }));
  const [availability, setAvailability] = useState<Awaited<ReturnType<typeof checkAvailabilityAction>> | null>(null);
  const [isChecking, startChecking] = useTransition();
  const selectedRoom = rooms.find((room) => room.id === reservation.roomId) ?? rooms[0];
  const nights = getNights(reservation.checkIn, reservation.checkOut);
  const subtotal = selectedRoom ? selectedRoom.price * nights : 0;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;
  const progress = useMemo(() => ((step + 1) / labels.steps.length) * 100, [labels.steps.length, step]);

  function updateReservation<K extends keyof ReservationState>(key: K, value: ReservationState[K]) {
    setReservation((current) => ({ ...current, [key]: value }));
    if (["checkIn", "checkOut", "adults", "children", "roomId"].includes(key)) setAvailability(null);
  }

  function verifyAvailability() {
    startChecking(async () => setAvailability(await checkAvailabilityAction({ roomId: reservation.roomId, checkIn: reservation.checkIn, checkOut: reservation.checkOut, adults: reservation.adults, children: reservation.children })));
  }

  if (!selectedRoom) return <section className="hotel-container py-10"><div className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 text-hotel-muted shadow-hotel-soft">{labels.noRooms}</div></section>;

  return (
    <form action={createReservationAction} className="hotel-container py-10 md:py-12">
      <HiddenFields locale={locale} reservation={reservation} />
      {error ? <p className="mb-6 rounded-[8px] border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">{error === "disponibilidad" ? labels.availabilityError : labels.validationError}</p> : null}
      <div className="mb-8 md:mb-10">
        <div className="h-2 overflow-hidden rounded-full bg-hotel-line"><div className="h-full bg-hotel-gold transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mt-4 grid gap-3 text-xs font-semibold text-hotel-muted sm:grid-cols-2 lg:grid-cols-4">{labels.steps.map((item, index) => <button aria-current={index === step ? "step" : undefined} className={`flex min-h-14 items-center gap-2 rounded-[8px] border p-3 text-left transition ${index === step ? "border-hotel-forest bg-hotel-forest text-white shadow-hotel-soft" : "border-hotel-line bg-white/80 hover:border-hotel-gold"}`} key={item} onClick={() => setStep(index)} type="button"><span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${index === step ? "bg-hotel-gold text-hotel-forest" : "bg-hotel-sage text-hotel-forest"}`}>{index < step ? <Check className="size-4" /> : index + 1}</span><span className="leading-5">{item}</span></button>)}</div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-5">
          {step === 0 ? <DatesStep availability={availability} dictionary={dictionary} isChecking={isChecking} locale={locale} onVerify={verifyAvailability} reservation={reservation} selectedRoom={selectedRoom} updateReservation={updateReservation} /> : null}
          {step === 1 ? <RoomsStep dictionary={dictionary} locale={locale} rooms={rooms} selectedRoomId={reservation.roomId} updateReservation={updateReservation} /> : null}
          {step === 2 ? <GuestStep dictionary={dictionary} locale={locale} reservation={reservation} updateReservation={updateReservation} /> : null}
          {step === 3 ? <ConfirmStep dictionary={dictionary} reservation={reservation} updateReservation={updateReservation} /> : null}
          <div className="flex flex-col gap-4 rounded-[8px] bg-hotel-forest p-5 text-white shadow-hotel-card sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h3 className="hotel-serif text-2xl font-bold">{labels.ready}</h3><p className="mt-1 text-sm leading-6 text-white/80">{labels.pendingNotice}</p></div><div className="flex shrink-0 flex-col gap-3 sm:flex-row"><Button className="border-white text-white hover:bg-white hover:text-hotel-forest" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} type="button" variant="outlineLight">{labels.back}</Button>{step === labels.steps.length - 1 ? <Button type="submit" variant="gold">{labels.submit}</Button> : <Button disabled={step === 0 && (!availability?.available || isChecking)} onClick={() => setStep((value) => Math.min(labels.steps.length - 1, value + 1))} type="button" variant="gold">{labels.continue}</Button>}</div></div>
        </div>
        <ReservationSummary dictionary={dictionary} locale={locale} nights={nights} reservation={reservation} room={selectedRoom} taxes={taxes} total={total} />
      </div>
    </form>
  );
}

function HiddenFields({ reservation, locale }: { reservation: ReservationState; locale: Locale }) {
  return <><input name="locale" type="hidden" value={locale} />{Object.entries(reservation).map(([key, value]) => <input key={key} name={key} type="hidden" value={String(value)} />)}</>;
}

function DatesStep({ reservation, selectedRoom, updateReservation, availability, isChecking, onVerify, locale, dictionary }: StepProps & { selectedRoom: Room; availability: Awaited<ReturnType<typeof checkAvailabilityAction>> | null; isChecking: boolean; onVerify: () => void; locale: Locale; dictionary: Dictionary }) {
  const labels = dictionary.booking;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" });
  const nights = getNights(reservation.checkIn, reservation.checkOut);
  return <Panel icon={CalendarDays} title={labels.datesTitle}><div className="grid gap-5 xl:grid-cols-[1fr_280px]"><div className="rounded-[8px] bg-hotel-forest p-4 text-white md:p-5"><div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><p className="text-sm text-white/82">{labels.datesHelp}</p><p className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-hotel-gold">{nights ? `${nights} ${nights === 1 ? dictionary.common.night : dictionary.common.nights}` : labels.selectDates}</p></div><CalendarRange checkIn={reservation.checkIn} checkOut={reservation.checkOut} dictionary={dictionary} locale={locale} minDate={today} onSelect={(date) => { if (!reservation.checkIn || reservation.checkOut || date <= reservation.checkIn) { updateReservation("checkIn", date); updateReservation("checkOut", ""); } else updateReservation("checkOut", date); }} /></div><div className="rounded-[8px] border border-hotel-line bg-white p-4 shadow-hotel-soft"><p className="text-xs font-bold uppercase tracking-[0.18em] text-hotel-gold-700">{labels.room}</p><h3 className="hotel-serif mt-1 text-2xl font-bold text-hotel-forest">{selectedRoom.name}</h3><p className="mt-2 text-sm leading-6 text-hotel-muted">{selectedRoom.description}</p><div className="mt-4 grid grid-cols-2 gap-3"><Stepper decrease={dictionary.bookingBar.decrease} increase={dictionary.bookingBar.increase} label={dictionary.common.adults} min={1} value={reservation.adults} onChange={(value) => updateReservation("adults", value)} /><Stepper decrease={dictionary.bookingBar.decrease} increase={dictionary.bookingBar.increase} label={dictionary.common.children} min={0} value={reservation.children} onChange={(value) => updateReservation("children", value)} /></div><Button className="mt-5 w-full" disabled={isChecking || !reservation.checkIn || !reservation.checkOut} onClick={onVerify} type="button" variant="gold">{isChecking ? labels.checking : labels.checkAvailability}</Button></div></div>{availability ? <div aria-live="polite" className={`mt-4 rounded-[8px] border p-4 text-sm font-semibold ${availability.available ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-red-600 bg-red-50 text-red-800"}`}>{availability.available ? labels.available : labels.unavailable}{!availability.available && availability.alternatives.length ? <div className="mt-3"><p>{labels.alternatives}</p><div className="mt-2 flex flex-wrap gap-2">{availability.alternatives.map((room) => <button className="rounded bg-white px-3 py-2 text-hotel-forest underline" key={room.id} onClick={() => updateReservation("roomId", room.id)} type="button">{room.name}</button>)}</div></div> : null}</div> : null}</Panel>;
}

function CalendarRange({ checkIn, checkOut, minDate, onSelect, locale, dictionary }: { checkIn: string; checkOut: string; minDate: string; onSelect: (date: string) => void; locale: Locale; dictionary: Dictionary }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const base = new Date(`${minDate}T12:00:00`); base.setMonth(base.getMonth() + monthOffset, 1);
  const next = new Date(base); next.setMonth(base.getMonth() + 1, 1);
  return <div><div className="mb-4 flex items-center justify-between"><button aria-label={dictionary.booking.previousMonth} className="grid size-10 place-items-center rounded-full border border-white/20 text-white disabled:opacity-40" disabled={monthOffset === 0} onClick={() => setMonthOffset((value) => Math.max(0, value - 1))} type="button"><ChevronLeft className="size-4" /></button><span className="text-sm font-bold uppercase tracking-[0.18em] text-hotel-gold">{dictionary.booking.calendar}</span><button aria-label={dictionary.booking.nextMonth} className="grid size-10 place-items-center rounded-full border border-white/20 text-white" onClick={() => setMonthOffset((value) => value + 1)} type="button"><ChevronRight className="size-4" /></button></div><div className="grid gap-5 lg:grid-cols-2"><MonthView {...{ checkIn, checkOut, minDate, onSelect, locale, dictionary }} month={base} /><MonthView {...{ checkIn, checkOut, minDate, onSelect, locale, dictionary }} month={next} /></div></div>;
}

function MonthView({ month, checkIn, checkOut, minDate, onSelect, locale, dictionary }: { month: Date; checkIn: string; checkOut: string; minDate: string; onSelect: (date: string) => void; locale: Locale; dictionary: Dictionary }) {
  return <div><h4 className="mb-3 text-center text-sm font-bold text-white">{month.toLocaleDateString(intlLocale(locale), { month: "long", year: "numeric" })}</h4><div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-white/55">{dictionary.booking.weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1">{buildMonth(month).map((day, index) => day ? <DayButton checkIn={checkIn} checkOut={checkOut} date={day} disabled={day < minDate} key={day} onSelect={onSelect} /> : <span key={`blank-${index}`} />)}</div></div>;
}

function DayButton({ date, checkIn, checkOut, disabled, onSelect }: { date: string; checkIn: string; checkOut: string; disabled: boolean; onSelect: (date: string) => void }) {
  const selected = date === checkIn || date === checkOut;
  const inRange = Boolean(checkIn && checkOut && date > checkIn && date < checkOut);
  return <button aria-label={date} aria-pressed={selected} className={`grid min-h-10 place-items-center rounded-[6px] text-sm font-bold transition ${selected ? "bg-hotel-gold text-hotel-forest" : inRange ? "bg-hotel-gold/25 text-white" : "bg-white/8 text-white hover:bg-white/18"} disabled:bg-white/5 disabled:text-white/25`} disabled={disabled} onClick={() => onSelect(date)} type="button">{Number(date.slice(-2))}</button>;
}

function RoomsStep({ rooms, selectedRoomId, updateReservation, locale, dictionary }: { rooms: Room[]; selectedRoomId: string; updateReservation: UpdateReservation; locale: Locale; dictionary: Dictionary }) {
  return <Panel icon={BedDouble} title={dictionary.booking.chooseRoom}><div className="grid gap-4 md:grid-cols-2">{rooms.map((room) => <button aria-pressed={room.id === selectedRoomId} className={`rounded-[8px] border bg-white p-4 text-left transition hover:border-hotel-gold ${room.id === selectedRoomId ? "border-hotel-forest shadow-hotel-soft" : "border-hotel-line"}`} key={room.id} onClick={() => updateReservation("roomId", room.id)} type="button"><strong className="text-hotel-forest">{room.name}</strong><p className="mt-1 text-sm leading-6 text-hotel-muted">{room.description}</p><p className="mt-3 text-sm font-bold text-hotel-forest">{formatCurrency(room.price, locale)} / {dictionary.common.night}</p></button>)}</div></Panel>;
}

function GuestStep({ reservation, updateReservation, locale, dictionary }: StepProps & { locale: Locale; dictionary: Dictionary }) {
  const labels = dictionary.booking;
  return <Panel icon={UserRound} title={labels.guestInfo}><div className="grid gap-4 md:grid-cols-2"><Field label={labels.fullName} onChange={(value) => updateReservation("guestName", value)} placeholder={labels.namePlaceholder} required value={reservation.guestName} /><Field label={labels.email} onChange={(value) => updateReservation("guestEmail", value)} placeholder="guest@example.com" required type="email" value={reservation.guestEmail} /><Field label={labels.phone} onChange={(value) => updateReservation("guestPhone", value)} placeholder="+504 0000-0000" required type="tel" value={reservation.guestPhone} /><Field label={labels.country} onChange={(value) => updateReservation("guestCountry", value)} placeholder={locale === "es" ? "Honduras" : "Country"} required value={reservation.guestCountry} /><Field label={labels.documentNumber} onChange={(value) => updateReservation("guestDocumentNumber", value)} placeholder={locale === "es" ? "Ej. 0801-1990-12345" : "e.g. Passport number"} required value={reservation.guestDocumentNumber} /><SelectField label={labels.documentType} onChange={(value) => updateReservation("guestDocumentType", value)} options={locale === "es" ? [["Identidad", "Identidad"], ["Pasaporte", "Pasaporte"], ["RTN", "RTN"]] : [["Identidad", "National ID"], ["Pasaporte", "Passport"], ["RTN", "Tax ID"]]} value={reservation.guestDocumentType} /></div><Field className="mt-4" label={labels.address} onChange={(value) => updateReservation("guestAddress", value)} placeholder={labels.addressPlaceholder} value={reservation.guestAddress} /><label className="mt-4 block text-sm font-medium text-hotel-ink">{labels.notes}<textarea className="mt-2 h-28 w-full rounded-[6px] border border-hotel-line bg-white p-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => updateReservation("notes", event.target.value)} placeholder={labels.notesPlaceholder} value={reservation.notes} /></label></Panel>;
}

function ConfirmStep({ reservation, updateReservation, dictionary }: StepProps & { dictionary: Dictionary }) {
  const labels = dictionary.booking;
  return <div className="space-y-5"><Panel icon={MessageCircle} title={labels.contactMethod}><div className="grid gap-4 md:grid-cols-3">{contactMethodValues.map((value, index) => <label className={`rounded-[8px] border p-4 text-sm transition ${reservation.preferredContactMethod === value ? "border-hotel-forest bg-hotel-sage/40" : "border-hotel-line bg-white"}`} key={value}><input checked={reservation.preferredContactMethod === value} className="mr-2" onChange={() => updateReservation("preferredContactMethod", value)} type="radio" />{labels.contactMethods[index]}</label>)}</div></Panel><Panel icon={ShieldCheck} title={labels.additionalInfo}><div className="space-y-3 text-sm leading-6"><label className="flex gap-2"><input name="termsAccepted" required type="checkbox" />{labels.terms}</label><label className="flex gap-2"><input name="dataProcessingAccepted" required type="checkbox" />{labels.data}</label></div></Panel></div>;
}

function ReservationSummary({ room, reservation, nights, taxes, total, locale, dictionary }: { room: Room; reservation: ReservationState; nights: number; taxes: number; total: number; locale: Locale; dictionary: Dictionary }) {
  const labels = dictionary.booking; const subtotal = room.price * nights;
  return <aside className="h-fit rounded-[8px] border border-hotel-line bg-hotel-ivory p-5 shadow-hotel-card lg:sticky lg:top-28"><h2 className="hotel-serif text-2xl font-bold text-hotel-forest">{labels.summary}</h2><div className="relative mt-4 h-44 overflow-hidden rounded-[8px] bg-white"><Image alt={room.name} className="object-cover" fill sizes="(min-width: 1024px) 400px, 100vw" src={room.image} /></div><h3 className="mt-4 text-lg font-bold text-hotel-forest">{room.name}</h3><div className="mt-3 grid grid-cols-2 gap-3 text-sm text-hotel-muted"><span>{reservation.adults} {reservation.adults === 1 ? dictionary.common.adult : dictionary.common.adults.toLocaleLowerCase(intlLocale(locale))}</span><span>{reservation.children} {reservation.children === 1 ? dictionary.common.child : dictionary.common.children.toLocaleLowerCase(intlLocale(locale))}</span><span>Check-in<br /><strong>{reservation.checkIn ? formatLongDate(reservation.checkIn, locale) : labels.select}</strong></span><span>Check-out<br /><strong>{reservation.checkOut ? formatLongDate(reservation.checkOut, locale) : labels.select}</strong></span><span>{labels.stay}<br /><strong>{nights} {nights === 1 ? dictionary.common.night : dictionary.common.nights}</strong></span><span>{labels.plan}<br /><strong>{labels.lodgingOnly}</strong></span></div><div className="mt-5 space-y-3 border-t border-hotel-line pt-5 text-sm"><p className="flex justify-between gap-4"><span>{labels.nightlyRate}</span><strong>{formatCurrency(room.price, locale)}</strong></p><p className="flex justify-between gap-4"><span>{nights} {nights === 1 ? dictionary.common.night : dictionary.common.nights}</span><strong>{formatCurrency(subtotal, locale)}</strong></p><p className="flex justify-between gap-4"><span>{labels.taxes}</span><strong>{formatCurrency(taxes, locale)}</strong></p><p className="flex justify-between gap-4 border-t border-hotel-line pt-4 text-xl text-hotel-forest"><span>{labels.total}</span><strong>{formatCurrency(total, locale)}</strong></p></div><div className="mt-5 rounded-[8px] bg-hotel-sage/70 p-4 text-sm leading-6 text-hotel-forest"><ShieldCheck className="mb-2 size-6" />{labels.secure}</div></aside>;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) { return <div className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-5 shadow-hotel-soft md:p-6"><h2 className="hotel-serif mb-5 flex items-center gap-3 text-2xl font-bold text-hotel-forest md:text-3xl"><Icon className="size-7 shrink-0" />{title}</h2>{children}</div>; }
function Field({ label, value, onChange, placeholder, type = "text", className = "", required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; className?: string; required?: boolean }) { return <label className={`block text-sm font-medium text-hotel-ink ${className}`}>{label}<input className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} type={type} value={value} /></label>; }
function Stepper({ label, min, value, onChange, decrease, increase }: { label: string; min: number; value: number; onChange: (value: number) => void; decrease: string; increase: string }) { return <div><p className="text-sm font-bold text-hotel-forest">{label}</p><div className="mt-2 flex h-12 items-center justify-between rounded-[6px] border border-hotel-line bg-hotel-ivory px-2"><button aria-label={`${decrease} ${label}`} className="grid size-8 place-items-center rounded bg-white text-hotel-forest disabled:opacity-45" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} type="button">−</button><strong>{value}</strong><button aria-label={`${increase} ${label}`} className="grid size-8 place-items-center rounded bg-hotel-forest text-white" onClick={() => onChange(value + 1)} type="button">+</button></div></div>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) { return <label className="text-sm font-medium text-hotel-ink">{label}<select className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => onChange(event.target.value)} value={value}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>; }

type UpdateReservation = <K extends keyof ReservationState>(key: K, value: ReservationState[K]) => void;
interface StepProps { reservation: ReservationState; updateReservation: UpdateReservation }

function buildMonth(month: Date) { const first = new Date(month.getFullYear(), month.getMonth(), 1); const days: Array<string | null> = Array.from({ length: (first.getDay() + 6) % 7 }, () => null); const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(); for (let day = 1; day <= count; day += 1) { const value = new Date(month.getFullYear(), month.getMonth(), day, 12); days.push(value.toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" })); } return days; }
function getNights(checkIn: string, checkOut: string) { if (!checkIn || !checkOut) return 0; const diff = new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime(); return Number.isFinite(diff) && diff > 0 ? Math.round(diff / 86_400_000) : 0; }

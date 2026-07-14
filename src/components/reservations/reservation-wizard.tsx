"use client";

import { BedDouble, CalendarDays, Check, ChevronLeft, ChevronRight, MessageCircle, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useTransition } from "react";

import { checkAvailabilityAction, createReservationAction } from "@/app/(public)/reservar/actions";
import { Button } from "@/components/ui/button";
import type { PreferredContactMethod, Room } from "@/types/hotel";

const steps = ["Selección de fechas", "Habitación", "Información", "Confirmación"];
const contactMethods: PreferredContactMethod[] = ["WhatsApp", "Correo electrónico", "Llamada telefónica"];

interface ReservationWizardProps {
  rooms: Room[];
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
}

interface ReservationState {
  checkIn: string;
  checkOut: string;
  roomId: string;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  guestDocumentNumber: string;
  guestDocumentType: string;
  guestAddress: string;
  notes: string;
  preferredContactMethod: PreferredContactMethod;
}

const defaultState: ReservationState = {
  checkIn: "",
  checkOut: "",
  roomId: "suite-premium",
  adults: 2,
  children: 0,
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  guestCountry: "Honduras",
  guestDocumentNumber: "",
  guestDocumentType: "Identidad",
  guestAddress: "",
  notes: "",
  preferredContactMethod: "WhatsApp",
};

export function ReservationWizard({ rooms, initialRoomId, initialCheckIn = "", initialCheckOut = "", initialAdults = 2, initialChildren = 0 }: ReservationWizardProps) {
  const [step, setStep] = useState(0);
  const [reservation, setReservation] = useState(() => ({ ...defaultState, roomId: initialRoomId ?? defaultState.roomId, checkIn: initialCheckIn, checkOut: initialCheckOut, adults: Math.max(1, initialAdults), children: Math.max(0, initialChildren) }));
  const [availability, setAvailability] = useState<Awaited<ReturnType<typeof checkAvailabilityAction>> | null>(null);
  const [isChecking, startChecking] = useTransition();
  const selectedRoom = rooms.find((room) => room.id === reservation.roomId) ?? rooms[0];
  const nights = getNights(reservation.checkIn, reservation.checkOut);
  const subtotal = selectedRoom ? selectedRoom.price * nights : 0;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function updateReservation<K extends keyof ReservationState>(key: K, value: ReservationState[K]) {
    setReservation((current) => ({ ...current, [key]: value }));
    if (["checkIn", "checkOut", "adults", "children", "roomId"].includes(key)) setAvailability(null);
  }

  function verifyAvailability() {
    startChecking(async () => setAvailability(await checkAvailabilityAction({ roomId: reservation.roomId, checkIn: reservation.checkIn, checkOut: reservation.checkOut, adults: reservation.adults, children: reservation.children })));
  }

  if (!selectedRoom) {
    return <section className="hotel-container py-10"><div className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 text-hotel-muted shadow-hotel-soft">No hay habitaciones disponibles para solicitar reservas en este momento.</div></section>;
  }

  return (
    <form action={createReservationAction} className="hotel-container py-10 md:py-12">
      <HiddenFields reservation={reservation} />
      <div className="mb-8 md:mb-10">
        <div className="h-2 overflow-hidden rounded-full bg-hotel-line"><div className="h-full bg-hotel-gold transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mt-4 grid gap-3 text-xs font-semibold text-hotel-muted sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <button className={`flex min-h-14 items-center gap-2 rounded-[8px] border p-3 text-left transition ${index === step ? "border-hotel-forest bg-hotel-forest text-white shadow-hotel-soft" : "border-hotel-line bg-white/80 hover:border-hotel-gold"}`} key={item} onClick={() => setStep(index)} type="button">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${index === step ? "bg-hotel-gold text-hotel-forest" : "bg-hotel-sage text-hotel-forest"}`}>{index < step ? <Check className="size-4" /> : index + 1}</span>
              <span className="leading-5">{item}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-5">
          {step === 0 ? <DatesStep reservation={reservation} selectedRoom={selectedRoom} updateReservation={updateReservation} availability={availability} isChecking={isChecking} onVerify={verifyAvailability} /> : null}
          {step === 1 ? <RoomsStep rooms={rooms} selectedRoomId={reservation.roomId} updateReservation={updateReservation} /> : null}
          {step === 2 ? <GuestStep reservation={reservation} updateReservation={updateReservation} /> : null}
          {step === 3 ? <ConfirmStep reservation={reservation} updateReservation={updateReservation} /> : null}
          <div className="flex flex-col gap-4 rounded-[8px] bg-hotel-forest p-5 text-white shadow-hotel-card sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0"><h3 className="hotel-serif text-2xl font-bold">¿Todo listo para continuar?</h3><p className="mt-1 text-sm leading-6 text-white/80">La solicitud quedará pendiente de revisión por el hotel.</p></div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button className="border-white text-white hover:bg-white hover:text-hotel-forest" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} type="button" variant="outlineLight">Atrás</Button>
              {step === steps.length - 1 ? <Button type="submit" variant="gold">Enviar solicitud</Button> : <Button disabled={step === 0 && (!availability?.available || isChecking)} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} type="button" variant="gold">Continuar reserva</Button>}
            </div>
          </div>
        </div>
        <ReservationSummary nights={nights} room={selectedRoom} taxes={taxes} total={total} reservation={reservation} />
      </div>
    </form>
  );
}

function HiddenFields({ reservation }: { reservation: ReservationState }) {
  return <>{Object.entries(reservation).map(([key, value]) => <input key={key} name={key} type="hidden" value={String(value)} />)}</>;
}

function DatesStep({ reservation, selectedRoom, updateReservation, availability, isChecking, onVerify }: StepProps & { selectedRoom: Room; availability: Awaited<ReturnType<typeof checkAvailabilityAction>> | null; isChecking: boolean; onVerify: () => void }) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" });
  const nights = getNights(reservation.checkIn, reservation.checkOut);
  return (
    <Panel title="Seleccione la fecha de entrada" icon={CalendarDays}>
      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="rounded-[8px] bg-hotel-forest p-4 text-white md:p-5">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/82">Seleccione primero el check-in y luego el check-out.</p>
            <p className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-hotel-gold">{nights ? `${nights} noches` : "Seleccione fechas"}</p>
          </div>
          <CalendarRange checkIn={reservation.checkIn} checkOut={reservation.checkOut} minDate={today} onSelect={(date) => {
            if (!reservation.checkIn || (reservation.checkIn && reservation.checkOut) || date <= reservation.checkIn) {
              updateReservation("checkIn", date);
              updateReservation("checkOut", "");
            } else {
              updateReservation("checkOut", date);
            }
          }} />
        </div>
        <div className="rounded-[8px] border border-hotel-line bg-white p-4 shadow-hotel-soft">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-hotel-gold-700">Habitación</p>
          <h3 className="hotel-serif mt-1 text-2xl font-bold text-hotel-forest">{selectedRoom.name}</h3>
          <p className="mt-2 text-sm leading-6 text-hotel-muted">{selectedRoom.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stepper label="Adultos" min={1} value={reservation.adults} onChange={(value) => updateReservation("adults", value)} />
            <Stepper label="Niños" min={0} value={reservation.children} onChange={(value) => updateReservation("children", value)} />
          </div>
          <Button className="mt-5 w-full" disabled={isChecking || !reservation.checkIn || !reservation.checkOut} onClick={onVerify} type="button" variant="gold">{isChecking ? "Verificando..." : "Verificar disponibilidad"}</Button>
        </div>
      </div>
      {availability ? <div aria-live="polite" className={`mt-4 rounded-[8px] border p-4 text-sm font-semibold ${availability.available ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-red-600 bg-red-50 text-red-800"}`}>{availability.available ? "La habitación está disponible para las fechas seleccionadas." : availability.reason ?? "Esta habitación no está disponible para las fechas seleccionadas."}{!availability.available && availability.alternatives.length ? <div className="mt-3"><p>Habitaciones alternativas disponibles:</p><div className="mt-2 flex flex-wrap gap-2">{availability.alternatives.map((room) => <button className="rounded bg-white px-3 py-2 text-hotel-forest underline" key={room.id} onClick={() => updateReservation("roomId", room.id)} type="button">{room.name}</button>)}</div></div> : null}</div> : null}
    </Panel>
  );
}

function CalendarRange({ checkIn, checkOut, minDate, onSelect }: { checkIn: string; checkOut: string; minDate: string; onSelect: (date: string) => void }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const base = new Date(`${minDate}T00:00:00`);
  base.setMonth(base.getMonth() + monthOffset, 1);
  const next = new Date(base);
  next.setMonth(base.getMonth() + 1, 1);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button aria-label="Mes anterior" className="grid size-10 place-items-center rounded-full border border-white/20 text-white disabled:opacity-40" disabled={monthOffset === 0} onClick={() => setMonthOffset((value) => Math.max(0, value - 1))} type="button"><ChevronLeft className="size-4" /></button>
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-hotel-gold">Calendario</span>
        <button aria-label="Mes siguiente" className="grid size-10 place-items-center rounded-full border border-white/20 text-white" onClick={() => setMonthOffset((value) => value + 1)} type="button"><ChevronRight className="size-4" /></button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2"><MonthView checkIn={checkIn} checkOut={checkOut} minDate={minDate} month={base} onSelect={onSelect} /><MonthView checkIn={checkIn} checkOut={checkOut} minDate={minDate} month={next} onSelect={onSelect} /></div>
    </div>
  );
}

function MonthView({ month, checkIn, checkOut, minDate, onSelect }: { month: Date; checkIn: string; checkOut: string; minDate: string; onSelect: (date: string) => void }) {
  const days = buildMonth(month);
  return <div><h4 className="mb-3 text-center text-sm font-bold capitalize text-white">{month.toLocaleDateString("es-HN", { month: "long", year: "numeric" })}</h4><div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-white/55">{["L", "M", "M", "J", "V", "S", "D"].map((day) => <span key={day}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1">{days.map((day, index) => day ? <DayButton checkIn={checkIn} checkOut={checkOut} date={day} disabled={day < minDate} key={day} onSelect={onSelect} /> : <span key={`blank-${index}`} />)}</div></div>;
}

function DayButton({ date, checkIn, checkOut, disabled, onSelect }: { date: string; checkIn: string; checkOut: string; disabled: boolean; onSelect: (date: string) => void }) {
  const day = Number(date.slice(-2));
  const selected = date === checkIn || date === checkOut;
  const inRange = Boolean(checkIn && checkOut && date > checkIn && date < checkOut);
  return <button aria-pressed={selected} className={`grid min-h-10 place-items-center rounded-[6px] text-sm font-bold transition ${selected ? "bg-hotel-gold text-hotel-forest" : inRange ? "bg-hotel-gold/25 text-white" : "bg-white/8 text-white hover:bg-white/18"} disabled:bg-white/5 disabled:text-white/25 disabled:hover:bg-white/5`} disabled={disabled} onClick={() => onSelect(date)} type="button">{day}</button>;
}

function RoomsStep({ rooms, selectedRoomId, updateReservation }: { rooms: Room[]; selectedRoomId: string; updateReservation: UpdateReservation }) {
  return <Panel title="Elige tu habitación" icon={BedDouble}><div className="grid gap-4 md:grid-cols-2">{rooms.map((room) => <button className={`rounded-[8px] border bg-white p-4 text-left transition hover:border-hotel-gold ${room.id === selectedRoomId ? "border-hotel-forest shadow-hotel-soft" : "border-hotel-line"}`} key={room.id} onClick={() => updateReservation("roomId", room.id)} type="button"><strong className="text-hotel-forest">{room.name}</strong><p className="mt-1 text-sm leading-6 text-hotel-muted">{room.description}</p><p className="mt-3 text-sm font-bold text-hotel-forest">L {room.price.toLocaleString("es-HN")} / noche</p></button>)}</div></Panel>;
}

function GuestStep({ reservation, updateReservation }: StepProps) {
  return <Panel title="Información del huésped" icon={UserRound}><div className="grid gap-4 md:grid-cols-2"><Field label="Nombre completo" value={reservation.guestName} placeholder="Ej. Juan Pérez" onChange={(value) => updateReservation("guestName", value)} /><Field label="Correo electrónico" type="email" value={reservation.guestEmail} placeholder="ejemplo@correo.com" onChange={(value) => updateReservation("guestEmail", value)} /><Field label="Teléfono" value={reservation.guestPhone} placeholder="+504 0000-0000" onChange={(value) => updateReservation("guestPhone", value)} /><Field label="País de residencia" value={reservation.guestCountry} placeholder="Honduras" onChange={(value) => updateReservation("guestCountry", value)} /><Field label="Número de documento" value={reservation.guestDocumentNumber} placeholder="Ej. 0801-1990-12345" onChange={(value) => updateReservation("guestDocumentNumber", value)} /><SelectField label="Tipo de documento" value={reservation.guestDocumentType} options={["Identidad", "Pasaporte", "RTN"]} onChange={(value) => updateReservation("guestDocumentType", value)} /></div><Field label="Dirección" value={reservation.guestAddress} placeholder="Ej. Colonia Palmira, San Pedro Sula" onChange={(value) => updateReservation("guestAddress", value)} className="mt-4" /><label className="mt-4 block text-sm font-medium text-hotel-ink">Notas o solicitudes especiales<textarea className="mt-2 h-28 w-full rounded-[6px] border border-hotel-line bg-white p-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => updateReservation("notes", event.target.value)} placeholder="Cuéntanos si tienes alguna solicitud especial para tu estancia..." value={reservation.notes} /></label></Panel>;
}

function ConfirmStep({ reservation, updateReservation }: StepProps) {
  return <div className="space-y-5"><Panel title="Método de contacto preferido" icon={MessageCircle}><div className="grid gap-4 md:grid-cols-3">{contactMethods.map((item) => <label className={`rounded-[8px] border p-4 text-sm transition ${reservation.preferredContactMethod === item ? "border-hotel-forest bg-hotel-sage/40" : "border-hotel-line bg-white"}`} key={item}><input checked={reservation.preferredContactMethod === item} className="mr-2" name="preferredContactMethod" onChange={() => updateReservation("preferredContactMethod", item)} type="radio" value={item} />{item}</label>)}</div></Panel><Panel title="Información adicional" icon={ShieldCheck}><div className="space-y-3 text-sm leading-6"><label className="flex gap-2"><input name="termsAccepted" required type="checkbox" />Acepto los Términos y condiciones y la Política de privacidad.</label><label className="flex gap-2"><input name="dataProcessingAccepted" required type="checkbox" />Autorizo a Hotel Casa Blanca a procesar mis datos para gestionar mi reserva.</label></div></Panel></div>;
}

function ReservationSummary({ room, reservation, nights, taxes, total }: { room: Room; reservation: ReservationState; nights: number; taxes: number; total: number }) {
  const subtotal = room.price * nights;
  return <aside className="h-fit rounded-[8px] border border-hotel-line bg-hotel-ivory p-5 shadow-hotel-card lg:sticky lg:top-28"><h2 className="hotel-serif text-2xl font-bold text-hotel-forest">Resumen de tu reserva</h2><div className="relative mt-4 h-44 overflow-hidden rounded-[8px] bg-white"><Image alt={room.name} className="object-cover" fill sizes="(min-width: 1024px) 400px, 100vw" src={room.image} /></div><h3 className="mt-4 text-lg font-bold text-hotel-forest">{room.name}</h3><div className="mt-3 grid grid-cols-2 gap-3 text-sm text-hotel-muted"><span>{reservation.adults} adultos</span><span>{reservation.children} niños</span><span>Check-in<br /><strong>{formatDate(reservation.checkIn)}</strong></span><span>Check-out<br /><strong>{formatDate(reservation.checkOut)}</strong></span><span>Estancia<br /><strong>{nights} noches</strong></span><span>Plan<br /><strong>Solo hospedaje</strong></span></div><div className="mt-5 space-y-3 border-t border-hotel-line pt-5 text-sm"><p className="flex justify-between gap-4"><span>Tarifa por noche</span><strong>L {room.price.toLocaleString("es-HN")}.00</strong></p><p className="flex justify-between gap-4"><span>{nights} noches</span><strong>L {subtotal.toLocaleString("es-HN")}.00</strong></p><p className="flex justify-between gap-4"><span>Impuestos y cargos</span><strong>L {taxes.toLocaleString("es-HN")}.00</strong></p><p className="flex justify-between gap-4 border-t border-hotel-line pt-4 text-xl text-hotel-forest"><span>Total</span><strong>L {total.toLocaleString("es-HN")}.00</strong></p></div><div className="mt-5 rounded-[8px] bg-hotel-sage/70 p-4 text-sm leading-6 text-hotel-forest"><ShieldCheck className="mb-2 size-6" />Reserva segura. Tus fechas se bloquean únicamente cuando el administrador confirma el pago.</div></aside>;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return <div className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-5 shadow-hotel-soft md:p-6"><h2 className="hotel-serif mb-5 flex items-center gap-3 text-2xl font-bold text-hotel-forest md:text-3xl"><Icon className="size-7 shrink-0" />{title}</h2>{children}</div>;
}

function Field({ label, value, onChange, placeholder, type = "text", className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; className?: string }) {
  return <label className={`block text-sm font-medium text-hotel-ink ${className}`}>{label}<input className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} /></label>;
}

function Stepper({ label, min, value, onChange }: { label: string; min: number; value: number; onChange: (value: number) => void }) {
  return <div><p className="text-sm font-bold text-hotel-forest">{label}</p><div className="mt-2 flex h-12 items-center justify-between rounded-[6px] border border-hotel-line bg-hotel-ivory px-2"><button aria-label={`Reducir ${label}`} className="grid size-8 place-items-center rounded bg-white text-hotel-forest" onClick={() => onChange(Math.max(min, value - 1))} type="button">−</button><strong>{value}</strong><button aria-label={`Aumentar ${label}`} className="grid size-8 place-items-center rounded bg-hotel-forest text-white" onClick={() => onChange(value + 1)} type="button">+</button></div></div>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="text-sm font-medium text-hotel-ink">{label}<select className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => onChange(event.target.value)} value={value}>{options.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
}

type UpdateReservation = <K extends keyof ReservationState>(key: K, value: ReservationState[K]) => void;
interface StepProps { reservation: ReservationState; updateReservation: UpdateReservation }

function buildMonth(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days: Array<string | null> = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= count; day += 1) days.push(new Date(month.getFullYear(), month.getMonth(), day).toLocaleDateString("en-CA"));
  return days;
}

function getNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  if (!Number.isFinite(diff) || diff <= 0) return 0;
  return Math.round(diff / 86_400_000);
}

function formatDate(value: string) {
  if (!value) return "Seleccionar";
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-HN", { day: "numeric", month: "long", year: "numeric" });
}

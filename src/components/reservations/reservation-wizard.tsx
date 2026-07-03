"use client";

import { CalendarDays, Check, MessageCircle, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { createReservationAction } from "@/app/(public)/reservar/actions";
import { Button } from "@/components/ui/button";
import type { PreferredContactMethod, Room } from "@/types/hotel";

const steps = ["Selección de Fechas", "Habitaciones", "Información", "Confirmación"];
const contactMethods: PreferredContactMethod[] = ["WhatsApp", "Correo electrónico", "Llamada telefónica"];

interface ReservationWizardProps {
  rooms: Room[];
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
  checkIn: "2026-05-24",
  checkOut: "2026-05-26",
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

export function ReservationWizard({ rooms }: ReservationWizardProps) {
  const [step, setStep] = useState(0);
  const [reservation, setReservation] = useState(defaultState);
  const selectedRoom = rooms.find((room) => room.id === reservation.roomId) ?? rooms[0];
  const nights = getNights(reservation.checkIn, reservation.checkOut);
  const subtotal = selectedRoom ? selectedRoom.price * nights : 0;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function updateReservation<K extends keyof ReservationState>(key: K, value: ReservationState[K]) {
    setReservation((current) => ({ ...current, [key]: value }));
  }

  if (!selectedRoom) {
    return (
      <section className="hotel-container py-10">
        <div className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 text-hotel-muted shadow-hotel-soft">
          No hay habitaciones disponibles para solicitar reservas en este momento.
        </div>
      </section>
    );
  }

  return (
    <form action={createReservationAction} className="hotel-container py-10 md:py-12">
      <HiddenFields reservation={reservation} />
      <div className="mb-8 md:mb-10">
        <div className="h-2 overflow-hidden rounded-full bg-hotel-line">
          <div className="h-full bg-hotel-forest transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 grid gap-3 text-xs font-semibold text-hotel-muted sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <button
              className={`flex min-h-14 items-center gap-2 rounded-[8px] border p-3 text-left transition ${index === step ? "border-hotel-forest bg-hotel-ivory text-hotel-forest shadow-hotel-soft" : "border-hotel-line bg-white/70 hover:border-hotel-gold"}`}
              key={item}
              onClick={() => setStep(index)}
              type="button"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-hotel-sage text-sm font-bold text-hotel-forest">
                {index < step ? <Check className="size-4" /> : index + 1}
              </span>
              <span className="leading-5">{item}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-5">
          {step === 0 ? <DatesStep reservation={reservation} updateReservation={updateReservation} /> : null}
          {step === 1 ? <RoomsStep rooms={rooms} selectedRoomId={reservation.roomId} updateReservation={updateReservation} /> : null}
          {step === 2 ? <GuestStep reservation={reservation} updateReservation={updateReservation} /> : null}
          {step === 3 ? <ConfirmStep reservation={reservation} updateReservation={updateReservation} /> : null}
          <div className="flex flex-col gap-4 rounded-[8px] bg-hotel-forest p-5 text-white shadow-hotel-card sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="hotel-serif text-2xl font-bold">¿Todo listo para continuar?</h3>
              <p className="mt-1 text-sm leading-6 text-white/80">La solicitud quedará pendiente de revisión por el hotel.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} type="button" variant="outline" className="border-white text-white hover:bg-white hover:text-hotel-forest">
                Atrás
              </Button>
              {step === steps.length - 1 ? (
                <Button type="submit" variant="gold">Enviar solicitud</Button>
              ) : (
                <Button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} type="button" variant="gold">
                  Continuar
                </Button>
              )}
            </div>
          </div>
        </div>
        <ReservationSummary nights={nights} room={selectedRoom} taxes={taxes} total={total} reservation={reservation} />
      </div>
    </form>
  );
}

function HiddenFields({ reservation }: { reservation: ReservationState }) {
  return (
    <>
      {Object.entries(reservation).map(([key, value]) => (
        <input key={key} name={key} type="hidden" value={String(value)} />
      ))}
    </>
  );
}

function DatesStep({ reservation, updateReservation }: StepProps) {
  return (
    <Panel title="Selecciona tus fechas" icon={CalendarDays}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Check-in" type="date" value={reservation.checkIn} onChange={(value) => updateReservation("checkIn", value)} />
        <Field label="Check-out" type="date" value={reservation.checkOut} onChange={(value) => updateReservation("checkOut", value)} />
        <NumberField label="Adultos" min={1} value={reservation.adults} onChange={(value) => updateReservation("adults", value)} />
        <NumberField label="Niños" min={0} value={reservation.children} onChange={(value) => updateReservation("children", value)} />
      </div>
    </Panel>
  );
}

function RoomsStep({ rooms, selectedRoomId, updateReservation }: { rooms: Room[]; selectedRoomId: string; updateReservation: UpdateReservation }) {
  return (
    <Panel title="Elige tu habitación" icon={CalendarDays}>
      <div className="grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <button
            className={`rounded-[8px] border bg-white p-4 text-left transition hover:border-hotel-gold ${room.id === selectedRoomId ? "border-hotel-forest shadow-hotel-soft" : "border-hotel-line"}`}
            key={room.id}
            onClick={() => updateReservation("roomId", room.id)}
            type="button"
          >
            <strong className="text-hotel-forest">{room.name}</strong>
            <p className="mt-1 text-sm leading-6 text-hotel-muted">{room.description}</p>
            <p className="mt-3 text-sm font-bold text-hotel-forest">L {room.price.toLocaleString("es-HN")} / noche</p>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function GuestStep({ reservation, updateReservation }: StepProps) {
  return (
    <Panel title="Información del huésped" icon={UserRound}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre completo" value={reservation.guestName} placeholder="Ej. Juan Pérez" onChange={(value) => updateReservation("guestName", value)} />
        <Field label="Correo electrónico" type="email" value={reservation.guestEmail} placeholder="ejemplo@correo.com" onChange={(value) => updateReservation("guestEmail", value)} />
        <Field label="Teléfono" value={reservation.guestPhone} placeholder="+504 0000-0000" onChange={(value) => updateReservation("guestPhone", value)} />
        <Field label="País de residencia" value={reservation.guestCountry} placeholder="Honduras" onChange={(value) => updateReservation("guestCountry", value)} />
        <Field label="Número de documento" value={reservation.guestDocumentNumber} placeholder="Ej. 0801-1990-12345" onChange={(value) => updateReservation("guestDocumentNumber", value)} />
        <SelectField label="Tipo de documento" value={reservation.guestDocumentType} options={["Identidad", "Pasaporte", "RTN"]} onChange={(value) => updateReservation("guestDocumentType", value)} />
      </div>
      <Field label="Dirección" value={reservation.guestAddress} placeholder="Ej. Colonia Palmira, San Pedro Sula" onChange={(value) => updateReservation("guestAddress", value)} className="mt-4" />
      <label className="mt-4 block text-sm font-medium text-hotel-ink">
        Notas o solicitudes especiales
        <textarea className="mt-2 h-28 w-full rounded-[6px] border border-hotel-line bg-white p-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => updateReservation("notes", event.target.value)} placeholder="Cuéntanos si tienes alguna solicitud especial para tu estancia..." value={reservation.notes} />
      </label>
    </Panel>
  );
}

function ConfirmStep({ reservation, updateReservation }: StepProps) {
  return (
    <div className="space-y-5">
      <Panel title="Método de contacto preferido" icon={MessageCircle}>
        <div className="grid gap-4 md:grid-cols-3">
          {contactMethods.map((item) => (
            <label className={`rounded-[8px] border bg-white p-4 text-sm transition ${reservation.preferredContactMethod === item ? "border-hotel-forest bg-hotel-sage/40" : "border-hotel-line"}`} key={item}>
              <input checked={reservation.preferredContactMethod === item} className="mr-2" name="preferredContactMethod" onChange={() => updateReservation("preferredContactMethod", item)} type="radio" value={item} />
              {item}
            </label>
          ))}
        </div>
      </Panel>
      <Panel title="Información adicional" icon={ShieldCheck}>
        <div className="space-y-3 text-sm leading-6">
          <label className="flex gap-2"><input name="termsAccepted" required type="checkbox" />Acepto los Términos y Condiciones y la Política de Privacidad.</label>
          <label className="flex gap-2"><input name="dataProcessingAccepted" required type="checkbox" />Autorizo a Hotel Casa Blanca a procesar mis datos para gestionar mi reserva.</label>
        </div>
      </Panel>
    </div>
  );
}

function ReservationSummary({ room, reservation, nights, taxes, total }: { room: Room; reservation: ReservationState; nights: number; taxes: number; total: number }) {
  const subtotal = room.price * nights;

  return (
    <aside className="h-fit rounded-[8px] border border-hotel-line bg-hotel-ivory p-5 shadow-hotel-card lg:sticky lg:top-28">
      <h2 className="hotel-serif text-2xl font-bold text-hotel-forest">Resumen de tu reserva</h2>
      <div className="relative mt-4 h-44 overflow-hidden rounded-[8px] bg-white">
        <Image alt={room.name} className="object-cover" fill sizes="(min-width: 1024px) 400px, 100vw" src={room.image} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-hotel-forest">{room.name}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-hotel-muted">
        <span>{reservation.adults} Adultos</span>
        <span>{reservation.children} Niños</span>
        <span>Check-in<br /><strong>{formatDate(reservation.checkIn)}</strong></span>
        <span>Check-out<br /><strong>{formatDate(reservation.checkOut)}</strong></span>
        <span>Estancia<br /><strong>{nights} noches</strong></span>
        <span>Plan<br /><strong>Solo hospedaje</strong></span>
      </div>
      <div className="mt-5 space-y-3 border-t border-hotel-line pt-5 text-sm">
        <p className="flex justify-between gap-4"><span>Tarifa por noche</span><strong>L {room.price.toLocaleString("es-HN")}.00</strong></p>
        <p className="flex justify-between gap-4"><span>{nights} noches</span><strong>L {subtotal.toLocaleString("es-HN")}.00</strong></p>
        <p className="flex justify-between gap-4"><span>Impuestos y cargos</span><strong>L {taxes.toLocaleString("es-HN")}.00</strong></p>
        <p className="flex justify-between gap-4 border-t border-hotel-line pt-4 text-xl text-hotel-forest"><span>Total</span><strong>L {total.toLocaleString("es-HN")}.00</strong></p>
      </div>
      <div className="mt-5 rounded-[8px] bg-hotel-sage/70 p-4 text-sm leading-6 text-hotel-forest">
        <ShieldCheck className="mb-2 size-6" />
        Reserva 100% segura. Tus fechas se bloquean únicamente cuando el administrador confirma el pago.
      </div>
    </aside>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return <div className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-5 shadow-hotel-soft md:p-6"><h2 className="hotel-serif mb-5 flex items-center gap-3 text-2xl font-bold text-hotel-forest md:text-3xl"><Icon className="size-7 shrink-0" />{title}</h2>{children}</div>;
}

function Field({ label, value, onChange, placeholder, type = "text", className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; className?: string }) {
  return <label className={`block text-sm font-medium text-hotel-ink ${className}`}>{label}<input className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} /></label>;
}

function NumberField({ label, min, value, onChange }: { label: string; min: number; value: number; onChange: (value: number) => void }) {
  return <label className="text-sm font-medium text-hotel-ink">{label}<input className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none transition focus:border-hotel-gold" min={min} onChange={(event) => onChange(Number(event.target.value))} type="number" value={value} /></label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="text-sm font-medium text-hotel-ink">{label}<select className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none transition focus:border-hotel-gold" onChange={(event) => onChange(event.target.value)} value={value}>{options.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
}

type UpdateReservation = <K extends keyof ReservationState>(key: K, value: ReservationState[K]) => void;
interface StepProps {
  reservation: ReservationState;
  updateReservation: UpdateReservation;
}

function getNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / 86_400_000));
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-HN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
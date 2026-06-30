"use client";

import { CalendarDays, Check, Mail, ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { rooms } from "@/data/rooms";
import { Button } from "@/components/ui/button";

const steps = ["SelecciÃ³n de Fechas", "Habitaciones", "InformaciÃ³n", "ConfirmaciÃ³n"];

export function ReservationWizard() {
  const [step, setStep] = useState(0);
  const selectedRoom = rooms[1];
  const subtotal = selectedRoom.price * 2;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  return (
    <section className="hotel-container py-10">
      <div className="mb-10">
        <div className="h-2 overflow-hidden rounded-full bg-hotel-line">
          <div className="h-full bg-hotel-forest transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 grid gap-3 text-xs font-semibold text-hotel-muted md:grid-cols-4">
          {steps.map((item, index) => (
            <button
              className={`flex items-center gap-2 rounded-[8px] border p-3 text-left ${index === step ? "border-hotel-forest bg-hotel-ivory text-hotel-forest" : "border-hotel-line bg-white/60"}`}
              key={item}
              onClick={() => setStep(index)}
              type="button"
            >
              <span className="grid size-7 place-items-center rounded-full bg-hotel-sage text-hotel-forest">
                {index < step ? <Check className="size-4" /> : index + 1}
              </span>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {step === 0 ? <DatesStep /> : null}
          {step === 1 ? <RoomsStep /> : null}
          {step === 2 ? <GuestStep /> : null}
          {step === 3 ? <ConfirmStep /> : null}
          <div className="flex flex-col gap-3 rounded-[8px] bg-hotel-forest p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="hotel-serif text-2xl font-bold">Â¿Todo listo para continuar?</h3>
              <p className="text-sm text-white/75">La solicitud quedarÃ¡ pendiente de revisiÃ³n por el hotel.</p>
            </div>
            <div className="flex gap-3">
              <Button disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} type="button" variant="outline" className="border-white text-white hover:bg-white hover:text-hotel-forest">
                AtrÃ¡s
              </Button>
              <Button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} type="button" variant="gold">
                {step === steps.length - 1 ? "Enviar solicitud" : "Continuar"}
              </Button>
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-[8px] border border-hotel-line bg-hotel-ivory p-5 shadow-hotel-card">
          <h2 className="hotel-serif text-2xl font-bold text-hotel-forest">Resumen de tu reserva</h2>
          <div className="mt-4 overflow-hidden rounded-[8px] bg-white">
            <Image alt={selectedRoom.name} className="h-44 w-full object-cover" height={176} src={selectedRoom.image} width={320} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-hotel-forest">{selectedRoom.name}</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-hotel-muted">
            <span>2 Adultos</span>
            <span>0 NiÃ±os</span>
            <span>Check-in<br /><strong>24 Mayo 2026</strong></span>
            <span>Check-out<br /><strong>26 Mayo 2026</strong></span>
            <span>Estancia<br /><strong>2 noches</strong></span>
            <span>Plan<br /><strong>Solo hospedaje</strong></span>
          </div>
          <div className="mt-5 space-y-3 border-t border-hotel-line pt-5 text-sm">
            <p className="flex justify-between"><span>Tarifa por noche</span><strong>L {selectedRoom.price.toLocaleString("es-HN")}.00</strong></p>
            <p className="flex justify-between"><span>2 noches</span><strong>L {subtotal.toLocaleString("es-HN")}.00</strong></p>
            <p className="flex justify-between"><span>Impuestos y cargos</span><strong>L {taxes.toLocaleString("es-HN")}.00</strong></p>
            <p className="flex justify-between border-t border-hotel-line pt-4 text-xl text-hotel-forest"><span>Total</span><strong>L {total.toLocaleString("es-HN")}.00</strong></p>
          </div>
          <div className="mt-5 rounded-[8px] bg-hotel-sage/70 p-4 text-sm text-hotel-forest">
            <ShieldCheck className="mb-2 size-6" />
            Reserva 100% segura. Tus fechas se bloquean Ãºnicamente cuando el administrador confirma el pago.
          </div>
        </aside>
      </div>
    </section>
  );
}

function DatesStep() {
  return <Panel title="Selecciona tus fechas" icon={CalendarDays}><div className="grid gap-4 md:grid-cols-3"><Field label="Check-in" value="2026-05-24" /><Field label="Check-out" value="2026-05-26" /><Field label="HuÃ©spedes" value="2 adultos, 0 niÃ±os" /></div></Panel>;
}

function RoomsStep() {
  return <Panel title="Elige tu habitaciÃ³n" icon={CalendarDays}><div className="grid gap-4 md:grid-cols-2">{rooms.map((room) => <button className="rounded-[8px] border border-hotel-line bg-white p-4 text-left hover:border-hotel-gold" key={room.id} type="button"><strong className="text-hotel-forest">{room.name}</strong><p className="text-sm text-hotel-muted">L {room.price.toLocaleString("es-HN")} / noche</p></button>)}</div></Panel>;
}

function GuestStep() {
  return <Panel title="InformaciÃ³n del huÃ©sped" icon={UserRound}><div className="grid gap-4 md:grid-cols-2"><Field label="Nombre completo" value="" placeholder="Ej. Juan PÃ©rez" /><Field label="Correo electrÃ³nico" value="" placeholder="ejemplo@correo.com" /><Field label="TelÃ©fono" value="" placeholder="+504 0000-0000" /><Field label="PaÃ­s de residencia" value="" placeholder="Honduras" /><Field label="NÃºmero de documento" value="" placeholder="Ej. 0801-1990-12345" /><Field label="Tipo de documento" value="" placeholder="Identidad" /></div><textarea className="mt-4 h-28 w-full rounded-[6px] border border-hotel-line bg-white p-3 text-sm outline-none focus:border-hotel-gold" placeholder="Notas o solicitudes especiales" /></Panel>;
}

function ConfirmStep() {
  return <Panel title="MÃ©todo de contacto e informaciÃ³n adicional" icon={ShieldCheck}><div className="grid gap-4 md:grid-cols-3">{["WhatsApp", "Correo electrÃ³nico", "Llamada telefÃ³nica"].map((item) => <label className="rounded-[8px] border border-hotel-line bg-white p-4 text-sm" key={item}><input className="mr-2" name="contact" type="radio" />{item}</label>)}</div><div className="mt-5 space-y-3 text-sm"><label className="flex gap-2"><input type="checkbox" />Acepto los TÃ©rminos y Condiciones y la PolÃ­tica de Privacidad.</label><label className="flex gap-2"><input type="checkbox" />Autorizo el procesamiento de datos para gestionar mi reserva.</label></div></Panel>;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Mail; children: React.ReactNode }) {
  return <div className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 shadow-hotel-soft"><h2 className="hotel-serif mb-5 flex items-center gap-3 text-3xl font-bold text-hotel-forest"><Icon className="size-7" />{title}</h2>{children}</div>;
}

function Field({ label, value, placeholder }: { label: string; value: string; placeholder?: string }) {
  return <label className="text-sm font-medium text-hotel-ink">{label}<input className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 text-sm outline-none focus:border-hotel-gold" defaultValue={value} placeholder={placeholder} /></label>;
}

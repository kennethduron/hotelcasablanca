# Seguridad de Firebase - Hotel Casa Blanca

## Estado confirmado

El proyecto configurado es `hotelcasablanca-ce1b5`, con display name `hotelcasablanca`. La app web Firebase activa usa el mismo nombre del hotel y Firestore está habilitado como base `(default)` en modo `FIRESTORE_NATIVE`.

Las credenciales administrativas nunca se versionan. Las operaciones con datos personales se ejecutan mediante Firebase Admin SDK en Server Actions o código `server-only`; las reglas niegan el acceso público directo.

## Colecciones

- Lectura pública condicionada a `active == true`: `rooms`, `services`, `destinations`, `gallery`.
- Configuración pública: exclusivamente `settings/public` con `visibility == "public"`.
- Privadas: `reservations`, `guests`, `blocked_dates`, `messages`, `users`, `activity_logs`, `reports`, `admin_settings` e `inventory_locks`.
- Las reservas y mensajes públicos se crean en servidor. Las reglas rechazan su creación directa desde navegadores.

## Roles mediante custom claims

- `admin`: administración completa, usuarios, roles, configuración, pagos y eliminación crítica.
- `reception`: lectura/operación de reservas y huéspedes, check-in/check-out y fechas bloqueadas; no puede gestionar pagos, enlaces, roles o configuración sensible.
- `management`: lectura de reservas, huéspedes, dashboard, actividad y reportes.
- `staff`: acceso mínimo; los módulos futuros deben añadir permisos explícitos.

El claim `role` debe asignarse mediante Firebase Admin SDK desde un proceso administrativo confiable. Nunca se acepta un rol proveniente del navegador o de un documento editable por el usuario.

## Primer administrador

1. Crear el usuario real en Firebase Console: Authentication > Users > Add user.
2. En una terminal local con variables privadas cargadas, ejecutar uno de estos comandos:

```powershell
npm run admin:set-role -- --email usuario@dominio.com
npm run admin:set-role -- --uid UID_DEL_USUARIO
```

El script valida que el usuario exista y asigna `role = admin` mediante custom claims. No contiene correos, UIDs ni credenciales codificadas. Después de asignar el claim, el usuario debe cerrar sesión y volver a iniciar sesión para renovar su token.

## Seed público inicial

El seed se ejecuta manualmente y solo crea contenido público si falta. No sobrescribe documentos existentes y no crea reservas, huéspedes, pagos, mensajes ni usuarios administrativos ficticios.

```powershell
npm run seed:public
```

El script usa IDs estables para habitaciones, servicios, destinos, galería y `settings/public`, e informa documentos creados u omitidos. No se ejecuta durante `npm run build` ni automáticamente en Vercel.

## Sesiones administrativas

`/admin` verifica en servidor una session cookie Firebase `HttpOnly`, `Secure` en producción, `SameSite=Lax`, con vigencia de ocho horas y revocación comprobada. El login intercambia un ID token válido por esa cookie y exige uno de los custom claims autorizados. Las acciones de pago vuelven a autorizar `admin` en servidor.

## Reservas y concurrencia

El servidor valida Zod, obtiene tarifa/capacidad desde `rooms`, recalcula subtotal/impuestos/total y fuerza `pending_review`, `pending`, campos de aprobación vacíos y timestamps de servidor. Confirmar pago requiere rol `admin`, enlace HTTPS, una nueva consulta de disponibilidad y una transacción que crea bloqueos deterministas por habitación/noche en `inventory_locks`, evitando dos confirmaciones concurrentes. También registra `activity_logs`.

No bloquean disponibilidad: `pending_review`, `awaiting_payment`.

Sí bloquean disponibilidad: `paid`, `confirmed`, `checked_in` y fechas activas de `blocked_dates`.

La condición de solapamiento es:

```text
requestedCheckIn < existingCheckOut
AND
requestedCheckOut > existingCheckIn
```

## Storage

Las rutas admitidas son `rooms/{roomId}`, `services/{serviceId}`, `destinations/{destinationId}` y `gallery/{category}`. Solo `admin` escribe. Se aceptan JPEG, PNG, WebP o AVIF de hasta 5 MiB y nombres seguros. La lectura pública exige metadata `published=true`; todo lo demás se deniega.

## Variables

Cliente/Auth: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.

Servidor: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`. Alternativamente puede usarse Application Default Credentials en infraestructura compatible. `RESEND_API_KEY` es solo servidor y opcional. `DEMO_MODE=false` exige Firebase real.

## Demo y producción

- Desarrollo local: demo permitido solo si se configura explícitamente o si no hay Firebase en entorno no productivo.
- Preview: el modo demo está deshabilitado para evitar confusión visual.
- Producción: `DEMO_MODE=false`; si Firebase falla, debe mostrarse un error controlado y no mezclarse con datos demo.

## Índices

Las consultas actuales usan filtros u ordenamientos de un solo campo; Firestore los indexa automáticamente. Por ello `firestore.indexes.json` queda vacío y no inventa índices compuestos para pantallas aún no implementadas.

## Emulator Suite

Requiere Java 11 o superior. Ejecutar:

```powershell
npm run test:rules
```

Las pruebas verifican contenido público, colecciones privadas, restricciones de reception/admin y carga/lectura de Storage.

## Despliegue seguro

```powershell
firebase deploy --only firestore:rules,firestore:indexes --project hotelcasablanca-ce1b5
firebase deploy --only storage --project hotelcasablanca-ce1b5
```

Desplegar Storage solo si el bucket está habilitado. No desplegar usando otro alias o proyecto.

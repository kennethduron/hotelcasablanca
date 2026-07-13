# Seguridad de Firebase — Hotel Casa Blanca

## Estado y alcance

El proyecto asociado por nombre es `hotelcasablanca-ce1b5`. Al realizar esta auditoría no tenía apps Firebase registradas y la API de Cloud Firestore estaba deshabilitada. Por ese motivo las reglas no deben desplegarse hasta crear/verificar la app web, habilitar Firestore y confirmar el entorno.

Las credenciales administrativas nunca se versionan. Las operaciones con datos personales se ejecutan mediante Firebase Admin SDK en Server Actions o código `server-only`; las reglas niegan su acceso público.

## Colecciones

- Lectura pública condicionada a `active == true`: `rooms`, `services`, `destinations`, `gallery`.
- Configuración pública: exclusivamente `settings/public` con `visibility == "public"`.
- Privadas: `reservations`, `guests`, `blocked_dates`, `messages`, `users`, `activity_logs`, `reports`, `admin_settings` e `inventory_locks`.
- Las reservas y mensajes públicos se crean en servidor. Las reglas rechazan su creación directa desde navegadores.

## Roles mediante custom claims

- `admin`: administración completa, usuarios, roles, configuración, pagos y eliminación crítica.
- `reception`: lectura/operación de reservas y huéspedes, check-in/check-out y fechas bloqueadas; no puede gestionar pagos, enlaces, roles o configuración sensible.
- `management`: lectura de reservas, huéspedes, dashboard, actividad y reportes.
- `staff`: acceso mínimo; actualmente solo puede crear registros de actividad propios. Los módulos futuros deben añadir permisos explícitos.

El claim `role` debe asignarse mediante Firebase Admin SDK desde un proceso administrativo confiable. Nunca se acepta un rol proveniente del navegador o de un documento editable por el usuario.

## Sesiones administrativas

`/admin` verifica en servidor una session cookie Firebase `HttpOnly`, `Secure` en producción, `SameSite=Lax`, con vigencia de ocho horas y revocación comprobada. El login intercambia un ID token válido por esa cookie y exige uno de los custom claims autorizados. Las acciones de pago vuelven a autorizar `admin` en servidor.

## Reservas y concurrencia

El servidor valida Zod, obtiene tarifa/capacidad desde `rooms`, recalcula subtotal/impuestos/total y fuerza `pending_review`, `pending`, campos de aprobación vacíos y timestamps de servidor. Confirmar pago requiere rol `admin`, enlace HTTPS, una nueva consulta de disponibilidad y una transacción que crea bloqueos deterministas por habitación/noche en `inventory_locks`, evitando dos confirmaciones concurrentes. También registra `activity_logs`.

## Storage

Las rutas admitidas son `rooms/{roomId}`, `services/{serviceId}`, `destinations/{destinationId}` y `gallery/{category}`. Solo `admin` escribe. Se aceptan JPEG, PNG, WebP o AVIF de hasta 5 MiB y nombres seguros. La lectura pública exige metadata `published=true`; todo lo demás se deniega.

## Variables

Cliente/Auth: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.

Servidor: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`. Alternativamente puede usarse Application Default Credentials en infraestructura compatible. `RESEND_API_KEY` es solo servidor. `DEMO_MODE=true` debe configurarse explícitamente cuando se quiera demo; `DEMO_MODE=false` exige Firebase.

## Demo y producción

- Desarrollo local: demo permitido si no hay Firebase.
- Preview: usar `DEMO_MODE=true` de forma explícita e identificar el entorno de prueba.
- Producción: configurar Firebase completo con `DEMO_MODE=false`, o declarar conscientemente `DEMO_MODE=true`. Una configuración parcial nunca se mezcla con datos locales.

## Índices

Las consultas actuales usan filtros u ordenamientos de un solo campo; Firestore los indexa automáticamente. Por ello `firestore.indexes.json` queda vacío y no inventa índices compuestos para pantallas aún no implementadas.

## Emulator Suite

Requiere Java 11 o superior. Ejecutar:

```powershell
npm run test:rules
```

Las pruebas verifican contenido público, colecciones privadas, restricciones de reception/admin y carga/lectura de Storage.

## Despliegue seguro

Después de crear/verificar la app y base correctas:

```powershell
firebase use hotelcasablanca-ce1b5
firebase deploy --only firestore:rules,firestore:indexes,storage --project hotelcasablanca-ce1b5
```

Revisar primero el diff y ejecutar el emulador. No desplegar usando otro alias o proyecto.

## Migración futura a Supabase

Mantener las interfaces de repositorio y servicios actuales. Sustituir Firebase Admin por un adaptador Supabase con RLS equivalente, mapear custom claims a roles de Supabase y conservar las validaciones Zod, la transacción de inventario y la interfaz de disponibilidad sin cambios en componentes visuales.

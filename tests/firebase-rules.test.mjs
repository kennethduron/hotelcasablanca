import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getBytes, ref, uploadString } from "firebase/storage";

let environment;

before(async () => {
  environment = await initializeTestEnvironment({
    projectId: "hotelcasablanca-ce1b5",
    firestore: { rules: await readFile("firestore.rules", "utf8") },
    storage: { rules: await readFile("storage.rules", "utf8") },
  });
  await environment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "rooms", "active-room"), { active: true, name: "Activa" });
    await setDoc(doc(context.firestore(), "rooms", "inactive-room"), { active: false, name: "Inactiva" });
    await setDoc(doc(context.firestore(), "reservations", "reservation-1"), { status: "pending_review", paymentStatus: "pending", roomId: "active-room" });
    await setDoc(doc(context.firestore(), "guests", "guest-1"), { name: "Privado" });
    await setDoc(doc(context.firestore(), "messages", "message-1"), { status: "new" });
    await setDoc(doc(context.firestore(), "blocked_dates", "block-1"), { roomId: "active-room", active: true });
  });
});

after(async () => { await environment?.cleanup(); });

test("público solo lee contenido activo", async () => {
  const db = environment.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, "rooms", "active-room")));
  await assertFails(getDoc(doc(db, "rooms", "inactive-room")));
  await assertFails(updateDoc(doc(db, "rooms", "active-room"), { name: "Alterada" }));
});

test("público no accede ni escribe colecciones privadas", async () => {
  const db = environment.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, "reservations", "reservation-1")));
  await assertFails(setDoc(doc(db, "reservations", "forged"), { status: "confirmed", paymentStatus: "paid" }));
  await assertFails(getDoc(doc(db, "guests", "guest-1")));
  await assertFails(getDoc(doc(db, "messages", "message-1")));
  await assertFails(updateDoc(doc(db, "blocked_dates", "block-1"), { active: false }));
});

test("reception administra reservas sin pagos ni roles", async () => {
  const db = environment.authenticatedContext("reception-1", { role: "reception" }).firestore();
  await assertSucceeds(getDoc(doc(db, "reservations", "reservation-1")));
  await assertSucceeds(updateDoc(doc(db, "reservations", "reservation-1"), { status: "checked_in" }));
  await assertFails(updateDoc(doc(db, "reservations", "reservation-1"), { paymentStatus: "paid" }));
  await assertFails(setDoc(doc(db, "users", "new-admin"), { role: "admin" }));
});

test("admin ejecuta operaciones autorizadas", async () => {
  const db = environment.authenticatedContext("admin-1", { role: "admin" }).firestore();
  await assertFails(updateDoc(doc(db, "reservations", "reservation-1"), { paymentStatus: "paid", confirmedBy: "admin-1" }));
  await assertSucceeds(updateDoc(doc(db, "rooms", "active-room"), { name: "Actualizada por admin" }));
  await assertSucceeds(setDoc(doc(db, "users", "staff-1"), { role: "staff" }));
  await assertSucceeds(deleteDoc(doc(db, "blocked_dates", "block-1")));
});

test("storage rechaza visitantes y archivos peligrosos", async () => {
  const publicStorage = environment.unauthenticatedContext().storage();
  await assertFails(uploadString(ref(publicStorage, "gallery/hotel/public.png"), "image", "raw", { contentType: "image/png" }));
  const adminStorage = environment.authenticatedContext("admin-1", { role: "admin" }).storage();
  await assertSucceeds(uploadString(ref(adminStorage, "gallery/hotel/valid.png"), "image", "raw", { contentType: "image/png", customMetadata: { published: "true" } }));
  await assertFails(uploadString(ref(adminStorage, "gallery/hotel/script.html"), "<script />", "raw", { contentType: "text/html" }));
  await assertFails(uploadString(ref(adminStorage, "gallery/hotel/huge.png"), "x".repeat(5 * 1024 * 1024 + 1), "raw", { contentType: "image/png" }));
  await assertSucceeds(getBytes(ref(publicStorage, "gallery/hotel/valid.png")));
});

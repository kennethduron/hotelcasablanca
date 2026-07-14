import { getScriptAuth } from "./firebase-admin.ts";

function getTarget() {
  const [, , flag, value] = process.argv;
  if ((flag === "--email" || flag === "--uid") && value) return { flag, value };
  const positional = process.argv[2];
  if (positional?.includes("@")) return { flag: "--email", value: positional };
  if (positional) return { flag: "--uid", value: positional };
  throw new Error("Uso: npm run admin:set-role -- --email usuario@dominio.com  o  npm run admin:set-role -- --uid UID");
}

const target = getTarget();
const auth = getScriptAuth();
const user = target.flag === "--email"
  ? await auth.getUserByEmail(target.value)
  : await auth.getUser(target.value);

await auth.setCustomUserClaims(user.uid, {
  ...(user.customClaims ?? {}),
  role: "admin",
});

process.stdout.write("Rol admin asignado. El usuario debe cerrar sesión y volver a iniciar sesión.\n");
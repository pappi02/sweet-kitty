// Makes the two admin settings for the hosting environment (and .env.local).
//   npm run admin:hash
// Type the password when asked. Nothing is saved or sent anywhere: copy the two
// printed lines into your environment variables.
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = (process.argv[2] ?? (await rl.question("Admin password (12+ characters): "))).trim();
rl.close();

if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}

const N = 2 ** 15, r = 8, p = 1;
const salt = randomBytes(16);
const key = await scrypt(password, salt, 64, { N, r, p, maxmem: 128 * N * r * 2 });

console.log("\nAdd these to your environment variables:\n");
// Colons, not "$": .env files expand "$NAME", which would corrupt the hash.
console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64url")}:${key.toString("base64url")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);

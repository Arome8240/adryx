/**
 * One-time script: create the first super-admin account.
 *
 * Usage:
 *   pnpm --filter backend tsx scripts/create-admin.ts
 *
 * Override defaults via env vars:
 *   ADMIN_EMAIL=me@example.com ADMIN_PASSWORD=s3cr3t pnpm --filter backend tsx scripts/create-admin.ts
 *
 * After creation the script prints the admin login URL and exits.
 */

import * as readline from "readline";
import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import * as path from "path";
import * as fs from "fs";

// Load .env from the backend root without an external dotenv dependency
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}

// ── Config ────────────────────────────────────────────────────────────────────

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/adryx";

const ADMIN_LOGIN_URL =
  process.env.NODE_ENV === "production"
    ? "https://admin.adryx.xyz/login"
    : "http://localhost:3000/admin/login";

// ── Minimal user schema (no NestJS decorators needed here) ────────────────────

const UserSchema = new mongoose.Schema(
  {
    email:         { type: String, required: true, unique: true },
    password:      { type: String, required: true },
    name:          { type: String, required: true },
    role:          { type: String, enum: ["advertiser", "publisher", "admin"], default: "publisher" },
    isActive:      { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    timezone:      { type: String, default: "UTC" },
  },
  { timestamps: true, collection: "users" },
);

const User = mongoose.model("User", UserSchema);

// ── Prompt helper ─────────────────────────────────────────────────────────────

function prompt(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (hidden) {
      // Don't echo the password
      process.stdout.write(question);
      process.stdin.setRawMode(true);
      let password = "";
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (ch: string) => {
        if (ch === "\n" || ch === "\r" || ch === "") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write("\n");
          rl.close();
          resolve(password);
        } else if (ch === "") {
          password = password.slice(0, -1);
        } else {
          password += ch;
          process.stdout.write("*");
        }
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║      Adryx — Create Super Admin Account  ║");
  console.log("╚══════════════════════════════════════════╝\n");

  // Collect credentials (env vars override interactive prompts)
  const email =
    process.env.ADMIN_EMAIL ||
    (await prompt("Admin email:    "));

  const name =
    process.env.ADMIN_NAME ||
    (await prompt("Admin name:     "));

  const password =
    process.env.ADMIN_PASSWORD ||
    (await prompt("Admin password: ", true));

  if (!email || !name || !password) {
    console.error("\n✗  Email, name, and password are all required.\n");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("\n✗  Password must be at least 8 characters.\n");
    process.exit(1);
  }

  // Connect
  console.log(`\nConnecting to ${MONGO_URI.replace(/\/\/.*@/, "//***@")} …`);
  await mongoose.connect(MONGO_URI);
  console.log("✓  Connected.\n");

  // Guard: already exists?
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === "admin") {
      console.log(`✗  An admin account with email "${email}" already exists.`);
      console.log(`   Log in at: ${ADMIN_LOGIN_URL}\n`);
    } else {
      // Upgrade existing user to admin
      existing.role = "admin";
      existing.password = await bcrypt.hash(password, 10);
      await existing.save();
      console.log(`✓  Existing user "${email}" upgraded to admin.`);
      console.log(`\n   → Log in at: ${ADMIN_LOGIN_URL}\n`);
    }
    await mongoose.disconnect();
    return;
  }

  // Create
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    email,
    name,
    password: hashedPassword,
    role: "admin",
    isActive: true,
    emailVerified: true,
  });

  console.log(`✓  Admin account created successfully!`);
  console.log(`   Email:    ${email}`);
  console.log(`   Name:     ${name}`);
  console.log(`\n   → Log in at: ${ADMIN_LOGIN_URL}\n`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("\n✗  Error:", err.message || err);
  process.exit(1);
});

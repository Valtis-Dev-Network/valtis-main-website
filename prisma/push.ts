import { execFileSync } from "node:child_process";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tables = [
  "ProjectTag",
  "DeveloperSkill",
  "InitiativeUpdate",
  "InitiativeMember",
  "SafeguardingNote",
  "SafeguardingCase",
  "Report",
  "ContactMessage",
  "Resource",
  "Initiative",
  "Project",
  "DeveloperProfile",
  "Tag",
  "LegalDocument",
  "CookieConsent",
  "SiteSetting",
  "Announcement",
  "AuditLog",
  "User"
];

async function main() {
  const prismaCli = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");
  const sql = execFileSync(process.execPath, [prismaCli, "migrate", "diff", "--from-empty", "--to-schema-datamodel", "prisma/schema.prisma", "--script"], {
    encoding: "utf8",
    env: { ...process.env, CHECKPOINT_DISABLE: "1" }
  });

  await prisma.$executeRawUnsafe("PRAGMA foreign_keys=OFF");
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}"`);
  }
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys=ON");

  const statements = sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

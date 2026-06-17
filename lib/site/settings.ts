import "server-only";

import { prisma } from "@/lib/db/client";

export type PlatformSettings = {
  discordUrl: string;
  githubUrl: string;
};

export const defaultPlatformSettings: PlatformSettings = {
  discordUrl: "https://discord.gg/valtis",
  githubUrl: "https://github.com/valtis-network"
};

export async function getPlatformSettings(): Promise<PlatformSettings> {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "platform" } });
  if (!setting) return defaultPlatformSettings;
  try {
    return { ...defaultPlatformSettings, ...(JSON.parse(setting.value) as Partial<PlatformSettings>) };
  } catch {
    return defaultPlatformSettings;
  }
}

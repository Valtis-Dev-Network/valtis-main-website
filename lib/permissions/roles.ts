export type Permission =
  | "dashboard:view"
  | "projects:moderate"
  | "developers:moderate"
  | "resources:edit"
  | "initiatives:edit"
  | "messages:manage"
  | "reports:manage"
  | "safeguarding:manage"
  | "users:manage"
  | "legal:manage"
  | "settings:manage"
  | "audit:view";

export type UserRole = "ADMIN" | "DIRECTOR" | "SAFEGUARDING_LEAD" | "MODERATOR" | "EDITOR" | "VIEWER";

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    "dashboard:view",
    "projects:moderate",
    "developers:moderate",
    "resources:edit",
    "initiatives:edit",
    "messages:manage",
    "reports:manage",
    "safeguarding:manage",
    "users:manage",
    "legal:manage",
    "settings:manage",
    "audit:view"
  ],
  DIRECTOR: [
    "dashboard:view",
    "projects:moderate",
    "developers:moderate",
    "resources:edit",
    "initiatives:edit",
    "messages:manage",
    "reports:manage",
    "safeguarding:manage",
    "users:manage",
    "legal:manage",
    "settings:manage",
    "audit:view"
  ],
  SAFEGUARDING_LEAD: ["dashboard:view", "reports:manage", "safeguarding:manage", "audit:view"],
  MODERATOR: ["dashboard:view", "projects:moderate", "developers:moderate", "messages:manage", "reports:manage", "audit:view"],
  EDITOR: ["dashboard:view", "resources:edit", "initiatives:edit"],
  VIEWER: ["dashboard:view"]
};

export function can(role: string | undefined, permission: Permission) {
  return Boolean(role && role in rolePermissions && rolePermissions[role as UserRole]?.includes(permission));
}

export function assertCan(role: string | undefined, permission: Permission) {
  if (!can(role, permission)) {
    throw new Error("You do not have permission to perform this action.");
  }
}

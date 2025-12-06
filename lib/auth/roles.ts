export type Role = "tutor" | "moderator" | "admin";

export const roleHierarchy: Record<Role, number> = {
tutor: 1,
moderator: 2,
admin: 3,
};

export function can(role: Role, required: Role) {
return roleHierarchy[role] >= roleHierarchy[required];
}

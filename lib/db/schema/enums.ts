// lib/db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const Role = pgEnum("Role", ["USER", "ADMIN"]);

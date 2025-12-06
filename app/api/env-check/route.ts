// app/api/env-check/route.ts
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    hasUploadthingSecret: !!process.env.UPLOADTHING_SECRET,
    hasUploadthingAppId: !!process.env.UPLOADTHING_APP_ID,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV ?? null
  });
}

export const runtime = "nodejs";

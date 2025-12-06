import { db } from "@/lib/db/client";

export async function GET() {
  try {
    const result = await db.query.users.findMany();
    return Response.json({
      ok: true,
      count: result.length,
    });
  } catch (e: any) {
    return Response.json({
      ok: false,
      error: e.message,
    });
  }
}

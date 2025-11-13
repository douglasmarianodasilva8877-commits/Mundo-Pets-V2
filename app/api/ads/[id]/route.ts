// app/api/ads/[id]/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ADS_PATH = path.join(process.cwd(), "data", "ads.json");

async function readAds() {
  const raw = await fs.readFile(ADS_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeAds(ads: any[]) {
  await fs.writeFile(ADS_PATH, JSON.stringify(ads, null, 2), "utf-8");
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    // body: { approved?: boolean, ...other fields to update }
    const ads = await readAds();
    const idx = ads.findIndex((a: any) => a.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    ads[idx] = { ...ads[idx], ...body, updatedAt: new Date().toISOString() };
    await writeAds(ads);
    return NextResponse.json({ success: true, ad: ads[idx] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const ads = await readAds();
    const filtered = ads.filter((a: any) => a.id !== id);
    await writeAds(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}

// app/api/ads/route.ts
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

export async function GET() {
  try {
    const ads = await readAds();
    const banners = ads.filter((a: any) => a.type === "banner" && a.approved);
    const produtos = ads.filter((a: any) => a.type === "produto" && a.approved);
    const videos = ads.filter((a: any) => a.type === "video" && a.approved);
    return NextResponse.json({ banners, produtos, videos, all: ads });
  } catch (err) {
    return NextResponse.json({ error: "Failed to read ads" }, { status: 500 });
  }
}

/**
 * POST -> criar novo anúncio (simulado).
 * Body JSON: { partnerName, type, title, description, mediaUrl, targetUrl }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.title || !body.type || !body.partnerName) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const ads = await readAds();
    const id = Date.now().toString();
    const newAd = {
      id,
      partnerName: body.partnerName,
      type: body.type,
      title: body.title,
      description: body.description || "",
      mediaUrl: body.mediaUrl || "/anuncio/premier-banner.jpg",
      targetUrl: body.targetUrl || "#",
      approved: false, // por padrão precisa aprovação
      createdAt: new Date().toISOString(),
    };

    ads.unshift(newAd);
    await writeAds(ads);

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}

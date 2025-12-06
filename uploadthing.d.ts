// uploadthing.d.ts
import type { OurFileRouter } from "@/uploadthing.config";

declare module "uploadthing/server" {
  interface UploadThingFileRouter extends OurFileRouter {}
}

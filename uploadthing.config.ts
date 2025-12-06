// uploadthing.config.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

export const UPLOADTHING_APP_ID = process.env.UPLOADTHING_APP_ID ?? "";
export const UPLOADTHING_SECRET = process.env.UPLOADTHING_SECRET ?? "";

const f = createUploadthing();

export const ourFileRouter = {
  postMedia: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 2 },
  })
    .middleware(async ({ req }) => {
      // Se quiser autenticação real, coloque aqui. Por enquanto anônimo:
      return { userId: "anonymous" };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("📁 Arquivo recebido →", file.url);

      return {
        url: file.url,
        type: file.type, // image/png ou video/mp4 etc
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

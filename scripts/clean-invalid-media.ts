import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🧹 Limpando URLs inválidas (/mnt/data/...) em posts.media_urls...");

  const result = await db.execute(sql`
    UPDATE posts
    SET media_urls = (
      SELECT ARRAY(
        SELECT url
        FROM unnest(media_urls) AS url
        WHERE url NOT LIKE '/mnt/data/%'
      )
    )
    WHERE EXISTS (
      SELECT 1
      FROM unnest(media_urls) AS url
      WHERE url LIKE '/mnt/data/%'
    );
  `);

  console.log("✔ Limpeza concluída!");
  console.log("Resultado:", result);
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro durante limpeza:", err);
  process.exit(1);
});

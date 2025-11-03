-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "slug" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "bio" TEXT,
    "description" TEXT,
    "avatarUrl" TEXT,
    "ownerId" TEXT,
    "ownerEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pet" ("age", "avatarUrl", "bio", "breed", "createdAt", "description", "id", "name", "ownerId", "slug", "species") SELECT "age", "avatarUrl", "bio", "breed", "createdAt", "description", "id", "name", "ownerId", "slug", "species" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
CREATE UNIQUE INDEX "Pet_slug_key" ON "Pet"("slug");
CREATE UNIQUE INDEX "Pet_ownerId_key" ON "Pet"("ownerId");
CREATE UNIQUE INDEX "Pet_ownerEmail_key" ON "Pet"("ownerEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

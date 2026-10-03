import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "products");
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Writes an uploaded product photo (from a Server Action's FormData) to
 * public/images/products/, returning the public URL path to store on Product.imageUrl.
 * Local-disk storage — fine for this project's current SQLite/local-dev setup,
 * won't persist on a serverless host (same caveat as dev.db).
 */
export async function saveProductPhoto(file: File, slug: string): Promise<string> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new Error("فرمت تصویر پشتیبانی نمی‌شود");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${slug}-${Date.now()}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/images/products/${filename}`;
}

/** Best-effort cleanup — a missing/already-removed file is not an error here. */
export async function deleteProductPhoto(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl || !imageUrl.startsWith("/images/products/")) return;

  const filePath = path.join(process.cwd(), "public", imageUrl);
  await unlink(filePath).catch(() => undefined);
}

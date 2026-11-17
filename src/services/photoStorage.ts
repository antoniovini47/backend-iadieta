import { randomUUID } from "node:crypto";
import { del, list, put } from "@vercel/blob";

const PREFIX = "fotos/";
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

const PhotoStorage = {
  save: async (image64Base: string): Promise<string> => {
    const day = new Date().toISOString().slice(0, 10);
    const { pathname } = await put(`${PREFIX}${day}/${randomUUID()}.jpg`, Buffer.from(image64Base, "base64"), {
      access: "private",
      contentType: "image/jpeg",
    });
    return pathname;
  },

  purgeExpired: async (now = Date.now()): Promise<number> => {
    let removed = 0;
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor });
      const expired = page.blobs.filter((blob) => now - blob.uploadedAt.getTime() > RETENTION_MS);
      if (expired.length) {
        await del(expired.map((blob) => blob.url));
        removed += expired.length;
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return removed;
  },
};

export default PhotoStorage;

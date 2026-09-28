import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { getWhatsAppCredentials } from "./client";

export interface DownloadedMedia {
  ok: boolean;
  mediaId: string;
  mimeType?: string;
  dataUri?: string;
  localPath?: string;
  buffer?: Buffer;
  error?: string;
}

/**
 * Downloads media from Meta WhatsApp Cloud API using media ID.
 * Returns both a base64 Data URI and stores it in public/uploads/slips for immediate UI rendering.
 */
export async function downloadWhatsAppMedia(mediaId: string): Promise<DownloadedMedia> {
  try {
    const creds = await getWhatsAppCredentials();
    if (!creds.token) {
      return { ok: false, mediaId, error: "WhatsApp token not configured" };
    }

    const apiVersion = creds.apiVersion || "v21.0";

    // 1. Get media URL metadata from Meta Graph API
    const metaRes = await axios.get(`https://graph.facebook.com/${apiVersion}/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${creds.token}`,
      },
      timeout: 10000,
    });

    const downloadUrl = metaRes.data?.url;
    const mimeType = metaRes.data?.mime_type || "image/jpeg";

    if (!downloadUrl) {
      return { ok: false, mediaId, error: "Download URL missing from Meta Graph response" };
    }

    // 2. Download the binary media content
    const mediaRes = await axios.get(downloadUrl, {
      headers: {
        Authorization: `Bearer ${creds.token}`,
      },
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const buffer = Buffer.from(mediaRes.data);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;

    // 3. Save to public/uploads/slips for persistent web access
    let localPublicUrl: string | undefined;
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "slips");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
      const fileName = `slip_${mediaId}_${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      localPublicUrl = `/uploads/slips/${fileName}`;
    } catch (fsErr) {
      console.warn("[downloadWhatsAppMedia] Could not write to disk, using data URI:", fsErr);
    }

    return {
      ok: true,
      mediaId,
      mimeType,
      dataUri,
      localPath: localPublicUrl || dataUri,
      buffer,
    };
  } catch (err: any) {
    console.error("[downloadWhatsAppMedia] Error downloading media:", err.response?.data || err.message);
    return {
      ok: false,
      mediaId,
      error: err.response?.data?.error?.message || err.message,
    };
  }
}

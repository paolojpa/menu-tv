import { head } from "@vercel/blob";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    const meta = await head("menu/menu.jpg");

    return res.status(200).json({
      url: meta.url,
      v: meta.uploadedAt || Date.now(),
    });
  } catch {
    return res.status(200).json({ url: null, v: null });
  }
}

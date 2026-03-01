import { head } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const meta = await head("menu/menu.jpg");

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({
      url: meta.url,
      v: meta.uploadedAt || Date.now()
    });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ url: null, v: null });
  }
}

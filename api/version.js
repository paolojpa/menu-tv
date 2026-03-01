import { head } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    // si siempre usas el mismo pathname:
    const info = await head("menu/menu.jpg");

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      url: info.url,
      v: info.uploadedAt ? new Date(info.uploadedAt).getTime() : Date.now(),
    });
  } catch (e) {
    // si aún no existe el archivo
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ url: null, v: null });
  }
}

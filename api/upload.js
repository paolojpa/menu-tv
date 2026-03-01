import { put } from '@vercel/blob';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).send("No autorizado");
  }

  if (req.method !== 'POST') {
    return res.status(405).send("Método no permitido");
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  const blob = await put("menu/menu.jpg", buffer, {
    access: "public",
    overwrite: true,
    cacheControlMaxAge: 60
  });

  return res.status(200).json({ ok: true, url: blob.url });
}

import { createUploadUrl } from "@vercel/blob";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).send("No autorizado");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  // pathname fijo (siempre igual)
  const url = await createUploadUrl({
    pathname: "menu/menu.jpg",
    access: "public",
    contentType: "image/jpeg"
  });

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ url });
}

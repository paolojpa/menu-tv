import { createUploadUrl } from "@vercel/blob";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).send("No autorizado");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  const { url } = await createUploadUrl({
    pathname: "menu/menu.jpg",
    access: "public",
    addRandomSuffix: false   // 👈 ESTA LÍNEA ES LA CLAVE
  });

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ url });
}

import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).send("No autorizado");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) return res.status(400).send("Error leyendo archivo: " + err.message);

      const f = files.file;
      const file = Array.isArray(f) ? f[0] : f;
      if (!file) return res.status(400).send("Falta campo 'file'");

      const buffer = fs.readFileSync(file.filepath);

      const blob = await put("menu/menu.jpg", buffer, {
        access: "public",
        overwrite: true,
        contentType: file.mimetype || "image/jpeg",
        cacheControlMaxAge: 60,
      });

      return res.status(200).json({ ok: true, url: blob.url });
    } catch (e) {
      return res.status(500).send(e?.message || "Error interno");
    }
  });
}

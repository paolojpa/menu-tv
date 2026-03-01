import formidable from "formidable";
import fs from "fs";
import { put } from "@vercel/blob";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // seguridad por token (querystring)
  const token = req.query.token;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).send("No autorizado");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) return res.status(400).json({ error: "Form data inválido" });

      // 1) obtener archivo de manera robusta
      let file = files.file || files.image || Object.values(files)[0];
      if (Array.isArray(file)) file = file[0]; // <-- CLAVE

      if (!file) return res.status(400).json({ error: "No llegó archivo" });

      // 2) filepath/path robusto
      const filepath = file.filepath || file.path;
      if (!filepath) {
        return res.status(400).json({
          error: "Archivo sin filepath/path (formidable devolvió un formato inesperado)",
        });
      }

      const buffer = await fs.promises.readFile(filepath);

      // 3) sube SIEMPRE al mismo nombre
      const blob = await put("menu/menu.jpg", buffer, {
        access: "public",
        contentType: file.mimetype || "image/jpeg",
        addRandomSuffix: false,
      });

      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ url: blob.url, v: Date.now() });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Upload falló" });
    }
  });
}

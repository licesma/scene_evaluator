import { firestore } from "../lib/firebaseAdmin.js";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import archiver from "archiver";

console.log("[download] Module loaded");
const s3 = new S3Client({ region: "us-west-2" });

export default async function handler(req, res) {
  console.log("[download] Handler called, query:", JSON.stringify(req.query));
  try {
    // Support both /api/download?video=xxx and /api/download/xxx via rewrite
    const video = req.query.video;
    
    if (!video) {
      return res.status(400).json({ error: "Missing video parameter" });
    }
    
    console.log("[download] Looking up video:", video);

    // 1. Firestore
    const snap = await firestore.doc("reconstructions/metadata").get();
    const meta = snap.data()[video];
    if (meta === undefined) {
      res.status(404).setHeader("Content-Type", "text/plain");
      return res.send(`The reconstruction "${video}" does not exist.`);
    }

    console.log("[download] Found metadata:", JSON.stringify(meta));
    const prefix = `${meta.week}/${meta.author}/${video}/simulation/`;

    // 2. List S3
    console.log("[download] Listing S3 prefix:", prefix);
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: "openreal2sim",
        Prefix: prefix,
      })
    );

    const items = (list.Contents || []).filter((o) => !o.Key.endsWith("/"));
    console.log("[download] Found", items.length, "files");

    if (items.length === 0) {
      res.status(404).setHeader("Content-Type", "text/plain");
      return res.send(
        `The reconstruction "${video}" has no simulation folder.`
      );
    }

    // 3. TAR.GZ setup
    res.setHeader("Content-Type", "application/gzip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${video}.tar.gz"`
    );

    const archive = archiver("tar", { gzip: true });
    archive.pipe(res);

    // 4. Add files
    for (const obj of items) {
      const key = obj.Key;
      const filename = key.replace(prefix, "");

      const s3Obj = await s3.send(
        new GetObjectCommand({
          Bucket: "openreal2sim",
          Key: key,
        })
      );

      archive.append(s3Obj.Body, { name: `${video}/${filename}` });
    }

    archive.finalize();
  } catch (err) {
    console.error("[download] ERROR:", err.message);
    console.error("[download] Stack:", err.stack);
    res.status(500).send(err.message);
  }
}

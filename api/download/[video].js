import { firestore } from "../../lib/firebaseAdmin.js";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import archiver from "archiver";

const s3 = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: "anonymous",
    secretAccessKey: "anonymous",
  },
});

export default async function handler(req, res) {
  try {
    const { video } = req.query;

    // 1. Firestore
    const snap = await firestore.doc("reconstructions/metadata").get();
    const meta = snap.data()[video];
    if (meta === undefined) {
      res.status(404).setHeader("Content-Type", "text/plain");
      return res.send(`The reconstruction "${video}" does not exist.`);
    }

    const prefix = `${meta.week}/${meta.author}/${video}/simulation/`;

    // 2. List S3
    const list = await s3.send(
      new ListObjectsV2Command({
        Bucket: "openreal2sim",
        Prefix: prefix,
      })
    );

    const items = (list.Contents || []).filter((o) => !o.Key.endsWith("/"));

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
    console.error(err);
    res.status(500).send(err.message);
  }
}

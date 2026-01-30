import { firestore } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    const docRef = firestore.doc("reconstructions/metadata");
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Doc not found" });
    }

    // Return just the keys so the response is tiny
    const data = snap.data();
    const keys = Object.keys(data);

    return res.status(200).json({
      ok: true,
      keys,
      firstEntry: data[keys[0]] ?? null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

admin.initializeApp()
const db = admin.firestore()

export const assetDetail = functions.https.onRequest(async function (req: any, res: any) {
  try {
    const id = (req.query?.id as string) || req.body?.id
    if (!id) return res.status(400).send("Missing id query param")

    const doc = await db.collection("assets").doc(id).get()
    if (!doc.exists) return res.status(404).send("Asset not found")

    const data = doc.data() || {}
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Asset ${escapeHtml(String(data.assetTag || id))}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:0;padding:24px;background:#f7fafc;color:#111}
  .card{background:#fff;border-radius:8px;padding:18px;box-shadow:0 4px 14px rgba(0,0,0,0.08);max-width:720px;margin:24px auto}
  h1{margin:0 0 8px 0;font-size:20px}
  dt{font-weight:600;color:#4b5563}
  dd{margin:4px 0 12px 0}
</style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(String(data.name || "Asset"))} — ${escapeHtml(String(data.assetTag || id))}</h1>
    <dl>
      <dt>Asset Tag</dt><dd>${escapeHtml(String(data.assetTag || "—"))}</dd>
      <dt>Name</dt><dd>${escapeHtml(String(data.name || "—"))}</dd>
      <dt>Serial Number</dt><dd>${escapeHtml(String(data.serialNumber || "—"))}</dd>
      <dt>Category</dt><dd>${escapeHtml(String(data.categoryName || "—"))}</dd>
      <dt>Location</dt><dd>${escapeHtml(String(data.locationName || "—"))}</dd>
      <dt>Assigned To</dt><dd>${escapeHtml(String(data.assignedUserName || "—"))}</dd>
      <dt>Status</dt><dd>${escapeHtml(String(data.status || "—"))}</dd>
      <dt>Created At</dt><dd>${escapeHtml(String(data.createdAt || "—"))}</dd>
    </dl>
  </div>
</body>
</html>`

    res.set("Cache-Control", "public, max-age=300, s-maxage=600")
    res.status(200).send(html)
  } catch (err) {
    console.error(err)
    res.status(500).send("Internal error")
  }
})

// Small helper to avoid XSS in the HTML
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
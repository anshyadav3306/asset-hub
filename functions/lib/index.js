"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetDetail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
exports.assetDetail = functions.https.onRequest(async function (req, res) {
    try {
        const id = req.query?.id || req.body?.id;
        if (!id)
            return res.status(400).send("Missing id query param");
        const doc = await db.collection("assets").doc(id).get();
        if (!doc.exists)
            return res.status(404).send("Asset not found");
        const data = doc.data() || {};
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
</html>`;
        res.set("Cache-Control", "public, max-age=300, s-maxage=600");
        res.status(200).send(html);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal error");
    }
});
// Small helper to avoid XSS in the HTML
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

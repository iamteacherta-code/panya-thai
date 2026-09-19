// Tiny zero-dependency static server for the Thai Literacy Studio.
// Run:  node serve.js   →   open http://localhost:8080/
//
// It also accepts one kind of write: the 14 Short Stories back office saves its data straight
// into short-stories-data.js (POST /api/save/short-stories). Downloading a file and copying it
// over by hand lost a teacher's edits, so saving now means saving. Every write keeps the previous
// version in backups/ first.
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".webm": "audio/webm",
};

const DATA_FILE = path.join(ROOT, "short-stories-data.js");
const BACKUPS = path.join(ROOT, "backups");

// Refuse anything that isn't a complete data file — above all, one that would drop a level's
// stories. That is exactly how Levels 04–05 once nearly vanished.
function checkData(text) {
  const box = { window: {} };
  vm.runInNewContext(text, box, { timeout: 1000 });
  const F = box.window.SHORT_STORIES_FILE;
  if (!F || !Array.isArray(F.levels)) throw new Error("ไม่ใช่ไฟล์ข้อมูล 14 เรื่องสั้น");
  const cur = { window: {} };
  vm.runInNewContext(fs.readFileSync(DATA_FILE, "utf8"), cur, { timeout: 1000 });
  for (const old of cur.window.SHORT_STORIES_FILE.levels) {
    const now = F.levels.find((l) => l.id === old.id);
    const had = (old.stories || []).length, has = now ? (now.stories || []).length : 0;
    if (has < had) throw new Error("Level " + old.n + " จะเหลือ " + has + " เรื่องจาก " + had + " — ไม่บันทึก");
  }
  return F;
}

function save(req, res) {
  let body = "";
  req.setEncoding("utf8");
  req.on("data", (c) => { body += c; if (body.length > 5e6) req.destroy(); });
  req.on("end", () => {
    const reply = (code, obj) => { res.writeHead(code, { "Content-Type": TYPES[".json"] }); res.end(JSON.stringify(obj)); };
    try {
      checkData(body);
      fs.mkdirSync(BACKUPS, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(DATA_FILE, path.join(BACKUPS, "short-stories-data." + stamp + ".js"));
      // เขียนไฟล์ชั่วคราวก่อนแล้วค่อยสลับ ไฟล์จริงจะไม่มีวันถูกเขียนค้างครึ่งไฟล์
      const tmp = DATA_FILE + ".tmp";
      fs.writeFileSync(tmp, body, "utf8");
      fs.renameSync(tmp, DATA_FILE);
      reply(200, { ok: true, savedAt: new Date().toISOString() });
    } catch (e) {
      reply(400, { ok: false, error: String(e.message || e) });
    }
  });
}

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url.split("?")[0] === "/api/save/short-stories") return save(req, res);
    if (req.method === "GET" && req.url.split("?")[0] === "/api/ping") {
      res.writeHead(200, { "Content-Type": TYPES[".json"] });
      res.end('{"ok":true}');
      return;
    }
    let rel = decodeURIComponent(req.url.split("?")[0]);
    if (rel === "/") rel = "/Panyaden Thai Literacy.html";
    const fp = path.join(ROOT, rel);
    // keep requests inside the project root
    if (!fp.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    fs.readFile(fp, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(fp)] || "application/octet-stream",
        // the data file changes while the teacher edits — never serve a stale copy
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`Panyaden Thai Literacy Studio → http://localhost:${PORT}/`);
  });

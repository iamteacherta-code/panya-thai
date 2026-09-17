/* ============================================================
   READING CLUB — ตัวจัดการข้อมูล
   คั่นกลางระหว่าง reading-club-data.js (ข้อมูลของกลาง)
   กับสิ่งที่ครูแก้ไว้ในหลังบ้าน (เก็บในเครื่องที่ใช้แก้)

   ทำไมต้องเก็บในเครื่อง
     Panya Thai เป็นเว็บนิ่ง ไม่มีเซิร์ฟเวอร์และไม่มีฐานข้อมูล
     จึงเก็บส่วนกลางให้เองไม่ได้ หลังบ้านจึงทำงานสองจังหวะ
       1. แก้แล้วเห็นผลทันทีบนเครื่องที่แก้ (เอาไว้ลองดูก่อน)
       2. กดดาวน์โหลดไฟล์ข้อมูลไปวางทับ reading-club-data.js
          แล้วทุกเครื่องจึงเห็นตรงกัน
     ตรงนี้ตั้งใจให้ชัด ไม่ใช่ข้อจำกัดที่ซ่อนไว้

   ของที่ใช้ได้
     RC.years          ข้อมูลที่ควรเอาไปแสดง (ที่แก้ไว้ ถ้าไม่มีก็ของไฟล์)
     RC.fileYears      ข้อมูลตามไฟล์ล้วน ๆ
     RC.edited         ตอนนี้กำลังใช้ข้อมูลที่แก้ค้างไว้อยู่หรือเปล่า
     RC.save(years)    บันทึกลงเครื่อง
     RC.reset()        ทิ้งของที่แก้ กลับไปใช้ไฟล์
     RC.toFileSource() สร้างเนื้อไฟล์ reading-club-data.js ใหม่
   ============================================================ */
(function (root) {

const FILE = root.READING_CLUB_FILE || { appUrl: "", years: [] };
const STORE_KEY = "panyaden_reading_club_v1";
const clone = (x) => JSON.parse(JSON.stringify(x));

function readStore() {
  try {
    const raw = root.localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && Array.isArray(data.years) && data.years.length ? data : null;
  } catch (e) { return null; }   // โหมดส่วนตัว/ปิดที่เก็บ → ถอยไปใช้ไฟล์
}

const stored = readStore();

const RC = {
  appUrl: FILE.appUrl,
  installUrl: String(FILE.appUrl || "").replace(/\/?$/, "/") + "install",
  adminUrl: "reading-club-admin.html",

  fileYears: clone(FILE.years),
  years: stored ? stored.years : clone(FILE.years),
  edited: !!stored,
  savedAt: stored ? stored.savedAt : null,

  /* ที่อยู่รูปปกแบบเต็ม — รับทั้ง /books/x.webp และ https://... */
  coverUrl(book) {
    const c = String((book && book.cover) || "");
    if (!c) return "";
    if (/^https?:/i.test(c)) return c;
    return String(FILE.appUrl || "").replace(/\/$/, "") + (c.charAt(0) === "/" ? c : "/" + c);
  },

  save(years) {
    const payload = { years: clone(years), savedAt: Date.now() };
    root.localStorage.setItem(STORE_KEY, JSON.stringify(payload));
    RC.years = payload.years;
    RC.edited = true;
    RC.savedAt = payload.savedAt;
  },

  reset() {
    root.localStorage.removeItem(STORE_KEY);
    RC.years = clone(FILE.years);
    RC.edited = false;
    RC.savedAt = null;
  },

  /* สร้างเนื้อไฟล์ reading-club-data.js ใหม่ ให้ครูดาวน์โหลดไปวางทับได้เลย */
  toFileSource(years, appUrl) {
    const stamp = new Date().toLocaleString("th-TH", { dateStyle: "long", timeStyle: "short" });
    return [
      "/* ============================================================",
      "   READING CLUB — ข้อมูลชั้นวางหนังสือ แยกตามชั้นเรียน",
      "   ไฟล์นี้สร้างจากหลังบ้าน (reading-club-admin.html)",
      "   เมื่อ " + stamp,
      "",
      "   แก้ต่อได้ที่หลังบ้าน ไม่ต้องล็อกอิน แล้วดาวน์โหลดมาวางทับไฟล์นี้",
      "   หรือจะแก้ years ข้างล่างตรง ๆ ก็ได้",
      "",
      "     status \"ready\"   = มีหนังสือแล้ว แสดงชั้นวางตามปกติ",
      "     status \"pending\" = ยังไม่มี หน้าเว็บจะขึ้นกล่องบอกว่ารอข้อมูล",
      "   ============================================================ */",
      "window.READING_CLUB_FILE = {",
      "  appUrl: " + JSON.stringify(appUrl || FILE.appUrl) + ",",
      "  years: " + JSON.stringify(years, null, 2).split("\n").join("\n  "),
      "};",
      "",
    ].join("\n");
  },

  clone,
  STORE_KEY,
};

root.READING_CLUB = RC;

})(window);

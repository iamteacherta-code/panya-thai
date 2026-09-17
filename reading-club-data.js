/* ============================================================
   READING CLUB — คลังกิจกรรมการอ่านแยกตามชั้นเรียน
   ใช้โดยหน้า Reading Club ในหมวด "สื่อการสอน" (pages.jsx → ReadingClubPage)

   ─────────────────────────────────────────────────────────────
   วิธีเพิ่มชั้นเรียนใหม่ (เช่น เมื่อ Y1 มีหนังสือแล้ว)
     1. หาชั้นนั้นใน YEARS ข้างล่าง
     2. เปลี่ยน status จาก "pending" เป็น "ready"
     3. ใส่ชุดหนังสือลงใน units
   ไม่ต้องแก้ไฟล์อื่นเลย หน้าเว็บอ่านจากที่นี่ที่เดียว

   ความหมายของ status
     "ready"   = มีหนังสือแล้ว แสดงชั้นวางหนังสือตามปกติ
     "pending" = ยังไม่มีข้อมูล หน้าเว็บจะขึ้นกล่องบอกว่ารอข้อมูลจากหลังบ้าน
   ============================================================ */
(function (root) {

/* ★ ที่อยู่ของแอป Reading Club (อยู่คนละเว็บกับ Panya Thai)
     ย้ายเว็บเมื่อไร แก้แค่บรรทัดนี้บรรทัดเดียว */
const APP_URL = "https://thai-reading-club-year4.p-aumporn.chatgpt.site/";
root.READING_CLUB_URL = APP_URL;

/* หนังสือหนึ่งเล่มใช้คีย์เหล่านี้
     id        รหัสเล่ม ตรงกับในแอป Reading Club
     level     ลำดับความยากในหน่วย (1 = ง่ายสุด)
     title     ชื่อเรื่อง
     subtitle  หัวข้อสัปดาห์ที่เรื่องนี้ผูกอยู่
     color     สีประจำเล่ม ใช้เป็นแถบหัวการ์ด
     cover     ที่อยู่รูปปก (ต่อท้าย APP_URL)
     pages     จำนวนหน้าอ่าน
     words     จำนวนคำศัพท์ประจำเล่ม
     questions จำนวนคำถามท้ายเล่ม                                  */
const UNIT1_BOOKS = [
  { id: "gate",      level: 1, title: "ประตูสีดินแดง",       subtitle: "ยินดีต้อนรับสู่ชุมชนปัญญาเด่น",        color: "#d66b3d", cover: "/books/cover-1.webp", pages: 5, words: 8, questions: 2 },
  { id: "ants",      level: 2, title: "รังมดใต้ต้นไผ่",       subtitle: "บทบาทและหน้าที่ของฉันในห้องเรียน",     color: "#f4b942", cover: "/books/cover-2.webp", pages: 5, words: 8, questions: 2 },
  { id: "wall",      level: 3, title: "ลมที่เดินในผนังดิน",    subtitle: "ระบบและวิถีของสมาคม",                  color: "#56a9a2", cover: "/books/cover-3.webp", pages: 5, words: 8, questions: 2 },
  { id: "traffic",   level: 4, title: "ไฟจราจรของคำพูด",      subtitle: "การทำงานร่วมกันแก้ไขปัญหาความขัดแย้ง", color: "#e76f51", cover: "/books/cover-4.webp", pages: 5, words: 8, questions: 2 },
  { id: "space",     level: 5, title: "ที่ว่างข้าง ๆ ฉัน",     subtitle: "การมีส่วนร่วมและความรู้สึกเป็นหนึ่งเดียว", color: "#8fbf7f", cover: "/books/cover-5.webp", pages: 5, words: 8, questions: 2 },
  { id: "open-wall", level: 6, title: "วันเปิดผนัง",          subtitle: "บทสรุปและงานสร้างสรรค์ปลายหน่วย",      color: "#d59b52", cover: "/books/cover-6.webp", pages: 6, words: 6, questions: 2 },
];

const YEARS = [
  {
    id: "y1", n: "1", en: "Year 1", th: "ป.1",
    status: "pending",
    note: "ยังไม่มีชุดหนังสือสำหรับชั้นนี้ — เมื่อครูอัปโหลดผ่านหลังบ้านแล้ว ชั้นวางจะขึ้นที่นี่",
    units: [],
  },
  {
    id: "y2", n: "2", en: "Year 2", th: "ป.2",
    status: "pending",
    note: "ยังไม่มีชุดหนังสือสำหรับชั้นนี้ — เมื่อครูอัปโหลดผ่านหลังบ้านแล้ว ชั้นวางจะขึ้นที่นี่",
    units: [],
  },
  {
    id: "y3", n: "3", en: "Year 3", th: "ป.3",
    status: "pending",
    note: "ยังไม่มีชุดหนังสือสำหรับชั้นนี้ — เมื่อครูอัปโหลดผ่านหลังบ้านแล้ว ชั้นวางจะขึ้นที่นี่",
    units: [],
  },
  {
    id: "y4", n: "4", en: "Year 4", th: "ป.4",
    status: "ready",
    note: "",
    units: [
      {
        no: 1,
        title: "ชุมชนและบทบาทหน้าที่",
        titleEn: "Community, Roles and Responsibilities",
        desc: "เรื่องเดียวเดินยาว 6 สัปดาห์ ตัวละครชุดเดิมตลอดเล่ม · นักเรียนอ่านออกเสียงแล้วระบบขึ้นสีให้ทันทีว่าคำไหนถูกคำไหนผิด",
        reader: "reader-y4-unit1.html",   // ฉบับพิมพ์ในเว็บนี้ (เว้นว่างได้ถ้ายังไม่มี)
        books: UNIT1_BOOKS,
      },
    ],
  },
];

root.READING_CLUB = {
  appUrl: APP_URL,
  installUrl: APP_URL.replace(/\/?$/, "/") + "install",
  years: YEARS,
  /* คืนที่อยู่รูปปกแบบเต็ม */
  coverUrl(book) { return APP_URL.replace(/\/$/, "") + book.cover; },
};

})(window);

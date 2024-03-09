// สร้าง interface ชื่อ MovieGet ซึ่งกำหนดรูปแบบของข้อมูลที่จะใช้ในการรับข้อมูลหนัง
export interface MovieGet {
    title:     string; // ชื่อของหนัง (ชนิดข้อมูลเป็น string)
    plot:      string; // เนื้อเรื่องของหนัง (ชนิดข้อมูลเป็น string)
    rating:    string; // การจัดอันดับหรือเรทติ้งของหนัง (ชนิดข้อมูลเป็น string)
    year:      string; // ปีที่หนังเข้าฉาย (ชนิดข้อมูลเป็น string)
    movietime: string; // เวลาของหนัง (ชนิดข้อมูลเป็น string)
    genre:     string; // ประเภทหนัง (ชนิดข้อมูลเป็น string)
    poster:    string; // ลิงก์หรือที่อยู่ของภาพโปสเตอร์ของหนัง (ชนิดข้อมูลเป็น string)
}

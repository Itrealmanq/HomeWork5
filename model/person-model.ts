// สร้าง interface ชื่อ PersonGet ซึ่งกำหนดรูปแบบของข้อมูลที่จะใช้ในการรับข้อมูลบุคคล
export interface PersonGet {
    name: string;    // ชื่อของบุคคล (ชนิดข้อมูลเป็น string)
    Born: string;    // วันเกิดของบุคคล (ชนิดข้อมูลเป็น string)
    imgp: string;    // ลิงก์หรือที่อยู่ของภาพประจำตัวของบุคคล (ชนิดข้อมูลเป็น string)
    bio:  string;    // ประวัติย่อของบุคคล (ชนิดข้อมูลเป็น string)
}

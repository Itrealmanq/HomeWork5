// สร้าง interface ชื่อ CreatorsGet ซึ่งกำหนดรูปแบบของข้อมูลที่จะใช้ในการรับข้อมูลจาก request
export interface CreatorsGet {
    moviename: string;      // ชื่อของหนัง (ชนิดข้อมูลเป็น string)
    personname: string;     // ชื่อของบุคคล (ชนิดข้อมูลเป็น string)
}

import http from "http"; // Import โมดูล http เพื่อใช้สร้างเซิร์ฟเวอร์ HTTP
import { app } from "./app"; // Import แอปพลิเคชัน Express ที่เราสร้างไว้

const port = process.env.port || 3000; // กำหนดพอร์ตของเซิร์ฟเวอร์ หากไม่ได้ระบุในตัวแปรสภาพแวดล้อม จะใช้พอร์ต 3000
const server = http.createServer(app); // สร้างเซิร์ฟเวอร์ HTTP โดยใช้แอปพลิเคชัน Express ที่เราสร้างไว้

server.listen(port, () => {
  console.log("Server is started"); // แสดงข้อความว่าเซิร์ฟเวอร์เริ่มทำงาน
});

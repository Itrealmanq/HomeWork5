import express from "express"; // เรียกใช้งาน Express.js
import { conn, mysql, queryAsync } from "../dbconn"; // เรียกใช้งานการเชื่อมต่อฐานข้อมูลแบบ asynchronous และการส่งคำสั่ง query ไปยังฐานข้อมูล
import { PersonGet } from "../model/person-model"; // เรียกใช้งานโมเดลของบุคคล

export const router = express.Router(); // สร้าง Router ของ Express.js

// สร้าง API endpoint สำหรับการดึงข้อมูลทั้งหมดของบุคคลจากฐานข้อมูล
router.get("/",(req,res)=>{
    conn.query('select * from person',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Person."
            });
        }
    });
});

// สร้าง API endpoint สำหรับการดึงข้อมูลบุคคลจากฐานข้อมูลโดยใช้ชื่อของบุคคล
router.get("/:personname",(req,res)=>{
    const personname = req.params.personname; // รับค่าชื่อของบุคคลจาก parameter
    conn.query('select * from person where name = ?',[personname],(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Person."
            });
        }
    });
});

// สร้าง API endpoint สำหรับการเพิ่มข้อมูลบุคคลลงในฐานข้อมูล
router.post("/insert", (req, res) => {
    let person: PersonGet = req.body; // รับข้อมูลบุคคลจาก request body
    let sql =
      "INSERT INTO `person`(`name`, `born`, `image`, `biography`) VALUES (?,?,?,?)"; // กำหนดคำสั่ง SQL สำหรับการเพิ่มข้อมูลบุคคล
    sql = mysql.format(sql, [
        person.name,
        person.Born,
        person.imgp,
        person.bio,
    ]); // กำหนดค่า parameter ให้กับคำสั่ง SQL
    conn.query(sql, (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
      if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
      res // ส่ง response กลับไปยัง client
        .status(201) // กำหนด HTTP status code 201 (Created)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId }); // ส่งข้อมูลผลลัพธ์การเพิ่มข้อมูลกลับไปยัง client
    });
});

// สร้าง API endpoint สำหรับการลบข้อมูลบุคคลจากฐานข้อมูลโดยใช้ชื่อของบุคคล
router.delete("/delete/:person", async (req, res) => {
    const person = req.params.person; // รับค่าชื่อของบุคคลจาก parameter
    let pid : number; // ตัวแปรเก็บค่า personid
    let sql = mysql.format("select personid from person where name = ?",[person]) // สร้างคำสั่ง SQL สำหรับการเลือก personid จากฐานข้อมูล
    let result = await queryAsync(sql); // ส่งคำสั่ง SQL ไปยังฐานข้อมูลและรอผลลัพธ์
    const jsonStr =  JSON.stringify(result); // แปลงผลลัพธ์เป็น JSON string
    const jsonobj = JSON.parse(jsonStr); // แปลง JSON string เป็น Object
    const rowData = jsonobj; // กำหนดค่า Object ที่ได้เป็น rowData
    pid = rowData[0].personid; // กำหนดค่า personid จาก rowData
    conn.query("delete from person where personid = ?", [pid], (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
        if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
        res // ส่ง response กลับไปยัง client
          .status(200) // กำหนด HTTP status code 200 (OK)
          .json({ affected_row: result.affectedRows }); // ส่งข้อมูลผลลัพธ์การลบข้อมูลกลับไปยัง client
     });
});

// สร้าง API endpoint สำหรับการลบข้อมูลบุคคลจากฐานข้อมูลโดยใช้ personid
router.delete("/deletebyid/:id", (req, res) => {
    let id = +req.params.id; // รับค่า personid จาก parameter แปลงเป็น integer
    conn.query("delete from person where personid = ?", [id], (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
       if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
       res // ส่ง response กลับไปยัง client
         .status(200) // กำหนด HTTP status code 200 (OK)
         .json({ affected_row: result.affectedRows }); // ส่งข้อมูลผลลัพธ์การลบข้อมูลกลับไปยัง client
    });
});

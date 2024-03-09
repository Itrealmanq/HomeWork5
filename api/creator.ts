import express from "express"; 
import { mysql, conn, queryAsync } from "../dbconn"; 
import { CreatorsGet } from "../model/creator-model"; 
export const router = express.Router(); 

// สร้าง API endpoint สำหรับการดึงข้อมูลทั้งหมดของ creators
router.get("/",(req,res)=>{
    conn.query('select * from creator',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Movie."
            });
        }
    });
});

// สร้าง API endpoint สำหรับการเพิ่มข้อมูล creator ลงในฐานข้อมูล
router.post("/insert", async (req, res) => {
    let creators: CreatorsGet = req.body; // รับข้อมูลผู้สร้างจาก request body
    let pidc : number; // ตัวแปรเก็บค่า personid
    let sql = mysql.format("select personid from person where name = ?",[creators.personname]) // สร้างคำสั่ง SQL สำหรับการเลือก personid จากฐานข้อมูล
    let result = await queryAsync(sql); // ส่งคำสั่ง SQL ไปยังฐานข้อมูลและรอผลลัพธ์
    let jsonStr =  JSON.stringify(result); // แปลงผลลัพธ์เป็น JSON string
    let jsonobj = JSON.parse(jsonStr); // แปลง JSON string เป็น Object
    let rowData = jsonobj; // กำหนดค่า Object ที่ได้เป็น rowData
    pidc = rowData[0].personid; // กำหนดค่า personid จาก rowData

    let midc : number; // ตัวแปรเก็บค่า movieid
    sql = mysql.format("select movieid from movie where title = ?",[creators.moviename]) // สร้างคำสั่ง SQL สำหรับการเลือก movieid จากฐานข้อมูล
    result = await queryAsync(sql); // ส่งคำสั่ง SQL ไปยังฐานข้อมูลและรอผลลัพธ์
    jsonStr =  JSON.stringify(result); // แปลงผลลัพธ์เป็น JSON string
    jsonobj = JSON.parse(jsonStr); // แปลง JSON string เป็น Object
    rowData = jsonobj; // กำหนดค่า Object ที่ได้เป็น rowData
    midc = rowData[0].movieid; // กำหนดค่า movieid จาก rowData

    sql = "INSERT INTO `creator`(`movieidc`, `personidc`) VALUES (?,?)"; // กำหนดคำสั่ง SQL สำหรับการเพิ่มข้อมูล creator
    sql = mysql.format(sql, [
        midc,
        pidc,
    ]); // กำหนดค่า parameter ให้กับคำสั่ง SQL
    conn.query(sql, (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
      if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
      res // ส่ง response กลับไปยัง client
        .status(201) // กำหนด HTTP status code 201 (Created)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId }); // ส่งข้อมูลผลลัพธ์การเพิ่มข้อมูลกลับไปยัง client
    });
});

// สร้าง API endpoint สำหรับการลบข้อมูล creator จากฐานข้อมูลโดยใช้ชื่อของผู้สร้างและชื่อของภาพยนตร์
router.delete("/delete/:person/:movie", async (req, res) => {
    const person = req.params.person; // รับค่าชื่อของผู้สร้างจาก parameter
    const movie = req.params.movie; // รับค่าชื่อของภาพยนตร์จาก parameter

    let pidc : number; // ตัวแปรเก็บค่า personid
    let sql = mysql.format("select personid from person where name = ?",[person]) // สร้างคำสั่ง SQL สำหรับการเลือก personid จากฐานข้อมูล
    let result = await queryAsync(sql); // ส่งคำสั่ง SQL ไปยังฐานข้อมูลและรอผลลัพธ์
    let jsonStr =  JSON.stringify(result); // แปลงผลลัพธ์เป็น JSON string
    let jsonobj = JSON.parse(jsonStr); // แปลง JSON string เป็น Object
    let rowData = jsonobj; // กำหนดค่า Object ที่ได้เป็น rowData
    pidc = rowData[0].personid; // กำหนดค่า personid จาก rowData

    let midc : number; // ตัวแปรเก็บค่า movieid
    sql = mysql.format("select movieid from movie where title = ?",[movie]) // สร้างคำสั่ง SQL สำหรับการเลือก movieid จากฐานข้อมูล
    result = await queryAsync(sql); // ส่งคำสั่ง SQL ไปยังฐานข้อมูลและรอผลลัพธ์
    jsonStr =  JSON.stringify(result); // แปลงผลลัพธ์เป็น JSON string
    jsonobj = JSON.parse(jsonStr); // แปลง JSON string เป็น Object
    rowData = jsonobj; // กำหนดค่า Object ที่ได้เป็น rowData
    midc = rowData[0].movieid; // กำหนดค่า movieid จาก rowData

    conn.query("delete from creator where movieidc = ? and personidc = ?", [midc,pidc], (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
        if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
        res // ส่ง response กลับไปยัง client
          .status(200) // กำหนด HTTP status code 200 (OK)
          .json({ affected_row: result.affectedRows }); // ส่งข้อมูลผลลัพธ์การลบข้อมูลกลับไปยัง client
     });
});

// สร้าง API endpoint สำหรับการลบข้อมูล creator จากฐานข้อมูลโดยใช้ personid และ movieid
router.delete("/deletebyid/:pid/:mid", (req, res) => {
    let pid = +req.params.pid; // รับค่า personid จาก parameter แปลงเป็น integer
    let mid = +req.params.mid; // รับค่า movieid จาก parameter แปลงเป็น integer
    conn.query("delete from creator where movieidc = ? and personidc = ?", [mid,pid], (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
       if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
       res // ส่ง response กลับไปยัง client
         .status(200) // กำหนด HTTP status code 200 (OK)
         .json({ affected_row: result.affectedRows }); // ส่งข้อมูลผลลัพธ์การลบข้อมูลกลับไปยัง client
    });
});

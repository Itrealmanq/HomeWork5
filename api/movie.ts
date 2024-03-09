import express from "express"; 
import { conn, mysql, queryAsync } from "../dbconn"; 
import { MovieGet } from "../model/movie-model"; 
export const router = express.Router(); 

// สร้าง API endpoint สำหรับการดึงข้อมูลทั้งหมดของภาพยนตร์จากฐานข้อมูล
router.get("/",(req,res)=>{
    conn.query('select * from movie',(err,result,fields)=>{
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

// สร้าง API endpoint สำหรับการดึงข้อมูลภาพยนตร์จากฐานข้อมูลโดยใช้ชื่อของภาพยนตร์
router.get("/:moviename",(req,res)=>{
    const moviename = req.params.moviename; // รับค่าชื่อของภาพยนตร์จาก parameter
    conn.query('select * from movie where title = ?',[moviename],(err,result,fields)=>{
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

// สร้าง API endpoint สำหรับการเพิ่มข้อมูลภาพยนตร์ลงในฐานข้อมูล
router.post("/insert", (req, res) => {
    let movie: MovieGet = req.body; // รับข้อมูลภาพยนตร์จาก request body
    let sql =
      "INSERT INTO `movie`(`title`, `plot`, `rating`, `year`, `movietime`, `genre`, `poster`) VALUES (?,?,?,?,?,?,?)"; // กำหนดคำสั่ง SQL สำหรับการเพิ่มข้อมูลภาพยนตร์
    sql = mysql.format(sql, [
        movie.title,
        movie.plot,
        movie.rating,
        movie.year,
        movie.movietime,
        movie.genre,
        movie.poster,
    ]); // กำหนดค่า parameter ให้กับคำสั่ง SQL
    conn.query(sql, (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
      if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
      res // ส่ง response กลับไปยัง client
        .status(201) // กำหนด HTTP status code 201 (Created)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId }); // ส่งข้อมูลผลลัพธ์การเพิ่มข้อมูลกลับไปยัง client
    });
});

// สร้าง API endpoint สำหรับการลบข้อมูลภาพยนตร์จากฐานข้อมูลโดยใช้ชื่อของภาพยนตร์
router.delete("/delete/:movie", async (req, res) => {
    const movie = req.params.movie; // รับค่าชื่อของภาพยนตร์จาก parameter
    let movieid : number; // ตัวแปรเก็บค่า movieid
    let sql = mysql.format("select movieid from movie where title = ?",[movie]) // สร้างคำสั่ง SQL สำหรับการเลือก movieid จากฐานข้อมูล
    let result = await queryAsync(sql); // ส่งคำสั่ง SQL ไปยังฐานข้อมูลและรอผลลัพธ์
    const jsonStr =  JSON.stringify(result); // แปลงผลลัพธ์เป็น JSON string
    const jsonobj = JSON.parse(jsonStr); // แปลง JSON string เป็น Object
    const rowData = jsonobj; // กำหนดค่า Object ที่ได้เป็น rowData
    movieid = rowData[0].movieid; // กำหนดค่า movieid จาก rowData
    conn.query("delete from movie where movieid = ?", [movieid], (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
        if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
        res // ส่ง response กลับไปยัง client
          .status(200) // กำหนด HTTP status code 200 (OK)
          .json({ affected_row: result.affectedRows }); // ส่งข้อมูลผลลัพธ์การลบข้อมูลกลับไปยัง client
     });
});

// สร้าง API endpoint สำหรับการลบข้อมูลภาพยนตร์จากฐานข้อมูลโดยใช้ movieid
router.delete("/deletebyid/:id", (req, res) => {
    let id = +req.params.id; // รับค่า movieid จาก parameter แปลงเป็น integer
    conn.query("delete from movie where movieid = ?", [id], (err, result) => { // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
       if (err) throw err; // หากเกิดข้อผิดพลาดให้ throw error
       res // ส่ง response กลับไปยัง client
         .status(200) // กำหนด HTTP status code 200 (OK)
         .json({ affected_row: result.affectedRows }); // ส่งข้อมูลผลลัพธ์การลบข้อมูลกลับไปยัง client
    });
});

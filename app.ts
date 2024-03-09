
import express from "express";
import { router as movie } from "./api/movie";
import { router as person } from "./api/person";
import { router as stars } from "./api/star";
import { router as creators } from "./api/creator";
import { router as searchmovie } from "./api/search";

// Import bodyParser เพื่อใช้ในการแปลงข้อมูล request เป็น JSON
import bodyParser from "body-parser";

// Import cors เพื่อเปิดให้แอพพลิเคชั่นสามารถรับข้อมูลจาก origin อื่นๆได้
import cors from "cors";

// สร้าง Express app
export const app = express();

// กำหนดให้แอพพลิเคชั่นใช้งาน cors โดยอนุญาตให้มี origin จากทุกที่
app.use(
    cors({
      origin: "*",
    })
  );

// กำหนดให้แอพพลิเคชั่นใช้งาน bodyParser เพื่อแปลงข้อมูล request เป็น JSON
app.use(bodyParser.text());
app.use(bodyParser.json());

// กำหนดเส้นทาง API สำหรับแต่ละประเภท
app.use("/movie", movie);          // เส้นทาง API 
app.use("/person", person);        
app.use("/star", stars);           
app.use("/creator", creators);     
app.use("/searchmovie", searchmovie); 

import express from "express"; // เรียกใช้งาน Express.js
import { conn, mysql, queryAsync } from "../dbconn"; // เรียกใช้งานการเชื่อมต่อฐานข้อมูลแบบ asynchronous และการส่งคำสั่ง query ไปยังฐานข้อมูล

export const router = express.Router(); // สร้าง Router ของ Express.js

router.get("/", (req, res) => {
    const title = `%${req.query.title}%`; // รับค่าชื่อของหนังที่ต้องการค้นหาจาก query parameter

    // กำหนดคำสั่ง SQL สำหรับดึงข้อมูลหนังพร้อมข้อมูลของนักแสดงและผู้สร้าง
    const sql = `
    SELECT  
        movie.movieid,
        movie.title AS movie_title,
        movie.plot AS movie_plot,
        movie.rating AS movie_rating,
        movie.year AS movie_year,
        movie.genre AS movie_genre,
        star.personids AS star_id,
        stars.name AS star_name,
        stars.born AS star_born,
        stars.biography AS star_bio,
        creator.personidc AS creators_id,
        creators.name AS creators_name,
        creators.born AS creators_born,
        creators.biography AS creators_bio
    FROM 
        movie , star , person AS stars , creator, person  AS creators 
    WHERE 
        movie.movieid = star.movieids
        AND star.personids = stars.personid
        AND movie.movieid = creator.movieidc
        AND creator.personidc = creators.personid
        AND movie.title LIKE ?
    `;
    
    conn.query(sql, [title], (err, results: any[], fields) => {
        if (err) throw err;

        // สร้าง Map เพื่อเก็บข้อมูลหนังพร้อมข้อมูลของนักแสดงและผู้สร้าง
        const moviesMap = new Map<number, any>();

        // วนลูปผลลัพธ์ที่ได้จากฐานข้อมูล
        results.forEach((row: any) => {
            const movieId = row.movieid;

            // ตรวจสอบว่าหนังมีอยู่ใน Map หรือไม่
            if (!moviesMap.has(movieId)) {
                moviesMap.set(movieId, {
                    movie_id: row.movieid,
                    movie_title: row.movie_title,
                    movie_plot: row.movie_plot,
                    movie_rating: row.movie_rating,
                    movie_year: row.movie_year,
                    movie_genre: row.movie_genre,
                    actors: [],
                    creators: [],
                });
            }

            const movie = moviesMap.get(movieId);

            const star = {
                star_id: row.star_id,
                star_name: row.star_name,
                star_born: row.star_born,
                star_bio: row.star_bio,
            };

            const creator = {
                creator_id: row.creator_id,
                creator_name: row.creator_name,
                creator_born: row.creator_born,
                creator_bio: row.creator_bio,
            };

            // เพิ่มข้อมูลนักแสดงเข้าไปใน array ของหนัง
            if (!movie.actors.find((a: any) => a.star_id === star.star_id)) {
                movie.actors.push(star);
            }

            // เพิ่มข้อมูลผู้สร้างเข้าไปใน array ของหนัง
            if (!movie.creators.find((c: any) => c.creator_id === creator.creator_id)) {
                movie.creators.push(creator);
            }
        });

        // แปลงข้อมูลใน Map เป็น array และส่งกลับไปยัง client ในรูปแบบ JSON
        const jsonData =  { movie: Array.from(moviesMap.values()) };
        res.json(jsonData);
    });
});

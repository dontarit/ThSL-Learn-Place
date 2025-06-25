import React from 'react';
import ReactDOM from 'react-dom/client';

/*
เรียกใช้ไฟล์ที่จำเป็น
    app.css         เป็น style ที่ได้ใช้ในทุก page
    homepage.js     ตัวหน้าหลักที่จะเปิดขึ้นในตอนแรก
    learnPlace.js   หน้าที่ user จะเข้าไปทันทีถ้าหาก login ไว้แล้ว
*/
import './app.css';
import LearnPlace from './pages/learnPlace.js';
import HomePage from './pages/homepage.js';
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        {/* ในจุดนี้จะมี script ตรวจจับว่า user ได้ login ไว้รึยังถ้ายังจะส่งไปหน้า HomePage ถ้าทำแล้วก็ไป LearnPlace */}

        {/* เรียกใช้ตัวที่ import จากข้างต้นเพื่อแสดงโครงสร้าง html และ logic ต่างๆ */}
        {/* <LearnPlace/> */}
        <HomePage/>
    </React.StrictMode>
);
reportWebVitals();
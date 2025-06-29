// ไฟล์นี้จะถูกเรียกโดย index.js ตอนเริ่ม server

/*
เรียกใช้ไฟล์ css
    homepage.css        เป็นไฟล์ style หลังของ homepage
    logsign-form.css    ไฟล์ style สำหรับหน้า login/signin เท่านั้น
*/
import '../css/homepage.css';
import '../css/sub/logsign-form.css';
import '../js/AnimatedBackground';

// import img ที่จำเป็น
import TSLlogo from '../assets/img/TSLlogo.png';

// เขียนคล้าย html นั่นแหละ
function HomePage() {
    return (
        <>
        <header>
            <div className='con-header'>
                <div className="main-logo">
                    <img src={TSLlogo} alt='logo'/>
                </div>
                <nav className="nav">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                </nav>
            </div>
        </header>

        <div className='main-container'>
            <section id="home" className="welcomePage">
                <div className='imgContainer'>
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0mo1-1RPPCSd54lH3fcOeOWM1wRHxEZ3C1A&s'/>
                </div>
                <div className='textContainer' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
                    <div className='headTitle' style={{ maxWidth: '400px', fontSize: '30px', fontWeight: 'bold' }}>
                        <p>วิธีการเรียนภาษาที่ทั้งสนุก ฟรีและได้ผลดีเยี่ยม!</p>
                    </div>
                    <div className='btnLogSign' style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button className="StartBtn">มาเริ่มกันเลย</button> 
                        <button className="LoginBtn">ฉันมีบัญชีอยู่แล้ว</button>    
                    </div>
                </div>
            </section>
            <section id="what" className="section1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '320px', height: '259.2px', marginTop: '20px'  }}>
                <h2 className='WhatIsThis' style={{ display: 'flex',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                    <span> What is this
                        <br></br>
                    </span>
                </h2>
                <br></br>
                <p className='FistParagrap' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: '16px', lineHeight: '1.5' }}>
                    <span>สนุกไปกับการเรียนรู้และการฝึกฝนภาษามือได้ด้วยตนเองผ่านเว็ปแอป ด้วยรูปแบบการตรวจจับการเคลื่อนไหวผ่านกล้องวิดีโอ เพื่อนำมาแปลข้อความแบบ real time 
                    </span>
                </p>
                </div>
            <div className='imgsection1' style={{ marginTop: '16px', textAlign: 'center' }}>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0mo1-1RPPCSd54lH3fcOeOWM1wRHxEZ3C1A&s'/>
            </div>
            </section>
            <section id="about_us" className="section2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',marginBottom:'0px' }}>
                <div style={{ width: '320px', height: '259.2px', marginTop: '20px'  }}>
                <h2 className='About_us' style={{ display: 'flex',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                    <span> About Us
                        <br></br>
                    </span>
                </h2>
                <br></br>
                <p className='SecondParagrap' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: '16px', lineHeight: '1.5',color: 'white' }}>
                    <span>
                        เราคือกลุ่มนักเรียนจากโรงเรียนหนองบัวพิทยาคาร ผู้จัดทำเว็ปแอพพลิเคชันนี้ขึ้นมาเพื่อช่วยให้ผู้ที่สนใจเรียนรู้ภาษามือไทยได้มีเครื่องมือที่สะดวกและเข้าถึงได้ง่าย
                        <br></br>
                        โดยใช้เทคโนโลยีการตรวจจับการเคลื่อนไหวผ่านกล้องวิดีโอ เพื่อแปลภาษามือเป็นข้อความแบบเรียลไทม์
                    </span>
                </p>
                </div>
            <div className='imgsection2' style={{ marginTop: '16px', textAlign: 'center' }}>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0mo1-1RPPCSd54lH3fcOeOWM1wRHxEZ3C1A&s'/>
            </div>
            </section>
        </div>

        <div className="logsign-container" style={{display: 'none'}}>
            <input type="checkbox" id="chk" aria-hidden="true"/>
            <div className="signup">
                <form>
                    <label htmlFor="chk" aria-hidden="true">Sign up</label>
                    <input type="text" name="txt" placeholder="User name" required/>
                    <input type="email" name="email" placeholder="Email" required/>
                    <input type="password" name="pswd" placeholder="Password" required/>
                    <button>Sign up</button>
                </form>
            </div>
            <div className="login">
                <form>
                    <label htmlFor="chk" aria-hidden="true">Login</label>
                    <input type="email" name="email" placeholder="Email" required=""/>
                    <input type="password" name="pswd" placeholder="Password" required=""/>
                    <button>Login</button>
                </form>
            </div>
        </div>
        </>
    )

}

// ส่งออกไปเพื่อใช้ใน index.js
export default HomePage
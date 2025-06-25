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
            <div className="con-header">
                <div className="main-logo">
                    <img src={TSLlogo} alt='logo'/>
                </div>
                <nav className="nav">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#what">What is this</a>
                    <a className="cta">ลงชื่อเข้าใช้</a>
                </nav>
            </div>
        </header>

        <div className='mainContent-container'>
            <section id="home" className="section">
                <h2>About Us</h2>
                <p>ชิน ทิว คอป 👍</p>
            </section>
            <section id="what" className="section">
                <h2>What is This</h2>
                <p>กูไม่รู้อะคิดไม่ออก</p>
            </section>
            <section id="what" className="section">
                <h2>What is This</h2>
                <p>กูไม่รู้อะคิดไม่ออก</p>
            </section>
            <section id="what" className="section">
                <h2>What is This</h2>
                <p>กูไม่รู้อะคิดไม่ออก</p>
            </section>
            <section id="what" className="section">
                <h2>What is This</h2>
                <p>กูไม่รู้อะคิดไม่ออก</p>
            </section>
            <section id="what" className="section">
                <h2>What is This</h2>
                <p>กูไม่รู้อะคิดไม่ออก</p>
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
        //
        </>
    )
}

// ส่งออกไปเพื่อใช้ใน index.js
export default HomePage
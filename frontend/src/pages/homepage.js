import '../css/homepage.css';
import '../css/sub/logsign-form.css';

function HomePage() {
    return (
        <>
        <header className="header">
            <h1 className="logo">ThSL-Homepage</h1>
            <nav className="nav">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#what">What is this</a>
                <a href="#">-</a>
                <a href="#">-</a>
                <a className="cta">ลงชื่อเข้าใช้</a>
            </nav>
        </header>

        <section id="home" className="section">
            <h2>About Us</h2>
            <p>ชิน ทิว คอป 👍</p>
        </section>
        <section id="about" className="section">
            <h2>About Us</h2>
            <p>ชิน ทิว คอป 👍</p>
        </section>
        <section id="what" className="section">
            <h2>What is This</h2>
            <p>กูไม่รู้อะคิดไม่ออก</p>
        </section>

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

export default HomePage
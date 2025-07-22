import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <>
       <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh' ,
            backgroundColor: '#ffffff'
        }}>
            <img src="/images/404.png" alt="404 Not Found" style={{ width: '300px', marginBottom: '20px' }} />
            <h2>Oops! The page you're looking for doesn't exist.</h2>
            <h1>Page Not Found ❌</h1>
            <Link to={"/"}>
                <button>Go back</button>
            </Link>
        </div>

        </>
    )
}
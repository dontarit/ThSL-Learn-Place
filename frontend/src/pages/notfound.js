import { Link } from "react-router-dom";
import notFound from '../assets/img/sad-face-clipart-lg.png';

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
            <img src={notFound} style={{ width: '150px'}} />
            <h2 style={{marginBottom: '20px'}}>Oops! The page you're looking for doesn't exist.</h2>
            <Link to={"/"}>
                <button style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    fontSize: '16px',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }} onMouseOver={e => {e.target.style.backgroundColor = '#2980b9'}} onMouseOut={e => {e.target.style.backgroundColor = '#3498db'}}>Go back</button>
            </Link>
        </div>
        </>
    )
}
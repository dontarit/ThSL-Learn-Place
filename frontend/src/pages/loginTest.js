import { useEffect, useState } from 'react';
import axios from 'axios'


export default function LoginTest() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    axios.post('http://localhost:5000/loginServer', {email, password})
        .then(res => {console.log(res.data)})
        .catch(err => {console.log(err)}) // Activate เมื่อไม่สามารถเชื่อมกับ server.js
    
    useEffect(() => { 
        import('../css/loginTest.css')
    }, []);

    return (
        <>
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input type='email' placeholder='Enter Email' onChange={e => {setEmail(e.target.value)}}/>
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input type='password' placeholder='Enter Password' onChange={e => {setPassword(e.target.value)}}/>
                </div>
                <button>Login</button>
            </form>
        </div>
        </>
    )
}
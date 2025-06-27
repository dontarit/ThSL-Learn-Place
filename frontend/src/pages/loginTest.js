import React, { useState } from 'react'

import '../css/loginTest.css'

function LoginTest() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
    }

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

export default LoginTest
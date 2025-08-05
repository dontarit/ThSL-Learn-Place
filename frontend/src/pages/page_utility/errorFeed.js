import React from 'react';
import notFound from '../../assets/img/sad-face-clipart-lg.png';

const ErrorFallback = () => {
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
            <h1 style={{marginBottom: '20px', textAlign: 'center'}}>Something went wrong while loading this page.</h1>
        </div>
        </>
    )
};

export default ErrorFallback;
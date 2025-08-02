import axios from 'axios';

export async function refreshToken() {
    await axios.post('/tokenServer')
        .then(res => {
            const accessToken = res.data.token;
            localStorage.setItem('authToken', accessToken);
            return accessToken
        })
        .catch(err => {
            console.error('Error refreshing token:', err);
        });
}

export function isTokenExpired() {
    const token = localStorage.getItem('authToken');
    if (!token || token.split('.').length !== 3) return true;

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.exp < Date.now() / 1000;
    } catch (e) {
        console.error('Error decoding token:', e);
        return true;
    }
}
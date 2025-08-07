import axios from 'axios';
import { isTokenExpired } from '../../js/tokenManipulate.js';

export async function handleLogoutAcc(token, setAuthToken) {
    localStorage.removeItem('authToken');
    localStorage.setItem('name', 'Unknow');
    localStorage.setItem('email', '');
    localStorage.setItem('profile', '');
    setAuthToken(false)

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });

    try {
        const res = await axios.post('/logoutServer');
        if (token && isTokenExpired()) {
            return {
                navigate: '/home',
                alert_value: ['success', 'Logout', 'You aren\'t signed in anymore']
            };
        }
        return {
            navigate: '',
            alert_value: [res.data.theme, res.data.title, res.data.content]
        };
    } catch (err) {
        console.log('Error during logout', err);
        return {
            navigate: '',
            alert_value: ['danger', 'Error', 'Unable to logout']
        };
    }
}
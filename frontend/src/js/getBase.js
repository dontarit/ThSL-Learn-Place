import axios from 'axios'
export default function getBase() {
    axios.defaults.baseURL = 'https://localhost:5000';
    // axios.defaults.baseURL = 'https://101.51.182.36:5000';
}
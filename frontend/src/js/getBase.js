import axios from 'axios'
export default function getBase() {
    axios.defaults.baseURL = 'http://localhost:5000';
}
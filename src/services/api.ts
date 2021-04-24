import axios from 'axios'; // necessario instalar biblioteca do Axios para as requisições http

export const api = axios.create({
    baseURL: 'http://localhost:3333/'
})
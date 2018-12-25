import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-b4f1d.firebaseio.com/'
});

export default instance;
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-68c50.firebaseio.com/'
});

export default instance;
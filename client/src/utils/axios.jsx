import axios from "axios";

const instance = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: "https://flexi-docs.onrender.com/api",
})

export default instance;
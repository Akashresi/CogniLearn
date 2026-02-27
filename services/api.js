import axios from "axios";

// Update the URL to match your backend when running on real device or emulator
// For Android emulator it usually is "http://10.0.2.2:8000" instead of localhost
// For web it could be http://localhost:8000
const API = axios.create({
    baseURL: "http://10.0.2.2:8000"
});

export default API;

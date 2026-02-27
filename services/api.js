import axios from "axios";
import { Platform } from "react-native";

// Detect if running on Android Emulator, iOS, or Web
const getBaseURL = () => {
    if (Platform.OS === 'android') return "http://10.0.2.2:8000";
    return "http://localhost:8000"; // iOS and Web
};

const API = axios.create({
    baseURL: getBaseURL()
});

API.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
})

export default API;

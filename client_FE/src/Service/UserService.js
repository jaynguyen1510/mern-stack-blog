import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL_BACKEND; // Không có dấu `/` thừa ở cuối

export const signUpUser = async (data) => {
    try {
        const res = await axios.post(`${apiUrl}/user/sign-up`, data);
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
};

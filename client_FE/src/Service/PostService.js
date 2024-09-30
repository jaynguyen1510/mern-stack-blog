import axios from 'axios';
const apiUrl = import.meta.env.VITE_APP_API_URL_BACKEND; // Không có dấu `/` thừa ở cuối

export const createPost = async (data) => {
    console.log('Creating post', data);
    try {
        const res = await axios.post(`${apiUrl}/post/create-post`, data, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error create post:', error);
        throw error;
    }
};

import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL_BACKEND; // Không có dấu `/` thừa ở cuối

export const signUpUser = async (data) => {
    try {
        const res = await axios.post(`${apiUrl}/user/sign-up`, data);
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error sign up user:', error);
        throw error;
    }
};
export const signInUser = async (data) => {
    console.log('data', data);
    try {
        const res = await axios.post(`${apiUrl}/user/sign-in`, data, {
            withCredentials: true, // Đảm bảo rằng chúng ta gửi cookie
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error sign in user:', error);
        throw error;
    }
};
export const signInGoogle = async (data) => {
    try {
        const res = await axios.post(`${apiUrl}/user/google`, data, {
            withCredentials: true,
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error sign in user:', error);
        throw error;
    }
};
export const logOutUser = async () => {
    try {
        const res = await axios.post(`${apiUrl}/user/log-out-user`, {}, { withCredentials: true });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error log out user:', error);
        throw error; // Để catch block trong hook có thể xử lý
    }
};
// UserService.js
export const updateUser = async (id, data) => {
    console.log('updateUser', id, data);
    try {
        const res = await axios.put(`${apiUrl}/user/update-profile/${id}`, data, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error update user:', error);
        throw error;
    }
};
export const deletedUser = async (id) => {
    try {
        const res = await axios.delete(`${apiUrl}/user/delete-profile/${id}`, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
export const getAllUsers = async (idAdmin, startIndex) => {
    try {
        const response = await axios.get(`${apiUrl}/user/get-all-user?userId=${idAdmin}&startIndex=${startIndex}`, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return response.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error get all user:', error);
        throw error;
    }
};
export const getUserById = async (userId) => {
    try {
        const responseUserById = await axios.get(`${apiUrl}/user/${userId}`);
        return responseUserById.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error get info user:', error);
        throw error;
    }
};
export const getUserLimit = async () => {
    try {
        const response = await axios.get(`${apiUrl}/user/get-all-user?limit=5`, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return response.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error get all user:', error);
        throw error;
    }
};

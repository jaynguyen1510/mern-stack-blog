import axios from 'axios';
const apiUrl = import.meta.env.VITE_APP_API_URL_BACKEND; // Không có dấu `/` thừa ở cuối

export const createPost = async (data) => {
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
export const getAllPost = async (id, startIndex) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-all-post?userId=${id}&startIndex=${startIndex}`);
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error get all post:', error);
        throw error;
    }
};
export const getPostFormPostId = async (id, postId) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-all-post?userId=${id}&postId=${postId}`);
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error get postId :', error);
        throw error;
    }
};

export const getPostBySlug = async (slug) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-all-post?slug=${slug}`);
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error get postId :', error);
        throw error;
    }
};

export const deletedPost = async (userId, postId) => {
    try {
        const res = await axios.delete(`${apiUrl}/post/delete-post/${postId}/${userId}`, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error delete post:', error);
        throw error;
    }
};

export const updatePost = async (postId, userId, data) => {
    try {
        const res = await axios.put(`${apiUrl}/post/update-post/${postId}/${userId}`, data, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error delete post:', error);
        throw error;
    }
};
export const getPostLimit = async () => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-all-post?limit=5`);
        return res.data;
    } catch (error) {
        console.error('Error get postId :', error);
        throw error;
    }
};
export const getPostHomePage = async () => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-all-post`);
        return res.data;
    } catch (error) {
        console.error('Error get post :', error);
        throw error;
    }
};
export const getPostsQuery = async (searchQuery) => {
    try {
        const res = await axios.get(`${apiUrl}/post/get-all-post?${searchQuery}`);
        return res.data;
    } catch (error) {
        console.error('Error get post :', error);
        throw error;
    }
};

import axios from 'axios';
const apiUrl = import.meta.env.VITE_APP_API_URL_BACKEND; // Không có dấu `/` thừa ở cuối

export const createComment = async (data) => {
    const { postId, userId, content } = data;
    try {
        // Tạo đối tượng commentData để gửi đến server
        const commentData = { content }; // Nội dung bình luận
        const res = await axios.post(`${apiUrl}/comment/create-comment/${postId}/${userId}`, commentData, {
            withCredentials: true, // Nếu cần gửi cookie
        });
        return res.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.error('Error create comment:', error);
        throw error;
    }
};
export const getAllComments = async (postId) => {
    try {
        const getComment = await axios.get(`${apiUrl}/comment/get-comment/${postId}`);
        return getComment.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.log('Error getting comments', error);
        throw error;
    }
};
export const getAllCommentAdmin = async (isAdmin, startIndex) => {
    try {
        const getComment = await axios.get(
            `${apiUrl}/comment/get-all-comment?userId=${isAdmin}&startIndex=${startIndex}`,
            {
                withCredentials: true, // Cấu hình để gửi cookie
            },
        );
        return getComment.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.log('Error getting comments', error);
        throw error;
    }
};
export const getCommentLimit = async () => {
    try {
        const resCommentLimit = await axios.get(`${apiUrl}/comment/get-all-comment?limit=5`, {
            withCredentials: true, // Cấu hình để gửi cookie
        });
        return resCommentLimit.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.log('Error getting comments', error);
        throw error;
    }
};

export const putLike = async (commentId) => {
    try {
        const likeResponse = await axios.put(
            `${apiUrl}/comment/like-comment/${commentId}`,
            {}, // Để tránh lỗi, bạn có thể để object rỗng hoặc bỏ qua data nếu không cần
            { withCredentials: true }, // Cấu hình để gửi cookie
        );
        return likeResponse.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.log('Error getting comments', error);
        throw error;
    }
};
export const editComment = async (commentId, { content }) => {
    console.log('Edit Comment', commentId, content); // Ghi lại thông tin comment được chỉnh sửa

    try {
        const editComment = await axios.put(
            `${apiUrl}/comment/edit-comment/${commentId}`,
            {
                content,
            },
            { withCredentials: true }, // Cấu hình để gửi cookie
        );
        return editComment.data;
    } catch (error) {
        console.log('Error edit comments', error);
        throw error;
    }
};
export const deletedComment = async (commentId) => {
    try {
        const deletedComment = await axios.delete(`${apiUrl}/comment/delete-comment/${commentId}`, {
            withCredentials: true, // Cấu hình để gửi cookie
        });
        return deletedComment.data; // Trả về dữ liệu từ response
    } catch (error) {
        console.log('Error delete comments', error);
        throw error;
    }
};

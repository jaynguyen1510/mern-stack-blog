import * as CommentService from '../Service/CommentService';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

const useGetAllCommentAdmin = (userIdAdmin) => {
    const [getCommentError, setGetCommentError] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const hasFetchedRef = useRef(false); // Sử dụng useRef để theo dõi việc đã gọi API

    const handleSetShowMore = (response) => {
        if (response.length < 2) {
            setShowMore(false); // Ẩn nút "Show More" nếu số người dùng trả về nhỏ hơn 2
        } else {
            setShowMore(true); // Nếu không, hiển thị lại nút "Show More"
        }
    };

    const getAllComment = async () => {
        setGetCommentError(null);
        if (!userIdAdmin) {
            setGetCommentError('Invalid admin user ID');
            return;
        }
        try {
            // Kiểm tra nếu dữ liệu đã được lấy
            if (hasFetchedRef.current) {
                return; // Nếu đã lấy, không cần gọi API nữa
            }
            // Call API to get all user
            const res = await CommentService.getAllCommentAdmin(userIdAdmin);
            if (res?.status === 'ERR' && res?.success === false) {
                setGetCommentError(res.message);
                return [];
            } else if (res?.status === 'OK' && res?.success === true) {
                hasFetchedRef.current = true;
                const users = res?.dataAllComment.data;
                setCommentData(users); // Lưu dữ liệu người dùng từ phản hồi API
                handleSetShowMore(users); // Gọi hàm để xử lý show more
                setGetCommentError(null);
                return res.dataAllComment;
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };
    // Sử dụng useQuery với object form
    const { isLoading, error } = useQuery({
        queryKey: ['getAllComment', userIdAdmin],
        queryFn: getAllComment,
        enabled: !!userIdAdmin && !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });

    const getMoreComment = async (startIndex) => {
        setGetCommentError(null);

        try {
            if (!userIdAdmin) {
                setGetCommentError('Invalid admin user ID');
                return;
            }
            // Call API to get all user
            const res = await CommentService.getAllCommentAdmin(userIdAdmin, startIndex);
            if (res?.status === 'ERR' && res?.success === false) {
                setGetCommentError(res.message);
                return [];
            } // Thay đổi trong getMoreComment
            else if (res?.status === 'OK' && res?.success === true) {
                const newComment = res?.dataAllComment.data;
                setCommentData((prev) => [...prev, ...newComment]); // Cập nhật danh sách người dùng

                handleSetShowMore(newComment); // Gọi hàm để xử lý show more
                setGetCommentError(null);
                return res.dataAllComment;
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    return { getCommentError, commentData, isLoading, error, showMore, getMoreComment, setCommentData };
};

export default useGetAllCommentAdmin;

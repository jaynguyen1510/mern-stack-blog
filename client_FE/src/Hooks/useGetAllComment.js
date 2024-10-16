import { useQuery } from '@tanstack/react-query';
import * as CommentService from '../Service/CommentService';

import { useRef, useState } from 'react';

const useGetAllComment = (postId) => {
    const [getCommentError, setGetCommentError] = useState(null);
    const [commentData, setCommentData] = useState({});
    const hasFetchedRef = useRef(false); // Sử dụng useRef để theo dõi việc đã gọi API

    const getAllComment = async () => {
        try {
            if (hasFetchedRef.current) {
                return; // Nếu đã lấy, không cần gọi API nữa
            }
            const responeComment = await CommentService.getAllComments(postId);
            if (responeComment?.status === 'ERR' && responeComment?.success === false) {
                setGetCommentError(responeComment.message);
                return;
            } else if (responeComment?.status === 'OK' && responeComment?.success === true) {
                setCommentData(responeComment?.data);
                hasFetchedRef.current = true; // Đánh dấu đã lấy dữ liệu
                return responeComment.data; // Trả về dữ liệu bình luận
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Sử dụng useQuery với object form
    const { isLoading, error } = useQuery({
        queryKey: ['getAllPost', postId],
        queryFn: getAllComment,
        enabled: !!postId && !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });
    return { commentData, getCommentError, isLoading, error };
};

export default useGetAllComment;

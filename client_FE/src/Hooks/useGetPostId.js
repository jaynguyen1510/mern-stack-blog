import * as PostService from '../Service/PostService';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

const useGetPostId = (userId, postId) => {
    const [userPostsId, setUserPostsId] = useState([]);

    const hasFetchedRef = useRef(false); // Sử dụng useRef để theo dõi việc đã gọi API

    // Hàm lấy tất cả bài viết của người dùng
    const getPostId = async () => {
        try {
            // Kiểm tra nếu dữ liệu đã được lấy
            if (hasFetchedRef.current) {
                return; // Nếu đã lấy, không cần gọi API nữa
            }

            const response = await PostService.getPostFormPostId(userId, postId);
            if (response?.status === 'ERR' && response?.success === false) {
                return response?.message;
            } else if (response?.status === 'OK' && response?.success === true) {
                setUserPostsId(response?.dataPost.data[0]);
                hasFetchedRef.current = true; // Đánh dấu là đã lấy dữ liệu
                return response?.dataPost; // Trả về dữ liệu bài viết
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Sử dụng useQuery với object form
    const { isLoading: isLoadingGetPostId, error: errorGetPostId } = useQuery({
        queryKey: ['getPostId', userId],
        queryFn: getPostId, // Hàm này sẽ có quyền truy cập vào userId và postId
        enabled: !!userId && !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });

    return { userPostsId, isLoadingGetPostId, errorGetPostId, setUserPostsId };
};

export default useGetPostId;

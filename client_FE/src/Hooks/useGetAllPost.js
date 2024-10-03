import * as PostService from '../Service/PostService';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

const useGetAllPost = (userId) => {
    const [showMore, setShowMore] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const hasFetchedRef = useRef(false); // Sử dụng useRef để theo dõi việc đã gọi API

    const handleSetShowMore = (response) => {
        if (response.length < 9) {
            setShowMore(false); // Không hiển thị nút show more nếu số bài viết không lớn hơn 9
        }
    };

    // Hàm lấy tất cả bài viết của người dùng
    const getAllPost = async () => {
        try {
            // Kiểm tra nếu dữ liệu đã được lấy
            if (hasFetchedRef.current) {
                return; // Nếu đã lấy, không cần gọi API nữa
            }

            const response = await PostService.getAllPost(userId);
            if (response?.status === 'ERR' && response?.success === false) {
                return response?.message;
            } else if (response?.status === 'OK' && response?.success === true) {
                handleSetShowMore(response?.dataPost.data);
                setUserPosts(response?.dataPost.data);
                hasFetchedRef.current = true; // Đánh dấu là đã lấy dữ liệu
                return response?.dataPost; // Trả về dữ liệu bài viết
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Sử dụng useQuery với object form
    const { isLoading, error } = useQuery({
        queryKey: ['getAllPost', userId],
        queryFn: getAllPost,
        enabled: !!userId && !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });

    const getMorePost = async (userId, startIndex) => {
        try {
            const response = await PostService.getAllPost(userId, startIndex);
            if (response?.status === 'ERR' && response?.success === false) {
                return response?.message;
            } else if (response?.status === 'OK' && response?.success === true) {
                setUserPosts((prev) => [...prev, ...response.dataPost.data]);
                handleSetShowMore(response?.dataPost.data);
                return response?.dataPost; // Trả về dữ liệu bài viết
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    return { isLoading, error, userPosts, showMore, getMorePost };
};

export default useGetAllPost;

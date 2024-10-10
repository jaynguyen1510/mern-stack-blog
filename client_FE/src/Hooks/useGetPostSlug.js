import * as PostService from '../Service/PostService';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

const useGetPostSlug = (Slug) => {
    const [postFromSlug, setPostFromSlug] = useState([]);
    const [errorPostSlug, setErrorPostSlug] = useState(null);
    const [successPostSlug, setSuccessPostSlug] = useState(null);
    const hasFetchedRef = useRef(false); // Sử dụng useRef để theo dõi việc đã gọi API
    const timeoutRef = useRef(null); // Sử dụng useRef để lưu giữ ID của setTimeout

    const getPostSlug = async () => {
        if (!Slug) {
            setErrorPostSlug('Không có định danh của bài post');
            return;
        }
        try {
            // Kiểm tra nếu dữ liệu đã được lấy
            if (hasFetchedRef.current) {
                return; // Nếu đã lấy, không cần gọi API nữa
            }
            const response = await PostService.getPostBySlug(Slug);
            if (response?.status === 'ERR' && response?.success === false) {
                setErrorPostSlug(response.message);
                return;
            } else if (response?.status === 'OK' && response?.success === true) {
                setSuccessPostSlug(response.message);
                setPostFromSlug(response?.dataPost.data[0]);
                hasFetchedRef.current = true;
                return response?.dataPost; // Trả về dữ liệu bài viết
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Sử dụng useQuery với object form
    const { isLoading: isLoadingGetPostSlug, error: errorGetPostSlug } = useQuery({
        queryKey: ['getPostId', Slug],
        queryFn: getPostSlug, // Hàm này sẽ có quyền truy cập vào userId và postId
        enabled: !!Slug && !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });

    // Cleanup timeout khi có thông báo lỗi
    useEffect(() => {
        if (errorPostSlug || successPostSlug) {
            // Thiết lập timeout để tự động xóa lỗi sau 2 giây
            timeoutRef.current = setTimeout(() => {
                setErrorPostSlug(null);
                setSuccessPostSlug(null);
            }, 2000);
        }

        // Cleanup function để xóa timeout
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [errorPostSlug, successPostSlug]); // Chỉ chạy effect này khi errorPostSlug thay đổi

    return { isLoadingGetPostSlug, errorGetPostSlug, postFromSlug, errorPostSlug, successPostSlug };
};

export default useGetPostSlug;

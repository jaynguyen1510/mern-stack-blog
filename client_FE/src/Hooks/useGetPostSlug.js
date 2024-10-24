import * as PostService from '../Service/PostService';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useGetPostSlug = (Slug) => {
    const [postFromSlug, setPostFromSlug] = useState([]);
    const [errorPostSlug, setErrorPostSlug] = useState(null);
    const [successPostSlug, setSuccessPostSlug] = useState(null);

    const getPostSlug = async () => {
        if (!Slug) {
            setErrorPostSlug('Không có định danh của bài post');
            return null;
        }
        try {
            const response = await PostService.getPostBySlug(Slug);
            if (response?.status === 'ERR' && response?.success === false) {
                setErrorPostSlug(response.message);
                return null;
            } else if (response?.status === 'OK' && response?.success === true) {
                setSuccessPostSlug(response.message);
                setPostFromSlug(response?.dataPost.data[0]);
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
        queryFn: getPostSlug,
        enabled: !!Slug, // Chỉ cho phép gọi API nếu Slug tồn tại
    });

    // Cleanup timeout cho thông báo lỗi/thành công
    useEffect(() => {
        let timeout; // Đặt timeout ở đây để không bị mất giữa các lần render

        if (errorPostSlug || successPostSlug) {
            // Thiết lập timeout để tự động xóa thông báo sau 2 giây
            timeout = setTimeout(() => {
                setErrorPostSlug(null);
                setSuccessPostSlug(null);
            }, 2000);
        }

        // Cleanup function để xóa timeout
        return () => {
            clearTimeout(timeout);
        };
    }, [errorPostSlug, successPostSlug]); // Chỉ chạy effect này khi errorPostSlug hoặc successPostSlug thay đổi

    return { isLoadingGetPostSlug, errorGetPostSlug, postFromSlug, errorPostSlug, successPostSlug };
};

export default useGetPostSlug;

import { useQuery } from '@tanstack/react-query';
import * as CommentService from '../Service/CommentService';

import { useRef } from 'react';

const useGetCommentLimit = () => {
    const hasFetchedRef = useRef(false);
    const getCommentLimit = async () => {
        try {
            // Kiểm tra nếu dữ liệu đã được lấy
            if (hasFetchedRef.current) {
                return []; // Nếu đã lấy, không cần gọi API nữa, trả về mảng rỗng
            }

            // Call API to get all post with limit
            const response = await CommentService.getCommentLimit();

            if (response?.status === 'ERR' && response?.success === false) {
                console.error(response?.message);
                return []; // Trả về mảng rỗng nếu có lỗi
            } else if (response?.status === 'OK' && response?.success === true) {
                hasFetchedRef.current = true; // Đánh dấu API đã được gọi thành công
                return response?.dataAllComment || []; // Trả về dữ liệu bài post hoặc mảng rỗng nếu không có dữ liệu
            }

            return null; // Trả về null nếu không có kết quả phù hợp
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Sử dụng useQuery với object form
    const {
        data: dataGetCommentLimit,
        isLoading: isLoadingGetCommentLimit,
        error: errorGetCommentLimit,
    } = useQuery({
        queryKey: ['getCommentLimit'],
        queryFn: getCommentLimit,
        enabled: !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });
    return { dataGetCommentLimit, isLoadingGetCommentLimit, errorGetCommentLimit };
};

export default useGetCommentLimit;

import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import * as PostService from '../Service/PostService';

const useGetPostLimit = () => {
    const hasFetchedRef = useRef(false); // Sử dụng useRef để theo dõi việc đã gọi API

    const getPostLimit = async () => {
        try {
            // Kiểm tra nếu dữ liệu đã được lấy
            if (hasFetchedRef.current) {
                return null; // Nếu đã lấy, không cần gọi API nữa, trả về null hoặc dữ liệu rỗng
            }

            // Call API to get all post with limit
            const response = await PostService.getPostLimit();

            if (response?.status === 'ERR' && response?.success === false) {
                return response?.message;
            } else if (response?.status === 'OK' && response?.success === true) {
                hasFetchedRef.current = true; // Đánh dấu API đã được gọi thành công
                return response?.dataPost; // Trả về dữ liệu bài post
            }

            return null; // Trả về null nếu không có kết quả phù hợp
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Sử dụng useQuery với object form
    const {
        data: dataGetPostLimit,
        isLoading: isLoadingGetPostLimit,
        error: errorGetPostLimit,
    } = useQuery({
        queryKey: ['getPostLimit'],
        queryFn: getPostLimit,
        enabled: !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });

    return { isLoadingGetPostLimit, errorGetPostLimit, dataGetPostLimit };
};

export default useGetPostLimit;

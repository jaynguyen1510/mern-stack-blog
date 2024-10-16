import { useQuery } from '@tanstack/react-query';
import * as UserService from '../Service/UserService';
import { useState } from 'react';

const useGetUserById = (userId) => {
    const [errorUserId, setErrorUserId] = useState(null);
    const getUserById = async () => {
        // Nếu userId không có giá trị, trả về một đối tượng rỗng
        if (!userId) {
            return {}; // Trả về đối tượng rỗng
        }

        try {
            // Gọi API để lấy thông tin người dùng
            const response = await UserService.getUserById(userId);

            // Kiểm tra kết quả trả về
            if (response?.status === 'ERR' && response?.success === false) {
                setErrorUserId(response?.message);
                return {}; // Trả về đối tượng rỗng khi có lỗi
            } else if (response?.status === 'OK' && response?.success === true) {
                return response?.userById || {}; // Trả về dữ liệu người dùng hoặc đối tượng rỗng
            }
        } catch (error) {
            console.error(error);
            setErrorUserId(error.message); // Cập nhật lỗi
            return {}; // Trả về đối tượng rỗng trong trường hợp có lỗi
        }
        return {}; // Trả về đối tượng rỗng nếu không vào được một trong các điều kiện
    };

    // Sử dụng useQuery để gọi hàm getUserById
    const { data: userIdData = {}, isLoading: isLoadingUserById } = useQuery({
        queryKey: ['getUserById', userId],
        queryFn: getUserById,
        enabled: !!userId, // Chỉ gọi API khi có userId
        refetchOnWindowFocus: false,
        retry: false,
    });

    return { userIdData, errorUserId, isLoadingUserById }; // Trả về dữ liệu người dùng, lỗi và trạng thái loading
};

export default useGetUserById;

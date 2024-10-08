import * as UserService from '../Service/UserService';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

const useGetAllUser = (userIdAdmin) => {
    const [errorGetAllUsers, setErrorGetAllUsers] = useState(null);
    const [getUser, setGetUser] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const hasFetchedRef = useRef(false); // Sử dụng useRef để theo dõi việc đã gọi API

    const handleSetShowMore = (response) => {
        if (response.length < 2) {
            setShowMore(false); // Ẩn nút "Show More" nếu số người dùng trả về nhỏ hơn 2
        } else {
            setShowMore(true); // Nếu không, hiển thị lại nút "Show More"
        }
    };

    const getAllUser = async () => {
        setErrorGetAllUsers(null);
        if (!userIdAdmin) {
            setErrorGetAllUsers('Invalid admin user ID');
            return;
        }
        try {
            // Kiểm tra nếu dữ liệu đã được lấy
            if (hasFetchedRef.current) {
                return; // Nếu đã lấy, không cần gọi API nữa
            }
            // Call API to get all user
            const res = await UserService.getAllUsers(userIdAdmin);
            if (res?.status === 'ERR' && res?.success === false) {
                setErrorGetAllUsers(res.message);
                return [];
            } else if (res?.status === 'OK' && res?.success === true) {
                hasFetchedRef.current = true;
                const users = res?.dataAllUser.data;
                setGetUser(users); // Lưu dữ liệu người dùng từ phản hồi API
                handleSetShowMore(users); // Gọi hàm để xử lý show more
                setErrorGetAllUsers(null);
                return res.dataAllUser;
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };
    // Sử dụng useQuery với object form
    const { isLoading, error } = useQuery({
        queryKey: ['getAllUser', userIdAdmin],
        queryFn: getAllUser,
        enabled: !!userIdAdmin && !hasFetchedRef.current, // Chỉ cho phép gọi API nếu chưa lấy dữ liệu
    });

    const getMoreUser = async (startIndex) => {
        setErrorGetAllUsers(null);

        try {
            if (!userIdAdmin) {
                setErrorGetAllUsers('Invalid admin user ID');
                return;
            }
            // Call API to get all user
            const res = await UserService.getAllUsers(userIdAdmin, startIndex);
            if (res?.status === 'ERR' && res?.success === false) {
                setErrorGetAllUsers(res.message);
                return [];
            } // Thay đổi trong getMoreUser
            else if (res?.status === 'OK' && res?.success === true) {
                const newUsers = res?.dataAllUser.data;
                setGetUser((prev) => [...prev, ...newUsers]); // Cập nhật danh sách người dùng

                handleSetShowMore(newUsers); // Gọi hàm để xử lý show more
                setErrorGetAllUsers(null);
                return res.dataAllUser;
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    return { errorGetAllUsers, getUser, isLoading, error, showMore, getMoreUser };
};

export default useGetAllUser;

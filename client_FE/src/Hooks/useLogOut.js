import { useDispatch } from 'react-redux';
import * as UserService from '../Service/UserService';
import { removeUserCurrent } from '../redux/Slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { useMutationCustomHook } from './useMutationCustom';

const useLogOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Import useNavigate để điều hướng đến trang

    const mutateLogOut = useMutationCustomHook(async () => {
        const response = await UserService.logOutUser();
        return response; // Trả về response của API đăng xuất
    });

    const logOut = async () => {
        try {
            const res = await mutateLogOut.mutateAsync();

            if (res) {
                // Nếu phản hồi thành công, xóa user khỏi Redux
                dispatch(removeUserCurrent());
                // Điều hướng đến trang đăng nhập hoặc trang chủ
                navigate('/'); // Hoặc '/'
            }
            return res;
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            // Có thể thêm thông báo cho người dùng ở đây nếu cần
        }
    };
    return logOut; // Trả về hàm logOut để component có thể gọi
};

export default useLogOut;

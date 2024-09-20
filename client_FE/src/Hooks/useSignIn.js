import * as UserService from '../Service/UserService';
import { useEffect } from 'react';
import { useMutationCustomHook } from './useMutationCustom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInUserStart, signInUserSuccess, signInFailure, resetMessage, resetError } from '../redux/Slice/userSlice';

const useSignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy các giá trị từ Redux
    const { isLoading, error, message } = useSelector((state) => state.user);

    const mutationSignIn = useMutationCustomHook(async (formData) => {
        return await UserService.signInUser(formData);
    });

    const signIn = async (formData) => {
        dispatch(signInUserStart()); // Bắt đầu quá trình đăng nhập

        let timer;
        try {
            const response = await mutationSignIn.mutateAsync(formData);
            if (response.status === 'OK' && response.success === true) {
                dispatch(signInUserSuccess(response));
                timer = setTimeout(() => {
                    navigate('/'); // Điều hướng sau khi đăng nhập thành công
                }, 3000); // Thời gian chờ để điều hướng
            } else if (response.status === 'ERR') {
                dispatch(signInFailure(response)); // Thông báo lỗi đăng nhập
            }
        } catch (err) {
            dispatch(signInFailure('Đã xảy ra lỗi, vui lòng thử lại'));
            console.error(err);
        }

        // Dọn dẹp timer nếu tồn tại
        return () => {
            if (timer) clearTimeout(timer);
        };
    };

    // Tự động xóa thông báo lỗi/message sau 3 giây
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                if (error) dispatch(resetError()); // Reset error sau 3 giây
                if (message) dispatch(resetMessage()); // Reset message sau 3 giây
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error, message, dispatch]);

    return { signIn, isLoading, error, message };
};

export default useSignIn;

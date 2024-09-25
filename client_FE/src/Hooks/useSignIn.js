import * as UserService from '../Service/UserService';
import { useMutationCustomHook } from './useMutationCustom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInUserStart, signInUserSuccess, signInFailure, resetMessage, resetError } from '../redux/Slice/userSlice';
import { useEffect, useRef } from 'react';

const useSignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy các giá trị từ Redux
    const { isLoading, error, message } = useSelector((state) => state.user);
    const timerRef = useRef(null); // Sử dụng useRef để lưu trữ timer

    const mutationSignIn = useMutationCustomHook(async (formData) => {
        return await UserService.signInUser(formData);
    });

    const signIn = async (formData) => {
        dispatch(signInUserStart()); // Bắt đầu quá trình đăng nhập

        try {
            const response = await mutationSignIn.mutateAsync(formData);
            if (response.status === 'OK' && response.success === true) {
                dispatch(signInUserSuccess(response));
                // Thiết lập timer để reset error và message
                timerRef.current = setTimeout(() => {
                    dispatch(resetError()); // Reset error
                    dispatch(resetMessage()); // Reset message
                    navigate('/'); // Điều hướng sau khi đăng nhập thành công
                }, 1000); // Thời gian chờ để điều hướng
            } else if (response.status === 'ERR') {
                dispatch(signInFailure(response)); // Thông báo lỗi đăng nhập
                timerRef.current = setTimeout(() => {
                    dispatch(resetError()); // Reset error
                    dispatch(resetMessage()); // Reset message
                }, 1000); // Thời gian chờ để điều hướng
            }
        } catch (err) {
            dispatch(signInFailure('Đã xảy ra lỗi, vui lòng thử lại'));
            console.error(err);
        }
    };

    // Dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { signIn, isLoading, error, message };
};

export default useSignIn;

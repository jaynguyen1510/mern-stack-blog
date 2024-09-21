import * as UserService from '../Service/UserService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutationCustomHook } from './useMutationCustom';
import { resetMessage, signInFailure, signInUserSuccess } from '../redux/Slice/userSlice';

const useSignInGoogle = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mutationSignInGoogle = useMutationCustomHook(async (formData) => {
        return await UserService.signInGoogle(formData);
    });

    const signInWithGoogle = async (formData) => {
        try {
            const response = await mutationSignInGoogle.mutateAsync(formData);
            if (response?.status === 'OK' && response?.success === true) {
                dispatch(signInUserSuccess(response));

                // Dọn dẹp timeout và điều hướng sau 3 giây
                const timeoutId = setTimeout(() => {
                    dispatch(resetMessage());
                    navigate('/'); // Điều hướng sau khi reset message
                }, 1000);

                // Dọn dẹp timeout khi component unmount
                return () => clearTimeout(timeoutId);
            }
        } catch (error) {
            dispatch(signInFailure('Đã xảy ra lỗi, vui lòng thử lại'));
            console.error(error);
        }
    };

    return { signInWithGoogle };
};

export default useSignInGoogle;

import { useEffect, useState } from 'react';
import * as UserService from '../Service/UserService';
import { useMutationCustomHook } from './useMutationCustom';
import { useNavigate } from 'react-router-dom';

const useSignUp = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const mutation = useMutationCustomHook(async (formData) => {
        return await UserService.signUpUser(formData);
    });

    const signUp = async (formData) => {
        setError(''); // Reset lỗi trước khi gọi API
        setMessage(''); // Reset thông điệp trước khi gọi API
        setIsLoading(true); // Bắt đầu loading

        let timer; // Khai báo biến timer
        try {
            const response = await mutation.mutateAsync(formData); // Gọi hàm đăng ký
            if (response.status === 'OK' && response.success) {
                setMessage(response.message);
                timer = setTimeout(() => {
                    navigate('/sign-in');
                }, 3000); // Thay đổi thời gian nếu cần
            } else if (response.status === 'ERR') {
                setError(response.message);
            }
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại');
            console.error(err);
        } finally {
            setIsLoading(false); // Kết thúc loading
        }
        return () => clearTimeout(timer); // Dọn dẹp timer
    };

    // Tự động tắt thông báo sau 5 giây
    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null);
        }, 3000); // Thay đổi thời gian tại đây nếu cần

        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }, [error, message]); // Chạy lại khi error hoặc message thay đổi
    return { signUp, message, error, isLoading };
};

export default useSignUp;

import { useEffect, useState } from 'react';
import * as UserService from '../Service/UserService';
import { useMutationCustomHook } from './useMutationCustom';
import { useNavigate } from 'react-router-dom';

const useSignIn = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const mutationSignIn = useMutationCustomHook(async (formData) => {
        return await UserService.sigInUser(formData);
    });
    const signIn = async (formData) => {
        setError(''); // Reset lỗi trước khi gọi API
        setMessage(''); // Reset thông điệp trước khi gọi API
        setIsLoading(true); // Bắt đầu loading
        let timer;
        try {
            const response = await mutationSignIn.mutateAsync(formData);
            if (response.status === 'OK' && response.success === true) {
                setMessage(response.message);
                timer = setTimeout(() => {
                    navigate('/');
                }, 3000); // Thay đổi thời gian nếu cần
            } else if (response.status === 'ERR' && response.success === false) {
                setError(response.message);
            }
        } catch (error) {
            setError('Đã xảy ra lỗi, vui lòng thử lại');
            console.error(error);
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
    return { signIn, message, error, isLoading };
};

export default useSignIn;

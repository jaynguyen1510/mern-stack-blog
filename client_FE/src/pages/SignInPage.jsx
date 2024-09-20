import InputComponent from '../components/InputComponent/InputComponent';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';
import LoadingComponent from '../components/LoadingComponent/LoadingComponent';
import useSignIn from '../Hooks/useSignIn';

import { Alert, Label } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

const SignInPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { signIn, isLoading, error, message } = useSignIn();

    const handleOnChange = useCallback(
        (e) => {
            setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
        },
        [formData],
    );

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return setErrorMessage('Vui lòng nhập đầy đủ thông tin'); // Nếu thiếu thông tin thì không thực hiện đăng nhập
        }
        setErrorMessage(null);
        await signIn(formData); // Gọi hàm signIn từ hook
    };
    // Tự động tắt thông báo sau 5 giây
    useEffect(() => {
        const timer = setTimeout(() => {
            setErrorMessage(null);
        }, 3000); // Thay đổi thời gian tại đây nếu cần

        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }, [errorMessage, message]); // Chạy lại khi errorMessage hoặc message thay đổi
    return (
        <div className="min-h-screen mt-40">
            <div className="flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* {left} */}
                <div className="flex-1">
                    <div
                        onClick={() => navigate('/')}
                        className="cursor-pointer text-sm sm:text-4xl font-bold dark:text-white"
                    >
                        <span className="px-1 pt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Sức khỏe và thể hình
                        </span>
                        Blog
                    </div>
                    <p className="text-sm mt-5">
                        Đây là Blog chia sẻ kiến thức về dinh dưỡng và tập luyện. Bạn có thể đăng nhập với Email và mật
                        khẩu hoặc với Google
                    </p>
                </div>
                {/* {right} */}
                <div className="flex-1">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmitForm}>
                        <div>
                            <Label value="Email" />
                            <InputComponent
                                id="email"
                                type="email"
                                placeholder="abc@gmail.com"
                                onChange={handleOnChange}
                                value={formData.email}
                            />
                        </div>
                        <div>
                            <Label value="Mật khẩu" />
                            <InputComponent
                                id="password"
                                type="password"
                                placeholder="Vui lòng nhập mật khẩu"
                                onChange={handleOnChange}
                                value={formData.password}
                            />
                        </div>
                        <ButtonComponent gradientDuoTone="purpleToPink" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <LoadingComponent isLoading={isLoading}>Vui lòng chờ...</LoadingComponent>
                            ) : (
                                'Đăng nhập'
                            )}
                        </ButtonComponent>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Bạn chưa có tài khoản?</span>
                        <span
                            onClick={() => navigate('/sign-up')}
                            className="text-sm text-blue-500 hover:text-blue-300 cursor-pointer"
                        >
                            Đăng ký tài khoản
                        </span>
                    </div>
                    {/* Hiển thị thông báo thành công */}
                    {message && (
                        <Alert className="mt-4 p-3 bg-green-100 border border-green-500 text-green-700 rounded">
                            {message}
                        </Alert>
                    )}
                    {/* Hiển thị thông báo lỗi */}
                    {(error || errorMessage) && (
                        <Alert className="mt-5 p-3 bg-red-100 border border-red-500 text-red-700 rounded">
                            {error || errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignInPage;

import { Label } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../components/InputComponent/InputComponent';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';

const SignUpPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen mt-40">
            <div className="flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* {left} */}
                <div className="flex-1">
                    <div
                        onClick={() => navigate('/')}
                        className="cursor-pointer text-sm sm:text-4xl font-bold dark:text-white "
                    >
                        <span className="px-1 pt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Sức khỏe và thể hình
                        </span>
                        Blog
                    </div>
                    <p className="text-sm mt-5">
                        Đây là Blog chia sẻ kiến thức về dinh dưỡng và tập luyện. Bạn có thể đăng nhập với Email và mật
                        khẩu hoặc với Google{' '}
                    </p>
                </div>
                {/* {right} */}
                <div className="flex-1">
                    <form className="flex flex-col gap-4">
                        <div>
                            <Label value="Tên tài khoản" />
                            <InputComponent id="username" type="text" placeholder="Vui lòng nhập tên tài khoản" />
                        </div>
                        <div>
                            <Label value="Email" />
                            <InputComponent id="email" type="text" placeholder="abc@gmail.com" />
                        </div>
                        <div>
                            <Label value="Mật khẩu" />
                            <InputComponent id="username" type="text" placeholder="Vui lòng nhập mật khẩu" />
                        </div>
                        <ButtonComponent gradientDuoTone="purpleToPink" type="submit">
                            Đăng ký
                        </ButtonComponent>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>
                            Bạn đã có tài khoản?
                            <span
                                onClick={() => navigate('/sign-in')}
                                className="text-sm hover:text-blue-500 cursor-pointer"
                            >
                                Đăng nhập
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;

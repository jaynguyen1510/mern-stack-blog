import { Button, Navbar, TextInput } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

const HeaderComponent = () => {
    const navigate = useNavigate();
    const path = useLocation().pathname;
    console.log('Loading', path);

    return (
        <Navbar className="border-b-2">
            <div
                onClick={() => navigate('/')}
                className="cursor-pointer self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
                <span className="px-1 pt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                    Sức khỏe và thể hình
                </span>
                Blog
            </div>
            <form>
                <TextInput
                    type="text"
                    placeholder="Tìm kiếm"
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                />
            </form>
            <Button className="w-12 h-10 lg:hidden " color="gray" pill>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button className="w-12 h-10 hidden sm:inline" color={'gray'} pill>
                    <FaMoon />
                </Button>
                <Button gradientDuoTone="purpleToBlue" outline onClick={() => navigate('/sign-in')}>
                    Đăng nhập
                </Button>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'}>
                    <div onClick={() => navigate('/')} className="cursor-pointer">
                        Trang chủ
                    </div>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'}>
                    <div onClick={() => navigate('/about')} className="cursor-pointer">
                        Tổng quan
                    </div>
                </Navbar.Link>
                <Navbar.Link active={path === '/project-page'}>
                    <div onClick={() => navigate('/project-page')} className="cursor-pointer">
                        Lịch tập
                    </div>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default HeaderComponent;

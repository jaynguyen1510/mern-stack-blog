import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/Theme/ThemeSlice';
import useLogOut from '../../Hooks/useLogOut';
const HeaderComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logout = useLogOut();
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);

    const path = useLocation().pathname;
    const handleLogOut = () => {
        console.log('Logging out...'); // Kiểm tra xem sự kiện này có được gọi
        logout(); // Gọi hàm logOut và truyền formData
    };
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
                <Button
                    className="w-12 h-10 hidden sm:inline"
                    color={'gray'}
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    // Nếu currentUser tồn tại, hiển thị một thành phần nào đó, ví dụ:
                    <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser?.avatar} rounded />}>
                        <Dropdown.Header onClick={() => navigate('/dashboard?tab=profile')}>
                            <div className="cursor-pointer">
                                <span className="block text-sm">Xin chào</span>
                                <span className="block text-sm font-bold text-blue-500 hover:text-orange-700 hover:shadow-lg transition duration-300">
                                    {currentUser?.userName}
                                </span>
                            </div>
                        </Dropdown.Header>
                        <Dropdown.Item onClick={handleLogOut}>Đăng xuất</Dropdown.Item>
                    </Dropdown>
                ) : (
                    // Nếu không có currentUser, hiển thị nút Đăng nhập
                    <Button gradientDuoTone="purpleToBlue" outline onClick={() => navigate('/sign-in')}>
                        Đăng nhập
                    </Button>
                )}

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
                {currentUser?.isAdmin === true && (
                    <Navbar.Link active>
                        <div className="cursor-pointer">Xin chào Admin</div>
                    </Navbar.Link>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default HeaderComponent;

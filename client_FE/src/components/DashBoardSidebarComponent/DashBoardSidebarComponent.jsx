import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { removeUserCurrent } from '../../redux/Slice/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const DashBoardSidebarComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState('');

    // lấy thông tin URL thuộc tính của tab?=profile or tab?=test
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabParamFormUrl = urlParams.get('tab');
        if (tabParamFormUrl) {
            setTab(tabParamFormUrl);
        }
    }, [location.search]);

    const handleLogOut = () => {
        dispatch(removeUserCurrent());
        navigate('/');
    };

    return (
        <Sidebar className="w-full md:w-50">
            <Sidebar.ItemGroup>
                <Sidebar.Item
                    className="cursor-pointer"
                    active={tab === 'profile'} // Đây sẽ đánh dấu active nếu tab là 'profile'
                    icon={HiUser}
                    label={'User'}
                    labelColor={'dark'}
                    onClick={() => navigate('/dashboard?tab=profile')} // Điều hướng
                >
                    Thông tin cá nhân
                </Sidebar.Item>
                {/* <Sidebar.Item
                    className="cursor-pointer"
                    active={tab === 'post'}
                    icon={HiUser}
                    label={'User'}
                    labelColor={'dark'}
                >
                    Post
                </Sidebar.Item> */}
                <Sidebar.Item className="cursor-pointer" icon={HiArrowSmRight} onClick={handleLogOut}>
                    Đăng xuất
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar>
    );
};

export default DashBoardSidebarComponent;

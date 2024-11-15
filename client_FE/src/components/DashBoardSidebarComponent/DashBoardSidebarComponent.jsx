import { Sidebar } from 'flowbite-react';
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiUser, HiUserGroup } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useLogOut from '../../Hooks/useLogOut';
import { useSelector } from 'react-redux';
const DashBoardSidebarComponent = () => {
    const navigate = useNavigate();
    const logout = useLogOut();
    const location = useLocation();
    const [tab, setTab] = useState('');
    const { currentUser } = useSelector((state) => state.user);

    // lấy thông tin URL thuộc tính của tab?=profile or tab?=test
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabParamFormUrl = urlParams.get('tab');
        if (tabParamFormUrl) {
            setTab(tabParamFormUrl);
        }
    }, [location.search]);

    const handleLogOut = () => {
        logout();
    };

    return (
        <Sidebar className="w-full md:w-50">
            <Sidebar.ItemGroup className="flex flex-col gap-1">
                {currentUser && currentUser?.isAdmin && (
                    <Sidebar.Item
                        className="cursor-pointer"
                        active={tab === 'dash' || !tab}
                        icon={HiChartPie}
                        labelColor={'dark'}
                        onClick={() => navigate('/dashboard?tab=dash')}
                    >
                        Dashboard
                    </Sidebar.Item>
                )}
                <Sidebar.Item
                    className="cursor-pointer"
                    active={tab === 'profile'} // Đây sẽ đánh dấu active nếu tab là 'profile'
                    icon={HiUser}
                    label={currentUser?.isAdmin ? ' Admin' : 'User'}
                    labelColor={'dark'}
                    onClick={() => navigate('/dashboard?tab=profile')} // Điều hướng
                >
                    Thông tin cá nhân
                </Sidebar.Item>
                {currentUser?.isAdmin && (
                    <Sidebar.Item
                        className="cursor-pointer"
                        active={tab === 'post'}
                        icon={HiDocumentText}
                        labelColor={'dark'}
                        onClick={() => navigate('/dashboard?tab=post')}
                    >
                        Quản lý Bài viết
                    </Sidebar.Item>
                )}
                {currentUser?.isAdmin && (
                    <Sidebar.Item
                        className="cursor-pointer"
                        active={tab === 'user'}
                        icon={HiUserGroup}
                        labelColor={'dark'}
                        onClick={() => navigate('/dashboard?tab=user')}
                    >
                        Quản lý người dùng
                    </Sidebar.Item>
                )}
                {currentUser?.isAdmin && (
                    <Sidebar.Item
                        className="cursor-pointer"
                        active={tab === 'comment'}
                        icon={HiAnnotation}
                        labelColor={'dark'}
                        onClick={() => navigate('/dashboard?tab=comment')}
                    >
                        Quản lý comment
                    </Sidebar.Item>
                )}
                <Sidebar.Item className="cursor-pointer" icon={HiArrowSmRight} onClick={handleLogOut}>
                    Đăng xuất
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar>
    );
};

export default DashBoardSidebarComponent;

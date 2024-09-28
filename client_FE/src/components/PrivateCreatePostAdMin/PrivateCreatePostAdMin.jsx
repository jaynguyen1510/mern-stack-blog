import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const PrivateCreatePostAdMin = () => {
    const { currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/sign-in'); // Chuyển hướng người dùng đến trang đăng nhập nếu chưa đăng nhập
        }
    }, [currentUser, navigate]);

    return currentUser && currentUser?.isAdmin ? <Outlet /> : null; // Nếu đã đăng nhập bằng Admin, render các route con, nếu không, trả về null
};
export default PrivateCreatePostAdMin;

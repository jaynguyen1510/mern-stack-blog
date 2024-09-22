import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashBoardSidebarComponent from '../components/DashBoardSidebarComponent/DashBoardSidebarComponent';
import DashBoardProfileComponent from '../components/DashBoardProfileComponent/DashBoardProfileComponent';

const Dasboard = () => {
    const location = useLocation();
    console.log('location', location);
    const [tab, setTab] = useState('');

    // lấy thông tin URL thuộc tính của tab?=profile or tab?=test
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabParamFormUrl = urlParams.get('tab');
        if (tabParamFormUrl) {
            setTab(tabParamFormUrl);
        }
    }, [location.search]);
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-50">
                {/* {sidebar} */}
                <DashBoardSidebarComponent />
            </div>
            {/* {Profile} */}
            {tab === 'profile' && <DashBoardProfileComponent />}
        </div>
    );
};

export default Dasboard;

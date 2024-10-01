import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashBoardSidebarComponent from '../components/DashBoardSidebarComponent/DashBoardSidebarComponent';
import DashBoardProfileComponent from '../components/DashBoardProfileComponent/DashBoardProfileComponent';
import DashPostComponent from '../components/DashPostComponent/DashPostComponent';

const Dasboard = () => {
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
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-50">
                {/* {sidebar} */}
                <DashBoardSidebarComponent />
            </div>
            {/* {tab total} */}
            {(tab === 'profile' && <DashBoardProfileComponent />) || (tab === 'post' && <DashPostComponent />)}
        </div>
    );
};

export default Dasboard;

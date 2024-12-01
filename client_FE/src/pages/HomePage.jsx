import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CallToAction from '../components/CallToAction/CallToAction';
import useGetPostHomePage from '../Hooks/useGetPostHomePage';
import PostCardComponent from '../components/PostCardComponent/PostCardComponent';

const HomePage = () => {
    const { isLoadingGetPostForHomePage, errorGetPostForHomePage, dataGetPostForHomePage } = useGetPostHomePage();
    const [dataPostHomePage, setDataPostHomePage] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (dataGetPostForHomePage && dataGetPostForHomePage.data) {
            setDataPostHomePage(dataGetPostForHomePage.data);
        }
    }, [dataGetPostForHomePage]);

    if (isLoadingGetPostForHomePage) {
        return <div className="text-center py-5">Loading posts...</div>;
    }

    if (errorGetPostForHomePage) {
        return <div className="text-center text-red-500 py-5">Failed to load posts. Please try again later.</div>;
    }

    return (
        <div>
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my blog healthy and fitness</h1>
                <p className="text-gray-500 text-xs sm:text-sm">
                    Here you will find a variety of articles and tutorials on topics such as healthy and fitness
                </p>
                <p
                    className="text-xs sm:text-sm text-teal-500 font-bold hover:underline cursor-pointer"
                    onClick={() => navigate('/search')}
                >
                    View all posts
                </p>
            </div>

            <div className="p-3 bg-amber-100 dark:bg-slate-700">
                <CallToAction />
            </div>

            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
                {dataPostHomePage && dataPostHomePage.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {dataPostHomePage.map((post) => (
                                <PostCardComponent key={post._id} post={post} />
                            ))}
                        </div>
                        <p
                            className="text-lg text-teal-500 font-bold hover:underline text-center cursor-pointer"
                            onClick={() => navigate('/search')}
                        >
                            View all posts
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;

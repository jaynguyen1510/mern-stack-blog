import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useGetPostLimit from '../Hooks/useGetPostLimit';
import useGetPostSlug from '../Hooks/useGetPostSlug';
import LoadingComponent from '../components/LoadingComponent/LoadingComponent';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';
import CallToAction from '../components/CallToAction/CallToAction';
import CommentSectionComponent from '../components/CommentSectionComponent/CommentSectionComponent';
import PostCardComponent from '../components/PostCardComponent/PostCardComponent';
import { Alert } from 'flowbite-react';
import { cleanTitle } from '../../utils';

const PostPage = () => {
    const { postSlug } = useParams();
    const navigate = useNavigate();
    const { isLoadingGetPostSlug, errorGetPostSlug, postFromSlug, errorPostSlug, successPostSlug } =
        useGetPostSlug(postSlug);
    const { isLoadingGetPostLimit, errorGetPostLimit, dataGetPostLimit } = useGetPostLimit();

    // Ensure recentPosts is an array initially
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        if (dataGetPostLimit) {
            setRecentPosts(dataGetPostLimit.data);
        }
    }, [dataGetPostLimit]);

    // Format date to ICT
    const formatDateToICT = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        return `Ngày tạo ${formattedDate} `;
    };

    // Calculate reading time
    const minsRead = (timeRead) => {
        if (timeRead && typeof timeRead === 'string' && timeRead.length > 0) {
            const readMinutes = (timeRead.length / 1000).toFixed(0);
            return readMinutes;
        }
        return 0; // Return default if not valid
    };

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen flex flex-col">
            {isLoadingGetPostSlug ? (
                <LoadingComponent isLoading={isLoadingGetPostSlug}>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải bài viết để cập nhật...</p>
                </LoadingComponent>
            ) : errorGetPostSlug ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-500">Đã xảy ra lỗi: {errorGetPostSlug.message || 'Vui lòng thử lại sau.'}</p>
                </div>
            ) : postFromSlug ? (
                <div>
                    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                        <h1 className="text-3xl mt-10 p-3 font-poppins text-center max-w-2xl mx-auto lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
                            {cleanTitle(postFromSlug.title)}
                        </h1>
                        <ButtonComponent
                            onClick={() => navigate(`/search?category=${postFromSlug?.category}`)}
                            color={'gray'}
                            pill
                            className="self-center mt-5"
                        >
                            {postFromSlug?.category}
                        </ButtonComponent>
                        <img
                            src={postFromSlug?.image}
                            alt={postFromSlug?.userName}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between p-3 border-b border-slate-500 w-full max-w-2xl text-xs">
                            <span>{formatDateToICT(postFromSlug?.createdAt)}</span>
                            <span className="italic">{minsRead(postFromSlug?.content)} Thời gian đọc</span>
                        </div>
                        <div
                            className="p-3 max-w-2xl mx-auto w-full post-content"
                            dangerouslySetInnerHTML={{ __html: postFromSlug?.content }}
                        ></div>
                        <div className="max-w-4xl mx-auto w-full">
                            <CallToAction />
                        </div>
                        <CommentSectionComponent postId={postFromSlug?._id} />
                        {isLoadingGetPostLimit ? (
                            <LoadingComponent isLoading={isLoadingGetPostLimit}>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải bài viết gần nhất...</p>
                            </LoadingComponent>
                        ) : errorGetPostLimit ? (
                            <div className="flex justify-center items-center h-full">
                                <p className="text-red-500">
                                    Đã xảy ra lỗi: {errorGetPostLimit.message || 'Vui lòng thử lại sau.'}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center mb-5">
                                <h1 className="text-xl mt-5">Recent articles</h1>
                                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                                    {recentPosts &&
                                        recentPosts.map((post) => <PostCardComponent key={post._id} post={post} />)}
                                </div>
                            </div>
                        )}
                    </main>

                    {successPostSlug && (
                        <Alert className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-500 dark:border-green-300 text-green-700 dark:text-green-200 rounded">
                            {successPostSlug}
                        </Alert>
                    )}

                    {errorPostSlug && (
                        <Alert className="mt-5 p-3 bg-red-100 dark:bg-red-900 border border-red-500 dark:border-red-300 text-red-700 dark:text-red-200 rounded">
                            {errorPostSlug}
                        </Alert>
                    )}
                </div>
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Không tìm thấy bài viết.</p>
                </div>
            )}
        </div>
    );
};

export default PostPage;

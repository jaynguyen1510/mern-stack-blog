import useGetPostSlug from '../Hooks/useGetPostSlug';
import LoadingComponent from '../components/LoadingComponent/LoadingComponent';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'flowbite-react';
import { cleanTitle } from '../../utils';
import CallToAction from '../components/CallToAction/CallToAction';

const PostPage = () => {
    const { postSlug } = useParams();
    const navigate = useNavigate();
    const { isLoadingGetPostSlug, errorGetPostSlug, postFromSlug, errorPostSlug, successPostSlug } =
        useGetPostSlug(postSlug);

    useEffect(() => {
        console.log('postPage', postFromSlug);
    }, [postFromSlug]);

    // định dạng ngày giờ
    const formatDateToICT = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        // const time = date.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        return `Ngày tạo ${formattedDate} `;
    };
    // tính toán thời gian đọc
    const minsRead = (timeRead) => {
        if (timeRead && typeof timeRead === 'string' && timeRead.length > 0) {
            const readMinutes = (timeRead.length / 1000).toFixed(0);
            return readMinutes;
        }
        return 0; // hoặc một giá trị mặc định khác
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
                    <main className="p-3  flex flex-col max-w-6xl mx-auto min-h-screen">
                        <h1 className="text-3xl mt-10 p-3 font-poppins text-center max-w-2xl mx-auto lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
                            {postFromSlug && cleanTitle(postFromSlug.title)}
                        </h1>
                        <ButtonComponent
                            onClick={() => navigate(`/search?category=${postFromSlug && postFromSlug?.category}`)}
                            color={'gray'}
                            pill
                            className="self-center mt-5"
                        >
                            {postFromSlug && postFromSlug?.category}
                        </ButtonComponent>
                        <img
                            src={postFromSlug && postFromSlug?.image}
                            alt={postFromSlug && postFromSlug?.image}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />
                        <div className="flex justify-between p-3 border-b border-slate-500 w-full max-w-2xl text-xs">
                            <span>{postFromSlug && formatDateToICT(postFromSlug?.createdAt)}</span>
                            <span className="italic">
                                {postFromSlug && minsRead(postFromSlug?.content)} Thời gian đọc
                            </span>
                        </div>
                        <div
                            className="p-3 max-w-2xl mx-auto w-full post-content"
                            dangerouslySetInnerHTML={{ __html: postFromSlug && postFromSlug?.content }}
                        ></div>
                        <div className="max-w-4xl mx-auto w-full">
                            <CallToAction />
                        </div>
                    </main>
                    {/* Hiển thị thông báo thành công */}
                    {successPostSlug && (
                        <Alert className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-500 dark:border-green-300 text-green-700 dark:text-green-200 rounded">
                            {successPostSlug}
                        </Alert>
                    )}

                    {/* Hiển thị thông báo lỗi */}
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

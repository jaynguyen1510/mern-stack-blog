import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Alert, Modal, Table } from 'flowbite-react';
import { categoryChange, formatDateToICT } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import useGetAllPost from '../../Hooks/useGetAllPost';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import useDeleted from '../../Hooks/useDeleted';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const DashPostComponent = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isAdminTrue, setIsAdminTrue] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null); // Thêm trạng thái để lưu ID bài viết cần xóa
    const [loadMorePost, setLoadMorePost] = useState(false);
    const [loadRemovePost, setLoadRemovePost] = useState(false);

    const { isLoading, error, userPosts, showMore, getMorePost, setUserPosts } = useGetAllPost(isAdminTrue);

    const { deletePost, errorDeleted, successDeleted } = useDeleted();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.isAdmin === true) {
            setIsAdminTrue(currentUser?._id); // Chỉ gọi API khi là admin
        }
    }, [currentUser]);

    const handleLoadMore = async () => {
        setLoadMorePost(true);
        const startIndex = userPosts?.length; // Lấy số lượng bài viết hiện tại

        try {
            await getMorePost(isAdminTrue, startIndex);

            setLoadMorePost(false);
        } catch (error) {
            console.error(error.message);
        }
    };
    // Cập nhật danh sách bài viết sau khi xóa thành công
    const updateNewPostFromRemove = () => {
        setLoadRemovePost(false);
        setShowDeleteModal(false); // Đóng modal
        setUserPosts(userPosts.filter((post) => post._id !== postIdToDelete));
    };

    const handleRemovePost = async () => {
        setLoadRemovePost(true);
        try {
            if (!isAdminTrue || !postIdToDelete) {
                return;
            }
            await deletePost(isAdminTrue, postIdToDelete); // Truyền đúng userId và postId
            // Cập nhật danh sách bài viết sau khi xóa thành công
            updateNewPostFromRemove();
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="table-auto md:mx-auto p-3 min-h-[500px]">
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-full">
                    <LoadingComponent isLoading={isLoading} />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Vui lòng chờ...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-500">Đã xảy ra lỗi: {error.message || 'Vui lòng thử lại sau.'}</p>
                </div>
            ) : currentUser?.isAdmin === true && userPosts?.length > 0 ? (
                <>
                    {/* Wrapper cho bảng với scrollbar riêng */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
                        <Table hoverable className="shadow-md w-full">
                            <Table.Head className="bg-gray-100 dark:bg-gray-700">
                                <Table.HeadCell>Ngày tạo bài viết</Table.HeadCell>
                                <Table.HeadCell>Ảnh bài viết</Table.HeadCell>
                                <Table.HeadCell>Tiêu đề bài viết</Table.HeadCell>
                                <Table.HeadCell>Chủ đề</Table.HeadCell>
                                <Table.HeadCell>Xóa bài viết</Table.HeadCell>
                                <Table.HeadCell>Chỉnh sửa</Table.HeadCell>
                            </Table.Head>
                            {userPosts?.map((post) => (
                                <Table.Body key={post?._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Table.Cell>{formatDateToICT(post?.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            {post?.image ? (
                                                <img
                                                    src={post?.image}
                                                    alt={post?.title}
                                                    className="w-20 h-10 object-cover bg-gray-500 cursor-pointer rounded"
                                                    onClick={() => navigate(`/post/${post?.slug}`)}
                                                />
                                            ) : (
                                                <p className="truncate max-w-xs">Bài viết này không có ảnh</p>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell
                                            className="font-medium text-gray-900 dark:text-white cursor-pointer truncate max-w-xs"
                                            onClick={() => navigate(`/post/${post?.slug}`)}
                                        >
                                            {post?.title}
                                        </Table.Cell>
                                        <Table.Cell>{categoryChange(post?.category)}</Table.Cell>
                                        <Table.Cell className="font-medium text-red-500 hover:underline cursor-pointer">
                                            <span
                                                onClick={() => {
                                                    setShowDeleteModal(true);
                                                    setPostIdToDelete(post._id); // Lưu ID bài viết cần xóa
                                                }}
                                            >
                                                Xóa
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-teal-500 hover:underline cursor-pointer">
                                            <span onClick={() => navigate(`/update_post/${post?._id}`)}>Chỉnh sửa</span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                    </div>
                    {/* Modal xác nhận xóa */}
                    <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
                        <Modal.Header />
                        <Modal.Body className="p-6 text-center">
                            {loadRemovePost ? (
                                <LoadingComponent isLoading={loadRemovePost}>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">Đang xóa bài viết...</p>
                                </LoadingComponent>
                            ) : (
                                <div>
                                    <ExclamationCircleIcon className="h-14 w-14 text-red-500 mb-4 mx-auto" />
                                    <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                        Bạn có chắc là muốn xóa bài viết này không?
                                    </h3>
                                    <div className="flex justify-between gap-4 mt-6">
                                        <ButtonComponent
                                            color="bg-gray-400"
                                            className="bg-gray-400 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-600"
                                            onClick={handleRemovePost}
                                        >
                                            Tôi muốn Hủy
                                        </ButtonComponent>
                                        <ButtonComponent
                                            color="failure"
                                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-red-600"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Không muốn hủy
                                        </ButtonComponent>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                    </Modal>
                    {/* Hiển thị thông báo thành công */}
                    {successDeleted && (
                        <Alert className="mt-4 p-3 bg-green-100 border border-green-500 text-green-700 rounded">
                            {successDeleted}
                        </Alert>
                    )}
                    {/* Hiển thị thông báo lỗi */}
                    {errorDeleted && (
                        <Alert className="mt-5 p-3 bg-red-100 border border-red-500 text-red-700 rounded">
                            {errorDeleted}
                        </Alert>
                    )}
                    {/* Nút Show More luôn cố định */}
                    {showMore && (
                        <div className="mt-4">
                            <ButtonComponent
                                onClick={handleLoadMore}
                                className="w-full text-teal-500 dark:text-teal-300 self-center text-sm py-4 px-6 rounded-lg bg-teal-50 dark:bg-teal-800 hover:bg-teal-100 dark:hover:bg-teal-700 active:bg-teal-200 dark:active:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-500 transition-all duration-300 ease-in-out shadow-md dark:shadow-none"
                            >
                                {loadMorePost ? ( // Kiểm tra trạng thái loading
                                    <LoadingComponent isLoading={true} /> // Hiển thị component loading
                                ) : (
                                    'Show more' // Nội dung bình thường
                                )}
                            </ButtonComponent>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-600 dark:text-gray-400">Không có bài viết nào hết hehe</p>
                </div>
            )}
        </div>
    );
};

export default DashPostComponent;

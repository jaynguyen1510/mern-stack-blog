import useGetAllPost from '../../Hooks/useGetAllPost';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import { categoryChange, formatDateToICT } from '../../../utils';
import { useNavigate } from 'react-router-dom';

const DashPostComponent = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isAdminTrue, setIsAdminTrue] = useState(null);
    const { isLoading, error, dataPost } = useGetAllPost(isAdminTrue);
    const dataGetAllPost = dataPost?.data;

    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser?.isAdmin === true) {
            setIsAdminTrue(currentUser?._id); // Chỉ gọi API khi là admin
        }
    }, [currentUser]);

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <LoadingComponent isLoading={isLoading}>Vui lòng chờ...</LoadingComponent>
                </div>
            ) : currentUser?.isAdmin === true && dataGetAllPost?.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Ngày tạo bài viết</Table.HeadCell>
                            <Table.HeadCell>Ảnh bài viết</Table.HeadCell>
                            <Table.HeadCell>Tiêu đề bài viết</Table.HeadCell>
                            <Table.HeadCell>Chủ đề</Table.HeadCell>
                            <Table.HeadCell>Xóa bài viết</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Chỉnh sửa</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {dataGetAllPost?.map((post) => {
                            return (
                                <Table.Body key={post?._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>{formatDateToICT(post?.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            {post?.image ? (
                                                <img
                                                    src={post?.image}
                                                    alt={post?.title}
                                                    className="w-20 h-10 object-cover bg-gray-500 "
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
                                            <span>Xóa </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-teal-500  hover:underline cursor-pointer">
                                            <span onClick={() => navigate(`/update_post/${post?._id}`)}>Chỉnh sửa</span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            );
                        })}
                    </Table>
                </>
            ) : (
                <p>Không có bài viết nào hết hehe</p>
            )}
        </div>
    );
};

export default DashPostComponent;

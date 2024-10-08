import useGetAllUser from '../../Hooks/useGetAllUser';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Modal, Table } from 'flowbite-react';
import { formatDateToICT } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FaCheck, FaTimes } from 'react-icons/fa';

const DashAllUserProfileComponent = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isAdminTrue, setIsAdminTrue] = useState(null);
    const [loadMoreNewUser, setLoadMoreNewUser] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();

    // Chỉ gọi useGetAllUser khi isAdminTrue có giá trị
    const { errorGetAllUsers, getUser, isLoading, error, showMore, getMoreUser } = useGetAllUser(isAdminTrue);

    useEffect(() => {
        if (currentUser?.isAdmin === true) {
            setIsAdminTrue(currentUser?._id); // Chỉ gọi API khi là admin
        }
    }, [currentUser]);

    useEffect(() => {
        console.log('User', getUser);
    }, [getUser]); // Log mỗi khi getUser thay đổi

    const handleLoadMore = async () => {
        setLoadMoreNewUser(true); // Bắt đầu loading

        const startIndex = getUser?.length; // Lấy số lượng người dùng hiện tại
        try {
            await getMoreUser(startIndex); // Gọi hàm getMoreUser
            setLoadMoreNewUser(false); // Kết thúc loading sau khi dữ liệu đã load xong
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
            ) : currentUser?.isAdmin === true && getUser?.length > 0 ? (
                <>
                    {/* Wrapper cho bảng với scrollbar riêng */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
                        <Table hoverable className="shadow-md w-full">
                            <Table.Head className="bg-gray-100 dark:bg-gray-700">
                                <Table.HeadCell>Ngày tạo tài khoản</Table.HeadCell>
                                <Table.HeadCell>Ảnh </Table.HeadCell>
                                <Table.HeadCell>Tên </Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Xóa tài khoản</Table.HeadCell>
                                <Table.HeadCell>Chỉnh sửa </Table.HeadCell>
                            </Table.Head>
                            {getUser?.map((newUser) => (
                                <Table.Body key={newUser?._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <Table.Cell>{formatDateToICT(newUser?.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            {newUser?.avatar ? (
                                                <img
                                                    src={newUser?.avatar}
                                                    alt={newUser?.userName}
                                                    className="w-10 h-10 object-cover bg-gray-500 cursor-pointer rounded-full"
                                                    onClick={() => navigate(`/newUser/${newUser?.slug}`)}
                                                />
                                            ) : (
                                                <p className="truncate max-w-xs">Tài khoản này không có ảnh</p>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell
                                            className="font-medium text-gray-900 dark:text-white cursor-pointer truncate max-w-xs"
                                            onClick={() => navigate(`/newUser/${newUser?.slug}`)}
                                        >
                                            {newUser?.userName}
                                        </Table.Cell>
                                        <Table.Cell className="flex justify-center items-center">
                                            {newUser?.isAdmin ? (
                                                <FaCheck className="text-green-500" style={{ marginTop: '15px' }} />
                                            ) : (
                                                <FaTimes className="text-red-500" style={{ marginTop: '15px' }} />
                                            )}
                                        </Table.Cell>

                                        <Table.Cell className="font-medium text-red-500 hover:underline cursor-pointer">
                                            <span
                                                onClick={() => {
                                                    setShowDeleteModal(true);
                                                    // setNewUserIdToDelete(newUser._id); // Lưu ID tài khỏa cần xóa
                                                }}
                                            >
                                                Xóa
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-teal-500 hover:underline cursor-pointer">
                                            <span onClick={() => navigate(`/update_newUser/${newUser?._id}`)}>
                                                Chỉnh sửa
                                            </span>
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
                            {/* {loadRemoveNewUser ? (
                                 <LoadingComponent isLoading={loadRemoveNewUser}>
                                     <p className="mt-2 text-gray-600 dark:text-gray-400">Đang xóa tài khỏa...</p>
                                 </LoadingComponent>
                             ) : ( */}
                            <div>
                                <ExclamationCircleIcon className="h-14 w-14 text-red-500 mb-4 mx-auto" />
                                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                    Bạn có chắc là muốn xóa tài khỏa này không?
                                </h3>
                                <div className="flex justify-between gap-4 mt-6">
                                    <ButtonComponent
                                        color="bg-gray-400"
                                        className="bg-gray-400 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-600"
                                        //  onClick={handleRemoveNewUser}
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
                            {/* )} */}
                        </Modal.Body>
                    </Modal>
                    {/* Hiển thị thông báo thành công */}
                    {/* {successDeleted && (
                         <Alert className="mt-4 p-3 bg-green-100 border border-green-500 text-green-700 rounded">
                             {successDeleted}
                         </Alert>
                     )} */}
                    {/* Hiển thị thông báo lỗi */}
                    {errorGetAllUsers && (
                        <Alert className="mt-5 p-3 bg-red-100 border border-red-500 text-red-700 rounded">
                            {errorGetAllUsers}
                        </Alert>
                    )}
                    {/* Nút Show More luôn cố định */}
                    {showMore && (
                        <div className="mt-4">
                            <ButtonComponent
                                onClick={handleLoadMore}
                                className="w-full text-teal-500 dark:text-teal-300 self-center text-sm py-4 px-6 rounded-lg bg-teal-50 dark:bg-teal-800 hover:bg-teal-100 dark:hover:bg-teal-700 active:bg-teal-200 dark:active:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 dark:focus:ring-teal-500 transition-all duration-300 ease-in-out shadow-md dark:shadow-none"
                            >
                                {loadMoreNewUser ? ( // Kiểm tra trạng thái loading
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
                    <p className="text-gray-600 dark:text-gray-400">Không có tài khoản nào hết hehe</p>
                </div>
            )}
        </div>
    );
};

export default DashAllUserProfileComponent;

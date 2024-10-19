import PropTypes from 'prop-types';
import moment from 'moment/moment';
import useGetUserById from '../../Hooks/useGetUserById';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const GetCommentComponent = ({ comment, onLike }) => {
    const { currentUser } = useSelector((state) => state.user);
    // Gọi hook để lấy thông tin người dùng
    const userId = comment.userId;
    const { userIdData, errorUserId, isLoadingUserById } = useGetUserById(userId);
    const [getDataUserComments, setGetDataUserComments] = useState(userIdData);

    // Lấy thông tin người dùng theo id và lưu vào state nếu có dữ liệu
    useEffect(() => {
        if (userIdData) {
            setGetDataUserComments({
                avatar: userIdData.avatar || '',
                createdAt: userIdData.createdAt || '',
                email: userIdData.email || '',
                updatedAt: userIdData.updatedAt || '',
                isAdmin: userIdData.isAdmin || false,
                userName: userIdData.userName || 'ẩn danh',
                _id: userIdData._id || '',
            });
        }
    }, [userIdData, setGetDataUserComments]);

    // Hàm để xử lý thời gian bằng moment
    const handleMoment = (dataCreated) => {
        return dataCreated ? moment(dataCreated).fromNow() : 'Thời gian không xác định';
    };

    return (
        <div className="flex p-3 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ease-in-out">
            {isLoadingUserById ? (
                <p className="text-gray-500">Loading...</p>
            ) : errorUserId ? (
                <p className="text-red-500">{errorUserId}</p>
            ) : (
                <>
                    <div className="flex-shrink-0">
                        <img
                            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
                            src={getDataUserComments?.avatar || 'default-avatar-url'}
                            alt={getDataUserComments?.userName || 'ẩn danh'}
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <div className="flex items-center mb-1">
                            <span className="font-semibold text-sm truncate text-gray-800 dark:text-gray-200">
                                {getDataUserComments ? `@${getDataUserComments.userName}` : 'ẩn danh'}
                            </span>
                            <span className="text-gray-500 text-xs ml-2 dark:text-gray-400">
                                {handleMoment(comment.createdAt)}
                            </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-300 text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center gap-2 text-sm">
                            <button
                                onClick={() => onLike(comment?._id)}
                                className={`flex items-center transition duration-200 ease-in-out ${currentUser && comment?.likes.includes(currentUser._id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                            >
                                {/* Icon thích */}
                                <span className="mr-1 text-xl">
                                    {currentUser && comment?.likes.includes(currentUser._id) ? '❤️' : '🤍'}
                                </span>
                            </button>

                            <p className="text-gray-600 text-xs">
                                {comment?.numberOfLikes > 0 &&
                                    (currentUser && comment?.likes.includes(currentUser._id)
                                        ? comment?.numberOfLikes === 1
                                            ? 'Bạn đã thích bình luận này'
                                            : `Bạn và ${comment?.numberOfLikes - 1} người khác đã thích bình luận này`
                                        : `${comment?.numberOfLikes} người đã thích bình luận này`)}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Xác thực kiểu dữ liệu cho props
GetCommentComponent.propTypes = {
    comment: PropTypes.object.isRequired,
    onLike: PropTypes.func.isRequired,
};

export default GetCommentComponent;

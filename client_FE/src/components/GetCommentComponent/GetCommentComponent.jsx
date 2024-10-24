import PropTypes from 'prop-types';
import moment from 'moment/moment';
import useGetUserById from '../../Hooks/useGetUserById';
import { Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import useEditComment from '../../Hooks/useEditComment';

const GetCommentComponent = ({ comment, onLike, onEdit, onDeleted }) => {
    const { currentUser } = useSelector((state) => state.user);
    // Gọi hook để lấy thông tin người dùng
    const userId = comment.userId;
    const { userIdData, errorUserId, isLoadingUserById } = useGetUserById(userId);
    const [isEditComment, setIsEditComment] = useState(false);
    const [editedContent, setEditedContent] = useState(comment?.content);
    const { editComment, isLoadingEditComment, isErrorEditComment } = useEditComment();

    // Hàm để xử lý thời gian bằng moment
    const handleMoment = (dataCreated) => {
        return dataCreated ? moment(dataCreated).fromNow() : 'Thời gian không xác định';
    };

    const handleEditComment = () => {
        setIsEditComment(true);
        setEditedContent(comment?.content);
    };

    const handleSaveNewContent = async () => {
        try {
            // const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         content: editedContent,
            //     }),
            // });
            // if (res.ok) {
            //     setIsEditComment(false);
            //     onEdit(comment, editedContent);
            // }
            const newDataComment = await editComment(comment._id, { content: editedContent });
            if (newDataComment) {
                setIsEditComment(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error.message);
        }
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
                            src={userIdData?.avatar || 'default-avatar-url'}
                            alt={userIdData?.userName || 'ẩn danh'}
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <div className="flex items-center mb-1">
                            <span className="font-semibold text-sm truncate text-gray-800 dark:text-gray-200">
                                {userIdData ? `@${userIdData.userName}` : 'ẩn danh'}
                            </span>
                            <span className="text-gray-500 text-xs ml-2 dark:text-gray-400">
                                {handleMoment(comment.createdAt)}
                            </span>
                        </div>
                        {isEditComment ? (
                            <>
                                <Textarea
                                    className="mb-2"
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                                {isErrorEditComment && (
                                    <p className="text-red-500 text-xs mb-2">Có lỗi xảy ra khi chỉnh sửa bình luận!</p>
                                )}
                                <div className="flex justify-end gap-2 text-xs">
                                    <ButtonComponent
                                        onClick={handleSaveNewContent}
                                        type={'button'}
                                        size={'sm'}
                                        gradientDuoTone={'purpleToBlue'}
                                        disabled={isLoadingEditComment} // Disable button while loading
                                    >
                                        {isLoadingEditComment ? 'Đang thay đổi...' : 'Lưu'}
                                    </ButtonComponent>
                                    <ButtonComponent
                                        type={'button'}
                                        size={'sm'}
                                        gradientDuoTone={'purpleToBlue'}
                                        outline
                                        onClick={() => setIsEditComment(false)}
                                    >
                                        Hủy
                                    </ButtonComponent>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-800 dark:text-gray-300 text-sm mb-2">{comment?.content}</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <button
                                        onClick={() => onLike(comment?._id)}
                                        className={`flex items-center transition duration-200 ease-in-out ${
                                            currentUser && comment?.likes?.includes(currentUser._id) // Adding optional chaining here
                                                ? 'text-red-600'
                                                : 'text-gray-500 hover:text-red-600'
                                        }`}
                                    >
                                        <span className="mr-1 text-xl">
                                            {currentUser && comment?.likes?.includes(currentUser._id) // Adding optional chaining here
                                                ? '❤️'
                                                : '🤍'}
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
                                    {currentUser && (currentUser?._id === comment?.userId || currentUser?.isAdmin) && (
                                        <>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-blue-500"
                                                onClick={handleEditComment}
                                            >
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-red-500"
                                                onClick={() => onDeleted(comment._id)}
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
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
    onEdit: PropTypes.func.isRequired,
    onDeleted: PropTypes.func.isRequired,
};

export default GetCommentComponent;

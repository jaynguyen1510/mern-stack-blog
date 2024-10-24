import PropTypes from 'prop-types';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import useCreateComment from '../../Hooks/useCreateComment';
import useGetAllComment from '../../Hooks/useGetAllComment';
import GetCommentComponent from '../GetCommentComponent/GetCommentComponent';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import useLikeComment from '../../Hooks/useLikeComment';

import { Modal, Textarea, Toast } from 'flowbite-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icon
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import useDeletedComment from '../../Hooks/useDeletedComment';

const CommentSectionComponent = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const { createComment } = useCreateComment();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newIdDeleted, setNewIdDeleted] = useState(null);
    const [toastType, setToastType] = useState('success'); // 'success' or 'error'
    const toastTimeoutRef = useRef(null); // Reference to store timeout
    const { commentData, getCommentError, isLoading, error } = useGetAllComment(postId);
    const { putLikeComment, likeData, createError } = useLikeComment();
    const [localComments, setLocalComments] = useState([]); // Initialize as empty array
    const [likeCount, setLikeCount] = useState(likeData); // Initialize like count as 0
    const { deletedComment, errorDeleted } = useDeletedComment();

    useEffect(() => {
        // Update local comments when commentData changes
        if (Array.isArray(commentData)) {
            setLocalComments(commentData);
        } else {
            setLocalComments([]); // Fallback to an empty array if not valid
        }
    }, [commentData]);

    const handleOnChangeComments = (e) => {
        setComment(e.target.value);
    };

    const handleSubmitComments = async (e) => {
        e.preventDefault();
        const newCommentData = {
            postId: postId,
            userId: currentUser?._id,
            content: comment,
        };

        if (!comment) {
            setToastMessage('Vui lòng nhập nội dung bình luận.');
            setToastType('error');
            setShowToast(true);
            return; // Early return if comment is undefined
        }

        try {
            await createComment(newCommentData);
            setComment(''); // Reset comment after submission
            setLocalComments((prevComments) => [
                ...prevComments,
                { ...newCommentData, _id: Date.now().toString() }, // Add new comment to the list
            ]);
            setToastMessage('Bình luận của bạn đã được đăng thành công!');
            setToastType('success');
        } catch (error) {
            console.error('Error creating comment:', error);
            setToastMessage('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.');
            setToastType('error');
        } finally {
            setShowToast(true); // Show toast message

            // Automatically hide toast after 2 seconds
            toastTimeoutRef.current = setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
    };

    useEffect(() => {
        setLikeCount({
            content: likeData?.content,
            createdAt: likeData?.createdAt,
            likes: likeData?.likes,
            numberOfLikes: likeData?.numberOfLikes,
            postId: likeData?.postId,
            updatedAt: likeData?.updatedAt,
            userId: likeData?.userId,
            _id: likeData?._id,
        });
    }, [likeData]);

    useEffect(() => {
        if (likeCount && likeCount._id) {
            setLocalComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment._id === likeCount._id) {
                        return { ...comment, ...likeCount };
                    }
                    return comment;
                }),
            );
        }
    }, [likeCount]);

    const handleLike = useCallback(
        async (commentId) => {
            if (!commentId) {
                console.error('Invalid commentId:', commentId);
                return;
            }
            try {
                await putLikeComment(commentId);
            } catch (error) {
                console.error('Error putting like:', error);
                setToastMessage(error.message || 'Có lỗi xảy ra khi thích bình luận.');
                setToastType('error');
                setShowToast(true); // Show toast message
            }
        },
        [putLikeComment],
    ); // Chỉ tạo lại hàm nếu putLikeComment thay đổi

    const handleEdit = useCallback(
        async (comment, editedContent) => {
            setLocalComments(
                localComments.map(
                    (newComment) =>
                        newComment._id === comment._id
                            ? { ...newComment, content: editedContent } // Cập nhật bình luận nếu ID trùng khớp
                            : newComment, // Giữ nguyên bình luận nếu ID không trùng
                ),
            );
        },
        [localComments],
    ); // Phụ thuộc vào localComments

    // ngày mai set up lại hàm deleted comment
    const handleDeleted = useCallback(async () => {
        setShowModal(false);
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            // const res = await fetch(`/api/comment/delete-comment/${newIdDeleted}`, {
            //     method: 'DELETE',
            // });

            // if (!res.ok) {
            //     throw new Error('Delete comment failed');
            // }

            // await res.json();
            // Update localComments by filtering out the deleted comment

            await deletedComment(newIdDeleted);
            setLocalComments((prevComments) =>
                prevComments.filter((newCommentAfterRemove) => newCommentAfterRemove._id !== newIdDeleted),
            );
        } catch (error) {
            console.log('Error: ' + error);
        }
    }, [newIdDeleted, currentUser, navigate, setLocalComments, deletedComment]);

    // Cleanup function
    useEffect(() => {
        return () => {
            clearTimeout(toastTimeoutRef.current); // Clear timeout if component unmounts
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto w-full p-3">
            {showToast && (
                <Toast>
                    <div
                        className={`flex items-center p-4 rounded-md shadow-md ${
                            toastType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        <div className="mr-2">
                            {toastType === 'success' ? (
                                <FaCheckCircle className="h-5 w-5" />
                            ) : (
                                <FaExclamationCircle className="h-5 w-5" />
                            )}
                        </div>
                        <div className="ml-3 text-sm font-medium">{toastMessage}</div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-auto text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            Đóng
                        </button>
                    </div>
                </Toast>
            )}
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Bình luận bằng tài khoản: </p>
                    <img
                        src={currentUser?.avatar}
                        alt={currentUser?.userName}
                        className="h-5 w-5 object-cover rounded-full"
                    />
                    <span
                        className="cursor-pointer text-xs text-cyan-600 hover:underline"
                        onClick={() => navigate('/dashboard?tab=profile')}
                    >
                        @{currentUser?.userName}
                    </span>
                </div>
            ) : (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    Vui lòng Đăng nhập để có thể bình luận
                    <span className="cursor-pointer text-blue-500 hover:underline" onClick={() => navigate('/sign-in')}>
                        Đăng nhập
                    </span>
                </div>
            )}
            {currentUser && (
                <form className="border border-teal-500 rounded-md p-3" onSubmit={handleSubmitComments}>
                    <Textarea
                        placeholder="Viết suy nghĩ của bạn về bài viết..."
                        rows={'3'}
                        maxLength={'200'}
                        value={comment}
                        onChange={handleOnChangeComments}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500 text-xs">
                            {comment?.length >= 200
                                ? 'Bạn đã điền đủ ký tự cần thiết'
                                : `Tối đa ${200 - comment?.length} ký tự`}
                        </p>
                        <ButtonComponent outline gradientDuoTone={'purpleToBlue'} type={'submit'}>
                            Đăng
                        </ButtonComponent>
                    </div>
                </form>
            )}
            {isLoading ? (
                <LoadingComponent isLoading={isLoading} />
            ) : (
                <>
                    {localComments.length === 0 ? (
                        <p className="text-sm text-gray-500 my-5">Chưa có bình luận nào</p>
                    ) : (
                        <div className="text-sm my-5 flex items-center gap-1">
                            <p>Bình luận</p>
                            <div className="border border-gray-400 py-1 px-2 rounded-sm">
                                <p>{localComments.length}</p>
                            </div>
                        </div>
                    )}
                    {/* Display error message if any */}
                    {getCommentError ||
                        createError ||
                        (error && (
                            <p className="text-red-500">
                                Có lỗi xảy ra: {getCommentError.message || error || createError}
                            </p>
                        ))}
                    {localComments.map((comment) => (
                        <GetCommentComponent
                            key={comment?._id}
                            comment={comment}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDeleted={(commentId) => {
                                setShowModal(true);
                                setNewIdDeleted(commentId);
                            }}
                        />
                    ))}
                    {/* Modal xác nhận xóa */}
                    <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                        <Modal.Header />
                        <Modal.Body className="p-6 text-center">
                            <div>
                                <ExclamationCircleIcon className="h-14 w-14 text-red-500 mb-4 mx-auto" />
                                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                                    Bạn có chắc là muốn xóa bình luận này không?
                                </h3>
                                {errorDeleted && (
                                    <p className="text-red-500 text-sm mb-4">
                                        {errorDeleted} {/* Hiển thị thông báo lỗi */}
                                    </p>
                                )}
                                <div className="flex justify-between gap-4 mt-6">
                                    <ButtonComponent
                                        color="bg-gray-400"
                                        className="bg-gray-400 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-600"
                                        onClick={handleDeleted}
                                    >
                                        xác nhận
                                    </ButtonComponent>
                                    <ButtonComponent
                                        color="failure"
                                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-red-600"
                                        onClick={() => setShowModal(false)}
                                    >
                                        hủy
                                    </ButtonComponent>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    );
};

CommentSectionComponent.propTypes = {
    postId: PropTypes.string, // Id of the post
};

export default memo(CommentSectionComponent);

import PropTypes from 'prop-types';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import useCreateComment from '../../Hooks/useCreateComment';
import useGetAllComment from '../../Hooks/useGetAllComment';
import GetCommentComponent from '../GetCommentComponent/GetCommentComponent';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

import { Textarea, Toast } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icon

const CommentSectionComponent = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const { createComment } = useCreateComment();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // 'success' or 'error'
    const toastTimeoutRef = useRef(null); // Reference to store timeout
    const { commentData, getCommentError, isLoading, error } = useGetAllComment(postId);
    const [localComments, setLocalComments] = useState([]); // Initialize as empty array

    useEffect(() => {
        if (Array.isArray(commentData)) {
            setLocalComments(commentData); // Update only if commentData is an array
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

        try {
            await createComment(newCommentData);
            setComment(''); // Reset comment after submission
            // Update localComments to display the new comment immediately
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
                    <p>Bình luận bằng tài khoản : </p>
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
            <>
                {isLoading ? ( // Show LoadingComponent when loading
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
                            (error && (
                                <p className="text-red-500">Có lỗi xảy ra: {getCommentError.message || error}</p>
                            ))}
                        {localComments.map((comment) => (
                            <GetCommentComponent key={comment?._id} comment={comment} />
                        ))}
                    </>
                )}
            </>
        </div>
    );
};

CommentSectionComponent.propTypes = {
    postId: PropTypes.string, // Id of the post
};

export default CommentSectionComponent;

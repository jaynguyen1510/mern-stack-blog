import PropTypes from 'prop-types';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import useCreateComment from '../../Hooks/useCreateComment';
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
    const [toastType, setToastType] = useState('success'); // 'success' hoặc 'error'
    const toastTimeoutRef = useRef(null); // Tham chiếu để lưu timeout

    useEffect(() => {
        console.log('postId', postId);
    }, [postId]); // Chỉ chạy khi postId thay đổi

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
            setComment(''); // Reset comment sau khi gửi
            setToastMessage('Bình luận của bạn đã được đăng thành công!');
            setToastType('success');
        } catch (error) {
            console.error('Error creating comment:', error);
            setToastMessage('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.');
            setToastType('error');
        } finally {
            setShowToast(true); // Hiện thông báo

            // Tự động ẩn thông báo sau 2 giây
            toastTimeoutRef.current = setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
    };

    // Cleanup function
    useEffect(() => {
        return () => {
            clearTimeout(toastTimeoutRef.current); // Xóa timeout nếu component unmount
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
        </div>
    );
};

CommentSectionComponent.propTypes = {
    postId: PropTypes.string, // Id của bài viết
};

export default CommentSectionComponent;

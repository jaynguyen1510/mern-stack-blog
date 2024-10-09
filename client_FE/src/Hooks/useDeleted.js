import * as UserService from '../Service/UserService';
import * as PostService from '../Service/PostService';
import { useDispatch } from 'react-redux';
import { deleteError, deleteStart, resetError, resetMessage } from '../redux/Slice/userSlice';
import { useEffect, useRef, useState } from 'react';
import { useMutationCustomHook } from './useMutationCustom';

const useDeleted = () => {
    const [errorDeleted, setErrorDeleted] = useState(null);
    const [successDeleted, setSuccessDeleted] = useState(null);
    const dispatch = useDispatch();
    const timeIdRef = useRef(null);

    const mutateRemoveUser = useMutationCustomHook(async ({ id }) => {
        const response = await UserService.deletedUser(id);
        return response;
    });

    const muteRemovePost = useMutationCustomHook(async ({ userId, postId }) => {
        const response = await PostService.deletedPost(userId, postId);
        return response;
    });

    const deleteUser = async (id) => {
        dispatch(deleteStart());
        if (!id) {
            return setErrorDeleted('Không thể tìm thấy id tài khoản');
        }

        try {
            const dataRemoveUser = { id };

            const data = await mutateRemoveUser.mutateAsync(dataRemoveUser);

            if (data.status === 'ERR') {
                dispatch(deleteError(data));
                timeIdRef.current = setTimeout(() => {
                    dispatch(resetError());
                    dispatch(resetMessage());
                    setErrorDeleted(null); // Tắt thông báo sau 2 giây
                }, 2000);
            } else if (data.status === 'OK' && data.success === true) {
                dispatch(resetError());
                dispatch(resetMessage());
                setSuccessDeleted(data.message);
                // Tắt thông báo sau 2 giây
                timeIdRef.current = setTimeout(() => {
                    setSuccessDeleted(null);
                }, 2000);
            }
        } catch (error) {
            dispatch(deleteError(error.message));
        }
    };

    // Dọn dẹp timeout khi component unmount
    useEffect(() => {
        return () => {
            if (timeIdRef.current) {
                clearTimeout(timeIdRef.current);
            }
        };
    }, []);

    const deletePost = async (userId, postId) => {
        if (!userId || !postId) {
            return setErrorDeleted('Không thể tìm thấy thông tin userId hoặc postId');
        }

        try {
            const dataRemovePost = { userId, postId };
            const data = await muteRemovePost.mutateAsync(dataRemovePost);
            if (data.status === 'ERR') {
                setErrorDeleted(data.message);
                timeIdRef.current = setTimeout(() => {
                    setErrorDeleted(null); // Reset lỗi sau một thời gian
                }, 2000);
            } else if (data.status === 'OK' && data.success === true) {
                setSuccessDeleted(data.message);
                // Reset thông báo sau một thời gian
                timeIdRef.current = setTimeout(() => {
                    setSuccessDeleted(null); // Clear success message
                }, 2000);
            }
        } catch (error) {
            setErrorDeleted(error.message);
            timeIdRef.current = setTimeout(() => {
                setErrorDeleted(null); // Reset lỗi sau một thời gian
            }, 2000);
        }
    };

    // Dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            clearTimeout(timeIdRef.current); // Clear timer if it exists
        };
    }, []);
    return { deleteUser, deletePost, errorDeleted, successDeleted };
};

export default useDeleted;

import * as Postservice from '../Service/PostService';

import { useEffect, useRef, useState } from 'react';
import { useMutationCustomHook } from './useMutationCustom';
import { useNavigate } from 'react-router-dom';

const useUpdatePost = () => {
    const [isLoadingUpdatePost, setIsLoadingUpdatePost] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [errorUpdate, setErrorUpdate] = useState(null);

    const navigate = useNavigate();
    const timerIdRef = useRef(null); // Sử dụng useRef để lưu trữ timerId

    const mutateUpdatePost = useMutationCustomHook(async ({ postId, userId, data }) => {
        // Call API to update post

        const response = await Postservice.updatePost(postId, userId, data);
        return response; // Trả về dữ liệu từ response
    });
    const updatePost = async (postId, userId, data) => {
        setErrorUpdate(false);
        setIsLoadingUpdatePost(true);

        try {
            if (!postId && !userId) {
                return setErrorUpdate('Invalid post');
            }

            const dataUpdate = await mutateUpdatePost.mutateAsync({ postId, userId, data });
            if (dataUpdate?.success === false) {
                setErrorUpdate(dataUpdate.message);
                timerIdRef.current = setTimeout(() => {
                    setErrorUpdate(null); // reset error update
                }, 2000);
            } else if (dataUpdate?.success === true) {
                setUpdateSuccess(dataUpdate.message);
                timerIdRef.current = setTimeout(() => {
                    setUpdateSuccess(null); // reset update success message
                    navigate(`/post/${dataUpdate?.data?.slug}`); // Redirect to detail post page after update success
                }, 2000);
                setIsLoadingUpdatePost(false); // reset update success flag
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };
    // Dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            clearTimeout(timerIdRef.current); // Clear timer if it exists
        };
    }, []);

    return { updatePost, updateSuccess, errorUpdate, isLoadingUpdatePost };
};

export default useUpdatePost;

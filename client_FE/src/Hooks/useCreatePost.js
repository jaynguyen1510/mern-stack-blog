import * as PostService from '../Service/PostService';
import { useRef, useEffect, useState } from 'react';
import { useMutationCustomHook } from './useMutationCustom'; // Custom hook for mutation
import { useNavigate } from 'react-router-dom';

const useCreatePost = () => {
    const timerIdRef = useRef(null); // Sử dụng useRef để lưu trữ timerId
    const navigate = useNavigate();
    const [createSuccess, setCreateSuccess] = useState(null);
    const [createError, setCreateError] = useState(null);

    const mutationCreatePost = useMutationCustomHook(async (formData) => {
        return await PostService.createPost(formData);
    });

    const createPost = async (formData) => {
        if (!formData) return;
        try {
            setCreateError(null);
            const data = await mutationCreatePost.mutateAsync(formData);
            if (data?.status === 'ERR' && data?.success === false) {
                setCreateError(data?.message);
                throw new Error(data?.message || 'Đã có lỗi xảy ra');
            } else if (data?.status === 'OK' && data?.success === true) {
                setCreateError(null);
                setCreateSuccess(data?.message);
                timerIdRef.current = setTimeout(() => {
                    navigate(`/post/${data?.data?.slug}`);
                }, 2000); // Điều chỉnh thời gian delay nếu cần
            }
            return data;
        } catch (error) {
            console.error(error);
            setCreateError(error.message);
        }
    };

    // Dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            clearTimeout(timerIdRef.current); // Clear timer if it exists
        };
    }, []);

    return {
        createPost,
        isLoadingCreatePost: mutationCreatePost?.isPending,
        isSuccessCreatePost: mutationCreatePost?.isSuccess,
        createError,
        createSuccess,
    };
};

export default useCreatePost;

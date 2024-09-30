import * as PostService from '../Service/PostService';
import { useEffect, useRef, useState } from 'react';
import { useMutationCustomHook } from './useMutationCustom'; // Custom hook for mutation
import { useNavigate } from 'react-router-dom';
const useCreatePost = () => {
    const [createPostError, setCreatePostError] = useState(null);
    const [createPostSuccess, setCreatePostSuccess] = useState(null);
    const timerIdRef = useRef(null); // Sử dụng useRef để lưu trữ timerId
    const navigate = useNavigate();
    const mutationCreatePost = useMutationCustomHook(async (formData) => {
        return await PostService.createPost(formData);
    });

    const createPost = async (formData) => {
        if (!formData) return;
        try {
            setCreatePostError(null);
            setCreatePostSuccess(null);
            const data = await mutationCreatePost.mutateAsync(formData);
            if (data?.status === 'ERR' && data?.success === false) {
                setCreatePostError(data?.message);
            } else if (data?.status === 'OK' && data?.success === true) {
                setCreatePostSuccess(data?.message);
                timerIdRef.current = setTimeout(() => {
                    setCreatePostSuccess(null); // Reset success message
                    navigate(`/post/${data?.data?.slug}`);
                }, 2000); // Adjust the delay as needed
            }
            return data;
        } catch (error) {
            setCreatePostError('Failed to create post');
            console.error(error);
        }
    };

    // Dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            clearTimeout(timerIdRef.current); // Clear timer if it exists
        };
    }, []);

    return { createPost, createPostError, createPostSuccess };
};

export default useCreatePost;

import * as CommentService from '../Service/CommentService';

import { useState } from 'react';

import { useMutationCustomHook } from './useMutationCustom';
// import { useNavigate } from 'react-router-dom';

const useCreateComment = () => {
    // const timerIdRef = useRef(null); // Sử dụng useRef để lưu trữ timerId

    const [createSuccess, setCreateSuccess] = useState(null);
    const [createError, setCreateError] = useState(null);
    // const navigate = useNavigate();
    const mutationCreateComment = useMutationCustomHook(async (commentData) => {
        return await CommentService.createComment(commentData);
    });
    const createComment = async (commentData) => {
        if (!commentData) {
            return setCreateError('Lỗi xảy ra ko thể tạo');
        }
        try {
            setCreateError(null);
            const data = await mutationCreateComment.mutateAsync(commentData);
            if (data?.status === 'ERR' && data?.success === false) {
                setCreateError(data?.message);
                throw new Error(data?.message || 'Đã có lỗi xảy ra');
            } else if (data?.status === 'OK' && data?.success === true) {
                setCreateError(null);
                setCreateSuccess(data?.message);
                // timerIdRef.current = setTimeout(() => {
                //     navigate(`/post/${data?.data?.slug}`);
                // }, 2000); // Điều chỉnh thời gian delay nếu cần
            }
            return data;
        } catch (error) {
            console.error(error);
            setCreateError(error.message);
        }
    };
    // Dọn dẹp timer khi component unmount
    // useEffect(() => {
    //     return () => {
    //         clearTimeout(timerIdRef.current); // Clear timer if it exists
    //     };
    // }, []);

    return { createComment, createSuccess, createError };
};

export default useCreateComment;

import { useState } from 'react';
import * as CommentService from '../Service/CommentService';
import { useMutationCustomHook } from './useMutationCustom';

const useLikeComment = () => {
    const [createError, setCreateError] = useState(null);
    const [likeData, setLikeData] = useState({});

    const mutationLikeComment = useMutationCustomHook(async (commentId) => {
        const response = await CommentService.putLike(commentId);
        return response;
    });
    const putLikeComment = async (commentId) => {
        if (!commentId) {
            return setCreateError('lỗi xảy ra khi like');
        }
        try {
            setCreateError(null);
            const dataLikeComment = await mutationLikeComment.mutateAsync(commentId);
            if (dataLikeComment?.status === 'ERR' && dataLikeComment?.success === false) {
                setCreateError(dataLikeComment?.message);
                throw new Error(dataLikeComment?.message || 'Đã có lỗi xảy ra');
            } else if (dataLikeComment?.status === 'OK' && dataLikeComment?.success === true) {
                setLikeData(dataLikeComment?.data);
            }
        } catch (error) {
            console.error(error);
            setCreateError(error.message);
        }
    };
    return { putLikeComment, createError, likeData };
};

export default useLikeComment;

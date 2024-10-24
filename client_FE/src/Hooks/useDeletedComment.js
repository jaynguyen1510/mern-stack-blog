import { useState } from 'react';
import * as CommentService from '../Service/CommentService';
import { useMutationCustomHook } from './useMutationCustom';

const useDeletedComment = () => {
    const [errorDeleted, setErrorDeleted] = useState(null);
    const mutateDeleteComment = useMutationCustomHook(async (commentId) => {
        const response = await CommentService.deletedComment(commentId);
        return response;
    });

    const deletedComment = async (commentId) => {
        if (!commentId) {
            return setErrorDeleted('Lỗi vì commentId ', commentId);
        }
        try {
            const dataDeleted = await mutateDeleteComment.mutateAsync(commentId);
            if (dataDeleted?.status === 'ERR' && dataDeleted?.success === false) {
                setErrorDeleted(dataDeleted?.message);
                throw new Error(dataDeleted?.message || 'Đã xảy ra lỗi');
            } else if (dataDeleted?.status === 'OK' && dataDeleted?.success === true) {
                setErrorDeleted(null);
                return dataDeleted?.data; // Return the deleted comment data if success
            }
        } catch (error) {
            setErrorDeleted(error.message);
        }
    };
    return { deletedComment, errorDeleted };
};

export default useDeletedComment;

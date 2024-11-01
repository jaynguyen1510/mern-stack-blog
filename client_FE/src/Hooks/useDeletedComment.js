import { useState, useEffect } from 'react';
import * as CommentService from '../Service/CommentService';
import { useMutationCustomHook } from './useMutationCustom';

const useDeletedComment = () => {
    const [errorDeleted, setErrorDeleted] = useState(null);
    const [successDeleted, setSuccessDeleted] = useState(null);

    const mutateDeleteComment = useMutationCustomHook(async (commentId) => {
        const response = await CommentService.deletedComment(commentId);
        return response;
    });

    const deletedComment = async (commentId) => {
        setSuccessDeleted(null);
        setErrorDeleted(null);
        if (!commentId) {
            return setErrorDeleted(`Lỗi vì commentId ${commentId}`);
        }
        try {
            const dataDeleted = await mutateDeleteComment.mutateAsync(commentId);
            if (dataDeleted?.status === 'ERR' && dataDeleted?.success === false) {
                setErrorDeleted(dataDeleted?.message);
                throw new Error(dataDeleted?.message || 'Đã xảy ra lỗi');
            } else if (dataDeleted?.status === 'OK' && dataDeleted?.success === true) {
                setSuccessDeleted(dataDeleted?.message);
                return dataDeleted?.data; // Return the deleted comment data if success
            }
        } catch (error) {
            setErrorDeleted(error.message);
        }
    };

    // Auto-dismiss error or success messages after 2 seconds
    useEffect(() => {
        if (errorDeleted || successDeleted) {
            const timer = setTimeout(() => {
                setErrorDeleted(null);
                setSuccessDeleted(null);
            }, 2000);

            // Cleanup timeout if messages change before 2 seconds
            return () => clearTimeout(timer);
        }
    }, [errorDeleted, successDeleted]);

    return { deletedComment, errorDeleted, successDeleted };
};

export default useDeletedComment;

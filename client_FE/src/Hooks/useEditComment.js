import * as CommentService from '../Service/CommentService';
import { useMutationCustomHook } from './useMutationCustom';

const useEditComment = () => {
    const mutationEditComment = useMutationCustomHook(async ({ commentId, editedContent }) => {
        return await CommentService.editComment(commentId, editedContent);
    });

    const editComment = async (commentId, editedContent) => {
        if (!commentId || !editedContent) {
            throw new Error('Missing commentId or editedContent');
        }

        try {
            // Thay vì truyền trực tiếp editedContent, bạn có thể bao bọc nó trong một đối tượng
            const editCommentData = await mutationEditComment.mutateAsync({ commentId, editedContent });

            if (editCommentData?.status === 'ERR' && editCommentData.success === false) {
                throw new Error(editCommentData?.message);
            } else if (editCommentData?.status === 'OK' && editCommentData.success === true) {
                return editCommentData?.data;
            }
        } catch (error) {
            console.error(error);
        }
    };

    return {
        editComment,
        isLoadingEditComment: mutationEditComment?.isPending,
        isErrorEditComment: mutationEditComment?.error,
    };
};

export default useEditComment;

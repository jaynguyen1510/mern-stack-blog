import * as PostService from '../Service/PostService';
import { useQuery } from '@tanstack/react-query';

const useGetAllPost = (idFromData) => {
    const getAllPost = async () => {
        try {
            const response = await PostService.getAllPost(idFromData);
            if (response?.status === 'ERR' && response?.success === false) {
                return response?.message;
            } else if (response?.status === 'OK' && response?.success === true) {
                return response?.dataPost;
            }
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Sử dụng useQuery với object form
    const {
        isLoading,
        error,
        data: dataPost,
    } = useQuery({
        queryKey: ['getAllPost', idFromData], // Object form cho queryKey
        queryFn: getAllPost, // Object form cho queryFn
        enabled: !!idFromData, // Điều kiện fetch dữ liệu
    });
    console.log('Fetched data:', dataPost);

    return { isLoading, error, dataPost };
};

export default useGetAllPost;

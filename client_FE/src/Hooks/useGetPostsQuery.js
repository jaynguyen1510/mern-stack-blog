import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import * as PostService from '../Service/PostService';

const useGetPostsQuery = () => {
    const [dataGetPostsQuery, setDataGetPostsQuery] = useState({});

    const getPostsQuery = async (searchQuery) => {
        try {
            // Call API to get all post with forHomePage
            const response = await PostService.getPostsQuery(searchQuery);

            if (response?.status === 'ERR' && response?.success === false) {
                return response?.message;
            } else if (response?.status === 'OK' && response?.success === true) {
                setDataGetPostsQuery(response?.dataPost); // Gán dữ liệu về state
                return response?.dataPost; // Trả về dữ liệu bài post
            }

            return null; // Trả về null nếu không có kết quả phù hợp
        } catch (error) {
            console.error(error);
            throw error; // Ném lỗi để react-query quản lý lỗi
        }
    };

    // Use useQuery hook with `searchQuery` as a dependency in the query key
    const { isLoading: isLoadingGetPostsQuery, error: errorGetPostsQuery } = useQuery({
        queryKey: ['getPostsQuery'], // Include searchQuery in queryKey
        queryFn: getPostsQuery,
        enabled: typeof searchQuery === 'string', // Enable query only when searchQuery is a string
    });

    return { isLoadingGetPostsQuery, errorGetPostsQuery, dataGetPostsQuery, getPostsQuery };
};

export default useGetPostsQuery;

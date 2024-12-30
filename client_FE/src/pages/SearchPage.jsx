import { Select, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useGetPostsQuery from '../Hooks/useGetPostsQuery';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';
import PostCardComponent from '../components/PostCardComponent/PostCardComponent';

const SearchPage = () => {
    const { dataGetPostsQuery, getPostsQuery } = useGetPostsQuery();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });
    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState([]); // Mảng các bài viết hiển thị
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const fetchPosts = async (urlParams) => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        try {
            await getPostsQuery(searchQuery);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        if (dataGetPostsQuery?.data && dataGetPostsQuery?.data?.length > 0) {
            setPosts(dataGetPostsQuery?.data);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchParamFormUrl = urlParams.get('searchTerm');
        const sortUrlParams = urlParams.get('sort');
        const categoryUrlParams = urlParams.get('category');
        if (searchParamFormUrl || sortUrlParams || categoryUrlParams) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchParamFormUrl,
                sort: sortUrlParams,
                category: categoryUrlParams,
            });
        }

        fetchPosts(urlParams);
    }, [location.search]);

    useEffect(() => {
        if (dataGetPostsQuery?.data && dataGetPostsQuery?.data?.length > 0) {
            setPosts(dataGetPostsQuery?.data);
            const initialVisiblePosts = dataGetPostsQuery?.data.slice(0, 7); // Chỉ lấy 7 bài viết đầu tiên
            setVisiblePosts(initialVisiblePosts);
            setShowMore(dataGetPostsQuery?.data?.length > 7); // Hiển thị nút Show More nếu có hơn 7 bài viết
        } else {
            setPosts([]);
            setVisiblePosts([]);
            setShowMore(false);
        }
        setLoading(false);
    }, [dataGetPostsQuery]);

    const handleOnChanges = (e) => {
        if (e.target.id === 'searchTerm') {
            const searchTerm = e.target.value;
            setSidebarData({ ...sidebarData, searchTerm: searchTerm });
        }
        if (e.target.id === 'sort') {
            const sort = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: sort });
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSidebarData({ ...sidebarData, category: category });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = () => {
        setVisiblePosts(posts); // Hiển thị toàn bộ bài viết
        setShowMore(false); // Ẩn nút Show More
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term: </label>
                        <TextInput
                            placeholder="Search..."
                            id="searchTerm"
                            type="text"
                            value={sidebarData?.searchTerm}
                            onChange={handleOnChanges}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort: </label>
                        <Select id="sort" value={sidebarData?.sort || 'desc'} onChange={handleOnChanges}>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Category: </label>
                        <Select
                            id="category"
                            value={sidebarData?.category || 'uncategorized'}
                            onChange={handleOnChanges}
                        >
                            <option value="uncategorized">Uncategorized</option>
                            <option value="workout">Workout</option>
                            <option value="healthy">Healthy</option>
                            <option value="worry">Worry</option>
                        </Select>
                    </div>
                    <ButtonComponent type="submit" outline gradientDuoTone="purpleToPink">
                        Search
                    </ButtonComponent>
                </form>
            </div>
            <div className="w-full">
                <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Post Result: </h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {loading && (
                        <div className="flex justify-center items-center w-full">
                            <Spinner aria-label="Loading spinner" size="xl" color="purple" />
                        </div>
                    )}
                    {!loading && visiblePosts.length === 0 && <p className="text-xl text-gray-500">No post found.</p>}
                    {!loading && visiblePosts.map((post) => <PostCardComponent key={post._id} post={post} />)}
                    {showMore && (
                        <button className="text-teal-500 text-lg hover:underline p-7 w-full" onClick={handleShowMore}>
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

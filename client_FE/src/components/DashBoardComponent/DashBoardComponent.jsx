import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import useGetUserLimit from '../../Hooks/useGetUerLimit';
import useGetPostLimit from '../../Hooks/useGetPostLimit';
import useGetCommentLimit from '../../Hooks/useGetCommentLimit';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

const DashBoardComponent = () => {
    const { errorUserLimit, isLoadingUserLimit, dataUserLimit } = useGetUserLimit();
    const { isLoadingGetPostLimit, errorGetPostLimit, dataGetPostLimit } = useGetPostLimit();
    const { isLoadingGetCommentLimit, errorGetCommentLimit, dataGetCommentLimit } = useGetCommentLimit();

    const [users, setUser] = useState([]);
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);
    const [totalUser, setTotalUser] = useState(0);
    const [totalPost, setTotalPost] = useState(0);
    const [totalComment, setTotalComment] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser.isAdmin) {
            // Check if all necessary data objects are available before setting state
            if (dataUserLimit && dataUserLimit.data) {
                setUser(dataUserLimit.data);
                setTotalUser(dataUserLimit.totalUser);
                setLastMonthUsers(dataUserLimit.lastMontCreateUser);
            }

            if (dataGetPostLimit && dataGetPostLimit.data) {
                setPost(dataGetPostLimit.data);
                setTotalPost(dataGetPostLimit.totalPost);
                setLastMonthPosts(dataGetPostLimit.lastMonthPost);
            }

            if (dataGetCommentLimit && dataGetCommentLimit.data) {
                setComment(dataGetCommentLimit.data);
                setLastMonthComments(dataGetCommentLimit.lastMontCreateComment);
                setTotalComment(dataGetCommentLimit.totalComment);
            }
        }
    }, [currentUser, dataUserLimit, dataGetPostLimit, dataGetCommentLimit]);

    // Combine all loading states into one for the loading component
    const isLoading = isLoadingUserLimit || isLoadingGetPostLimit || isLoadingGetCommentLimit;

    // Hiển thị lỗi nếu có, thay vì hiển thị đối tượng lỗi
    const errorMessage =
        errorUserLimit?.message ||
        errorGetPostLimit?.message ||
        errorGetCommentLimit?.message ||
        'An unknown error occurred. Please try again later.';

    // Show the loading component if any data is still loading
    if (isLoading) {
        return <LoadingComponent isLoading={isLoading} />;
    }

    return (
        <div className="p-3 md:mx-auto">
            {/* Error message block */}
            {(errorUserLimit || errorGetPostLimit || errorGetCommentLimit) && (
                <div className="bg-red-500 text-white p-3 rounded-md mb-4">
                    <strong>Error:</strong> {errorMessage}
                </div>
            )}

            <div className="flex-wrap flex gap-4 justify-center">
                {/* Card 1: Total Users */}
                <div className="flex flex-col p-5 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md mb-6">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total users</h3>
                            <p className="text-2xl">{totalUser}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                            <div className="text-gray-500 p-2"> Last Month</div>
                        </span>
                    </div>
                </div>
                {/* Card 2: Total Posts */}
                <div className="flex flex-col p-5 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md mb-6">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total Post</h3>
                            <p className="text-2xl">{totalPost}</p>
                        </div>
                        <HiDocumentText className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                            <div className="text-gray-500 p-2"> Last Month</div>
                        </span>
                    </div>
                </div>
                {/* Card 3: Total Comments */}
                <div className="flex flex-col p-5 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md mb-6">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
                            <p className="text-2xl">{totalComment}</p>
                        </div>
                        <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                            <div className="text-gray-500 p-2"> Last Month</div>
                        </span>
                    </div>
                </div>
            </div>
            {/* Tables */}
            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                {/* Recent User Table */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent User</h1>
                        <ButtonComponent
                            outline
                            gradientDuoTone={'purpleToPink'}
                            onClick={() => navigate('/dashboard?tab=user')}
                        >
                            see all
                        </ButtonComponent>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>User name</Table.HeadCell>
                        </Table.Head>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <Table.Body key={user._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="user"
                                                    className="w-10 h-10 rounded-full bg-gray-500"
                                                />
                                            ) : (
                                                <span className="text-gray-500 italic">No image available</span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/profile/${user.userName}`}>{user.userName}</Link>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        ) : (
                            <Table.Body className="text-center">
                                <Table.Row>
                                    <Table.Cell colSpan={2} className="text-gray-500">
                                        No recent users available
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        )}
                    </Table>
                </div>
                {/* Recent Post Table */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Post</h1>
                        <ButtonComponent
                            outline
                            gradientDuoTone={'purpleToPink'}
                            onClick={() => navigate('/dashboard?tab=post')}
                        >
                            see all
                        </ButtonComponent>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Post category</Table.HeadCell>
                        </Table.Head>
                        {post && post.length > 0 ? (
                            post.map((posts) => (
                                <Table.Body key={posts._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            {posts.image ? (
                                                <img
                                                    src={posts.image}
                                                    alt="post"
                                                    className="w-10 h-10 rounded-lg bg-gray-500"
                                                />
                                            ) : (
                                                <span className="text-gray-500 italic">No image available</span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/post/${posts.slug}`}>{posts.title}</Link>
                                        </Table.Cell>
                                        <Table.Cell>{posts.category}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        ) : (
                            <Table.Body className="text-center">
                                <Table.Row>
                                    <Table.Cell colSpan={3} className="text-gray-500">
                                        No recent posts available
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        )}
                    </Table>
                </div>
                {/* Recent Comment Table */}
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Comment</h1>
                        <ButtonComponent
                            outline
                            gradientDuoTone={'purpleToPink'}
                            onClick={() => navigate('/dashboard?tab=comment')}
                        >
                            see all
                        </ButtonComponent>
                    </div>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Number of like</Table.HeadCell>
                        </Table.Head>
                        {comment && comment.length > 0 ? (
                            comment.map((com) => (
                                <Table.Body key={com._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>{com.content}</Table.Cell>
                                        <Table.Cell>{com.numberOfLikes}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        ) : (
                            <Table.Body className="text-center">
                                <Table.Row>
                                    <Table.Cell colSpan={2} className="text-gray-500">
                                        No recent comments available
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default DashBoardComponent;

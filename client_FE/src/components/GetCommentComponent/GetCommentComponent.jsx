import PropTypes from 'prop-types';
import moment from 'moment/moment';
import useGetUserById from '../../Hooks/useGetUserById';

const GetCommentComponent = ({ comment }) => {
    const userId = comment.userId;

    // Gọi hook để lấy thông tin người dùng
    const { userIdData, errorUserId, isLoadingUserById } = useGetUserById(userId);

    const handleMoment = (dataCreated) => {
        return moment(dataCreated).fromNow(); // Trả về thời gian từ hiện tại đến dataCreated
    };

    return (
        <div className="flex p-4 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ease-in-out">
            {isLoadingUserById ? (
                <p>Loading...</p> // Hiển thị trạng thái loading
            ) : errorUserId ? (
                <p className="text-red-500">{errorUserId}</p> // Hiển thị thông báo lỗi nếu có
            ) : (
                <>
                    <div className="flex-shrink-0">
                        <img
                            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
                            src={userIdData?.avatar}
                            alt={userIdData?.userName}
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <div className="flex items-center mb-1">
                            <span className="font-semibold text-sm truncate text-gray-800 dark:text-gray-200">
                                {userIdData ? `@${userIdData.userName}` : 'ẩn danh'}
                            </span>
                            <span className="text-gray-500 text-xs ml-2 dark:text-gray-400">
                                {handleMoment(comment.dataCreated)}
                            </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-300 text-sm">{comment.content}</p>
                    </div>
                </>
            )}
        </div>
    );
};

// Xác thực kiểu dữ liệu cho props
GetCommentComponent.propTypes = {
    comment: PropTypes.object.isRequired,
};

export default GetCommentComponent;

import { Alert, FileInput, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import InputComponent from '../components/InputComponent/InputComponent';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Sử dụng giao diện "snow"
import useUploadImage from '../Hooks/useUpLoadImage';
import CircularProgressbarComponent from '../components/CircularProgressbarComponent/CircularProgressbarComponent ';
import LoadingComponent from '../components/LoadingComponent/LoadingComponent';
import useGetPostId from '../Hooks/useGetPostId';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useUpdatePost from '../Hooks/useUpdatePost';

const UpdatePost = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { postId } = useParams();
    const {
        uploadImage,
        uploadProgress: imageUploadProgress,
        imageUrl,
        uploadError: imageUploadError,
        fromData,
    } = useUploadImage();
    const [isAdminTrue, setIsAdminTrue] = useState(null);
    const { userPostsId, isLoadingGetPostId, errorGetPostId } = useGetPostId(isAdminTrue, postId);
    const [fileImage, setFileImage] = useState(null);
    const [title, setTitle] = useState('');
    const [errorTitle, setErrorTitle] = useState(null);
    const [selectCategory, setSelectCategory] = useState('');
    const [content, setContent] = useState('');
    const [totalFromData, setTotalFromData] = useState({
        _id: '',
        title: '',
        category: '',
        content: '',
        image: '',
    });
    const { updatePost, updateSuccess, errorUpdate, isLoadingUpdatePost } = useUpdatePost();

    // Khởi tạo state cho title, selectCategory và content với giá trị từ userPostsId nếu có
    useEffect(() => {
        if (userPostsId) {
            setTitle(userPostsId?.title || ''); // Khởi tạo với giá trị rỗng nếu không có
            setSelectCategory(userPostsId?.category || ''); // Khởi tạo với giá trị rỗng nếu không có
            setContent(userPostsId?.content || ''); // Khởi tạo với giá trị rỗng nếu không có
        }
        setTotalFromData({
            _id: userPostsId?._id,
            title: userPostsId?.title || '',
            category: userPostsId?.category || '',
            content: userPostsId?.content || '',
            image: userPostsId?.image || '',
        });
    }, [userPostsId]);

    useEffect(() => {
        if (currentUser?.isAdmin === true) {
            setIsAdminTrue(currentUser?._id); // Chỉ gọi API khi là admin
        }
    }, [currentUser]);

    // Hàm xử lý tải hình ảnh
    const handleUploadImageFile = () => {
        if (fileImage) {
            uploadImage(fileImage);
            console.log('Uploading image...'); // Kiểm tra xem hàm có được gọi không
        }
    };

    const handleChangeLimitTitle = (e) => {
        const value = e.target.value;

        // Kiểm tra chiều dài và chỉ cập nhật nếu chiều dài từ 0 đến 70 ký tự
        if (value.length <= 70) {
            setTitle(value);
            // Kiểm tra chiều dài của tiêu đề để thiết lập thông báo lỗi phù hợp
            setTotalFromData((prev) => ({
                ...prev,
                title: value, // Cập nhật title trong totalFromData
            }));
            if (value.length < 50) {
                setErrorTitle('Tiêu đề phải ít nhất 50 ký tự và nhỏ hơn 70 ký tự.');
            } else {
                setErrorTitle(null); // Xóa thông báo lỗi nếu tiêu đề đủ điều kiện
            }
        } else {
            setErrorTitle('Tiêu đề vượt quá 70 ký tự.'); // Thông báo nếu vượt quá 70 ký tự
        }
    };
    const handleSelectCategory = (e) => {
        const category = e.target.value;
        setSelectCategory(category);
        setTotalFromData((prev) => ({
            ...prev,
            category, // Cập nhật category trong totalFromData
        }));
    };
    const handleContentChange = (content) => {
        setContent(content);
        setTotalFromData((prev) => ({
            ...prev,
            content, // Cập nhật content trong totalFromData
        }));
    };
    // Hàm xử lý khi tải ảnh thành công
    useEffect(() => {
        if (imageUrl) {
            setTotalFromData((prev) => ({
                ...prev,
                image: imageUrl, // Cập nhật image trong totalFromData với URL mới
            }));
        }
    }, [imageUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorTitle(null);
        try {
            await updatePost(postId, isAdminTrue, totalFromData);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen flex flex-col">
            <h1 className="text-center text-3xl my-4 font-semibold">Cập nhật bài viết</h1>
            {isLoadingGetPostId ? (
                <LoadingComponent isLoading={isLoadingGetPostId}>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải bài viết để cập nhật...</p>
                </LoadingComponent>
            ) : errorGetPostId ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-500">Đã xảy ra lỗi: {errorGetPostId.message || 'Vui lòng thử lại sau.'}</p>
                </div>
            ) : currentUser?.isAdmin === true && userPostsId ? (
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 sm:flex-row justify-between">
                        <InputComponent
                            type="text"
                            placeholder="Tiêu đề"
                            required
                            id="title"
                            className="flex-1"
                            maxLength={71} // Giới hạn tối đa 70 ký tự
                            onChange={handleChangeLimitTitle}
                            value={title} // Truy cập trực tiếp vào thuộc tính title
                        />

                        <Select
                            id="category-select"
                            className="flex-1"
                            onChange={handleSelectCategory}
                            value={selectCategory}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            <option value={'healthy'}>Ăn uống</option>
                            <option value={'workout'}>Tập luyện</option>
                            <option value={'worry'}>Lo lắng</option>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-4 border-4 border-teal-500 border-dotted p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                            <FileInput
                                id="file-input"
                                type="file"
                                accept="image/*"
                                className="flex-1"
                                onChange={(e) => setFileImage(e.target.files[0])}
                            />
                            <ButtonComponent
                                type={'button'}
                                gradientDuoTone={'purpleToBlue'}
                                size="sm"
                                outline
                                onClick={handleUploadImageFile}
                                disabled={!fileImage || !!imageUploadProgress} // Disable if no file selected or uploading
                            >
                                {imageUploadProgress ? (
                                    <div className="w-16 h-16">
                                        <CircularProgressbarComponent
                                            value={Number(imageUploadProgress)}
                                            text={`Tải lên: ${imageUploadProgress || 0}%`}
                                        />
                                    </div>
                                ) : (
                                    'Tải ảnh lên'
                                )}
                            </ButtonComponent>
                        </div>
                        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                        {imageUrl && <Alert className="text-green-500">Hình ảnh đã tải lên thành công</Alert>}
                        {/* Chọn hiển thị hình ảnh đã tải lên hoặc hình ảnh từ userPostsId */}
                        {fromData?.avatar && !imageUploadProgress ? (
                            <img src={fromData?.avatar} alt="Uploaded" className="w-full h-72 object-cover" />
                        ) : userPostsId?.image && !fileImage ? (
                            <img src={userPostsId?.image} alt="Avatar" className="w-full h-72 object-cover" />
                        ) : (
                            'Bài viết này không có ảnh'
                        )}
                    </div>

                    <div className="border-gray-300 rounded-lg p-4">
                        <ReactQuill
                            theme="snow"
                            placeholder="Hãy viết gì đó ở đây cho chủ đề của bạn..."
                            className="h-72"
                            value={content}
                            onChange={handleContentChange}
                        />
                    </div>

                    <div className="flex justify-center p-5">
                        <ButtonComponent gradientDuoTone="purpleToPink" type="submit" disabled={isLoadingUpdatePost}>
                            {isLoadingUpdatePost ? (
                                <LoadingComponent isLoading={isLoadingUpdatePost}>Vui lòng chờ...</LoadingComponent>
                            ) : (
                                'Cập nhật bài viết'
                            )}
                        </ButtonComponent>
                    </div>

                    {/* Hiển thị thông báo thành công */}
                    {updateSuccess && (
                        <Alert className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-500 dark:border-green-300 text-green-700 dark:text-green-200 rounded">
                            {updateSuccess}
                        </Alert>
                    )}

                    {/* Hiển thị thông báo lỗi */}
                    {errorUpdate && (
                        <Alert className="mt-5 p-3 bg-red-100 dark:bg-red-900 border border-red-500 dark:border-red-300 text-red-700 dark:text-red-200 rounded">
                            {errorUpdate || errorTitle}
                        </Alert>
                    )}
                </form>
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-600 dark:text-gray-400">Không có bài viết nào được chọn để chỉnh sửa</p>
                </div>
            )}
        </div>
    );
};

export default UpdatePost;

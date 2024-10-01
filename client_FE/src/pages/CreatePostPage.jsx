import { Alert, FileInput, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import InputComponent from '../components/InputComponent/InputComponent';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Sử dụng giao diện "snow"
import useUploadImage from '../Hooks/useUpLoadImage';
import CircularProgressbarComponent from '../components/CircularProgressbarComponent/CircularProgressbarComponent ';
import useCreatePost from '../Hooks/useCreatePost';
import LoadingComponent from '../components/LoadingComponent/LoadingComponent';

const CreatePostPage = () => {
    const {
        uploadImage,
        uploadProgress: imageUploadProgress,
        imageUrl,
        uploadError: imageUploadError,
        fromData,
    } = useUploadImage();
    const [fileImage, setFileImage] = useState(null);
    const [title, setTitle] = useState(null);
    const [selectCategory, setSelectCategory] = useState(null);
    const [content, setContent] = useState(null);
    const [totalFromData, setTotalFromData] = useState({});
    const [isLoading, setIsLoading] = useState(null);
    const { createPost, isLoadingCreatePost, isSuccessCreatePost, createError, createSuccess } = useCreatePost();

    // Sử dụng useEffect để cập nhật totalFromData mỗi khi có thay đổi ở title, selectCategory, content
    useEffect(() => {
        const total = { title, category: selectCategory, content, image: fromData.avatar };
        setTotalFromData(total);
    }, [title, selectCategory, content, fromData]);

    // Hàm xử lý tải hình ảnh
    const handleUploadImageFile = () => {
        if (fileImage) {
            uploadImage(fileImage);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Thêm code để lưu bài viết vào cơ sở dữ liệu
        try {
            setIsLoading(true);
            await createPost(totalFromData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen flex flex-col">
            <h1 className="text-center text-3xl my-4 font-semibold">Tạo bài viết</h1>
            {/* Form to create a post */}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <InputComponent
                        type="text"
                        placeholder="Tiêu đề"
                        required
                        id="title"
                        className="flex-1"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Select id="category-select" className="flex-1" onChange={(e) => setSelectCategory(e.target.value)}>
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
                    {fromData?.avatar && (
                        <img src={fromData?.avatar} alt="Avatar" className="w-full h-72 object-cover" />
                    )}
                </div>
                <div className="border-gray-300 rounded-lg p-4">
                    <ReactQuill
                        theme="snow"
                        placeholder="Hãy viết gì đó ở đây cho chủ đề của bạn..."
                        className="h-72"
                        onChange={(content) => setContent(content)}
                    />
                </div>
                {/* Optional: Add a submit button */}
                <div className="flex justify-center p-5">
                    <ButtonComponent gradientDuoTone="purpleToPink" type="submit" disabled={isLoadingCreatePost}>
                        {isLoadingCreatePost || isLoading ? (
                            <LoadingComponent isLoading={isLoadingCreatePost}>Vui lòng chờ...</LoadingComponent>
                        ) : (
                            'Tạo bài viết'
                        )}
                    </ButtonComponent>
                </div>
                {/* Hiển thị thông báo thành công */}
                {isSuccessCreatePost && createSuccess && (
                    <Alert className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-500 dark:border-green-300 text-green-700 dark:text-green-200 rounded">
                        {createSuccess}
                    </Alert>
                )}
                {/* Hiển thị thông báo lỗi */}
                {createError && (
                    <Alert className="mt-5 p-3 bg-red-100 dark:bg-red-900 border border-red-500 dark:border-red-300 text-red-700 dark:text-red-200 rounded">
                        {createError}
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default CreatePostPage;

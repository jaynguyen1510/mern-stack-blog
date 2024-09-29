import { Alert, FileInput, Select } from 'flowbite-react';
import { useState } from 'react';
import InputComponent from '../components/InputComponent/InputComponent';
import ButtonComponent from '../components/ButtonComponent/ButtonComponent';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Sử dụng giao diện "snow"
import useUploadImage from '../Hooks/useUpLoadImage';
import CircularProgressbarComponent from '../components/CircularProgressbarComponent/CircularProgressbarComponent ';

const CreatePostPage = () => {
    const {
        uploadImage,
        uploadProgress: imageUploadProgress,
        imageUrl,
        uploadError: imageUploadError,
        fromData,
    } = useUploadImage();
    const [fileImage, setFileImage] = useState(null);

    // Hàm xử lý tải hình ảnh
    const handleUploadImageFile = () => {
        if (fileImage) {
            uploadImage(fileImage);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen flex flex-col">
            <h1 className="text-center text-3xl my-4 font-semibold">Tạo bài viết</h1>
            {/* Form to create a post */}
            <form className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <InputComponent type="text" placeholder="Tiêu đề" required id="title" className="flex-1" />
                    <Select id="category-select" className="flex-1">
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
                    />
                </div>
                {/* Optional: Add a submit button */}
                <div className="flex justify-center p-5">
                    <ButtonComponent type={'submit'} gradientDuoTone={'purpleToBlue'} size="md">
                        Đăng bài
                    </ButtonComponent>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;

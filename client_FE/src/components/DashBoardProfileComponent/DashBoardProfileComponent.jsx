import InputComponent from '../InputComponent/InputComponent';
import CircularProgressbarComponent from '../CircularProgressbarComponent/CircularProgressbarComponent ';
import useUploadImage from '../../Hooks/useUpLoadImage';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'flowbite-react';
import { updateError } from '../../redux/Slice/userSlice';
import useUpdateUser from '../../Hooks/useUpdateUser';
import LoadingComponent from '../LoadingComponent/LoadingComponent';

const DashBoardProfileComponent = () => {
    const { uploadImage, uploadProgress, imageUrl, uploadError, fromData } = useUploadImage();
    const { currentUser } = useSelector((state) => state.user);
    const [selectImage, setSelectImage] = useState(null);
    const [imageUrlSelected, setImageUrlSelected] = useState(currentUser?.avatar);
    const [dataFormSelected, setDataFormSelected] = useState({});
    const { updateUser, success, isLoading, error, message } = useUpdateUser();

    const dispatch = useDispatch();
    const fileInputRef = useRef();

    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectImage(file);
            setImageUrlSelected(URL.createObjectURL(file)); // Cập nhật imageUrl
        }
    };

    useEffect(() => {
        if (selectImage) {
            uploadImage(selectImage);
        }
    }, [selectImage]);

    const dataForm = { ...dataFormSelected, ...fromData };

    const handleChangeProfile = (e) => {
        // Sử dụng hàm callback để cập nhật trạng thái với giá trị mới nhất
        setDataFormSelected((prevData) => ({
            ...prevData, // Giữ lại tất cả thuộc tính cũ
            [e.target.id]: e.target.value, // Cập nhật thuộc tính dựa trên ID
        }));
    };
    // console.log(currentUser?._id);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form

        if (Object.keys(dataForm).length === 0) {
            return;
        }

        try {
            await updateUser(currentUser?._id, dataForm); // Đợi kết quả từ updateUser
        } catch (error) {
            dispatch(updateError(error.message));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Thông tin cá nhân</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <InputComponent type="file" accept="image/.*" onChange={handleSelectImage} ref={fileInputRef} hidden />
                <div
                    className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => fileInputRef.current.click()}
                >
                    <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                        {uploadProgress !== null && (
                            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-70 flex items-center justify-center rounded-full">
                                <CircularProgressbarComponent
                                    value={parseFloat(uploadProgress) || 0}
                                    text={uploadProgress}
                                    strokeWidth={5}
                                    styles={{
                                        root: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                        },
                                        path: {
                                            stroke: `rgba(62, 152, 199, ${uploadProgress / 100})`,
                                        },
                                    }}
                                />
                            </div>
                        )}
                        <img
                            src={imageUrlSelected || imageUrl}
                            alt="user"
                            className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${uploadProgress !== null ? 'blur-sm opacity-70' : ''}`}
                        />
                    </div>
                </div>
                <InputComponent
                    id="userName"
                    placeholder="username"
                    type="text"
                    defaultValue={currentUser?.userName}
                    onChange={handleChangeProfile}
                />
                <InputComponent
                    id="email"
                    type="text"
                    placeholder="email"
                    defaultValue={currentUser?.email}
                    onChange={handleChangeProfile}
                />
                <InputComponent id="password" type="password" placeholder="password" onChange={handleChangeProfile} />

                <ButtonComponent type={'submit'} gradientDuoTone="purpleToBlue" outline>
                    {isLoading ? (
                        <LoadingComponent isLoading={isLoading}>Vui lòng chờ...</LoadingComponent>
                    ) : (
                        'Cập nhật'
                    )}
                </ButtonComponent>
                {/* Hiển thị thông báo thành công */}
                {message && success && (
                    <Alert className="mt-4 p-3 bg-green-100 border border-green-500 text-green-700 rounded">
                        {message}
                    </Alert>
                )}
            </form>
            {uploadError && (
                <Alert color="failure" className="mt-3 text-center">
                    <span>{uploadError}</span>
                </Alert>
            )}

            {/* Hiển thị thông báo lỗi */}
            {error && <Alert className="mt-5 p-3 bg-red-100 border border-red-500 text-red-700 rounded">{error}</Alert>}

            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Hủy tài khoản</span>
            </div>
        </div>
    );
};

export default DashBoardProfileComponent;

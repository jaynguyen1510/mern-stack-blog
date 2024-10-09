import InputComponent from '../InputComponent/InputComponent';
import CircularProgressbarComponent from '../CircularProgressbarComponent/CircularProgressbarComponent ';
import useUploadImage from '../../Hooks/useUpLoadImage';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import useUpdateUser from '../../Hooks/useUpdateUser';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import useDeleted from '../../Hooks/useDeleted';
import useLogOut from '../../Hooks/useLogOut';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Alert, Modal } from 'flowbite-react';
import { deleteError, updateError } from '../../redux/Slice/userSlice';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const DashBoardProfileComponent = () => {
    const { uploadImage, uploadProgress, imageUrl, uploadError, fromData } = useUploadImage();
    const { currentUser, isLoading } = useSelector((state) => state.user);
    const [selectImage, setSelectImage] = useState(null);
    const [imageUrlSelected, setImageUrlSelected] = useState(currentUser?.avatar);
    const [dataFormSelected, setDataFormSelected] = useState({});
    const { updateUser, success, isLoading: isLoadingUpdateUser, error, message } = useUpdateUser();
    const { deleteUser, errorDeleted, successDeleted } = useDeleted();
    const [showModal, setShowModal] = useState(false);
    const [noFromData, setNoFromData] = useState(null);
    const userDataWithGoogle = JSON.parse(localStorage.getItem('userDataWithGG')); // Lấy dữ liệu từ localStorage

    const dispatch = useDispatch();
    const fileInputRef = useRef();
    const navigate = useNavigate();
    const logOut = useLogOut();
    const timeoutRef = useRef(null); // Sử dụng useRef để lưu timeoutId

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Log dataForm to check if it's getting the latest values
        console.log('Submitted form data:', dataForm);

        if (Object.keys(dataForm).length === 0) {
            return setNoFromData('Không có thông tin mới để thay đổi');
        }
        setNoFromData(null);
        try {
            // Ensure you are passing the latest formData, not outdated
            await updateUser(currentUser?._id, dataForm); // Wait for the updateUser response
        } catch (error) {
            dispatch(updateError(error.message));
        }
    };

    const handleRemoveUser = async () => {
        setShowModal(false);
        try {
            await deleteUser(currentUser?._id);

            // Lưu timeoutId vào timeoutRef
            timeoutRef.current = setTimeout(() => {
                logOut();
            }, 2000);
        } catch (error) {
            dispatch(deleteError(error.message));
        }
    };

    // Cleanup timeout khi component bị unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current); // Xóa timeout khi component unmount
            }
        };
    }, []);

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
                {/* {đăng nhập với gg thì ko cần thay đổi email} */}
                {!userDataWithGoogle?.userGoogle && (
                    <InputComponent
                        id="email"
                        type="text"
                        placeholder="email"
                        defaultValue={currentUser?.email}
                        onChange={handleChangeProfile}
                    />
                )}
                {/* {đăng nhập với gg thì ko cần thay đổi mật khẩu cho profile} */}
                {!userDataWithGoogle?.userGoogle && (
                    <InputComponent
                        id="password"
                        type="password"
                        placeholder="password"
                        onChange={handleChangeProfile}
                    />
                )}

                <ButtonComponent
                    type={'submit'}
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={isLoading || isLoadingUpdateUser}
                >
                    {isLoadingUpdateUser || isLoading ? (
                        <LoadingComponent isLoading={isLoadingUpdateUser || isLoading}>
                            Vui lòng chờ...
                        </LoadingComponent>
                    ) : (
                        'Cập nhật'
                    )}
                </ButtonComponent>
                {/* {Hiển thị nút tạo bài viết của Admin} */}
                {currentUser?.isAdmin === true && (
                    <Link to={'/create-post'}>
                        <ButtonComponent
                            type="button"
                            gradientDuoTone="purpleToBlue"
                            className="w-full"
                            onClick={() => navigate('/create-post')}
                        >
                            Tạo bài viết
                        </ButtonComponent>
                    </Link>
                )}
                {/* Hiển thị thông báo thành công */}
                {((message && success) || successDeleted) && (
                    <Alert className="mt-4 p-3 bg-green-100 border border-green-500 text-green-700 rounded">
                        {message || successDeleted}
                    </Alert>
                )}
            </form>
            {uploadError && (
                <Alert color="failure" className="mt-3 text-center">
                    <span>{uploadError}</span>
                </Alert>
            )}

            {/* Hiển thị thông báo lỗi */}
            {(error || errorDeleted || noFromData) && (
                <Alert className="mt-5 p-3 bg-red-100 border border-red-500 text-red-700 rounded">
                    {error || errorDeleted || noFromData}
                </Alert>
            )}

            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer" onClick={() => setShowModal(true)}>
                    Hủy tài khoản
                </span>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <ExclamationCircleIcon className="h-14 w-14 text-red-500 mb-4 mx-auto " />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Bạn có chắc là muốn hủy tài khoản không ?
                        </h3>
                        <div className="flex justify-between gap-4 mt-6">
                            <ButtonComponent
                                color="bg-gray-400"
                                className="bg-gray-400 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-600 !important" // Thêm !important nếu cần
                                onClick={handleRemoveUser}
                            >
                                Tôi muốn Hủy
                            </ButtonComponent>
                            <ButtonComponent
                                color="failure"
                                className="bg-red-500 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-red-600 !important" // Thêm !important nếu cần
                                onClick={() => setShowModal(false)}
                            >
                                Không muốn hủy
                            </ButtonComponent>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashBoardProfileComponent;

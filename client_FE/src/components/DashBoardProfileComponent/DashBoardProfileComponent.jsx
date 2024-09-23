import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'flowbite-react';
import CircularProgressbarComponent from '../CircularProgressbarComponent/CircularProgressbarComponent ';
import useUploadImage from '../../Hooks/useUpLoadImage';

const DashBoardProfileComponent = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [selectImage, setSelectImage] = useState(null);
    const [imageUrlSelected, setImageUrlSelected] = useState(currentUser?.avatar);
    const { uploadImage, uploadProgress, imageUrl, uploadError } = useUploadImage();
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

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Thông tin cá nhân</h1>
            <form className="flex flex-col gap-4">
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
                <InputComponent id="username" placeholder="username" type="text" defaultValue={currentUser?.userName} />
                <InputComponent id="email" type="text" placeholder="email" defaultValue={currentUser?.email} />
                <InputComponent id="password" type="password" placeholder="password" />

                <ButtonComponent type={'submit'} gradientDuoTone="purpleToBlue" outline>
                    <span>Cập nhật</span>
                </ButtonComponent>
            </form>
            {uploadError && (
                <Alert color="failure" className="mt-3 text-center">
                    <span>{uploadError}</span>
                </Alert>
            )}

            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Hủy tài khoản</span>
            </div>
        </div>
    );
};

export default DashBoardProfileComponent;

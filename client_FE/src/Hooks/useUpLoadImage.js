// useUploadImage.js

import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../FireBase/fireBase';

const useUploadImage = () => {
    const [uploadProgress, setUploadProgress] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const uploadImage = async (file) => {
        setUploadError(null); // Reset error before upload
        try {
            const storage = getStorage(app);
            const fileName = `${Date.now()}_${file.name}`;
            const storageFile = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageFile, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setUploadError('Không thể upload hình ảnh vì hình ảnh quá lớn hoặc có lỗi khác.');
                    setUploadProgress(null);
                    setImageUrl(null);

                    console.error('Upload failed:', error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setImageUrl(downloadURL);
                        setUploadProgress(null); // Reset progress after successful upload
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        setUploadError('Không thể lấy URL hình ảnh.');
                    }
                },
            );
        } catch (error) {
            console.error('Error initiating upload:', error);
            setUploadError('Có lỗi xảy ra trong quá trình tải lên.');
        }
    };

    return { uploadImage, uploadProgress, imageUrl, uploadError };
};

export default useUploadImage;

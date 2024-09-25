// src/hooks/useUpdateUser.js
import * as UserService from '../Service/UserService';
import { useDispatch } from 'react-redux';
import { resetMessage, updateError, updateSuccess, updateStart } from '../redux/Slice/userSlice';
import { useState } from 'react';

const useUpdateUser = () => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const updateUser = async (id, formData) => {
        try {
            if (!formData) {
                setError('Dữ liệu không hợp lệ.'); // Set error if formData is not provided
                return;
            }

            dispatch(updateStart(formData)); // Start the update process
            const data = await UserService.updateUser(id, formData);

            // Handle different status codes based on the response
            if (data.status === 'ERR') {
                dispatch(updateError(data));
                dispatch(resetMessage(data));
                setError(data.message); // Set error message from backend
                setSuccess(null); // Reset success message
            } else if (data.status === 'OK') {
                dispatch(updateSuccess(data));
                dispatch(resetMessage(data));
                setSuccess(data.message); // Set success message from backend
                setError(null); // Reset error message
            } else {
                setError('Đã có lỗi xảy ra.'); // Generic error message
            }
        } catch (error) {
            dispatch(updateError(error.message));
            setError(error.message);
            setSuccess(null); // Reset success message on error
        }
    };

    return { updateUser, success, error };
};

export default useUpdateUser;

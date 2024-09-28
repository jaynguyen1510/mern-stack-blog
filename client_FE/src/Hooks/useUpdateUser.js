import * as UserService from '../Service/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateError, updateSuccess, updateStart, resetError, resetMessage } from '../redux/Slice/userSlice';
import { useEffect, useState, useRef } from 'react';
import { useMutationCustomHook } from './useMutationCustom';

const useUpdateUser = () => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(null);
    const { isLoading, error, message } = useSelector((state) => state.user);
    const timerIdRef = useRef(null); // Sử dụng useRef để lưu trữ timerId

    const mutateUpdateUser = useMutationCustomHook(async ({ id, formData }) => {
        console.log('user', id, formData);
        const response = await UserService.updateUser(id, formData);
        return response; // Đảm bảo trả về response từ API
    });

    const updateUser = async (id, formData) => {
        dispatch(updateStart()); // Start update process

        try {
            if (!formData && !id) {
                return;
            }
            const dataUserUpdate = { id, formData };
            const data = await mutateUpdateUser.mutateAsync(dataUserUpdate);

            if (data.status === 'ERR') {
                dispatch(updateError(data)); // Handle error
                // Reset error and message after some time
                timerIdRef.current = setTimeout(() => {
                    dispatch(resetError());
                    dispatch(resetMessage());
                    setSuccess(null); // Reset success message
                }, 2000); // Adjust the delay as needed
            } else if (data.status === 'OK' && data.success === true) {
                dispatch(updateSuccess(data));
                setSuccess(data.message); // Set success message

                // Reset error and message after some time
                timerIdRef.current = setTimeout(() => {
                    dispatch(resetError());
                    dispatch(resetMessage());
                    setSuccess(null); // Reset success message
                }, 2000); // Adjust the delay as needed
            }
        } catch (error) {
            dispatch(updateError(error.message));
            setSuccess(null); // Reset success on error
        }
    };

    // Dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            clearTimeout(timerIdRef.current); // Clear timer if it exists
        };
    }, []);

    return { updateUser, success, isLoading, error, message };
};

export default useUpdateUser;

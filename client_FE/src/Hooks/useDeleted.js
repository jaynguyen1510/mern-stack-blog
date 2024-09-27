import { useDispatch } from 'react-redux';
import { deleteError, deleteStart, resetError, resetMessage } from '../redux/Slice/userSlice';
import { useEffect, useRef, useState } from 'react';
import * as UserService from '../Service/UserService';
import useLogOut from './useLogOut';

const useDeleted = () => {
    const [errorDeleted, setErrorDeleted] = useState(null);
    const [successDeleted, setSuccessDeleted] = useState(null);
    const logOut = useLogOut();
    const dispatch = useDispatch();
    const timeIdRef = useRef(null);

    const deleteUser = async (id) => {
        console.log('id', id);

        dispatch(deleteStart());
        if (!id) {
            return setErrorDeleted('Không thể tìm thấy id tài khoản');
        }
        try {
            const data = await UserService.deletedUser(id);
            if (data.status === 'ERR') {
                dispatch(deleteError(data));
                timeIdRef.current = setTimeout(() => {
                    dispatch(resetError());
                    dispatch(resetMessage());
                    setErrorDeleted(data.message);
                }, 2000);
            } else if (data.status === 'OK' && data.success === true) {
                dispatch(resetError());
                dispatch(resetMessage());
                setSuccessDeleted(data.message);
                // Reset error and message after some time
                timeIdRef.current = setTimeout(() => {
                    logOut();
                }, 2000); // Adjust the delay as needed
            }
        } catch (error) {
            dispatch(deleteError(error.message));
        }
    };
    // Dọn dẹp timer khi component unmount
    useEffect(() => {
        return () => {
            clearTimeout(timeIdRef.current); // Clear timer if it exists
        };
    }, []);
    return { deleteUser, errorDeleted, successDeleted };
};

export default useDeleted;

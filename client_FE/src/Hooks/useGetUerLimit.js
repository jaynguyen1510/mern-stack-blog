import * as UserService from '../Service/UserService';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';

const useGetUserLimit = () => {
    const hasFetchedRef = useRef(false); // Track if the API has been called

    const fetchUserLimit = async () => {
        try {
            if (hasFetchedRef.current) return; // Avoid re-fetching if data is already fetched

            // Call API to get all users
            const res = await UserService.getUserLimit();
            if (res?.status === 'ERR' && res?.success === false) {
                throw new Error(res.message);
            } else if (res?.status === 'OK' && res?.success === true) {
                hasFetchedRef.current = true;
                return res.dataAllUser;
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error; // Let react-query handle the error
        }
    };

    const {
        isLoading: isLoadingUserLimit,
        error: errorUserLimit,
        data: dataUserLimit,
    } = useQuery({
        queryKey: ['userLimit'],
        queryFn: fetchUserLimit,
        enabled: !hasFetchedRef.current, // Only enable if data hasn't been fetched
    });

    return { errorUserLimit, isLoadingUserLimit, dataUserLimit };
};

export default useGetUserLimit;

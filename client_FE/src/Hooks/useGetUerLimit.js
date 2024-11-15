import * as UserService from '../Service/UserService';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const useGetUserLimit = () => {
    const [hasFetched, setHasFetched] = useState(false); // Track fetch state

    const fetchUserLimit = async () => {
        try {
            // Avoid refetching if already fetched
            if (hasFetched) return []; // Return an empty array to avoid undefined

            const res = await UserService.getUserLimit();

            if (res?.status === 'ERR' && res?.success === false) {
                throw new Error(res.message);
            } else if (res?.status === 'OK' && res?.success === true) {
                setHasFetched(true);
                return res.dataAllUser || []; // Ensure returning data or empty array
            }

            // Default return if conditions aren't met
            return [];
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
        enabled: !hasFetched, // Only enable if data hasn't been fetched
    });

    // Safe fallback for data if undefined or null
    const safeDataUserLimit = dataUserLimit ?? []; // Ensure it's never undefined

    return { errorUserLimit, isLoadingUserLimit, dataUserLimit: safeDataUserLimit };
};

export default useGetUserLimit;

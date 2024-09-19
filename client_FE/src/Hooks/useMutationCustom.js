import { useMutation } from '@tanstack/react-query';

export const useMutationCustomHook = (fnCallback, options = {}) => {
    const mutation = useMutation({
        mutationFn: fnCallback,
        ...options, // Cho phép truyền các tùy chọn như onSuccess, onError từ bên ngoài
    });
    return mutation;
};

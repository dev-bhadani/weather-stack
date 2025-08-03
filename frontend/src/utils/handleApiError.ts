import axios from 'axios';

export function extractApiErrorMessage(error: unknown): string {
    const defaultMessage = 'Something went wrong';
    if (axios.isAxiosError(error)) {
        let data = error.response?.data;
        try {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            return (
                data?.error?.message ||
                data?.message ||
                error.message ||
                defaultMessage
            );
        } catch {
            return error.message || defaultMessage;
        }
    }
    return defaultMessage;
}

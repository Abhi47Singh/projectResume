import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetail } from "../api";

const useUser = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "user",
        async () => {
            try {
                const userDetail = await getUserDetail();
                return userDetail;
            } catch (err) {
                if (!err.message.includes("not authenticated")) {
                    toast.error("Something went wrong...");
                }
                throw err; // Ensure error is thrown to maintain `isError` state
            }
        },
        { refetchOnWindowFocus: false }
    );

    return { data, isLoading, isError, refetch };
};

export default useUser;

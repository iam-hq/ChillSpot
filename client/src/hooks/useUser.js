import axios from "axios";
import { useQuery } from "react-query";

const fetchUser = async (token, userId) => axios
        .get(`http://localhost:3001/users/${userId}`)
        .then((response) => {
            return response.data;
        });

export default function useUser(token, userId) {
    return useQuery(['users', {userId}], () => fetchUser(token, userId));
}
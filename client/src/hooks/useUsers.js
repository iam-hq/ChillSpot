import axios from "axios";
import { useQuery } from "react-query";

const fetchUsers = () => 
    axios
        .get("http://localhost:3001/users")
        .then((response) => response.data);

export default function useUsers() {
    return useQuery('users', fetchUsers);
}
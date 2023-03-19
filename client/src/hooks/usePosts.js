import axios from "axios";
import { useQuery } from "react-query";


const fetchPosts = (token) => 
    axios
        .get("http://localhost:3001/posts", {
            headers: { Authorization: `Bearer ${token}` },
          })
        .then((response) => response.data);

export default function usePosts(token) {
    return useQuery('posts', () => fetchPosts(token));
}
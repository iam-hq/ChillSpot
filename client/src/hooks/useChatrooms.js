import axios from "axios";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import "../config";

const useFetchChatrooms = () => {
    const { _id } = useSelector((state) => state.user);
    axios
        .get(`${global.config.api_url}/chatrooms/${_id}`)
        .then((response) => response.data);
}

export default function useChatrooms() {
    return useQuery('chatrooms', useFetchChatrooms);
}
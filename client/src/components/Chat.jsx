import { useTheme } from "@emotion/react";
import { Box, Backdrop, useMediaQuery, InputBase, Typography, IconButton } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { Close, SendRounded } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsChatOpen } from "state";
import UserImage from "./UserImage";
import io from "socket.io-client";
import Messages from "./Messages";
import axios from "axios";

const Chat = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { _id: friendId, name, subtitle, userPicturePath } = useSelector((state) => state.chatUser);
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [chatroom, setChatroom] = useState(null);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const socket = useRef(); 

    const joinRoom = ({chatroomId}) => {
        socket.current?.emit("join_chat", { chatroomId });
    }

    useEffect(() => {
        socket.current = io(`${global.config.api_url}`);
    }, []);

    useEffect(() => {
        socket.current.on("getMessage", data => {
            if(data.senderId !== _id) setMessages((messages) => [...messages, data]);
        })
        socket.current.emit("addUser", _id);
        socket.current.on("getUsers", users => {
            // console.log(users);
        });
    }, [socket]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const newMessage = {
            senderId: _id,
            body: message,
            chatroomId: chatroom._id
        }
        try {
            const response = await axios.post(`${global.config.api_url}/messages`, newMessage);
            const data = await response.data;
            setMessages([...messages, data]);
            socket.current.emit("send_message", {...data, receiverId: friendId});
        } catch (err) {
            console.log(err);
        }
        setMessage("");
    }

    const getMessages = async ({ chatId = undefined }) => {
        try {
            const response = await fetch(`${global.config.api_url}/messages/${(chatId === undefined) ? chatroom?._id : chatId}`);
            const data = await response.json();
            setMessages(data);
        } catch (err) {
            console.log(err)
        }
    }

    const closeChat = () => {
        dispatch(setIsChatOpen(false))
    }

    useEffect(() => {
        const newChat = async () => {
            await fetch(`${global.config.api_url}/chatrooms`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: _id,
                    friendId: friendId,
                }),
            });
            init();
        }


        const init = async () => {
            const response = await fetch(`${global.config.api_url}/chatrooms/${_id}/${friendId}`);
            const chat = await response.json();
            if(chat.length > 0) {
                joinRoom({ chatroomId: chat[0]._id});
                setChatroom(chat[0]);
                getMessages({ chatId: chat[0]._id});
            } else {
                newChat();
            }
        }
        init();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages])

    return ( <Backdrop
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={true}
    >
        <Box
            sx={{ 
                backgroundColor: theme.palette.neutral.light,
                width: isNonMobileScreens ? "50vw" : "90vw",
                height: "75vh",
                position: "fixed",
                top: isNonMobileScreens ? undefined : "0",
                bottom: isNonMobileScreens ? "2rem" : "0",
                right: "0",
                left: isNonMobileScreens ? undefined : "0",
                margin: isNonMobileScreens ? "1rem" : "auto",
                borderRadius: "9px",
            }}
        >
            {/* Chat Header */}
            <FlexBetween
                backgroundColor={theme.palette.neutral.medium}
                borderRadius="9px 9px 0 0"
                gap="3rem"
                padding="0.3rem 0.3rem 0.3rem 1.5rem"
            >
                <FlexBetween gap="0.5rem">
                    <UserImage image={userPicturePath} size="55px" />
                    <Box>
                        <Typography
                            color={theme.palette.neutral.dark}
                            variant="h5"
                            fontWeight="500"
                        >
                            {name}
                        </Typography>
                        <Typography color={theme.palette.neutral.main} fontSize="0.75rem">
                            {subtitle}
                        </Typography>
                    </Box>
                </FlexBetween>
                <IconButton onClick={closeChat}>
                    <Close />
                </IconButton>
            </FlexBetween>

            {/* Chat Body */}
            <Box sx={{ 
                height: "63.5vh",
                padding: "10px 0.5rem",
                overflowY: "scroll", 
            }}>
                {messages.map((message) => (
                    <div ref={scrollRef}>
                        <Messages key={message.id} message={message} />
                    </div>
                ))} 
            </Box>
            

            {/* Chat Footer */}
            <FlexBetween
                backgroundColor={theme.palette.neutral.medium}
                borderRadius="0 0 9px 9px"
                padding="0.3rem 0.3rem 0.3rem 0.7rem"
                sx={{ 
                    alignItems: "start"
                }}
            >
                <InputBase
                    value={message}
                    multiline
                    maxRows={3}
                    placeholder="Type Message Here..." 
                    style={{ width: "100%", outline: 0 }}
                    onChange={(e) => setMessage(e.target.value)} />
                <IconButton onClick={handleSendMessage}>
                    <SendRounded />
                </IconButton>
            </FlexBetween>
        </Box>
    </Backdrop> );
}
 
export default Chat;
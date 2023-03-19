import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { format } from "timeago.js";

const Messages = ({ message }) => {
    const theme = useTheme();
    const { _id } = useSelector((state) => state.user);
    const own = message.senderId === _id;
    return ( <Box key={message.id}>
        <Box 
            style={{ 
                backgroundColor: (own) ? theme.palette.primary.main : theme.palette.neutral.medium,
                margin: own ? "0.5rem 0.4rem 0.5rem 3rem" : "0.5rem 3rem 0.5rem 0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: own ? "10px 10px 0 10px" : "10px 10px 10px 0",
                display: "inline-block",
            }}
        >
            <Typography>
                {message.body}
            </Typography>
            <Typography 
                mt="5px"
                style={{ fontSize: "10px", fontStyle: "italic", fontWeight: "bold" }}
            >
                {format(message.createdAt)}
            </Typography>
        </Box>
    </Box> );
}
 
export default Messages;
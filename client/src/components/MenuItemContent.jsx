import { MenuItem, Box, Stack, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MenuItemContent = ({ popupState, title, time, subtitle }) => {
    return <>
        <Divider />
        <MenuItem onClick={popupState.close} >
            <Box width={250}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontWeight: "500" }}>
                    {title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "300", fontStyle: "italic" }}>
                    {time}
                </Typography>
            </Stack>
            <Typography style={{ overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                {subtitle}
            </Typography>
            </Box>
        </MenuItem>
    </>;
}
 
export default MenuItemContent;
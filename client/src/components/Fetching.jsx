import { Box, CircularProgress, useMediaQuery } from "@mui/material";

const Fetching = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    
    return <Box 
        sx={{ 
            position: "fixed", 
            top: isNonMobileScreens ? "6rem" : "5.5rem", 
            right: "1rem",
            zIndex: (theme) => theme.zIndex.drawer + 1
        }}
    >
        <CircularProgress color="inherit" size={isNonMobileScreens ? "2rem" : "1rem"}/>
    </Box>;
}
 
export default Fetching;
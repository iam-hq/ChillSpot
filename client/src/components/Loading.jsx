import { Backdrop, CircularProgress, useTheme } from "@mui/material";

const Loading = () => {
    const theme = useTheme();
    
    return ( <Backdrop
        sx={{ 
          color: theme.palette.primary.main,
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop> );
}
 
export default Loading;
import { Box } from "@mui/material";

function WindowTitle(props) {
  const { currentPath } = props;

  return (
    <Box
      sx={{
        background:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(228,245,255,1) 98%)",
        height: 45,
        color: "#ffffff",
        fontSize: 25,
        fontWeight: 600,
        paddingLeft: "20px",
      }}
    >
      {currentPath}
    </Box>
  );
}

export default WindowTitle;

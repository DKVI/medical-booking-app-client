import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Màu chính (blue)
    },
    secondary: {
      main: "#dc004e", // Màu phụ (red)
    },
    background: {
      default: "#f4f6f8", // Màu nền
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Font mặc định
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

export default theme;

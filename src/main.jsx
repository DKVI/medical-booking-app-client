import React from "react";
import ReactDOM from "react-dom/client"; // Sử dụng React 18 API
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./index.css"; // Import TailwindCSS hoặc các style khác

// Tạo root container với React 18 API
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    {/* Bọc App trong BrowserRouter */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Đặt lại CSS mặc định */}
      <App />
    </ThemeProvider>
  </BrowserRouter>
);

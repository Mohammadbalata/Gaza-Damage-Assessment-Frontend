import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/muiTheme";
import { SnackbarProvider } from "notistack";

function App() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && window.location.pathname === "/admin/login") {
      window.location.href = "/admin/dashboard";
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <BrowserRouter>
          <LanguageProvider>
            <AdminAuthProvider>
              <AppRoutes />
            </AdminAuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

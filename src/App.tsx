import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/muiTheme";
import { SnackbarProvider } from "notistack";
import { ROUTES } from "./routes/Routes";

function App() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      const a = [
        ROUTES.LAYOUT,
        ROUTES.SIGNIN,
        ROUTES.SIGNUP,
        ROUTES.VERIFICATION_QUESTIONS,
        ROUTES.PASSWORD_DISPLAY,
        ROUTES.ADMIN_LOGIN,
      ];
      if (userObj && a.includes(window.location.pathname)) {
        if (userObj?.role) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/citizen/dashboard";
        }
      }
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

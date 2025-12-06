import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";

function App() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && window.location.pathname === "/admin/login") {
      window.location.href = "/admin/dashboard";
    }
  });
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <UserAuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </UserAuthProvider>
      </AdminAuthProvider>
    </LanguageProvider>
  );
}

export default App;

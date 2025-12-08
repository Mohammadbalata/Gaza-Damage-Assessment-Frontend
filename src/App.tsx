import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

function App() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && window.location.pathname === "/admin/login") {
      window.location.href = "/admin/dashboard";
    }
  });
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AdminAuthProvider>
          <AppRoutes />
        </AdminAuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

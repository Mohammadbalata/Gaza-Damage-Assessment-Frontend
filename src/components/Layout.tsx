import { Outlet } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";

const Layout = ({ children }: any) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {children ? children : <Outlet />}
      </main>
      <LanguageToggle />
    </div>
  );
};

export default Layout;

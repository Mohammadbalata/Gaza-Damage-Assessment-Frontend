import { Outlet } from "react-router-dom";
import LanguageToggle from "../ui/LanguageToggle";

const Layout = ({ children }: any) => {
  return (
    <div className={`min-h-screen bg-gray-50 `}>
      <main className=" ">{children ? children : <Outlet />}</main>
      <LanguageToggle />
    </div>
  );
};

export default Layout;

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <Box component="main" className="!pt-20" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;

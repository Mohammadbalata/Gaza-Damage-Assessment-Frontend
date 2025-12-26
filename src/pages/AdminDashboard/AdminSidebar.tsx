import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { adminRoutes } from "../../routes/admin.routes";
import { useAuth } from "../../contexts/AdminAuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { LogOutIcon } from "lucide-react";
import { enqueueSnackbar } from "notistack";

const drawerWidth = 260;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, logout } = useAuth();
  const { t, language } = useLanguage();

  const isRTL = language === "ar";

  const handleLogout = () => {
    logout();
    enqueueSnackbar(t("common.logout") + " ✓", { variant: "success" });
  };

  return (
    <Drawer
      variant="permanent"
      anchor={isRTL ? "right" : "left"}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: isRTL ? "none" : "1px solid #eee",
          borderLeft: isRTL ? "1px solid #eee" : "none",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          {t("admin.dashboard")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {adminRoutes.map(route => {
          if (route.permission && !hasPermission(route.permission)) return null;

          const fullPath = `/admin/${route.path}`;

          return (
            <ListItemButton
              key={route.path}
              selected={location.pathname === fullPath}
              onClick={() => navigate(fullPath)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.main",
                  fontWeight: 600,
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "text.secondary",
                }}
              >
                {route.icon}
              </ListItemIcon>
              <ListItemText className={`${language === "ar" ? "text-right" :""}`} primary={t(route.label)} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          className="hover:text-white"
          sx={{
            borderRadius: 2,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
            },
          }}
        >
          <ListItemIcon sx={{ color: "error.main", minWidth: 36 }}>
            <LogOutIcon size={20} />
          </ListItemIcon>
          <ListItemText primary={t("common.logout")} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;

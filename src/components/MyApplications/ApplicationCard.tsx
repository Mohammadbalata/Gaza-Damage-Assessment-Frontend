import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  Tooltip,
  Divider,
  Fade,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Event as EventIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  Map as MapIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as ValidIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
  TaskAlt as VerifiedIcon,
  Lock as ClosedIcon,
  Feedback as ComplaintIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { MenuItem, Menu, ListItemIcon, ListItemText } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export interface ApplicationCardProps {
  application: any;
  onAction: (app: any) => void;
  onDownloadPdf: (app: any) => void;
  onAddComplaint: (app: any) => void;
  onCloseComplaint: (app: any) => void;
  neighborhoods?: any[];
  index?: number; // For staggered animation
}

const ApplicationCard = ({
  application,
  onAction,
  onDownloadPdf,
  onAddComplaint,
  onCloseComplaint,
  neighborhoods = [],
  index = 0,
}: ApplicationCardProps) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!application) return null;

  const buildingType = application?.damage_details.buildingType;
  const buildingData = application?.damage_details[buildingType];

  const status = application.status?.toUpperCase() || "SUBMITTED";
  const isSubmitted = status === "SUBMITTED";


  const getNeighborhoodName = (id: string) => {
    const neighborhood = neighborhoods.find((n) => n.id.toString() === id.toString());
    if (!neighborhood) return id;
    return language === "ar" ? neighborhood.name : neighborhood.name_en;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "APPROVED":
        return { color: "success", icon: <ValidIcon fontSize="small" /> };
      case "REJECTED":
        return { color: "error", icon: <RejectedIcon fontSize="small" /> };
      case "VERIFIED":
        return { color: "info", icon: <VerifiedIcon fontSize="small" /> };
      case "CLOSED":
        return { color: "default", icon: <ClosedIcon fontSize="small" /> };
      case "PENDING":
      default:
        return { color: "warning", icon: <PendingIcon fontSize="small" /> };
    }
  };

  const statusConfig = getStatusConfig(status);
  const statusLabel =
    t(`status.${application.status?.toLowerCase()}`) || application.status;

  // Staggered animation delay based on index
  const animationDelay = `${index * 100}ms`;

  return (
    <Fade in={true} style={{ transitionDelay: animationDelay }} timeout={500}>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 12px 24px -10px ${alpha(
              theme.palette.primary.main,
              0.15
            )}`,
            borderColor: "primary.main",
            "& .card-header-bg": {
              opacity: 1,
            },
          },
        }}
      >
        {/* Subtle Background Decoration on Hover */}
        <Box
          className="card-header-bg"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            bgcolor: "primary.main",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />

        <CardContent sx={{ p: 3, flexGrow: 1 }}>
          {/* Header: ID and Status */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            mb={3}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              useFlexGap={true}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: isSubmitted
                    ? alpha(theme.palette.warning.main, 0.1)
                    : alpha(theme.palette.primary.main, 0.1),
                  color: isSubmitted ? "warning.main" : "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionIcon />
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  lineHeight={1}
                >
                  {t("citizen.applicationId")}
                </Typography>
                <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                  #{application.report_code}
                </Typography>
              </Box>
            </Stack>

            <Tooltip
              title={
                t(`status.tooltip.${application.status?.toLowerCase()}`) || ""
              }
            >
              <Chip
                label={statusLabel}
                icon={statusConfig.icon}
                color={statusConfig.color as any}
                size="small"
                sx={{
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 1,
                  direction: "ltr",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Tooltip>
          </Stack>

          <Divider sx={{ my: 2, borderStyle: "dashed" }} />

          {/* Body: Metadata */}
          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              useFlexGap={true}
            >
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {t("citizen.submittedOn")}:{" "}
                <Typography
                  component="span"
                  variant="body2"
                  fontWeight="medium"
                  color="text.primary"
                >
                  {new Date(application.created_at).toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-US"
                  )}
                </Typography>
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
              useFlexGap={true}
            >
              <LocationOnIcon
                fontSize="small"
                color="action"
                sx={{ mt: 0.3 }}
              />
              <Typography variant="body2" color="text.secondary">
                {t("citizen.address")}:{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    lineHeight: 1.6,
                    display: "inline-flex",
                    gap: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  {application?.neighborhood_id && (
                    <span> {getNeighborhoodName(application?.neighborhood_id)}</span>
                  )}
                  {buildingData?.landmark && (
                    <span> - {buildingData?.landmark}</span>
                  )}
                  {buildingData?.nameOfStreet && (
                    <span> - {buildingData?.nameOfStreet}</span>
                  )}

                  {buildingData?.buildingNumber && (
                    <span> - {buildingData?.buildingNumber}</span>
                  )}
                </Typography>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>

        {/* Footer: Actions */}
        <Box
          sx={{
            p: 2,
            pt: 0,
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Primary Action */}
          <Button
            variant={isSubmitted ? "contained" : "outlined"}
            color={isSubmitted ? "primary" : "inherit"}
            startIcon={
              isSubmitted ? (
                <EditIcon sx={{ ml: 2 }} />
              ) : (
                <VisibilityIcon sx={{ ml: 2 }} />
              )
            }
            onClick={() => onAction(application)}
            sx={{
              flexGrow: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: isSubmitted ? 2 : 0,
              borderWidth: isSubmitted ? 0 : "1px",
              borderColor: isSubmitted ? "primary.main" : "divider",
            }}
          >
            {isSubmitted ? t("common.editRequest") : t("common.reviewRequest")}
          </Button>

          {/* Secondary Actions (Icons) */}
          <Tooltip title={t("app.receipt")}>
            <IconButton
              onClick={() => onDownloadPdf(application)}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                color: "primary.main",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  borderColor: "primary.main",
                },
              }}
            >
              <PdfIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {application.complaint && application.complaint.status?.toUpperCase().replace("-", "_") !== "CLOSED" && (
            <>
              <Tooltip title={t("common.actions")}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    color: "primary.main",
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <MoreIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ vertical: "top", horizontal: language === "ar" ? "right" : "left" }}
                anchorOrigin={{ vertical: "bottom", horizontal: language === "ar" ? "right" : "left" }}
              >
                <MenuItem 
                  component={Link} 
                  to={`/citizen/complaints/${application.complaint.id}`}
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("citizen.viewDetails")} />
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    onCloseComplaint(application);
                  }}
                  disabled={application.complaint.status?.toUpperCase().replace("-", "_") !== "RESOLVED"}
                >
                  <ListItemIcon>
                    <ClosedIcon fontSize="small" color={application.complaint.status?.toUpperCase().replace("-", "_") === "RESOLVED" ? "error" : "disabled"} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={t("complaint.close")} 
                    secondary={application.complaint.status?.toUpperCase().replace("-", "_") !== "RESOLVED" ? t("complaint.waitingForResponse") : null}
                  />
                </MenuItem>
              </Menu>
            </>
          )}

          {(!application.complaint || ["RESOLVED", "CLOSED"].includes(application.complaint.status?.toUpperCase().replace("-", "_"))) && (
            <Tooltip title={t("complaint.add")}>
              <IconButton
                onClick={() => onAddComplaint(application)}
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  color: "error.main",
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "white",
                    borderColor: "error.main",
                  },
                }}
              >
                <ComplaintIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {application?.latitude &&
            application?.longitude && (
              <Tooltip title={t("map.showonmap")}>
                <IconButton
                  component={Link}
                  to={`/admin/locations/map?lat=${application.latitude}&lng=${application.longitude}`}
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    color: "info.main",
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                    "&:hover": {
                      bgcolor: "info.main",
                      color: "white",
                      borderColor: "info.main",
                    },
                  }}
                >
                  <MapIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
        </Box>
      </Card>
    </Fade>
  );
};

export default ApplicationCard;

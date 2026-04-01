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
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Event as EventIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  Map as MapIcon,
  PictureAsPdf as PdfIcon,
  HourglassEmpty as PendingIcon,
  Lock as ClosedIcon,
  Feedback as ComplaintIcon,
  MoreVert as MoreIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import PendingActionsIcon from "@mui/icons-material/PendingActions"; 
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; 
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; 
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ReportStatus } from "../../constants/ReportStatus";
import { CommentsDialog } from "../CommentsDialog";
import StepperRTL from "./StepperRTL";

export interface ApplicationCardProps {
  application: any;
  notes: any[];
  onAction: (app: any) => void;
  onDownloadPdf: (app: any) => void;
  onAddComplaint: (app: any) => void;
  onCloseComplaint: (app: any) => void;
  onFetchComments?: (applicationId: string) => Promise<any[]>;
  neighborhoods?: any[];
  index?: number;
  statusReport: string;
}

const ApplicationCard = ({
  application,
  onAction,
  onDownloadPdf,
  onAddComplaint,
  onCloseComplaint,
  neighborhoods = [],
  index = 0,
  notes = [],
  statusReport,
}: ApplicationCardProps) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);

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
    const neighborhood = neighborhoods.find(
      (n) => n.id.toString() === id.toString(),
    );
    if (!neighborhood) return id;
    return language === "ar" ? neighborhood.name : neighborhood.name_en;
  };

  const getStatusConfig = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.SUBMITTED:
        return {
          color: "primary",
          icon: <AssignmentTurnedInIcon fontSize="small" />,
        };

      case ReportStatus.UNDER_REVIEW:
        return {
          color: "warning",
          icon: <PendingActionsIcon fontSize="small" />,
        };

      case ReportStatus.NEED_COMPLETION:
        return {
          color: "default",
          icon: <EditNoteIcon fontSize="small" />,
        };

      case ReportStatus.PRE_APPROVED:
        return {
          color: "info",
          icon: <CheckCircleOutlineIcon fontSize="small" />,
        };

      case ReportStatus.FIELD_VERIFICATION_REQUIRED:
        return {
          color: "warning",
          icon: <AssignmentLateIcon fontSize="small" />,
        };

      case ReportStatus.FIELD_VERIFICATION_IN_PROGRESS:
        return {
          color: "info",
          icon: <AutorenewIcon fontSize="small" />,
        };

      case ReportStatus.FIELD_VERIFIED:
        return {
          color: "success",
          icon: <FactCheckIcon fontSize="small" />,
        };

      case ReportStatus.APPROVED:
        return {
          color: "success",
          icon: <CheckCircleIcon fontSize="small" />,
        };

      case ReportStatus.REJECTED:
        return {
          color: "error",
          icon: <CancelIcon fontSize="small" />,
        };

      case ReportStatus.ESCALATED:
        return {
          color: "error",
          icon: <CancelIcon fontSize="small" />,
        };

      default:
        return {
          color: "default",
          icon: <PendingIcon fontSize="small" />,
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const statusLabel =
    t(`status.${application.status?.toLowerCase()}`) || application.status;

  // Check if application has notes
  const hasComments = notes && notes.length > 0;

  // Staggered animation delay based on index
  const animationDelay = `${index * 100}ms`;

  return (
    <>
      <Fade in={true} style={{ transitionDelay: animationDelay }} timeout={500}>
        <Card
          elevation={0}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.8),
            bgcolor: "background.paper",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.03)}`,
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: `0 20px 40px -12px ${alpha(
                theme.palette.primary.main,
                0.12,
              )}`,
              borderColor: "primary.light",
              "& .card-header-bg": {
                height: "8px",
                opacity: 1,
              },
            },
          }}
        >
          {/* Top accent line */}
          <Box
            className="card-header-bg"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgcolor: "primary.main",
              opacity: 0.8,
              transition: "all 0.3s ease",
            }}
          />

          <CardContent sx={{ p: 3, flexGrow: 1 }}>
            {/* Header: ID and Status */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              mb={3}
            >
              <Stack direction="row" spacing={2} className="gap-4" alignItems="center">
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: alpha(
                      isSubmitted
                        ? theme.palette.primary.main
                        : theme.palette.warning.main,
                      0.1,
                    ),
                    color: isSubmitted ? "primary.main" : "warning.main",
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 22 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    {t("citizen.applicationId")}
                  </Typography>
                  <Typography variant="h6" fontWeight={800} lineHeight={1}>
                    {application.report_code}
                  </Typography>
                </Box>
              </Stack>
              <Tooltip
                title={
                  t(`status.tooltip.${application.status?.toLowerCase()}`) || ""
                }
                className="w-36"
              >
                <Chip
                  label={statusLabel}
                  icon={statusConfig.icon}
                  color={statusConfig.color as any}
                  size="medium"
                  className="flex "
                  sx={{
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    height: 32,
                    boxShadow: (theme) =>
                      `0 2px 8px ${alpha(
                        (theme.palette as any)[statusConfig.color]?.main ||
                          theme.palette.grey[500],
                        0.25,
                      )}`,
                    "& .MuiChip-label": {  },
                  }}
                />
              </Tooltip>
            </Stack>

            <Divider sx={{ mb: 3, opacity: 0.6 }} />
             {/* Stepper Section (Inset background) */}
          <Box sx={{ mt: 1 }}>
            <StepperRTL {...{ statusReport }} />
          </Box>

            {/* Metadata Section */}
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" className="flex gap-2">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.action.selected, 0.5),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EventIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("citizen.submittedOn")}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(application.created_at).toLocaleDateString(
                      language === "ar" ? "ar-EG" : "en-US",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="" className="flex gap-2 items-center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.action.selected, 0.5),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 0.5,
                  }}
                >
                  <LocationOnIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("citizen.address")}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {[
                      getNeighborhoodName(application?.neighborhood_id),
                      buildingData?.landmark,
                      buildingData?.nameOfStreet,
                      buildingData?.buildingNumber,
                    ]
                      .filter(Boolean)
                      .join(" - ")}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>

         

          <Divider sx={{ opacity: 0.6 }} />

          {/* Footer: Actions */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Primary Action */}
            <Button
              variant={isSubmitted ? "contained" : "outlined"}
              fullWidth
              size="large"
              startIcon={
                isSubmitted ? (
                  <EditIcon sx={{ ml: 1, fontSize: 20 }} />
                ) : (
                  <VisibilityIcon sx={{ ml: 1, fontSize: 20 }} />
                )
              }
              onClick={() => onAction(application)}
              sx={{
                borderRadius: 2.5,
                height: 48,
                fontSize: "0.95rem",
                fontWeight: 800,
                textTransform: "none",
                boxShadow: isSubmitted
                  ? `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.3)}`
                  : 0,
                transition: "all 0.2s",
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              {isSubmitted
                ? t("common.editRequest")
                : t("common.reviewRequest")}
            </Button>

            {/* Icon Actions Row */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ width: "100%", justifyContent: "center", mt: 0.5 }}
            >
              {[
                {
                  icon: <CommentIcon fontSize="small" className="" />,
                  onClick: () => setCommentsDialogOpen(true),
                  tooltip:
                    t("common.viewComments") ||
                    (language === "ar" ? "عرض الملاحظات" : "View Comments"),
                  color: hasComments ? "warning" : "info",
                  badge: hasComments,
                  show: true,
                },
                {
                  icon: <PdfIcon fontSize="small" />,
                  onClick: () => onDownloadPdf(application),
                  tooltip: t("app.receipt"),
                  color: "primary",
                  show: true,
                },
                {
                  icon: <MoreIcon fontSize="small" />,
                  onClick: handleMenuOpen,
                  tooltip: t("common.actions"),
                  color: "primary",
                  show:
                    application.complaint &&
                    application.complaint.status
                      ?.toUpperCase()
                      .replace("-", "_") !== "CLOSED",
                },
                {
                  icon: <ComplaintIcon fontSize="small" />,
                  onClick: () => onAddComplaint(application),
                  tooltip: t("complaint.add"),
                  color: "error",
                  show:
                    !application.complaint ||
                    ["RESOLVED", "CLOSED"].includes(
                      application.complaint.status
                        ?.toUpperCase()
                        .replace("-", "_"),
                    ),
                },
                {
                  icon: <MapIcon fontSize="small" />,
                  link: `/locations/map?lat=${application.latitude}&lng=${application.longitude}`,
                  tooltip: t("map.showonmap"),
                  color: "secondary",
                  show: application?.latitude && application?.longitude,
                },
              ]
                .filter((action) => action.show)
                .map((action, idx) => (
                  <Tooltip key={idx} title={action.tooltip}>
                    <IconButton
                      component={action.link ? Link : "button"}
                      to={action.link}
                      onClick={action.onClick}
                      className="first:ml-2"
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: (theme) =>
                          alpha((theme.palette as any)[action.color].main, 0.08),
                        color: `${action.color as any}.main`,
                        border: "1px solid",
                        borderColor: (theme) =>
                          alpha((theme.palette as any)[action.color].main, 0.15),
                        position: "relative",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: `${action.color as any}.main`,
                          color: "white",
                          transform: "translateY(-2px)",
                          boxShadow: (theme) =>
                            `0 4px 12px ${alpha(
                              (theme.palette as any)[action.color].main,
                              0.3,
                            )}`,
                        },
                      }}
                    >
                      {action.icon}
                      {action.badge && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -3,
                            right: -3,
                            width: 10,
                            height: 10,
                            bgcolor: "error.main",
                            borderRadius: "50%",
                            border: "2px solid white",
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                          }}
                        />
                      )}
                    </IconButton>
                  </Tooltip>
                ))}
            </Stack>

            {/* Menu for Complaint Actions */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{
                vertical: "top",
                horizontal: language === "ar" ? "right" : "left",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: language === "ar" ? "right" : "left",
              }}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
                },
              }}
            >
              <MenuItem
                component={Link}
                to={`/citizen/complaints/${application.complaint?.id}`}
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
                disabled={
                  application.complaint?.status
                    ?.toUpperCase()
                    .replace("-", "_") !== "RESOLVED"
                }
              >
                <ListItemIcon>
                  <ClosedIcon
                    fontSize="small"
                    color={
                      application.complaint?.status
                        ?.toUpperCase()
                        .replace("-", "_") === "RESOLVED"
                        ? "error"
                        : "disabled"
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={t("complaint.close")}
                  secondary={
                    application.complaint?.status
                      ?.toUpperCase()
                      .replace("-", "_") !== "RESOLVED"
                      ? t("complaint.waitingForResponse")
                      : null
                  }
                />
              </MenuItem>
            </Menu>
          </Box>
        </Card>
      </Fade>

      {/* Comments Dialog */}
      <CommentsDialog
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        notes={notes}
        language={language}
      />
    </>
  );
};

export default ApplicationCard;
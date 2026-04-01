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
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  TextField,
  CircularProgress,
  Paper,
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
  Comment as CommentIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
} from "@mui/icons-material";
import { MenuItem, Menu, ListItemIcon, ListItemText } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PendingActionsIcon from "@mui/icons-material/PendingActions"; // UNDER_REVIEW
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // SUBMITTED
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // PRE_APPROVED
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ReportStatus } from "../../constants/ReportStatus";
import { axiosClient } from "../../api/baseUrl";
import { API } from "../../constants/ApiRoutes";

export interface ApplicationCardProps {
  application: any;
  notes: any[];
  onAction: (app: any) => void;
  onDownloadPdf: (app: any) => void;
  onAddComplaint: (app: any) => void;
  onCloseComplaint: (app: any) => void;
  onSendCommentReply?: (
    applicationId: string,
    commentId: string,
    replyText: string,
  ) => Promise<void>;
  onFetchComments?: (applicationId: string) => Promise<any[]>;
  neighborhoods?: any[];
  index?: number;
}

// Comments Dialog Component
const CommentsDialog = ({
  open,
  onClose,
  language,
  notes = [],
}: {
  open: boolean;
  onClose: () => void;
  application: any;
  onSendReply: (commentId: string, replyText: string) => Promise<void>;
  language: string;
  onFetchComments?: (applicationId: string) => Promise<any[]>;
  notes: any[];
}) => {
  const theme = useTheme();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes || []);
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSendReply = async (id: any) => {
    try {
      setIsSending(true);
      setIsLoading(true);
      const res = await axiosClient.post(
        API.citizen.applications.notes(id),
        {
          content: replyText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res) {
        console.log("response", res.data.note_reply.content);
        setLocalNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  replies: [
                    ...(note.replies || []),
                    {
                      id: res.data.note_reply.id,
                      content: res.data.note_reply.content,
                      created_at: res.data.note_reply.created_at,
                      role: "citizen",
                    },
                  ],
                }
              : note,
          ),
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
      setReplyingTo(null);
      setReplyText("");
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <CommentIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            {language === "ar"
              ? "ملاحظات المشرف والردود"
              : "Supervisor Comments & Replies"}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, maxHeight: "60vh", overflowY: "auto" }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : localNotes.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <CommentIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
              <Typography>
                {language === "ar" ? "لا توجد ملاحظات بعد" : "No comments yet"}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {localNotes.map((note: any) => (
                <Box key={note.id}>
                  {/* Main Comment */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={1}
                    >
                      <Stack
                        sx={{ display: "flex", gap: 1 }}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            fontSize: "0.875rem",
                          }}
                        >
                          {note.user.name?.charAt(0) || "C"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {note.user.name}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(note.created_at).toLocaleString(
                          language === "ar" ? "ar-EG" : "en-US",
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {note.note}
                    </Typography>

                    {/* Reply Button for Main Comment */}
                    <Box
                      sx={{
                        mt: 1.5,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={<ReplyIcon fontSize="small" />}
                        onClick={() => handleReplyClick(note.id)}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        {language === "ar" ? "رد" : "Reply"}
                      </Button>
                    </Box>

                    {/* Existing Replies */}
                    {note.replies && note.replies.length > 0 && (
                      <Stack spacing={1.5} sx={{ mt: 1.5, ml: 4 }}>
                        {note.replies.map((reply: any) => (
                          <Paper
                            key={reply.id}
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.grey[500], 0.05),
                              borderRadius: 2,
                              borderRight:
                                reply.role === "citizen"
                                  ? `2px solid ${theme.palette.success.main}`
                                  : "none",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              mb={1}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    bgcolor:
                                      reply.role === "supervisor"
                                        ? "info.main"
                                        : "success.main",
                                    fontSize: "0.75rem",
                                  }}
                                ></Avatar>
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(reply.created_at).toLocaleString(
                                  language === "ar" ? "ar-EG" : "en-US",
                                )}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {reply.content}
                            </Typography>
                          </Paper>
                        ))}

                        {/* Reply Input for this specific comment */}
                        {replyingTo === note.id && (
                          <Box sx={{ mt: 1.5, ml: 4, mb: 2 }}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.02,
                                ),
                                borderRadius: 2,
                                border: `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.1,
                                )}`,
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="flex-end"
                              >
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  placeholder={
                                    language === "ar"
                                      ? `اكتب ردك على ${note.author || "المشرف"}...`
                                      : `Write your reply to ${
                                          note.author || "supervisor"
                                        }...`
                                  }
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  autoFocus
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                      bgcolor: "background.paper",
                                    },
                                  }}
                                />
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    variant="outlined"
                                    onClick={handleCancelReply}
                                    size="small"
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: "none",
                                    }}
                                  >
                                    {language === "ar" ? "إلغاء" : "Cancel"}
                                  </Button>
                                  <Button
                                    variant="contained"
                                    onClick={() => handleSendReply(note.id)}
                                    disabled={!replyText.trim() || isSending}
                                    size="small"
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: "none",
                                    }}
                                  >
                                    {isSending ? (
                                      <CircularProgress
                                        size={20}
                                        color="inherit"
                                      />
                                    ) : language === "ar" ? (
                                      "إرسال"
                                    ) : (
                                      "Send"
                                    )}
                                  </Button>
                                </Stack>
                              </Stack>
                            </Paper>
                          </Box>
                        )}
                      </Stack>
                    )}
                  </Paper>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const ApplicationCard = ({
  application,
  onAction,
  onDownloadPdf,
  onAddComplaint,
  onCloseComplaint,
  onSendCommentReply,
  onFetchComments,
  neighborhoods = [],
  index = 0,
  notes = [],
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

  const handleSendReply = async (commentId: string, replyText: string) => {
    if (onSendCommentReply) {
      await onSendCommentReply(application.id, commentId, replyText);
    } else {
      console.log(
        "Sending reply for application:",
        application.id,
        commentId,
        replyText,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
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
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: `0 12px 24px -10px ${alpha(
                theme.palette.primary.main,
                0.15,
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
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.warning.main, 0.1),
                    color: isSubmitted ? "primary.main" : "warning.main",
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
                      language === "ar" ? "ar-EG" : "en-US",
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
                      <span>
                        {" "}
                        {getNeighborhoodName(application?.neighborhood_id)}{" "}
                      </span>
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
              {isSubmitted
                ? t("common.editRequest")
                : t("common.reviewRequest")}
            </Button>

            {/* Notes/Comments Button */}
            <Tooltip
              title={
                t("common.viewComments") ||
                (language === "ar" ? "عرض الملاحظات" : "View Comments")
              }
            >
              <IconButton
                onClick={() => setCommentsDialogOpen(true)}
                sx={{
                  bgcolor: hasComments
                    ? alpha(theme.palette.warning.main, 0.1)
                    : alpha(theme.palette.info.main, 0.05),
                  color: hasComments ? "warning.main" : "info.main",
                  borderRadius: 2,
                  border: `1px solid ${alpha(
                    hasComments
                      ? theme.palette.warning.main
                      : theme.palette.info.main,
                    0.2,
                  )}`,
                  position: "relative",
                  "&:hover": {
                    bgcolor: hasComments ? "warning.main" : "info.main",
                    color: "white",
                    borderColor: hasComments ? "warning.main" : "info.main",
                  },
                }}
              >
                <CommentIcon fontSize="small" />
                {hasComments && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 12,
                      height: 12,
                      bgcolor: "warning.main",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>

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

            {application.complaint &&
              application.complaint.status?.toUpperCase().replace("-", "_") !==
                "CLOSED" && (
                <>
                  <Tooltip title={t("common.actions")}>
                    <IconButton
                      onClick={handleMenuOpen}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        color: "primary.main",
                        borderRadius: 2,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1,
                        )}`,
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
                    transformOrigin={{
                      vertical: "top",
                      horizontal: language === "ar" ? "right" : "left",
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: language === "ar" ? "right" : "left",
                    }}
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
                      disabled={
                        application.complaint.status
                          ?.toUpperCase()
                          .replace("-", "_") !== "RESOLVED"
                      }
                    >
                      <ListItemIcon>
                        <ClosedIcon
                          fontSize="small"
                          color={
                            application.complaint.status
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
                          application.complaint.status
                            ?.toUpperCase()
                            .replace("-", "_") !== "RESOLVED"
                            ? t("complaint.waitingForResponse")
                            : null
                        }
                      />
                    </MenuItem>
                  </Menu>
                </>
              )}

            {(!application.complaint ||
              ["RESOLVED", "CLOSED"].includes(
                application.complaint.status?.toUpperCase().replace("-", "_"),
              )) && (
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

            {application?.latitude && application?.longitude && (
              <Tooltip title={t("map.showonmap")}>
                <IconButton
                  component={Link}
                  to={`/locations/map?lat=${application.latitude}&lng=${application.longitude}`}
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

      {/* Comments Dialog */}
      <CommentsDialog
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        application={application}
        notes={notes}
        onSendReply={handleSendReply}
        language={language}
        onFetchComments={onFetchComments}
      />
    </>
  );
};

export default ApplicationCard;

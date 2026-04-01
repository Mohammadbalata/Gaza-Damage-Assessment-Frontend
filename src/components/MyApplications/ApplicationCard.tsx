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
  HourglassEmpty as PendingIcon,


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
import StepperRTL from "./StepperRTL";

export interface ApplicationCardProps {
  application: any;
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
  statusReport: string;
}


// Comments Dialog Component
const CommentsDialog = ({
  open,
  onClose,
  application,
  onSendReply,
  language,
  onFetchComments,
}: {
  open: boolean;
  onClose: () => void;
  application: any;
  onSendReply: (commentId: string, replyText: string) => Promise<void>;
  language: string;
  onFetchComments?: (applicationId: string) => Promise<any[]>;
}) => {
  const theme = useTheme();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load comments from application or fetch them
  useEffect(() => {
    const loadComments = async () => {
      if (open && application?.id) {
        setIsLoading(true);
        try {
          if (onFetchComments) {
            const fetchedComments = await onFetchComments(application.id);
            setLocalComments(fetchedComments);
          } else if (application?.supervisor_comments) {
            setLocalComments(application.supervisor_comments);
          } else {
            setLocalComments([]);
          }
        } catch (error) {
          console.error("Error loading comments:", error);
          setLocalComments([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadComments();
  }, [
    open,
    application?.id,
    onFetchComments,
    application?.supervisor_comments,
  ]);

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !replyingTo) return;
    setIsSending(true);
    try {
      await onSendReply(replyingTo, replyText);

      // Update comments locally to add the reply
      const updatedComments = localComments.map((comment) => {
        if (comment.id === replyingTo) {
          const newReply = {
            id: Date.now().toString(),
            author: language === "ar" ? "أنت" : "You",
            role: "citizen",
            message: replyText,
            timestamp: new Date().toISOString(),
          };
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });

      setLocalComments(updatedComments);
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsSending(false);
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
          ) : localComments.length === 0 ? (
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
              {localComments.map((comment: any) => (
                <Box key={comment.id}>
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
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            fontSize: "0.875rem",
                          }}
                        >
                          {comment.author?.charAt(0) || "C"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {comment.author ||
                              (comment.role === "supervisor"
                                ? language === "ar"
                                  ? "مشرف"
                                  : "Supervisor"
                                : language === "ar"
                                  ? "مواطن"
                                  : "Citizen")}
                          </Typography>
                          <Chip
                            label={
                              comment.role === "supervisor"
                                ? language === "ar"
                                  ? "مشرف"
                                  : "Supervisor"
                                : language === "ar"
                                  ? "مواطن"
                                  : "Citizen"
                            }
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.625rem",
                              bgcolor:
                                comment.role === "supervisor"
                                  ? alpha(theme.palette.info.main, 0.1)
                                  : alpha(theme.palette.success.main, 0.1),
                              color:
                                comment.role === "supervisor"
                                  ? "info.main"
                                  : "success.main",
                            }}
                          />
                        </Box>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.timestamp).toLocaleString(
                          language === "ar" ? "ar-EG" : "en-US",
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {comment.message}
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
                        onClick={() => handleReplyClick(comment.id)}
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
                  </Paper>

                  {/* Reply Input for this specific comment */}
                  {replyingTo === comment.id && (
                    <Box sx={{ mt: 1.5, ml: 4, mb: 2 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
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
                                ? `اكتب ردك على ${
                                    comment.author || "المشرف"
                                  }...`
                                : `Write your reply to ${
                                    comment.author || "supervisor"
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
                              onClick={handleSendReply}
                              disabled={!replyText.trim() || isSending}
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                              }}
                            >
                              {isSending ? (
                                <CircularProgress size={20} color="inherit" />
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

                  {/* Existing Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <Stack spacing={1.5} sx={{ mt: 1.5, ml: 4 }}>
                      {comment.replies.map((reply: any) => (
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
                              >
                                {reply.author?.charAt(0) ||
                                  (reply.role === "supervisor" ? "م" : "م")}
                              </Avatar>
                              <Typography variant="caption" fontWeight="bold">
                                {reply.author ||
                                  (reply.role === "supervisor"
                                    ? language === "ar"
                                      ? "مشرف"
                                      : "Supervisor"
                                    : language === "ar"
                                      ? "مواطن"
                                      : "Citizen")}
                              </Typography>
                              <Chip
                                label={
                                  reply.role === "supervisor"
                                    ? language === "ar"
                                      ? "مشرف"
                                      : "Supervisor"
                                    : language === "ar"
                                      ? "مواطن"
                                      : "Citizen"
                                }
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "0.625rem",
                                }}
                              />
                            </Stack>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(reply.timestamp).toLocaleString(
                                language === "ar" ? "ar-EG" : "en-US",
                              )}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {reply.message}
                          </Typography>

                          {/* Add Reply button to replies as well */}
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              size="small"
                              startIcon={<ReplyIcon fontSize="small" />}
                              onClick={() => handleReplyClick(comment.id)}
                              sx={{
                                textTransform: "none",
                                color: "primary.main",
                                fontSize: "0.75rem",
                                "&:hover": {
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.05,
                                  ),
                                },
                              }}
                            >
                              {language === "ar" ? "رد" : "Reply"}
                            </Button>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  )}
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
  statusReport,
}: ApplicationCardProps) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  // Load comments if fetch function is provided
  useEffect(() => {
    if (onFetchComments && application?.id) {
      onFetchComments(application.id).then(setComments).catch(console.error);
    } else if (application?.supervisor_comments) {
      setComments(application.supervisor_comments);
    }
  }, [application?.id, onFetchComments, application?.supervisor_comments]);

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
      // Mock implementation if no handler provided
      console.log(
        "Sending reply for application:",
        application.id,
        commentId,
        replyText,
      );
      // Simulate API call
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

  // Check if application has comments
  const hasComments = comments && comments.length > 0;

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
                    {console.log(application.address)}
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
        application={application}
        onSendReply={handleSendReply}
        language={language}
        onFetchComments={onFetchComments}
      />
    </>
  );
};

export default ApplicationCard;
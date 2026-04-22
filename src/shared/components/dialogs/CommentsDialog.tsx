import {
  Typography,
  Box,
  Stack,
  Button,
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
  Comment as CommentIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import { axiosClient } from "../../api/api";
import { API } from "../../constants/ApiRoutes";

export const CommentsDialog = ({
  open,
  onClose,
  language,
  notes = [],
}: {
  open: boolean;
  onClose: () => void;
  language: string;
  notes: any[];
}) => {
  const theme = useTheme();

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes || []);

  const rolesMap: any = {
    super_admin: {
      ar: "مدير النظام",
      en: "Super Admin",
    },
    general_supervisor: {
      ar: "المشرف العام",
      en: "General Supervisor",
    },
    district_supervisor: {
      ar: "مشرف المنطقة",
      en: "District Supervisor",
    },
    field_team_member: {
      ar: "عضو الفريق الميداني",
      en: "Field Team Member",
    },
    gis_reviewer: {
      ar: "مراجع GIS",
      en: "GIS Reviewer",
    },
  };

  useEffect(() => {
    setLocalNotes(notes);
    console.log(notes);
  }, [notes]);

  const handleReplyClick = (noteId: string) => {
    setReplyingTo(noteId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSendReply = async (id: any) => {
    if (!replyText.trim()) return;

    try {
      setIsSending(true);
      setIsLoading(true);

      const res = await axiosClient.post(
        API.citizen.applications.notes(id),
        { content: replyText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res) {
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
      }
    } catch (error) {
      console.error("Error sending reply:", error);
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
          borderRadius: { xs: 3, sm: 3 },
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
        <Box sx={{ p: { xs: 2, sm: 3 }, maxHeight: "60vh", overflowY: "auto" }}>
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
            <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
              <CommentIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
              <Typography>
                {language === "ar" ? "لا توجد ملاحظات بعد" : "No comments yet"}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {localNotes.map((note: any) => (
                <Box key={note.id}>
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
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={1}
                      mb={1}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                          }}
                        >
                          {note.user.name?.charAt(0) || "C"}
                        </Avatar>

                        <Typography variant="subtitle2" fontWeight="bold">
                          {rolesMap[note.user.roles]
                            ? rolesMap[note.user.roles][
                                language === "ar" ? "ar" : "en"
                              ]
                            : note.user.name}
                          :
                        </Typography>

                        <Typography variant="subtitle2">
                          {note.user.name}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          alignSelf: { xs: "flex-end", sm: "flex-end" },
                        }}
                      >
                        {new Date(note.created_at).toLocaleString(
                          language === "ar" ? "ar-EG" : "en-US",
                        )}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        pr: 3,
                      }}
                      variant="body2"
                    >
                      {note.content}
                    </Typography>

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
                        }}
                      >
                        {language === "ar" ? "رد" : "Reply"}
                      </Button>
                    </Box>

                    {replyingTo === note.id && (
                      <Box sx={{ mt: 1.5, ml: { xs: 1, sm: 4 } }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                            borderRadius: 2,
                          }}
                        >
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                          >
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              placeholder={
                                language === "ar"
                                  ? "اكتب ردك..."
                                  : "Write your reply..."
                              }
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              size="small"
                            />

                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                onClick={handleCancelReply}
                              >
                                {language === "ar" ? "إلغاء" : "Cancel"}
                              </Button>

                              <Button
                                variant="contained"
                                onClick={() => handleSendReply(note.id)}
                                disabled={!replyText.trim() || isSending}
                              >
                                {isSending ? (
                                  <CircularProgress size={18} color="inherit" />
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

                    {note.replies && note.replies.length > 0 && (
                      <Stack
                        spacing={1.5}
                        sx={{ mt: 1.5, ml: { xs: 1, sm: 4 } }}
                      >
                        {note.replies.map((reply: any) => (
                          <Paper
                            key={reply.id}
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.grey[500], 0.05),
                              borderRadius: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
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

                              <Typography variant="caption">
                                {new Date(reply.created_at).toLocaleString(
                                  language === "ar" ? "ar-EG" : "en-US",
                                )}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mt: 0.5, pr: 3 }}>
                              {reply.content}
                            </Typography>
                          </Paper>
                        ))}
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

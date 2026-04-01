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
import { axiosClient } from "../api/baseUrl";
import { API } from "../constants/ApiRoutes";



// Comments Dialog Component

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

  useEffect(() => {
    setLocalNotes(notes);
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

                    {/* Reply Input for this specific comment */}
                    {replyingTo === note.id && (
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

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const CommentDialog = ({ open, onClose, order, mode, onSave }) => {
  const [comment, setComment] = useState(order?.comment || "");

  const handleSave = () => {
    onSave(comment);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === "view" ? "View Comment" : "Add Comment "}</DialogTitle>
      <DialogContent>
        {mode === "view" ? (
          <TextField
            value={order?.comment || "No comment"}
            fullWidth
            multiline
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            margin="dense"
          />
        ) : (
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            label="Comment"
            variant="outlined"
            margin="dense"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {mode === "edit" && (
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;

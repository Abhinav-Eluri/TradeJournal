import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const NoteDialog = ({ open, onClose, trade, mode, onSave }) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (trade) {
      setNote(trade.note || "");
    }
  }, [trade]);

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === "view" ? "View Note" : "Add Note"}</DialogTitle>
      <DialogContent>
        {mode === "view" ? (
          <TextField
            value={note || "No note"}
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            label="Note"
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

export default NoteDialog;

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from '@mui/material';
import {closeTrade} from "../../api/api.js";
import {toast} from "../../utils/toastService.js";

const CloseTrade = ({ open, onClose, order, refreshOrders }) => {
    const [closePrice, setClosePrice] = useState("");
    const [closeDate, setCloseDate] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        // Reset form when dialog opens
        if (open) {
            setClosePrice("");
            setCloseDate("");
        }
    }, [open]);

    const handleSubmit = async () => {
        try {
            await closeTrade(order?.id, {
                close_price: closePrice,
                close_date: closeDate,
                note: note,
            });
            toast("Trade closed successfully", "success");
            await refreshOrders();
            onClose();
        } catch (error) {
            console.error("Error closing trade:", error);
            toast("Failed to close trade. Check console for more information.", "error");

        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Close Trade</DialogTitle>
            <DialogContent>
                <TextField
                    label="Close Price"
                    type="number"
                    fullWidth
                    value={closePrice}
                    onChange={(e) => setClosePrice(e.target.value)}
                    margin="dense"
                    required={true}
                />
                <TextField
                    label="Close Date"
                    type="date"
                    fullWidth
                    value={closeDate}
                    onChange={(e) => setCloseDate(e.target.value)}
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                        min: order?.date,
                        max: new Date().toISOString().split("T")[0],
                    }}
                    required={true}
                />
                <TextField
                    label="Note(Optional)"
                    type="text"
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    margin="dense"

                    variant="outlined"
                    multiline
                    rows={4}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Confirm Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CloseTrade;

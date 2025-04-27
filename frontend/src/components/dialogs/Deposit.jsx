import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import {addDeposit} from "../../api/api.js";
import {toast} from "../../utils/toastService.js";

export default function DepositDialog({ open, onClose }) {
    const [amount, setAmount] = useState("");

    const handleSubmit = () => {
        if (!amount) {
            toast("Please enter a valid amount", "error");
            return;
        }
        addDeposit(amount).then((res)=>{
            console.log(res.message);
            setAmount("");
            onClose();
        }).catch((err)=>{
            console.error('Deposit failed:', err);
            toast("Failed to deposit funds. Check console for more information.", "error");
        });

        }


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>Deposit Funds in your Account</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required={true}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

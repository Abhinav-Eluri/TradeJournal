import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from '@mui/material';
import { createOrder } from "../../api/api.js";
import { toast } from "../../utils/toastService.js";

const CreateOrder = ({ open, onClose, refreshOrders }) => {
    const [form, setForm] = useState({
        symbol: '',
        quantity: '',
        price: '',
        date: '',
        order_type: 'buy'
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        createOrder({
            symbol: form.symbol,
            quantity: form.quantity,
            price: form.price,
            date: form.date,
            order_type: form.order_type
        })
            .then((r) => {
                console.log("Order created:", r);
                toast("Order created Successfully ", "success");
                refreshOrders();
                onClose();
            })
            .catch((err) => {
                console.error('Order creation failed:', err);
                toast("Failed to create order. Check console for more information.", "error");
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Create Order</DialogTitle>
            <DialogContent className="flex flex-col gap-4 mt-2">
                <TextField
                    label="Stock Symbol"
                    name="symbol"
                    value={form.symbol}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={form.quantity}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        inputProps: {
                            max: new Date().toISOString().split('T')[0]
                        }
                    }}
                    required
                />
                <TextField
                    select
                    label="Order Type"
                    name="order_type"
                    value={form.order_type}
                    onChange={handleChange}
                    fullWidth
                    required
                >
                    <MenuItem value="buy">Buy</MenuItem>
                    <MenuItem value="sell">Sell</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateOrder;

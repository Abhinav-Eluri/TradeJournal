import React, { useEffect, useState } from 'react';
import { fetchOrders } from "../api/api.js";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Box, TextField
} from '@mui/material';
import { toast } from "../utils/toastService.js";

function History() {
    const [orderHistory, setOrderHistory] = useState([]);
    const [symbolFilter, setSymbolFilter] = useState("");

    useEffect(() => {
        fetchOrders()
            .then(orders => {
                toast("Loaded Order History successfully", "success");
                const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrderHistory(sortedOrders);
            })
            .catch((err) => {
                toast("Failed to load order history. Look console for more Information", "error");
                console.error(err)
            });
    }, []);

    const filteredOrders = orderHistory.filter(order =>
        order?.stock.symbol.toLowerCase().includes(symbolFilter.toLowerCase())
    );

    return (
        <Box className="p-6 w-full min-h-screen bg-white">
            <Typography variant="h5" className="mb-4 font-bold">Order History</Typography>

            <Box sx={{ mb: 3 }}>
                <TextField
                    label="Filter by Symbol"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={symbolFilter}
                    onChange={(e) => setSymbolFilter(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Stock Symbol</strong></TableCell>
                            <TableCell><strong>Order Type</strong></TableCell>
                            <TableCell><strong>Quantity</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Order Date</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{order.stock.symbol}</TableCell>
                                    <TableCell>{order.order_type}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>${order.price}</TableCell>
                                    <TableCell style={{ color: order.status === "open" ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {order.status}
                                    </TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default History;
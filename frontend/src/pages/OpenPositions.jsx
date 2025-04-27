import React, { useEffect, useState } from 'react';
import { fetchOpenPositions } from "../api/api.js";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import {toast} from "../utils/toastService.js";

function OpenPositions() {
    const [openPositions, setOpenPositions] = useState([]);

    useEffect(() => {
        fetchOpenPositions()
            .then((response) => {
                toast("Loaded Opem Positions successfully", "success");
                setOpenPositions(response);
            })
            .catch((error) => {
                console.error("Error fetching open positions:", error);
                toast("Failed to load open positions. Look console for more Information", "error");
            });
    }, []);

    return (
        <Box sx={{ width: '100vw', minHeight: '100vh', p: 4, display: 'flex', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
            <Box sx={{ width: '100%', maxWidth: 1000 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Open Positions
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Symbol</strong></TableCell>
                                <TableCell align="right"><strong>Quantity</strong></TableCell>
                                <TableCell align="right"><strong>Total Value</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {openPositions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'gray' }}>
                                        No open positions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                openPositions.map((pos, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{pos.symbol}</TableCell>
                                        <TableCell align="right">{pos.quantity}</TableCell>
                                        <TableCell align="right">${Number(pos.total_value).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default OpenPositions;

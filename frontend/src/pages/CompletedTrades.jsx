import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { fetchCompletedTrades, updateCompletedTradeNote } from "../api/api.js";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography,
    TextField, Select, MenuItem, FormControl, InputLabel, Box, Button,
} from "@mui/material";
import NoteDialog from "../components/dialogs/NoteDialog.jsx";
import {toast} from "../utils/toastService.js";

function CompletedTrades() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [completedTrades, setCompletedTrades] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [symbolFilter, setSymbolFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [noteMode, setNoteMode] = useState("view");
    const [selectedTrade, setSelectedTrade] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = "/login";
        } else {
            loadCompletedTrades();
        }
    }, [isAuthenticated]);

    const loadCompletedTrades = async () => {
        try {
            const response = await fetchCompletedTrades();
            toast("Loaded CompletedTrades successfully.", "success");
            setCompletedTrades(response);
            setFilteredHistory(response);
        } catch (error) {
            console.error("Error fetching completed trades:", error);
            toast("Failed to load completed trades.Look console for more Information", "error");
        }
    };

    useEffect(() => {
        const filtered = completedTrades.filter(entry =>
          entry.symbol.toLowerCase().includes(symbolFilter.toLowerCase()) &&
          (typeFilter === "" || entry.order_type === typeFilter)
        );
        setFilteredHistory(filtered);
    }, [symbolFilter, typeFilter, completedTrades]);

    const handleAddNote = (trade) => {
        setSelectedTrade(trade);
        setNoteMode("edit");
        setNoteDialogOpen(true);
    };

    const handleViewNote = (trade) => {
        setSelectedTrade(trade);
        toast(`Note for trade ${trade.id}: ${trade.note}`, "info");
        setNoteMode("view");
        setNoteDialogOpen(true);
    };

    const handleSaveNote = async (newNote) => {
        try {
            await updateCompletedTradeNote(selectedTrade.id, newNote);
            toast("Note saved successfully.", "success");
            await loadCompletedTrades();
        } catch (error) {
            console.error("Failed to save note:", error);
            toast("Failed to save note. Look console for more Information", "error");
        }
    };

    return (
      <Box className="p-6 w-full min-h-screen bg-white">
          <Typography variant="h5" className="mb-10 font-bold">Completed Trades</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Filter by Symbol"
                variant="outlined"
                size="small"
                value={symbolFilter}
                onChange={(e) => setSymbolFilter(e.target.value)}
              />
              <FormControl size="small">
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    label="Order Type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    sx={{ minWidth: 150 }}
                    variant="outlined"
                  >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="buy">Buy</MenuItem>
                      <MenuItem value="sell">Sell</MenuItem>
                  </Select>
              </FormControl>
          </Box>

          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell><strong>Stock Symbol</strong></TableCell>
                          <TableCell><strong>Order Type</strong></TableCell>
                          <TableCell><strong>Quantity</strong></TableCell>
                          <TableCell><strong>Open Date</strong></TableCell>
                          <TableCell><strong>Close Date</strong></TableCell>
                          <TableCell><strong>Initial Price</strong></TableCell>
                          <TableCell><strong>Final Price</strong></TableCell>
                          <TableCell><strong>Net Amount</strong></TableCell>
                          <TableCell><strong>Duration (days)</strong></TableCell>
                          <TableCell><strong>Note</strong></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredHistory.length > 0 ? (
                        filteredHistory.map((entry, index) => (
                          <TableRow key={index}>
                              <TableCell>{entry.symbol}</TableCell>
                              <TableCell>{entry.order_type}</TableCell>
                              <TableCell>{entry.quantity}</TableCell>
                              <TableCell>{entry.open_date}</TableCell>
                              <TableCell>{entry.close_date}</TableCell>
                              <TableCell>${entry.open_price}</TableCell>
                              <TableCell>${entry.close_price}</TableCell>
                              <TableCell
                                style={{
                                    color: parseFloat(entry.net_amount) > 0 ? 'green' : parseFloat(entry.net_amount) < 0 ? 'red' : 'black',
                                    fontWeight: 'bold',
                                }}
                              >
                                  {parseFloat(entry.net_amount) > 0 ? '+' : parseFloat(entry.net_amount) < 0 ? '-' : ''}
                                  ${Math.abs(parseFloat(entry.net_amount)).toFixed(2)}
                              </TableCell>
                              <TableCell>{entry.duration ?? "-"}</TableCell>
                              <TableCell>
                                  {entry.note ? (
                                    <Button
                                      variant="outlined"
                                      onClick={() => handleViewNote(entry)}
                                    >
                                        View Note
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleAddNote(entry)}
                                    >
                                        Add Note
                                    </Button>
                                  )}
                              </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                            <TableCell colSpan={10} align="center">
                                No completed trades found.
                            </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
              </Table>
          </TableContainer>

          {/* Note Dialog */}
          <NoteDialog
            open={noteDialogOpen}
            onClose={() => setNoteDialogOpen(false)}
            trade={selectedTrade}
            mode={noteMode}
            onSave={handleSaveNote}
          />
      </Box>
    );
}

export default CompletedTrades;

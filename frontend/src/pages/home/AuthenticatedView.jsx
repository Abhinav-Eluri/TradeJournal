import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';
import CreateOrder from '../../components/dialogs/CreateOrder.jsx';
import CloseTrade from '../../components/dialogs/CloseTrade.jsx';
import CommentDialog from '../../components/dialogs/CommentDialog.jsx';
import { fetchOrders, updateOrderComment } from '../../api/api.js';
import { toast } from '../../utils/toastService.js';

const HomeAuthenticatedView = () => {
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searchSymbol, setSearchSymbol] = useState("");
    const [closeDialogOpen, setCloseDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [commentMode, setCommentMode] = useState("view"); // "view" or "edit"
    const [commentOrder, setCommentOrder] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetchOrders();
            const openOrders = response.filter(order => order.status === "open");
            setOrders(openOrders);
        } catch (e) {
            console.error("Failed to fetch orders:", e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddComment = (order) => {
        setCommentOrder(order);
        setCommentMode("edit");
        setCommentDialogOpen(true);
    };

    const handleViewComment = (order) => {
        setCommentOrder(order);
        setCommentMode("view");
        setCommentDialogOpen(true);
    };

    const handleSaveComment = async (newComment) => {
        try {
            await updateOrderComment(commentOrder.id, newComment);
            toast("Comment saved successfully", "success");
            await fetchData(); // Refresh orders after saving
        } catch (error) {
            console.error("Failed to save comment:", error);
            toast("Failed to save comment. Look console for more Information", "error");
        }
    };

    const filteredOrders = orders.filter(order =>
      order.symbol.toLowerCase().includes(searchSymbol.toLowerCase())
    );

    return (
      <div className="relative w-screen min-h-screen bg-white text-black px-10 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
              <Typography variant="h5" fontWeight="bold">
                  Existing Orders
              </Typography>
              <Button variant="contained" color="primary" onClick={handleClickOpen}>
                  Create Order
              </Button>
          </div>

          {/* Filter Input */}
          <div className="mb-4">
              <TextField
                label="Filter by Symbol"
                variant="outlined"
                size="small"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
              />
          </div>

          {/* Orders Table */}
          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell><strong>Stock Symbol</strong></TableCell>
                          <TableCell><strong>Quantity</strong></TableCell>
                          <TableCell><strong>Price</strong></TableCell>
                          <TableCell><strong>Trade Date</strong></TableCell>
                          <TableCell><strong>Order Type</strong></TableCell>
                          <TableCell><strong>Comment</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                          <TableRow key={index}>
                              <TableCell>{order.symbol}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell>${order.price}</TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                              <TableCell>{order.order_type}</TableCell>
                              <TableCell>
                                  {order.comment ? (
                                    <Button
                                      variant="outlined"
                                      onClick={() => handleViewComment(order)}
                                    >
                                        View Comment
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleAddComment(order)}
                                    >
                                        Add Comment
                                    </Button>
                                  )}
                              </TableCell>
                              <TableCell style={{ color: order.status === "open" ? "green" : "red" }}>
                                  {order.status}
                              </TableCell>
                              <TableCell>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setCloseDialogOpen(true);
                                    }}
                                  >
                                      Close Trade
                                  </Button>
                              </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                No orders found.
                            </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
              </Table>
          </TableContainer>

          {/* Dialogs */}
          <CreateOrder open={open} onClose={handleClose} refreshOrders={fetchData} />
          <CloseTrade
            open={closeDialogOpen}
            onClose={() => setCloseDialogOpen(false)}
            order={selectedOrder}
            refreshOrders={fetchData}
          />
          <CommentDialog
            open={commentDialogOpen}
            onClose={() => setCommentDialogOpen(false)}
            order={commentOrder}
            mode={commentMode}
            onSave={handleSaveComment}
          />
      </div>
    );
};

export default HomeAuthenticatedView;

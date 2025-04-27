import React, { useState, useEffect, useCallback } from "react";
import DepositDialog from "../components/dialogs/Deposit";
import { fetchDepositHistory, fetchUserData } from "../api/api.js";
import { useSelector } from "react-redux";
import { toast } from "../utils/toastService.js";

export default function Dashboard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [depositHistory, setDepositHistory] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [userInformation, setUserInformation] = useState({});

    const loadDepositHistory = useCallback(async () => {
        try {
            const history = await fetchDepositHistory();
            toast("Loaded Deposit History successfully.", "success");
            setDepositHistory(history);
        } catch (error) {
            console.error("Failed to fetch deposit history:", error);
            toast("Failed to load deposit history. Look console for more Information", "error");
        }
    }, []);

    const loadUserInformation = useCallback(async () => {
        try {
            const response = await fetchUserData(user?.id);
            setUserInformation(response);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast("Failed to load user data. Look console for more Information", "error");
        }
    }, [user?.id]);

    const handleDepositClick = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = async () => {
        setIsDialogOpen(false);
        await loadDepositHistory();
        await loadUserInformation();
    };

    useEffect(() => {
        loadDepositHistory();
    }, [loadDepositHistory]);

    useEffect(() => {
        if (user?.id) {
            loadUserInformation();
        }
    }, [user, loadUserInformation]);

    const stats = [
        // Removed "Open Orders" and "Closed Orders"
        { label: "Total Orders", value: userInformation.total_no_of_orders },
        { label: "Win Rate (%)", value: userInformation.win_rate },
        { label: "Profit Factor", value: userInformation.profit_factor },
        { label: "Avg Profit/Loss", value: userInformation.average_profit_loss },
        { label: "Avg Holding Duration (days)", value: userInformation.average_holding_duration },
        { label: "Total Deposits ($)", value: userInformation.total_deposits },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                  <button
                    onClick={handleDepositClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md"
                  >
                      Add Deposit
                  </button>
              </div>

              <DepositDialog open={isDialogOpen} onClose={handleCloseDialog} />

              {/* Account Overview */}
              <div className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6">
                            <div className="flex flex-col items-center">
                                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {stat.value !== undefined ? stat.value : "-"}
                                </p>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>

              {/* Deposit History */}
              <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Deposit History</h2>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                              <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Amount
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Deposit Date
                                  </th>
                              </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                              {depositHistory.length > 0 ? (
                                depositHistory.map((deposit) => (
                                  <tr key={deposit.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                          ${deposit.amount}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {new Date(deposit.deposited_at).toLocaleDateString()}
                                      </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No deposits found.
                                    </td>
                                </tr>
                              )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}
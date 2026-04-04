import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import ExpenseChart from '../components/ExpenseChart';
import ExpenseList from '../components/ExpenseList';
import { Download, Mail, Plus } from 'lucide-react';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import toast from 'react-hot-toast';
import moment from 'moment';
import Modal from '../components/Modal';
import AddExpenseForm from '../components/AddExpenseForm';

const Expense = () => {
    useUser();
    const [expenseData, setExpenseData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [editExpense, setEditExpense] = useState(null);

    const fetchExpenses = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_EXPENSE);
            if (response.status === 200) {
                setExpenseData(response.data);
                prepareChartData(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axiosConfig.get(`${API_ENDPOINTS.GET_ALL_CATEGORIES}/expense`);
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch categories", error);
        }
    }

    const prepareChartData = (data) => {
        const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        const chartData = sortedData.map(item => ({
            date: moment(item.date).format('MMM Do'),
            amount: item.amount
        }));
        setChartData(chartData);
    }

    const handleAddExpense = async (expense) => {
        const { name, amount, date, categoryId, icon } = expense;
        if (!name || !amount || !date || !categoryId) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            let response;
            if (editExpense) {
                // Update mode
                response = await axiosConfig.put(`${API_ENDPOINTS.UPDATE_EXPENSE}/${editExpense.id}`, expense);
                if (response.status === 200) {
                    toast.success("Expense updated successfully");
                }
            } else {
                // Add mode
                response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, expense);
                if (response.status === 201) {
                    toast.success("Expense added successfully");
                }
            }

            if (response && (response.status === 200 || response.status === 201)) {
                setOpenAddExpenseModal(false);
                setEditExpense(null);
                fetchExpenses();
            }
        } catch (error) {
            toast.error(editExpense ? "Failed to update expense" : "Failed to add expense");
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            const response = await axiosConfig.delete(`${API_ENDPOINTS.DELETE_EXPENSE}/${id}`);
            if (response.status === 204) {
                toast.success("Expense deleted successfully");
                fetchExpenses();
            }
        } catch (error) {
            toast.error("Failed to delete expense");
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DOWNLOAD_EXPENSE, { responseType: 'blob' });
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'expense_details.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success("Download started");
            }
        } catch (error) {
            toast.error("Failed to download");
        }
    }

    const handleEmail = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
            if (response.status === 200) {
                toast.success("Email sent successfully");
            }
        } catch (error) {
            toast.error("Failed to send email");
        }
    }

    const handleEdit = (expense) => {
        setEditExpense(expense);
        setOpenAddExpenseModal(true);
    }

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, []);

    return (
        <Dashboard activeMenu="Expense">
            <div className="mx-auto my-5 space-y-6">
                {/* Chart Section */}
                <div className="card p-6 ">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Expense Overview</h2>
                            <p className="text-sm text-gray-500">Track your spending trends over time and gain insights into where your money goes.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditExpense(null);
                                setOpenAddExpenseModal(true);
                            }}
                            className="add-btn flex items-center gap-1">
                            <Plus size={15} />
                            Add Expense
                        </button>
                    </div>
                    <div className="h-80">
                        <ExpenseChart data={chartData} />
                    </div>
                </div>

                {/* Actions & List Section */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">All Expenses</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={handleEmail}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                                <Mail size={16} />
                                Email
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    </div>

                    <ExpenseList expenses={expenseData} onDelete={handleDelete} onEdit={handleEdit} />

                    <Modal
                        title={editExpense ? "Edit Expense" : "Add Expense"}
                        isOpen={openAddExpenseModal}
                        onClose={() => {
                            setOpenAddExpenseModal(false);
                            setEditExpense(null);
                        }}
                    >
                        <AddExpenseForm
                            onAddExpense={handleAddExpense}
                            categories={categories}
                            initialData={editExpense}
                            key={editExpense ? `edit-${editExpense.id}` : 'add-new'}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Expense
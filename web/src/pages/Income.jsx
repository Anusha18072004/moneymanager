import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import IncomeChart from '../components/IncomeChart';
import IncomeList from '../components/IncomeList';
import { Download, Mail, Plus } from 'lucide-react';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import toast from 'react-hot-toast';
import moment from 'moment';
import Modal from '../components/Modal';
import AddIncomeForm from '../components/AddIncomeForm';

const Income = () => {
    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [editIncome, setEditIncome] = useState(null);

    const fetchIncomes = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_INCOME);
            if (response.status === 200) {
                setIncomeData(response.data);
                prepareChartData(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axiosConfig.get(`${API_ENDPOINTS.GET_ALL_CATEGORIES}/income`);
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch categories", error);
        }
    }

    const prepareChartData = (data) => {
        // Aggregate amount by date for the chart
        const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        const chartData = sortedData.map(item => ({
            date: moment(item.date).format('MMM Do'),
            amount: item.amount
        }));
        setChartData(chartData);
    }

    const handleAddIncome = async (income) => {
        const { name, amount, date, categoryId, icon } = income;
        if (!name || !amount || !date || !categoryId) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            let response;
            if (editIncome) {
                // Update mode
                response = await axiosConfig.put(`${API_ENDPOINTS.UPDATE_INCOME}/${editIncome.id}`, income);
                if (response.status === 200) {
                    toast.success("Income updated successfully");
                }
            } else {
                // Add mode
                response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, income);
                if (response.status === 201) {
                    toast.success("Income added successfully");
                }
            }

            if (response && (response.status === 200 || response.status === 201)) {
                setOpenAddIncomeModal(false);
                setEditIncome(null);
                fetchIncomes();
            }
        } catch (error) {
            toast.error(editIncome ? "Failed to update income" : "Failed to add income");
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this income?")) return;
        try {
            const response = await axiosConfig.delete(`${API_ENDPOINTS.DELETE_INCOME}/${id}`);
            if (response.status === 204) {
                toast.success("Income deleted successfully");
                fetchIncomes();
            }
        } catch (error) {
            toast.error("Failed to delete income");
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DOWNLOAD_INCOME, { responseType: 'blob' });
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'income_details.csv');
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
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
            if (response.status === 200) {
                toast.success("Email sent successfully");
            }
        } catch (error) {
            toast.error("Failed to send email");
        }
    }

    const handleEdit = (income) => {
        setEditIncome(income);
        setOpenAddIncomeModal(true);
    }

    useEffect(() => {
        fetchIncomes();
        fetchCategories();
    }, []);

    return (
        <Dashboard activeMenu="Income">
            <div className="mx-auto my-5 space-y-6">
                {/* Chart Section */}
                <div className="card p-6 ">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Income Overview</h2>
                            <p className="text-sm text-gray-500">Track your earnings over time and analyze your income trends.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditIncome(null);
                                setOpenAddIncomeModal(true);
                            }}
                            className="add-btn flex items-center gap-1">
                            <Plus size={15} />
                            Add Income
                        </button>
                    </div>
                    <div className="h-80">
                        <IncomeChart data={chartData} />
                    </div>
                </div>

                {/* Actions & List Section */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Income Sources</h2>
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

                    <IncomeList incomes={incomeData} onDelete={handleDelete} onEdit={handleEdit} />

                    <Modal
                        title={editIncome ? "Edit Income" : "Add Income"}
                        isOpen={openAddIncomeModal}
                        onClose={() => {
                            setOpenAddIncomeModal(false);
                            setEditIncome(null);
                        }}
                    >
                        <AddIncomeForm
                            onAddIncome={handleAddIncome}
                            categories={categories}
                            initialData={editIncome}
                            key={editIncome ? `edit-${editIncome.id}` : 'add-new'}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income
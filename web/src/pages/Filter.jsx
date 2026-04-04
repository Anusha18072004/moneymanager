import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import useUser from '../hooks/useUser';
import { Search } from 'lucide-react';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import IncomeList from '../components/IncomeList';
import ExpenseList from '../components/ExpenseList';
import toast from 'react-hot-toast';

const Filter = () => {
    useUser();

    const [filters, setFilters] = useState({
        type: 'income',
        startDate: '',
        endDate: '',
        sortField: 'date',
        sortOrder: 'ASC',
        search: ''
    });

    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    // Auto fetch when type changes
    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.type]);

    const handleSearch = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const endpoint =
                filters.type === 'income'
                    ? API_ENDPOINTS.FILTER_INCOME
                    : API_ENDPOINTS.FILTER_EXPENSE;

            const params = {
                startDate: filters.startDate,
                endDate: filters.endDate,
                sortBy: filters.sortField,
                sortDirection: filters.sortOrder,
                keyword: filters.search
            };

            const response = await axiosConfig.get(endpoint, { params });

            if (response.status === 200) {
                setResults(response.data || []);
                setSearched(true);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch filtered data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${filters.type}?`)) return;

        try {
            const endpoint =
                filters.type === 'income'
                    ? API_ENDPOINTS.DELETE_INCOME
                    : API_ENDPOINTS.DELETE_EXPENSE;

            const response = await axiosConfig.delete(`${endpoint}/${id}`);

            if (response.status === 204) {
                toast.success(
                    `${filters.type === 'income' ? 'Income' : 'Expense'} deleted successfully`
                );
                handleSearch();
            }
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    return (
        <Dashboard activeMenu="Filters">
            <div className="mx-auto my-5 space-y-6">
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Filter Transactions
                    </h2>

                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Select the filters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                            {/* Type */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Type</label>
                                <select
                                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={filters.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>

                            {/* Start Date */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={filters.startDate}
                                    onChange={(e) => handleChange('startDate', e.target.value)}
                                />
                            </div>

                            {/* End Date */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={filters.endDate}
                                    onChange={(e) => handleChange('endDate', e.target.value)}
                                />
                            </div>

                            {/* Sort Field */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Sort Field
                                </label>
                                <select
                                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={filters.sortField}
                                    onChange={(e) => handleChange('sortField', e.target.value)}
                                >
                                    <option value="date">Date</option>
                                    <option value="amount">Amount</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Sort Order
                                </label>
                                <select
                                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={filters.sortOrder}
                                    onChange={(e) => handleChange('sortOrder', e.target.value)}
                                >
                                    <option value="ASC">Ascending</option>
                                    <option value="DESC">Descending</option>
                                </select>
                            </div>

                            {/* Search */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Search
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={filters.search}
                                        onChange={(e) => handleChange('search', e.target.value)}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Transactions
                        </h3>

                        {!searched ? (
                            <p className="text-gray-500 text-sm">
                                Select filters and click search to view results
                            </p>
                        ) : (
                            <div className="max-h-[600px] overflow-y-auto pr-2">
                                {results.length > 0 ? (
                                    filters.type === 'income' ? (
                                        <IncomeList
                                            incomes={results}
                                            onDelete={handleDelete}
                                        />
                                    ) : (
                                        <ExpenseList
                                            expenses={results}
                                            onDelete={handleDelete}
                                        />
                                    )
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-gray-500">
                                            No transactions found
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default Filter;

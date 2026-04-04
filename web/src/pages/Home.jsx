import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import InfoCard from '../components/InfoCard';
import { CircleDollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import RecentTransactions from '../components/RecentTransactions';
import FinancialOverview from '../components/FinancialOverview';

const Home = () => {
    useUser();
    const [dashboardData, setDashboardData] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_DASHBOARD_DATA);
            if (response.status === 200) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.log("Failed to fetch dashboard data", error);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <Dashboard activeMenu="Dashboard">
            <div className="mx-auto my-5 space-y-6">

                {/* Info Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoCard
                        icon={<Wallet size={24} />}
                        title="Total Balance"
                        amount={dashboardData?.totalBalance}
                        color="bg-indigo-600"
                    />
                    <InfoCard
                        icon={<TrendingUp size={24} />}
                        title="Total Income"
                        amount={dashboardData?.totalIncome}
                        color="bg-emerald-500"
                    />
                    <InfoCard
                        icon={<TrendingDown size={24} />}
                        title="Total Expenses"
                        amount={dashboardData?.totalExpenses}
                        color="bg-rose-500"
                    />
                </div>

                {/* Main Overview Section: Transactions & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <RecentTransactions transactions={dashboardData?.recentTransactions || []} />
                    </div>
                    <div>
                        <FinancialOverview
                            balance={dashboardData?.totalBalance}
                            income={dashboardData?.totalIncome}
                            expense={dashboardData?.totalExpenses}
                        />
                    </div>
                </div>

                {/* Detailed Breakdown Section: Recent Incomes & Expenses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecentTransactions
                        title="Recent Incomes"
                        linkTo="/income"
                        transactions={dashboardData?.recent5Incomes?.map(i => ({ ...i, type: 'income' })) || []}
                    />
                    <RecentTransactions
                        title="Recent Expenses"
                        linkTo="/expense"
                        transactions={dashboardData?.recent5Expences?.map(e => ({ ...e, type: 'expense' })) || []}
                    />
                </div>

            </div>
        </Dashboard>
    )
}

export default Home
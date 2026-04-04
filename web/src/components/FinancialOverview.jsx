import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4f46e5", "#ef4444", "#10b981"]; // Indigo (Balance), Red (Expense), Green (Income)

const FinancialOverview = ({ balance, income, expense }) => {
    const data = [
        { name: "Total Balance", value: parseFloat(balance) || 0 },
        { name: "Total Expenses", value: parseFloat(expense) || 0 },
        { name: "Total Income", value: parseFloat(income) || 0 },
    ];

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Financial Overview</h3>
            <div className="h-96 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={100}
                            outerRadius={140}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-gray-400 text-sm">Total Balance</p>
                    <p className="text-2xl font-bold text-gray-800">₹{balance?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialOverview;

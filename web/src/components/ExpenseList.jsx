import { Trash2 } from "lucide-react";
import moment from "moment";

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
    return (
        <div className="card p-4 mt-6">
            <h4 className="text-lg font-semibold mb-4">All Expenses</h4>
            {expenses.length === 0 ? (
                <p className="text-gray-500">No expense records found.</p>
            ) : (
                <div className="space-y-4">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center text-xl bg-white rounded-full shadow-sm">
                                    {expense.icon ? (
                                        expense.icon.includes('http') ? (
                                            <img src={expense.icon} alt={expense.name} className="w-6 h-6" />
                                        ) : (
                                            <span>{expense.icon}</span>
                                        )
                                    ) : (
                                        <span>💸</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{expense.name}</p>
                                    <p className="text-xs text-gray-400">
                                        {moment(expense.date).format("Do MMM YYYY")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => onEdit(expense)}
                                    className="text-gray-300 hover:text-indigo-500 transition-colors cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                </button>
                                <button
                                    onClick={() => onDelete(expense.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer">
                                    <Trash2 size={18} />
                                </button>
                                <p className="font-semibold text-red-500">
                                    ₹{expense.amount?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpenseList;

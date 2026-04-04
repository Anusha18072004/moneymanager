import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";

const RecentTransactions = ({ transactions, title = "Recent Transactions", linkTo = "/income" }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
                <Link to={linkTo} className="text-sm border border-gray-200 px-3 py-1 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                    More →
                </Link>
            </div>

            <div className="space-y-4">
                {transactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-50 rounded-full">
                                {txn.icon ? (
                                    txn.icon.includes('http') ? (
                                        <img src={txn.icon} alt={txn.name} className="w-6 h-6" />
                                    ) : (
                                        <span>{txn.icon}</span>
                                    )
                                ) : (
                                    <span>💰</span>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{txn.name}</p>
                                <p className="text-xs text-gray-400">{moment(txn.date).format("Do MMM YYYY")}</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2 font-semibold text-sm ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                            {txn.type === 'income' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                            {txn.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentTransactions;

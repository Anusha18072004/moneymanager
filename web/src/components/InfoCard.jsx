
const InfoCard = ({ icon, title, amount, color }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 flex items-center justify-center text-white text-xl rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-xl font-bold text-gray-800">₹{amount?.toLocaleString()}</h3>
            </div>
        </div>
    );
};

export default InfoCard;

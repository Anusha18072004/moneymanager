import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";


const Input = ({ label, value, onChange, placeholder, type, isSelect, options }) => {
    const [showpassword, setShowpassword] = useState(false);

    const toggleShowPassword = () => {
        setShowpassword(!showpassword);
    }
    return (
        <div className="mb-4">
            <label className="text-[13px] text-slate-800 block mb-1">{label}</label>
            <div className="relative">
                {isSelect ? (
                    <select
                        className="w-full bg-transparent outline-none border border-gray rounded-md py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        value={value}
                        onChange={(e) => onChange(e)}>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                ) : (
                    <input type={type === "password" ? (showpassword ? "text" : "password") : type}
                        value={value}
                        onChange={(e) => onChange(e)}
                        placeholder={placeholder}
                        className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" />
                )}
                {type === "password" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showpassword ? (
                            <Eye
                                size={20}
                                className="text-indigo-800"
                                onClick={toggleShowPassword}
                            />) : (
                            <EyeOff
                                size={20}
                                className="text-slate-400"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input;
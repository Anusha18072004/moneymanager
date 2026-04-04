import React, { useState, useEffect } from "react";
import Input from "./Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({ onAddIncome, categories, initialData }) => {
    const [income, setIncome] = useState({
        name: initialData?.name || "",
        amount: initialData?.amount || "",
        date: initialData?.date || "",
        categoryId: initialData?.categoryId || "",
        icon: initialData?.icon || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setIncome({ ...income, [key]: value });
    };

    const handleCategoryChange = (categoryId) => {
        const selectedCategory = categories.find((c) => c.id === parseInt(categoryId));
        if (selectedCategory) {
            setIncome({
                ...income,
                categoryId: categoryId,
                icon: selectedCategory.icon || "",
            });
        } else {
            setIncome({ ...income, categoryId });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddIncome(income);
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = [
        { value: "", label: "Select Category" },
        ...categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
        }))
    ];

    return (
        <div className="p-4">
            <EmojiPickerPopUp
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <div className="space-y-4">
                <Input
                    value={income.name}
                    onChange={({ target }) => handleChange("name", target.value)}
                    placeholder="e.g. Salary, Freelance"
                    label="Income Name"
                    type="text"
                />

                <Input
                    value={income.amount}
                    onChange={({ target }) => handleChange("amount", target.value)}
                    placeholder="e.g. 5000"
                    label="Amount"
                    type="number"
                />

                <Input
                    value={income.date}
                    onChange={({ target }) => handleChange("date", target.value)}
                    label="Date"
                    type="date"
                />

                <Input
                    value={income.categoryId}
                    onChange={({ target }) => handleCategoryChange(target.value)}
                    label="Category"
                    type="text"
                    isSelect={true}
                    options={categoryOptions}
                />
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            {initialData ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        initialData ? "Update Income" : "Add Income"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm;

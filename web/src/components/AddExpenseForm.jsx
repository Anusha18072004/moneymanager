import React, { useState } from "react";
import Input from "./Input";
import EmojiPickerPopUp from "./EmojiPickerPopUp";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories, initialData }) => {
    const [expense, setExpense] = useState({
        name: initialData?.name || "",
        amount: initialData?.amount || "",
        date: initialData?.date || "",
        categoryId: initialData?.categoryId || "",
        icon: initialData?.icon || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setExpense({ ...expense, [key]: value });
    };

    const handleCategoryChange = (categoryId) => {
        const selectedCategory = categories.find((c) => c.id === parseInt(categoryId));
        if (selectedCategory) {
            setExpense({
                ...expense,
                categoryId: categoryId,
                icon: selectedCategory.icon || "",
            });
        } else {
            setExpense({ ...expense, categoryId });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense);
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
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <div className="space-y-4">
                <Input
                    value={expense.name}
                    onChange={({ target }) => handleChange("name", target.value)}
                    placeholder="e.g. Rent, Groceries"
                    label="Expense Name"
                    type="text"
                />

                <Input
                    value={expense.amount}
                    onChange={({ target }) => handleChange("amount", target.value)}
                    placeholder="e.g. 2000"
                    label="Amount"
                    type="number"
                />

                <Input
                    value={expense.date}
                    onChange={({ target }) => handleChange("date", target.value)}
                    label="Date"
                    type="date"
                />

                <Input
                    value={expense.categoryId}
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
                        initialData ? "Update Expense" : "Add Expense"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;

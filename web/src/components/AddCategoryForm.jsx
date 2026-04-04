import { useState } from "react"
import Input from "./Input"
import EmojiPickerPopUp from "./EmojiPickerPopUp"
import { LoaderCircle } from "lucide-react"

const AddCategoryForm = ({ onAddCategory, existingCategory }) => {
    const [category, setCategory] = useState({
        name: existingCategory?.name || "",
        type: existingCategory?.type || "income",
        icon: existingCategory?.icon || ""
    })
    const [loading, setLoading] = useState(false);
    const categoryTypesOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" },
    ]
    const handleChange = (key, value) => {
        setCategory({ ...category, [key]: value })
    }


    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <EmojiPickerPopUp
                icon={category.icon}
                onSelect={(selcetedIcon) => handleChange("icon", selcetedIcon)}
            />

            <Input
                value={category.name}
                onChange={({ target }) => handleChange("name", target.value)}
                placeholder="e.g.,Freelance,Salary,Bonus"
                label="Category Name"
                type="text"
            />
            <Input
                value={category.type}
                onChange={({ target }) => handleChange("type", target.value)}
                label="Category Type"
                type="text"
                isSelect={true}
                options={categoryTypesOptions}
            />
            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2">
                    {loading ? (<>
                        <LoaderCircle className="animate-spin w-4 h-4" />
                        {existingCategory ? "Updating.." : "Adding.."}
                    </>) : <>
                        {existingCategory ? "Update Category" : "Add Category"}
                    </>}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryForm
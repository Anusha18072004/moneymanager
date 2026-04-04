import React from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
import { Plus } from 'lucide-react';
import CategoryList from '../components/CategoryList';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import axiosConfig from '../util/axiosConfig';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const fetchCategoryDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                console.log('categories', response.data);
                setCategoryData(response.data);
            }

        } catch (error) {
            console.log('Something went wrong.please try again', error);
            toast.error(error?.message || 'Something went wrong. Please try again');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const { name, type, icon } = category;

        if (!name.trim()) {
            toast.error("Category Name is required");
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, category);
            if (response.status === 201) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.log('Something went wrong.please try again', error);
            toast.error(error?.message || 'Failed to add category');
        }

    }

    const handleUpdateCategory = async (categoryId, category) => {
        try {
            const response = await axiosConfig.put(`${API_ENDPOINTS.UPDATE_CATEGORY}/${categoryId}`, category);
            if (response.status === 200) {
                toast.success("Category updated successfully");
                setOpenAddCategoryModal(false);
                setSelectedCategory(null);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.log('Something went wrong.please try again', error);
            toast.error(error?.message || 'Failed to update category');
        }
    }

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold">All Categories</h2>
                    <button
                        onClick={() => setOpenAddCategoryModal(true)}
                        className="add-btn flex items-center gap-1">
                        <Plus size={15} />
                        Add Category
                    </button>
                </div>

                <CategoryList
                    categories={categoryData}
                    onEditCategory={(category) => {
                        setSelectedCategory(category);
                        setOpenAddCategoryModal(true);
                    }}
                />

                <Modal title={selectedCategory ? "Edit Category" : "Add Category"}
                    isOpen={openAddCategoryModal}
                    onClose={() => {
                        setOpenAddCategoryModal(false);
                        setSelectedCategory(null);
                    }}>

                    <AddCategoryForm
                        existingCategory={selectedCategory}
                        onAddCategory={selectedCategory ? (data) => handleUpdateCategory(selectedCategory.id, data) : handleAddCategory}
                    />
                </Modal>

            </div>
        </Dashboard>
    )
}
export default Category

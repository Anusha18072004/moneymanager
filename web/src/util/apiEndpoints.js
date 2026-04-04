export const BASE_URL = "http://localhost:8084/api/v1.0";

const CLOUDINARY_CLOUD_NAME = "dhxvzmdlf";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    GET_USER_INFO: "/profile",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload `,
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: "/categories",
    GET_INCOME: "/incomes",
    ADD_INCOME: "/incomes",
    DELETE_INCOME: "/incomes",
    DOWNLOAD_INCOME: "/incomes/download",
    EMAIL_INCOME: "/incomes/email",
    GET_EXPENSE: "/expenses",
    ADD_EXPENSE: "/expenses",
    DELETE_EXPENSE: "/expenses",
    DOWNLOAD_EXPENSE: "/expenses/download",
    EMAIL_EXPENSE: "/expenses/email",
    FILTER_INCOME: "/incomes/filter",
    FILTER_EXPENSE: "/expenses/filter",
    GET_DASHBOARD_DATA: "/dashboard",
};
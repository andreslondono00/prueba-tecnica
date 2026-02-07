export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: Pagination;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    errors?: string[];
}
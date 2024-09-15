export interface ProductCardProps {
    id: number;
    title: string;
    price: number;
    pid?: string;
    createdAt?: string;
    updatedAt?: string;
    photos: string;
    isCart?: boolean;
    isAuthenticated: string| undefined;
}

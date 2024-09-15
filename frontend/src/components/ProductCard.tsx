import React from 'react';
import { ProductCardProps } from '../helpers/types';

interface ExtendedProductCardProps extends ProductCardProps {
    updateCartItemCount: () => void;
    isAddedToCart: boolean;
    FetchCartItems?: () => void;
}

const ProductCard: React.FC<ExtendedProductCardProps> = ({ id, title, price, photos, isCart, isAuthenticated, updateCartItemCount, isAddedToCart,FetchCartItems }) => {
   

    
    const handleAddToCart = (productId: number) => {
        console.log("handleAddToCart",productId);
        
        fetch('/api/addcart', {
            method: 'PUT',
            body: JSON.stringify({ productId }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                // call the fn to update the cart count
                updateCartItemCount();
            })
            .catch((err) => console.error('Add to cart failed:', err));
    };

    const handleRemoveFromCart = (productId: number) => {
        fetch('/api/removecart', {
            method: 'PUT',
            body: JSON.stringify({ productId }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                // call the fn to update the cart count
                updateCartItemCount();
                FetchCartItems && FetchCartItems();
                
            })
            .catch((err) => console.error('Remove from cart failed:', err));
    };

    return (
        <div className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                <img
                    className="object-cover object-center w-full h-full"
                    src={photos}
                    alt={title}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/Default_product_img.png';
                    }}
                />
               
            </div>
            <div className="mt-4 px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">{title}</h5>
                </a>
                <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                        <span className="text-3xl font-bold text-slate-900">${price}</span>
                    </p>
                </div>
                {!isCart ? (
                    isAuthenticated ? (
                        !isAddedToCart? (<button
                            id="add_to_cart_button"
                            className="w-full flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            data-product-id={id}
                            onClick={() => handleAddToCart(id)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Add to cart 
                        </button>
                        ) : (
                            <button
                                id="remove_from_cart_button"
                                className="w-full flex items-center justify-center rounded-md bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                data-product-id={id}
                                onClick={() => handleRemoveFromCart(id)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                Remove from cart
                            </button>
                        ) 
                    ) : (
                        <a
                            className="w-full flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            href="/auth/signin"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Sign In to Add to Cart
                        </a>
                    )
                ) : (
                    <button
                        id="remove_from_cart_button"
                        className="w-full flex items-center justify-center rounded-md bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        data-product-id={id}
                        onClick={() => handleRemoveFromCart(id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Remove from cart
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;

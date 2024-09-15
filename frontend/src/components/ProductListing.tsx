
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ProductCardProps } from '../helpers/types';
import  ProductCard  from './ProductCard';
import { fetchProductData } from "../pages/api/products";
//serverUrl props from Astro
const ProductListing = ({ serverUrl, isAuthenticated }: { serverUrl: string, isAuthenticated : string | undefined}) => {
    const [products, setProducts] = useState<ProductCardProps[]>([]);
    console.log('PUBLIC_SERVER_URL:', serverUrl);

    const [cartItems, setCartItems] = useState<{ cart: { id: number }[] }>({ cart: [] });
    async function updateCartItemCount() {
        try {
            const response = await fetch(`/api/getcart`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const cartItems = await response.json();
            setCartItems(cartItems);

            // Wait until the DOM is fully loaded

            console.log("inside script", cartItems);

            const cartItemCount = document.getElementById("cart_item_count");
            if (cartItemCount) {
                cartItemCount.innerText = cartItems.cart.length;
                console.log(cartItems.cart.length);
            } else {
                console.error('Element with id "cart_item_count" not found.');
            }

        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    function handleProductCreate(data: ProductCardProps) {
        console.log('Product created:', data);
        
        setProducts([...products, data]);
    }

    function handleProductUpdate(data: ProductCardProps) {
        const updatedProducts = products.map((product) => {
            if (product.id === data.id) {
                return data;
            }
            return product;
        })
        console.log('Updated Products:', updatedProducts);
        
        setProducts(updatedProducts);
    }

    function handleDeleteProduct(data: ProductCardProps) {
        const updatedProducts = products.filter((product) => product.id !== data.id);
        console.log('Deleted Products:', updatedProducts);
        setProducts(updatedProducts);
    }

    const fetchProduct = async () => {
        const data = await fetchProductData();
        setProducts(data);
    }

    useEffect(() => {
        fetchProduct();
        updateCartItemCount();
        console.log('Connecting to WebSocket:', serverUrl);
        const socket = io(serverUrl);

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('product:create', (data) => {
            console.log('Product created:', data);
            handleProductCreate(data);
        });

        socket.on('product:update', (data) => {
            console.log('Product updated:', data);
            handleProductUpdate(data);
        });

        socket.on('product:delete', (data) => {
            console.log('Product deleted:', data);
            handleDeleteProduct(data);
        });

        socket.on('server:heartbeat', (data) => {
            console.log('Heartbeat from server:', data);
        });

        return () => {
            console.log('Disconnecting WebSocket');
            socket.disconnect(); // Clean up on unmount
            console.log('Disconnected WebSocket');

        };
    }, []);

    return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-5">
            {products &&
                products.map((product)=> {
                    return (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            photos={product.photos}
                            pid = {product.pid}
                            createdAt = {product.createdAt}
                            updatedAt = {product.updatedAt}
                            isAuthenticated = {isAuthenticated}
                            updateCartItemCount={updateCartItemCount}
                            isAddedToCart={cartItems.cart.some((item) => item.id === product.id)}
                        />
                    )
                })
            }
        </div>
    )
};

export default ProductListing;

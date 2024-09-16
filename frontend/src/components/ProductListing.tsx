
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ProductCardProps } from '../helpers/types';
import ProductCard from './ProductCard';
//serverUrl props from Astro
const ProductListing = ({ isProd, serverUrl, isAuthenticated }: { isProd: boolean, serverUrl: string, isAuthenticated: string | undefined }) => {

    console.log('PUBLIC_SERVER_URL:', serverUrl);


    const [products, setProducts] = useState<ProductCardProps[]>([]);
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
            const cart = cartItems?.cart ?? [];

            // Wait until the DOM is fully loaded

            const cartItemCount = document.getElementById("cart_item_count");
            if (cartItemCount) {

                cartItemCount.innerText = cart.length;
                console.log(cart.length);
            } else {
                console.error('Element with id "cart_item_count" not found.');
            }

        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    function handleProductCreate(data: ProductCardProps) {
        console.log('Product created:', data);

        setProducts((prevProducts)=>{
            const updatedProducts = [...prevProducts, data];
            console.log('Updated Products:', updatedProducts);
            return updatedProducts;
        });
    }

    function handleProductUpdate(data: ProductCardProps) {
        console.log("handleProductUpdate data:", data);
        setProducts((prevProducts)=>{
            console.log("before update products:", prevProducts);
    
    
            const updatedProducts = prevProducts.map((product) => {
                if (product.id === data.id) {
                    return data;
                }
                return product;
            })

            return updatedProducts;
        })
       
    }

    function handleDeleteProduct(data: ProductCardProps) {
        setProducts((prevProducts)=>{
            const updatedProducts = prevProducts.filter((product) => product.id !== data.id);
            console.log('Deleted Products:', updatedProducts);
            return updatedProducts;
        });
    }

    async function fetchProduct() {
        console.log("inside fetchProduct of productListing");

        const response = await fetch(`/api/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        console.log("inside fetchProduct of productListing, products =", data);
        const products = data.products;
        setProducts(products);
    }

    useEffect(() => {
        const initialize = async () => {

            await fetchProduct();
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
        }
        initialize();
    }, []);

    return (<>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-5">
            {products &&
                products.map((product) => {
                    return (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            photos={isProd ? product.photos : `${serverUrl}${product.photos}`}
                            pid={product.pid}
                            createdAt={product.createdAt}
                            updatedAt={product.updatedAt}
                            isAuthenticated={isAuthenticated}
                            updateCartItemCount={updateCartItemCount}
                            isAddedToCart={cartItems.cart ? cartItems.cart.some((item) => item.id === product.id) : false}
                        />
                    )
                })
            }
        </div>
    </>
    )
};

export default ProductListing;

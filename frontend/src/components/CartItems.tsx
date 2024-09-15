import { useEffect, useState } from 'react';
import { ProductCardProps } from '../helpers/types';
import ProductCard from './ProductCard';

const CartItems = ({ serverUrl, isAuthenticated, clientUrl }: { clientUrl: string, serverUrl: string, isAuthenticated: string | undefined }) => {
    console.log('PUBLIC_SERVER_URL:', serverUrl);


    async function updateCartItemCount() {
        try {
            const response = await fetch(`/api/getcart`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const cartItems = await response.json();


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

    const [cartItems, setCartItems] = useState<ProductCardProps[]>([]);
    const FetchCartItems = async () => {
        // Fetch cart data
        const response = await fetch(`${clientUrl}/api/getfullcart`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${isAuthenticated}`,
            },
        });
        const data = await response.json();
        const products = data ? data.cart : [];
        setCartItems(products);
    }
    useEffect(() => {
        if (isAuthenticated) {
            FetchCartItems();
        }
        console.log("isAuthenticated", isAuthenticated);

    }, [])
    return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-5">
            {
                cartItems.map((product: ProductCardProps) => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        isCart={true}
                        isAuthenticated={isAuthenticated}
                        updateCartItemCount={updateCartItemCount}
                        isAddedToCart={true} 
                        FetchCartItems={FetchCartItems}
                        />

                ))
           }
        </div>
    )

}

export default CartItems;


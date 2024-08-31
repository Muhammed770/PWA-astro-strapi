import showToast from "../../helpers/showToast";

// Update cart items
export const updateCart = async (actionName:"add"| "delete", productId:any) => {
    try {
        console.log("updateCart");
        
        const jwtToken = document.cookie.split('jwt_token=')[1];
        if (!jwtToken) {
            showToast("Error", "OOPS :( Maybe you haven't SIGN IN 😬");
            return;
        }

        // Fetch the current user's cart
        const cartRes = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/cart`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!cartRes.ok) {
            showToast("Error", "OOPS :( Maybe you haven't SIGN IN 😬");
            return;
        }

        const cart = await cartRes.json();
        //@ts-ignore
        let updatedCart = cart.products.map(product => product.id);
        let isAlreadyInCart = updatedCart.includes(productId);

        // Handle adding or deleting products from the cart
        if (actionName === "add" && !isAlreadyInCart) {
            updatedCart.push(productId);
            await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/cart/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });
            showToast("Success", "Product added to cart!");
        } else if (actionName === "delete" && isAlreadyInCart) {
            //@ts-ignore
            updatedCart = updatedCart.filter(id => id !== productId);
            await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/cart/remove`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId }),
            });
            showToast("Success", "Product removed from cart!");
        } else {
            showToast("Cart", "Product is already in your cart!");
        }

    } catch (err) {
        showToast("Error", "OOPS :( Maybe you haven't SIGN IN 😬");
    }
};

import { PUBLIC_SERVER_URL } from "astro:env/client";
import type { APIRoute } from "astro";
import { parseCookies } from "../../helpers/lib"
// Function to get the user ID from the JWT
const getUserIdFromJwt = async (jwtToken: string) => {
    try {
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        return data.id; // Return the user ID
    } catch (error) {
        throw new Error('Error retrieving user ID: ' + error);
    }
};

export const PUT: APIRoute = async ({ request }) => {

    // Extract JWT token from httpOnly cookie
    const cookies = request.headers.get('cookie');

    const cookieMap = parseCookies(cookies);
    const jwtToken = cookieMap.jwt_token;
    console.log("jwtToken", jwtToken);
    if (!jwtToken) {
        console.log("Authorization header missing", jwtToken);

        return new Response("Authorization header missing", {
            status: 400,
        });
    }

    try {

        const userId = await getUserIdFromJwt(jwtToken); // Get the user ID from the JWT
        const { productId } = await request.json(); // Extract userId and productId from the request body

        if (!userId || !productId) {
            return new Response("User ID and Product ID are required", {
                status: 400,
            });
        }
        console.log(userId, productId);

        // Send PUT request to Strapi to add product to user's cart
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                cart: {
                    disconnect: [productId], //  Remove the product from the cart
                },

            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update cart");
        }

        const data = await response.json();
        return new Response(JSON.stringify({
            success: true,
            data,
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add product to cart' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};


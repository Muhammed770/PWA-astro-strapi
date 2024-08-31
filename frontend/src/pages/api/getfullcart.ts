import { PUBLIC_CLIENT_URL, PUBLIC_SERVER_URL } from "astro:env/client";
import type { APIRoute } from "astro";
import { parseCookies } from "../../helpers/lib";

export const GET: APIRoute = async ({ request }) => {

    // extract JWT token from header authorization
    const jwtToken = request.headers.get('authorization')?.split('Bearer ')[1];

    try {
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/users/me?populate=cart`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const data = await response.json();
        //get product ids, and fetch full data by product id
        const productIds = data.cart.map((item: any) => item.id);
        const alldetails = await Promise.all(productIds.map(async (id: any) => {
            const response = await fetch(`${PUBLIC_CLIENT_URL}/api/products/${id}`);
            const data = await response.json();
            return data;
        }
        ));

        return Response.json({
            success: true,
            cart: alldetails,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), {
            status: 500,
        });
    }
};
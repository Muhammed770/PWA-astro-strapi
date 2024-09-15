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
        }));

        const sanitizedData = alldetails.map((product: any) => {
            const { data } = product;
            const { id, attributes } = data;
            const { title, price, pid, createdAt, updatedAt, photos } = attributes;
            return {
                id,
                title,
                price,
                pid,
                createdAt,
                updatedAt,
                photos: photos.data[0].attributes.formats.medium.url
            };
        });

        return Response.json({
            success: true,
            cart: sanitizedData,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), {
            status: 500,
        });
    }
};
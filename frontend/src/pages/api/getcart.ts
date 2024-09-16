import { PUBLIC_SERVER_URL } from "astro:env/client";
import type { APIRoute } from "astro";
import { parseCookies } from "../../helpers/lib";

export const GET: APIRoute = async ({ request }) => {
    // Extract JWT token from httpOnly cookie
    const cookies = request.headers.get('cookie');    
    const cookieMap = parseCookies(cookies);
    const jwtToken = cookieMap.jwt_token;
    if(!jwtToken) {
        return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), {
            status: 500,
        });
    }
    try {
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/users/me?populate=cart`, {
            headers: {
                method: 'GET',
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const data = await response.json();
        
        return Response.json({
            success: true,
            cart: data.cart,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), {        
            status: 500,
        });
    }
};
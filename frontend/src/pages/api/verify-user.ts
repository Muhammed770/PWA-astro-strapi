import { PUBLIC_SERVER_URL } from "astro:env/client";
import type { APIRoute } from "astro";
import { parseCookies } from "../../helpers/lib";

export const GET: APIRoute = async ({ request }) => {
    // Extract JWT token from httpOnly cookie
    const jwtToken = request.headers.get('authorization')?.split('Bearer ')[1];

    try {
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/users/me?populate=cart`, {
            headers: {
                method: 'GET',
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const data = await response.json();
        const isVerified = !!data?.id; 
        return Response.json({
            success: true,
            isVerified: isVerified,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), {
            status: 500,
        });
    }
};
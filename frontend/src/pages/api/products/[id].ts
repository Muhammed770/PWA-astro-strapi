import { PUBLIC_SERVER_URL } from "astro:env/client"
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ params }) => {
    const { id } = params;

    try {
        console.log("product id", id);

        const response = await fetch(`${PUBLIC_SERVER_URL}/api/products/${id}?populate=*`);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
        });
    } catch (error) {
        return new Response("Failed to fetch product", {
            status: 500,
        });
    }
};

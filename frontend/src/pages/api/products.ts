import { PUBLIC_SERVER_URL } from "astro:env/client";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {

    try {
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/products?populate=photos`, {
            headers: {
                method: 'GET',
            },
        });
        const data = await response.json();        
        // Sanitize and format the product data
        const sanitizedData = data.data.map((product: any) => {
            const { id, attributes } = product;
           
            
            const { title, price, pid, createdAt, updatedAt, photos } = attributes;
            // Extract the formats
            const formats = photos.data[0].attributes.formats;

            // Check if medium exists, otherwise fallback to small or thumbnail
            const photoUrl = formats.medium
                ? formats.medium.url
                : formats.small
                    ? formats.small.url
                    : formats.thumbnail.url;
            
            return {
                id,
                title,
                price,
                pid,
                createdAt,
                updatedAt,
                photos: photoUrl
            };
        });

        // Return the sanitized data as a JSON response
        return Response.json({
            success: true,
            products: sanitizedData,
        });
    } catch (error) {
        console.error("Error fetching product data:", error);
        return new Response(JSON.stringify({
            error: 'Failed to fetch product data',
        }), {
            status: 500,
        });
    }
};

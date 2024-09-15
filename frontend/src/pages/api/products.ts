
import { PUBLIC_SERVER_URL } from "astro:env/client";

export async function fetchProductData() {
    const response = await fetch(`${PUBLIC_SERVER_URL}/api/products?populate=photos`);
    const data = await response.json();
    
    
    const sanitizedData = data.data.map((product: any) => {
        const { id, attributes } = product;
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
    })
    console.log("sanitizedData", sanitizedData);
    
    return sanitizedData;
}


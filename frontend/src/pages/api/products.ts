
import { PUBLIC_SERVER_URL } from "astro:env/client";

export async function fetchProductData() {
const response = await fetch(`${PUBLIC_SERVER_URL}/api/products?populate=photos`);
    const data = await response.json();
    return data;
}


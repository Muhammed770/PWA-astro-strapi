
import { PUBLIC_SERVER_URL } from 'astro:env/client';
import type { APIRoute } from 'astro';
export const post:APIRoute = async ({ request }) => {
    const { email, password } = await request.json();

    try {
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier: email, password }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return JSON.stringify({ error: 'Login failed' });
    }
};

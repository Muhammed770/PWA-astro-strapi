
import { PUBLIC_SERVER_URL } from 'astro:env/client';
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
    const { username, email, password } = await request.json();

    try {
        const response = await fetch(`${PUBLIC_SERVER_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return JSON.stringify({ error: 'Registration failed' });
    }
};

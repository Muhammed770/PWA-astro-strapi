import type { APIRoute } from "astro";

// Save cookie
export const POST: APIRoute = ({ request }) => {
    const jwtToken = request.headers.get("Authorization");

    if (!jwtToken) {
        return new Response("Authorization header missing", {
            status: 400,
        });
    }

    const headers = new Headers();
    headers.append(
        "Set-Cookie",
        `jwt_token=${jwtToken}; HttpOnly; Secure; SameSite=Strict; Path=/;`
    );

    return new Response(null, {
        status: 200,
        headers,
    });
};

// Delete cookie
export const GET: APIRoute = () => {
    const headers = new Headers();
    headers.append(
        "Set-Cookie",
        `jwt_token=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict; Path=/;`
    );

    return new Response(null, {
        status: 200,
        headers,
    });
};

export function parseCookies(cookies: string | null) {
    if (!cookies) {
        return {};
    }

    const cookieArr = cookies.split(';');
    const cookieMap: { [key: string]: string } = {};

    cookieArr.forEach((cookie) => {
        const [name, value] = cookie.split('=');
        cookieMap[name.trim()] = decodeURIComponent(value);
    });

    return cookieMap;
}

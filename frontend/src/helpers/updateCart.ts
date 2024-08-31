import {  PUBLIC_CLIENT_URL } from "astro:env/client"

export const updateCart = async (action: "add"|"remove", productId: number) => {
    // const jwtCookie = document.cookie
    //     .split('; ')
    //     .find(cookie => cookie.startsWith('jwt_token='));
    // console.log("inside updatecart ,jwtCookie",jwtCookie);
    
    // // Extract the token if the cookie is found
    // const jwt_token = jwtCookie ? jwtCookie.split('=')[1] : null;

    // if (jwt_token) {
    //     console.log('JWT Token:', jwt_token);
    //     // Proceed with the API call using the jwt_tocken
    //     await fetch(`${PUBLIC_CLIENT_URL}/api/addcart`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${jwt_token}`,
    //         },
    //         body: JSON.stringify({ productId }),
    //     });
    // } else {
    //     console.error('JWT token not found in cookies');
    //     // Handle the absence of the JWT token (e.g., redirect to login or show a message)
    // }
    // console.log("inside updatecart ,jwt",jwt_token);
    
    if(action === 'add') {
        await fetch(`${PUBLIC_CLIENT_URL}/api/addcart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "productId": 2
            })
        })
    }
    if(action === 'remove') {
        await fetch(`${PUBLIC_CLIENT_URL}/api/removecart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productId})
        })
    }
}
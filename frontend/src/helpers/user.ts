import showToast from "./showToast";
import { PUBLIC_SERVER_URL, PUBLIC_CLIENT_URL}  from "astro:env/client"
// Authenticate user
export const authUser = async (payload: FormData, actionName: string) => {
  // Get url according to action
  const url =
    actionName === "sign_in"
      ? `${PUBLIC_SERVER_URL}/api/auth/local`
      : `${PUBLIC_SERVER_URL}/api/auth/local/register`;

  const response = await fetch(url, {
    method: "POST",
    body: payload,
  });

  const data = await response.json();

  // Check for jwt token
  if (data.jwt) {
    // Success! Save jwt token to cookie using 'cookie' endpoint
    fetch(`${PUBLIC_CLIENT_URL}/api/cookie`, {
      method: "POST",
      headers: { Authorization: `${data.jwt}` },
    }).then((res) => {
      // Redirect
      window.location.href = "/";
    });
  } else {
    showToast("Error", "Something went wrong. Try again!");
  }
};

export const signOut = () => {
  fetch(`${PUBLIC_CLIENT_URL}/api/cookie`)
    .then((res) => {
      // Redirect
      window.location.href = "/auth/signin";
    })
    .catch((err) => showToast("Error", "Something went wrong :("));
};

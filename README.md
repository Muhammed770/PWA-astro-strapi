
# PWA-Astro-Strapi

This is a Progressive Web Application (PWA) built using Astro.js for the frontend and Strapi for the backend. The project allows users to view products, sign up, sign in, add products to their cart, and remove them from the cart.

https://github.com/user-attachments/assets/2038ab7b-a4b1-462b-8997-5b6527960673

## Project Structure

PWA-astro-strapi/
├── frontend/
│   ├── ... (your frontend files)
├── backend/
│   ├── ... (your backend files)

## Getting Started

### Backend

https://github.com/user-attachments/assets/61d8fdd7-9155-4c7b-bc20-4cce5b826126



1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Run the Strapi server:**

   ```bash
   yarn develop
   ```

   The backend server will start on `http://localhost:1337`. You can log in to the Strapi admin panel at `http://localhost:1337/admin` to create products and manage content.

### Frontend

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

   or

   ```bash
   npm install
   ```

3. **Run the Astro frontend server:**

   ```bash
   pnpm run dev
   ```

   or

   ```bash
   npm run dev
   ```

   The frontend server will start on `http://localhost:4321`.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
PUBLIC_SERVER_URL="http://localhost:1337"
PUBLIC_CLIENT_URL="http://localhost:4321"
```

### Features

- **Strapi Backend:** Manage content and products through Strapi’s admin panel.
- **Astro Frontend:** View products, create a user account, sign in, and manage your cart.
- **Authentication:** Secure sign-up and sign-in with JWT.
- **Cart Management:** Add and remove products from your cart.





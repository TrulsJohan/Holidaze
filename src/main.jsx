import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import {
    RenderHome,
    RenderLogin,
    RenderRegister,
    RenderVenue,
    RenderProfile,
    RenderCreateVenue,
    RenderUpdateProfile,
    RenderUpdateVenue,
} from './routes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <RenderHome />,
            },
            {
                path: '/login',
                element: <RenderLogin />,
            },
            {
                path: '/register',
                element: <RenderRegister />,
            },
            {
                path: '/venue/:id',
                element: <RenderVenue />,
            },
            {
                path: '/profile',
                element: <RenderProfile />,
            },
            {
                path: '/venue/create',
                element: <RenderCreateVenue />,
            },
            {
                path: '/profile/update',
                element: <RenderUpdateProfile />,
            },
            {
                path: '/venue/update/:id',
                element: <RenderUpdateVenue />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

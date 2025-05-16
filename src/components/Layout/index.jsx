import { Outlet } from 'react-router-dom';
import { Background } from './Background';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full max-w-full mx-auto">
        <Background />
        <div className="relative w-full max-w-full">
            <Header className="w-full max-w-full" />
            <main className="grow pb-20 w-full max-w-full mx-auto">
                <Outlet />
            </main>
            <Footer className="w-full max-w-full" />
        </div>
    </div>
);

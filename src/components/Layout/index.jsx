import { Outlet } from 'react-router-dom';
import { Background } from './Background';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => (
    <div className="flex flex-col min-h-screen">
        <Background />
        <div className="relative">
            <Header />
            <main className="grow pb-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    </div>
);

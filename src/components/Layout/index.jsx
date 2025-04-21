import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow relative z-50">
            <Outlet />
        </main>
        <Footer className="z-30" />
    </div>
);

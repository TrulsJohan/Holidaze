import { Outlet } from 'react-router-dom';
import { Background } from './Background';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => (
    <div className="flex flex-col min-h-screen">
        <Background />
        <div>
            <Header />
            <main className="grow">
                <Outlet />
            </main>
            <Footer className="" />
        </div>
    </div>
);

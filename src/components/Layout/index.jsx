import { Outlet } from 'react-router-dom';
import { Background } from './Background';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Layout = () => (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full max-w-full mx-auto">
        <Background />
        <div className="relative w-full max-w-full">
            <Header className="w-full max-w-full" />
            <main className="grow pb-20 w-full max-w-full mx-auto">
                <Outlet />
            </main>
            <Footer className="w-full max-w-full" />
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    backgroundColor: '#1F2937',
                    color: '#F9FAFB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    padding: '12px',
                }}
                progressStyle={{
                    background: '#4B5563',
                }}
            />
        </div>
    </div>
);

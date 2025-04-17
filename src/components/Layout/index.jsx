import { Outlet } from "react-router-dom";
import { Background } from "./Background";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = () => (
    <>
        <Header />
        <Background />
        <main className="grow">
            <Outlet />
        </main>
        <Footer />
    </>
);
